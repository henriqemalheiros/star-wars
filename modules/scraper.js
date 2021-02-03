/* eslint-disable global-require, import/no-extraneous-dependencies */

import fetch from 'cross-fetch';
import { escape } from 'querystring';
import pick from 'lodash.pick';
import fs from 'fs-extra';
import path from 'path';

const metascraper = require('metascraper')([require('metascraper-description')(), require('metascraper-image')()]);
const logger = require('consola').withScope('nuxt:scrapper');

const PEOPLE_JSON_PATH = path.resolve(__dirname, '../data/people.json');
const PLANETS_JSON_PATH = path.resolve(__dirname, '../data/planets.json');

const SWAPI_URL = 'https://swapi.dev/api/';
const WOOKIEEPEDIA_SEARCH_API_URL = 'https://starwars.fandom.com/api.php?action=opensearch&limit=1&search=';

const fetchJson = async (url) => (await fetch(url)).json();
const fetchHTML = async (url) => (await fetch(url)).text();
const fetchMetadata = async (url) => metascraper({ html: (await fetchHTML(url)), url });

const getSwapiIdFromUrl = (url) => Number(url.replace(/^(?:.*?)(\d+)\/?$/, '$1'));
const getSwapiPage = (resource) => async (page = 1) => fetchJson(`${SWAPI_URL}${resource}?page=${page}`);
const getSwapiPeoplePage = getSwapiPage('people');
const getSwapiPlanetsPage = getSwapiPage('planets');

const getWookieepediaArticle = async (resource) => ({
  ...resource,
  article: (await fetchJson(`${WOOKIEEPEDIA_SEARCH_API_URL}${escape(resource.name)}`))[3][0],
});

const getWookieepediaMetadata = async (resource) => {
  const { description, image } = await fetchMetadata(resource.article);

  const descriptionNormalized = !description.endsWith('| Wookieepedia | Fandom')
    ? description
    : undefined;

  return {
    ...resource,
    description: typeof descriptionNormalized === 'string' && descriptionNormalized.length
      ? descriptionNormalized.replace('Please update the article to reflect recent events, and remove this template when finished.', '').trim()
      : undefined,
    image,
  };
};

async function scrape() {
  await Promise.all([
    fs.remove(PEOPLE_JSON_PATH),
    fs.remove(PLANETS_JSON_PATH),
  ]);

  logger.info('Scraping SWAPI');

  const [
    { count: peopleCount, results: peopleFirstResults },
    { count: planetsCount, results: planetsFirstResults },
  ] = await Promise.all([
    getSwapiPeoplePage(1),
    getSwapiPlanetsPage(1),
  ]);

  const peoplePageCount = Math.ceil(peopleCount / peopleFirstResults.length);
  const planetsPageCount = Math.ceil(planetsCount / planetsFirstResults.length);

  const peopleRemainingPages = [...Array(peoplePageCount - 1).keys()].map((i) => i + 2);
  const planetsRemainingPages = [...Array(planetsPageCount - 1).keys()].map((i) => i + 2);

  const [
    peopleRemainingResults,
    planetsRemainingResults,
  ] = await Promise.all([
    Promise.all(peopleRemainingPages.map(getSwapiPeoplePage)),
    Promise.all(planetsRemainingPages.map(getSwapiPlanetsPage)),
  ]);

  const people = [
    ...peopleFirstResults,
    ...peopleRemainingResults.reduce((acc, { results }) => [...acc, ...results], []),
  ];

  const planets = [
    ...planetsFirstResults,
    ...planetsRemainingResults.reduce((acc, { results }) => [...acc, ...results], []),
  ];

  if (peopleCount !== people.length || planetsCount !== planets.length) {
    throw new Error('Something went wrong while scraping SWAPI');
  }

  logger.info('Scraping Wookieepedia');

  const [
    peopleWithArticle,
    planetsWithArticle,
  ] = await Promise.all([
    Promise.all(people.map(getWookieepediaArticle)),
    Promise.all(planets.map(getWookieepediaArticle)),
  ]);

  const [
    peopleWithMetadata,
    planetsWithMetadata,
  ] = await Promise.all([
    Promise.all(peopleWithArticle.map(getWookieepediaMetadata)),
    Promise.all(planetsWithArticle.map(getWookieepediaMetadata)),
  ]);

  const peopleNormalized = peopleWithMetadata.map((person, index) => ({
    id: index + 1,
    ...pick(person, [
      'name',
      'image',
      'description',
      'article',
      'height',
      'mass',
    ]),
    homeworld: getSwapiIdFromUrl(person.homeworld),
    ...pick(person, [
      'created',
      'edited',
    ]),
  }));

  const planetsNormalized = planetsWithMetadata.map((planet, index) => ({
    id: index + 1,
    ...pick(planet, [
      'name',
      'image',
      'description',
      'article',
      'diameter',
      'climate',
      'population',
    ]),
    residents: planet.residents.map(getSwapiIdFromUrl),
  }));

  await Promise.all([
    fs.ensureFile(PEOPLE_JSON_PATH),
    fs.ensureFile(PLANETS_JSON_PATH),
  ]);

  await Promise.all([
    fs.writeFile(PEOPLE_JSON_PATH, JSON.stringify(peopleNormalized, null, 2)),
    fs.writeFile(PLANETS_JSON_PATH, JSON.stringify(planetsNormalized, null, 2)),
  ]);

  logger.success('Scraper done');
}

export default function scraper() {
  this.nuxt.hook('build:before', async () => {
    const [
      peopleJsonExists,
      planetsJsonExists,
    ] = await Promise.all([
      fs.exists(PEOPLE_JSON_PATH),
      fs.exists(PLANETS_JSON_PATH),
    ]);

    if (!this.nuxt.options.dev || !(peopleJsonExists && planetsJsonExists)) {
      await scrape();
    }

    this.nuxt.callHook('scraper:done');
  });
}

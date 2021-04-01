/* eslint-disable import/no-extraneous-dependencies */

import fetch from 'cross-fetch';
import fs from 'fs-extra';
import kebabcase from 'lodash.kebabcase';
import { getExtension, getType } from 'mime';
import path from 'path';
import { escape } from 'querystring';
import sharp from 'sharp';

import isKnown from '../utils/is-known';

const metascraper = require('metascraper')([require('metascraper-description')(), require('metascraper-image')()]);
const logger = require('consola').withScope('nuxt:scrapper');

sharp.cache(false);

const PEOPLE_IMAGES_PATH = path.resolve(__dirname, '../static/images/people');
const PEOPLE_JSON_PATH = path.resolve(__dirname, '../data/people.json');
const PLANETS_JSON_PATH = path.resolve(__dirname, '../data/planets.json');
const PLANETS_IMAGES_PATH = path.resolve(__dirname, '../static/images/planets');

const SWAPI_URL = 'https://swapi.dev/api/';
const WOOKIEEPEDIA_SEARCH_API_URL = 'https://starwars.fandom.com/api.php?action=opensearch&limit=1&search=';

const chunk = (arr, size) => Array.from({ length: Math.ceil(arr.length / size) }, (v, i) => arr.slice(i * size, i * size + size));

const fetchJson = async (url) => (await fetch(url)).json();
const fetchHTML = async (url) => (await fetch(url)).text();
const fetchMetadata = async (url) => metascraper({ html: (await fetchHTML(url)), url });

const getSwapiIdFromUrl = (url) => Number(url.split('/').map((c) => c.trim()).filter(Boolean).pop());
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
  logger.info('Scraping SWAPI data');

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

  logger.info('Scraping Wookieepedia data');

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

  const peopleNormalized = peopleWithMetadata.map((person) => {
    const slug = kebabcase(person.name);

    const originalImage = person.image.replace(/^(.+?)\/revision(?:.+?)$/, '$1').trim();
    const resizedImage = `/images/people/${slug}.${getExtension(getType(originalImage))}`;

    const homeworld = getSwapiIdFromUrl(person.homeworld);

    return {
      id: getSwapiIdFromUrl(person.url),
      slug,
      name: person.name,
      images: {
        original: originalImage,
        resized: resizedImage,
      },
      ...(isKnown(person.description) && { description: person.description }),
      ...(isKnown(person.article) && { article: person.article }),
      ...(isKnown(person.birth_year) && { birthYear: person.birth_year }),
      ...(isKnown(person.height) && { height: person.height }),
      ...(isKnown(person.mass) && { mass: person.mass }),
      ...(planetsWithMetadata[homeworld - 1].name.toLowerCase() !== 'unknown' && { homeworld }),
      created: person.created,
      edited: person.edited,
    };
  });

  const planetsNormalized = planetsWithMetadata.filter(({ name }) => name.toLowerCase() !== 'unknown').map((planet) => {
    const slug = kebabcase(planet.name);

    const originalImage = planet.image.replace(/^(.+?)\/revision(?:.+?)$/, '$1').trim();
    const resizedImage = `/images/planets/${slug}.${getExtension(getType(originalImage))}`;

    return {
      id: getSwapiIdFromUrl(planet.url),
      slug,
      name: planet.name,
      images: {
        original: originalImage,
        resized: resizedImage,
      },
      ...(isKnown(planet.description) && { description: planet.description }),
      ...(isKnown(planet.article) && { article: planet.article }),
      ...(isKnown(planet.diameter) && { diameter: planet.diameter }),
      ...(isKnown(planet.climate) && { climate: planet.climate }),
      ...(isKnown(planet.population) && { population: planet.population }),
      residents: planet.residents.map(getSwapiIdFromUrl),
      created: planet.created,
      edited: planet.edited,
    };
  });

  await Promise.all([
    fs.writeFile(PEOPLE_JSON_PATH, JSON.stringify(peopleNormalized, null, 2)),
    fs.writeFile(PLANETS_JSON_PATH, JSON.stringify(planetsNormalized, null, 2)),
  ]);
}

async function download() {
  logger.info('Scraping Wookieepedia images');

  const people = require('../data/people.json');
  const planets = require('../data/planets.json');

  const images = [
    ...people.map(({ images: { original, resized } }) => ({ mode: 'person', original, resized })),
    ...planets.map(({ images: { original, resized } }) => ({ mode: 'planet', original, resized })),
  ];

  for (const imagesChunk of chunk(images, 10)) {
    await Promise.all(imagesChunk.map(async ({ mode, original, resized }) => {
      const { body: readStream } = await fetch(original);

      const resizeStream = sharp().rotate().resize(192, 192, {
        fit: 'cover',
        position: mode === 'person' ? 'top' : 'center',
      });

      const writeStream = fs.createWriteStream(
        path.resolve(
          mode === 'person' ? PEOPLE_IMAGES_PATH : PLANETS_IMAGES_PATH,
          resized.replace(/^(?:.*)\/(.*?)$/, '$1'),
        ),
      );

      await new Promise((resolve, reject) => {
        readStream.on('error', reject).on('end', resolve).on('close', resolve);
        resizeStream.on('error', reject).on('end', resolve).on('close', resolve);
        writeStream.on('error', reject).on('end', resolve).on('close', resolve);

        readStream.pipe(resizeStream).pipe(writeStream);
      });
    }));
  }
}

export default function scraper() {
  this.nuxt.hook('build:before', async () => {
    const [
      peopleJsonExists,
      planetsJsonExists,
      peopleImagesExists,
      planetsImagesExists,
    ] = await Promise.all([
      fs.exists(PEOPLE_JSON_PATH),
      fs.exists(PLANETS_JSON_PATH),
      fs.exists(PEOPLE_IMAGES_PATH),
      fs.exists(PLANETS_IMAGES_PATH),
    ]);

    if (this.nuxt.options.dev && peopleJsonExists && planetsJsonExists && peopleImagesExists && planetsImagesExists) {
      logger.info('Skipping scraper');
      return;
    }

    logger.info('Initiating scraper');

    await Promise.all([
      fs.remove(PEOPLE_IMAGES_PATH),
      fs.remove(PEOPLE_JSON_PATH),
      fs.remove(PLANETS_IMAGES_PATH),
      fs.remove(PLANETS_JSON_PATH),
    ]);

    await Promise.all([
      fs.ensureDir(PEOPLE_IMAGES_PATH),
      fs.ensureFile(PEOPLE_JSON_PATH),
      fs.ensureDir(PLANETS_IMAGES_PATH),
      fs.ensureFile(PLANETS_JSON_PATH),
    ]);

    await scrape();
    await download();

    logger.success('Scraper done');
  });
}

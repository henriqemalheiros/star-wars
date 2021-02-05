<template>
  <div class="w-full overflow-hidden rounded-md bg-gray-900 border border-gray-800 divide-y divide-gray-800">
    <div class="flex flex-col-reverse sm:flex-row sm:justify-between sm:items-center">
      <div class="text-gray-400 pt-0 p-2 sm:pt-3 sm:p-3 flex-grow flex-shrink">
        <div class="w-full sm:w-2/3 md:w-1/2">
          <FieldText
            v-model="searchQuery"
            icon="search"
            placeholder="Search"
          />
        </div>
      </div>
      <div class="flex justify-end items-center space-x-4 p-2 sm:p-3">
        <div>
          <FieldSelect
            v-model="sortBy"
            :options="SORT_OPTIONS"
          />
        </div>
        <div>
          <FieldSelect
            v-model="orderBy"
            :options="ORDER_OPTIONS"
          />
        </div>
      </div>
    </div>
    <div class="grid grid-cols-1 xxs:grid-cols-2 sm:grid-cols-3 gap-px">
      <div
        v-for="person of paginatedPeople"
        :key="person.id"
        class="ring-1 ring-gray-800"
      >
        <PeoplePerson :person="person"/>
      </div>
    </div>
    <div v-if="canLoadMore">
      <button
        class="block w-full py-4 px-5 text-gray-300 font-bold hover:bg-gray-800 hover:text-gray-100 focus:outline-none"
        @click="onLoadMore"
      >
        Load more
      </button>
    </div>
  </div>
</template>

<script>
/* eslint-disable no-nested-ternary */

import Fuse from 'fuse.js';

import isKnown from '~/utils/is-known';
import isValidNumber from '~/utils/is-valid-number';
import stringToNumber from '~/utils/string-to-number';
import toValidBirthYear from '~/utils/to-valid-birth-year';
import toValidNumber from '~/utils/to-valid-number';

import FieldSelect from '~/components/field-select';
import FieldText from '~/components/field-text';

import PeoplePerson from './PeoplePerson.vue';

const ORDER_OPTIONS = [
  { label: 'Ascending', value: 'asc' },
  { label: 'Descending', value: 'desc' },
];

const PEOPLE_PER_PAGE = 12;

const SORT_FUNCTIONS = {
  birthYear: (birthYearA, birthYearB) => (toValidBirthYear(birthYearB) - toValidBirthYear(birthYearA)),
  height: (heightA, heightB) => (toValidNumber(stringToNumber(heightB)) - toValidNumber(stringToNumber(heightA))),
  mass: (massA, massB) => (toValidNumber(stringToNumber(massB)) - toValidNumber(stringToNumber(massA))),
  slug: (slugA, slugB) => (slugA < slugB ? 1 : (slugA > slugB ? -1 : 0)),
};

const SORT_FILTERS = {
  birthYear: (birthYear) => isKnown(birthYear) && isValidNumber(stringToNumber(birthYear)),
  height: (height) => isKnown(height) && isValidNumber(stringToNumber(height)),
  mass: (mass) => isKnown(mass) && isValidNumber(stringToNumber(mass)),
  slug: (slug) => isKnown(slug),
};

const SORT_OPTIONS = [
  { label: 'Name', value: 'slug' },
  { label: 'Birth year', value: 'birthYear' },
  { label: 'Height', value: 'height' },
  { label: 'Mass', value: 'mass' },
];

export default {
  name: 'People',
  components: {
    FieldSelect,
    FieldText,
    PeoplePerson,
  },
  props: {
    people: {
      type: Array,
      default: () => [],
    },
    planets: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      orderBy: ORDER_OPTIONS[0].value,
      page: 1,
      sortBy: SORT_OPTIONS[0].value,
      searchQuery: '',
    };
  },
  computed: {
    sortedPeople() {
      return [...this.people].filter((person) => (
        SORT_FILTERS[this.sortBy](person[this.sortBy])
      )).sort((personA, personB) => (
        SORT_FUNCTIONS[this.sortBy](personA[this.sortBy], personB[this.sortBy]) * (this.orderBy === 'desc' ? 1 : -1)
      ));
    },
    searchedPeople() {
      return this.$fuse.search(this.searchQuery).map((result) => {
        const { indices = [], value } = result.matches.find(({ key: matchKey }) => matchKey === 'name') || {};

        return {
          ...result.item,
          nameWithHighlights: [...indices, undefined].reduce(({ chunks, nextUnhighlightedIndex }, pair, pairIndex, pairs) => ({
            chunks: [
              ...chunks,
              ...(
                pairIndex < (pairs.length - 1)
                  ? [
                    [value.substring(nextUnhighlightedIndex, pair[0]), false],
                    [value.substring(pair[0], pair[1] + 1), true],
                  ]
                  : [
                    [value.substring(nextUnhighlightedIndex, value.length), false],
                  ]
              ),
            ],
            nextUnhighlightedIndex: pairIndex < (pairs.length - 1)
              ? pair[1] + 1
              : -1,
          }), { chunks: [], nextUnhighlightedIndex: 0 }).chunks.filter(([string]) => (
            typeof string === 'string'
            && string.length
          )),
        };
      });
    },
    normalizedPeople() {
      return this.searchQuery.length ? this.searchedPeople : this.sortedPeople;
    },
    paginatedPeople() {
      return [...this.normalizedPeople].splice(0, PEOPLE_PER_PAGE * this.page);
    },
    canLoadMore() {
      return (PEOPLE_PER_PAGE * this.page) < this.normalizedPeople.length;
    },
  },
  watch: {
    people(people) {
      this.$fuse.setCollection(people);
    },
  },
  created() {
    this.$fuse = new Fuse(this.people, {
      includeMatches: true,
      keys: ['name'],
      threshold: 0.2,
    });

    this.ORDER_OPTIONS = ORDER_OPTIONS;
    this.SORT_OPTIONS = SORT_OPTIONS;
  },
  methods: {
    onLoadMore() {
      this.page += 1;
    },
  },
};
</script>

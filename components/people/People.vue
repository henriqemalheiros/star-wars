<template>
  <div class="w-full overflow-hidden rounded-md bg-gray-900 border border-gray-800 divide-y divide-gray-800">
    <div class="flex justify-between items-center">
      <div class="text-gray-400">
        Search
      </div>
      <div class="flex items-center space-x-4 p-3">
        <div class="text-xs uppercase text-gray-400">
          Sort by
        </div>
        <div>
          <Select
            v-model="sortBy"
            :options="SORT_OPTIONS"
          />
        </div>
        <div>
          <Select
            v-model="orderBy"
            :options="ORDER_OPTIONS"
          />
        </div>
      </div>
    </div>
    <div class="grid grid-cols-1 xxs:grid-cols-2 sm:grid-cols-3 gap-px">
      <div
        v-for="person of normalizedPeople"
        :key="person.id"
        class="ring-1 ring-gray-800"
      >
        <PeoplePerson
          :person="person"
        />
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

import isKnown from '~/utils/is-known';
import isValidNumber from '~/utils/is-valid-number';
import stringToNumber from '~/utils/string-to-number';
import toValidBirthYear from '~/utils/to-valid-birth-year';
import toValidNumber from '~/utils/to-valid-number';

import Select from '~/components/select';

import PeoplePerson from './PeoplePerson.vue';

const ORDER_OPTIONS = [
  { label: 'Descending', value: 'desc' },
  { label: 'Ascending', value: 'asc' },
];

const PEOPLE_PER_PAGE = 12;

const SORT_FUNCTIONS = {
  birthYear: (birthYearA, birthYearB) => (toValidBirthYear(birthYearB) - toValidBirthYear(birthYearA)),
  height: (heightA, heightB) => (toValidNumber(stringToNumber(heightB)) - toValidNumber(stringToNumber(heightA))),
  mass: (massA, massB) => (toValidNumber(stringToNumber(massB)) - toValidNumber(stringToNumber(massA))),
  slug: (slugA, slugB) => (slugA > slugB ? 1 : (slugA < slugB ? -1 : 0)),
};

const SORT_FILTERS = {
  birthYear: (birthYear) => isKnown(birthYear) && isValidNumber(stringToNumber(birthYear)),
  height: (height) => isKnown(height) && isValidNumber(stringToNumber(height)),
  mass: (mass) => isKnown(mass) && isValidNumber(stringToNumber(mass)),
  slug: (slug) => isKnown(slug),
};

const SORT_OPTIONS = [
  { label: 'Name', value: 'slug' },
  { label: 'Age', value: 'birthYear' },
  { label: 'Height', value: 'height' },
  { label: 'Mass', value: 'mass' },
];

export default {
  name: 'People',
  components: {
    Select,
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
    normalizedPeople() {
      return [...this.sortedPeople].splice(0, PEOPLE_PER_PAGE * this.page).map((person) => ({
        id: person.id,
        name: person.name,
        image: person.images.resized,
        info: [
          isKnown(person.birthYear) ? `${person.birthYear}` : undefined,
          isKnown(person.height) ? `${person.height}cm` : undefined,
          isKnown(person.mass) ? `${person.mass}kg` : undefined,
        ].filter(Boolean).join(' · '),
        homeworld: {
          name: this.planets[person.homeworld - 1].name,
          image: this.planets[person.homeworld - 1].images.resized,
        },
      }));
    },
    canLoadMore() {
      return (PEOPLE_PER_PAGE * this.page) < this.sortedPeople.length;
    },
  },
  created() {
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

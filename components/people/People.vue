<template>
  <div class="w-full overflow-hidden rounded-md bg-gray-900 border border-gray-800 divide-y divide-gray-800">
    <div class="flex justify-between items-center px-4 py-3">
      <div class="text-gray-400">
        Search
      </div>
      <div class="flex space-x-4 text-xs uppercase text-gray-400">
        <div>
          Sort by
        </div>
        <div>
          Order by
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
import isKnown from '~/utils/is-known';

import PeoplePerson from './PeoplePerson.vue';

const PEOPLE_PER_PAGE = 12;

export default {
  name: 'People',
  components: {
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
      page: 1,
    };
  },
  computed: {
    normalizedPeople() {
      return [...this.people].splice(0, PEOPLE_PER_PAGE * this.page).map((person) => ({
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
      return (PEOPLE_PER_PAGE * this.page) < this.people.length;
    },
  },
  methods: {
    onLoadMore() {
      this.page += 1;
    },
  },
};
</script>

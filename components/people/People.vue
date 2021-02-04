<template>
  <div class="w-full overflow-hidden rounded-md border border-gray-800 divide-y divide-gray-800">
    <div class="flex justify-between items-center px-4 py-3 bg-gray-900">
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
    <div class="grid grid-cols-1 xxs:grid-cols-2 sm:grid-cols-3 gap-px bg-gray-800">
      <div
        v-for="person of normalizedPeople"
        :key="person.id"
        class="bg-gray-900"
      >
        <PeoplePerson
          :person="person"
        />
      </div>
    </div>
  </div>
</template>

<script>
import isKnown from '~/utils/is-known';

import PeoplePerson from './PeoplePerson.vue';

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
  computed: {
    normalizedPeople() {
      return [...this.people].splice(0, 12).map((person) => ({
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
  },
};
</script>

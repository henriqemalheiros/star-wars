<template>
  <button
    class="w-full h-full flex flex-col justify-center items-center px-6 py-5 space-y-2 xs:space-y-3 hover:bg-gray-800 hover:bg-opacity-50 focus:outline-none"
    @click="$emit('click')"
  >
    <InfoSummary
      :image="(person.images || {}).resized"
      :misc="misc"
      :name-with-highlights="person.nameWithHighlights"
      :name="person.name"
    >
      <div
        v-if="planet"
        class="flex items-center space-x-1.5"
      >
        <span class="text-xs xs:text-sm text-gray-400">
          from
        </span>
        <InfoRibbon
          :image="(planet.images || {}).resized"
          :label="planet.name"
        />
      </div>
    </InfoSummary>
  </button>
</template>

<script>
import formatBithYear from '~/utils/format-birth-year';
import formatHeight from '~/utils/format-height';
import formatMass from '~/utils/format-mass';

import InfoRibbon from '../info-ribbon';
import InfoSummary from '../info-summary';

export default {
  name: 'PeoplePerson',
  components: {
    InfoRibbon,
    InfoSummary,
  },
  inject: [
    'getPlanet',
  ],
  props: {
    person: {
      type: Object,
      required: true,
    },
  },
  computed: {
    misc() {
      return [
        formatBithYear(this.person.birthYear),
        formatHeight(this.person.height),
        formatMass(this.person.mass),
      ];
    },
    planet() {
      return this.getPlanet(this.person.homeworld);
    },
  },
};
</script>

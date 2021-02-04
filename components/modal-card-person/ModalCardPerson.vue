<template>
  <ModalCard
    title="Character info"
    @close="$emit('close')"
  >
    <div class="flex flex-col space-y-5">
      <div class="px-6 pt-6">
        <InfoSummary
          :image="(person.images || {}).resized"
          :misc="misc"
          :name="person.name"
          is-horizontal
          is-large
        >
          <div
            v-if="planet"
            class="flex items-center space-x-1.5"
          >
            <span class="text-sm xs:text-base text-gray-400">
              from
            </span>
            <InfoRibbon
              :image="(planet.images || {}).resized"
              :label="planet.name"
              is-clickable
              @click="onPlanetClick"
            />
          </div>
        </InfoSummary>
      </div>
      <div
        v-if="person.description && person.article"
        class="px-6"
      >
        <InfoDescription
          :description="person.description"
          :article="person.article"
        />
      </div>
      <div class="border-t border-gray-800 divide-y divide-gray-800">
        <InfoData
          v-if="formattedBithYear"
          label="Birth year"
          :value="formattedBithYear"
        />
        <InfoData
          v-if="formattedHeight"
          label="Height"
          :value="formattedHeight"
        />
        <InfoData
          v-if="formattedMass"
          label="Mass"
          :value="formattedMass"
        />
        <InfoData
          v-if="planet"
          label="Homeworld"
        >
          <InfoRibbon
            :image="(planet.images || {}).resized"
            :label="planet.name"
            is-clickable
            @click="onPlanetClick"
          />
        </InfoData>
        <InfoData
          v-if="formattedCreatedAt"
          label="Created at"
          :value="formattedCreatedAt"
        />
        <InfoData
          v-if="formattedUpdatedAt"
          label="Updated at"
          :value="formattedUpdatedAt"
        />
      </div>
    </div>
  </ModalCard>
</template>

<script>
import formatBithYear from '~/utils/format-birth-year';
import formatDate from '~/utils/format-date';
import formatHeight from '~/utils/format-height';
import formatMass from '~/utils/format-mass';

import InfoData from '../info-data';
import InfoDescription from '../info-description';
import InfoRibbon from '../info-ribbon';
import InfoSummary from '../info-summary';
import ModalCard from '../modal-card';

export default {
  name: 'ModalCardPerson',
  components: {
    InfoData,
    InfoDescription,
    InfoRibbon,
    InfoSummary,
    ModalCard,
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
    formattedBithYear() {
      return formatBithYear(this.person.birthYear);
    },
    formattedCreatedAt() {
      return formatDate(this.person.created);
    },
    formattedHeight() {
      return formatHeight(this.person.height);
    },
    formattedMass() {
      return formatMass(this.person.mass);
    },
    formattedUpdatedAt() {
      return formatDate(this.person.edited);
    },
    misc() {
      return [
        this.formattedBithYear,
        this.formattedHeight,
        this.formattedMass,
      ];
    },
    planet() {
      return this.getPlanet(this.person.homeworld);
    },
  },
  methods: {
    onPlanetClick() {
      console.log(`Open planet modal: ${this.planet.id}`);
    },
  },
};
</script>

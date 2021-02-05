<template>
  <ModalCard
    title="Character info"
    :with-back-button="withBackButton"
    @back="$emit('back')"
    @close="$emit('close')"
  >
    <div class="flex flex-col space-y-5">
      <div class="px-6 pt-6">
        <InfoSummary
          :image="(data.images || {}).resized"
          :misc="misc"
          :name="data.name"
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
        v-if="data.description && data.article"
        class="px-6"
      >
        <InfoDescription
          :description="data.description"
          :article="data.article"
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
          v-if="formattedMass"
          label="Mass"
          :value="formattedMass"
        />
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
    'modalOpen',
  ],
  props: {
    data: {
      type: Object,
      required: true,
    },
    withBackButton: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    formattedBithYear() {
      return formatBithYear(this.data.birthYear);
    },
    formattedCreatedAt() {
      return formatDate(this.data.created);
    },
    formattedHeight() {
      return formatHeight(this.data.height);
    },
    formattedMass() {
      return formatMass(this.data.mass);
    },
    formattedUpdatedAt() {
      return formatDate(this.data.edited);
    },
    misc() {
      return [
        this.formattedBithYear,
        this.formattedHeight,
        this.formattedMass,
      ];
    },
    planet() {
      return this.getPlanet(this.data.homeworld);
    },
  },
  methods: {
    onPlanetClick() {
      this.modalOpen({ type: 'planet', id: this.planet.id });
    },
  },
};
</script>

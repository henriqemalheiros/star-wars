<template>
  <ModalCard
    title="Planet info"
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
          <span class="text-sm xs:text-base text-gray-400">
            {{ formattedClimate }}
          </span>
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
          v-if="formattedClimate"
          label="Climate"
          :value="formattedClimate"
        />
        <InfoData
          v-if="formattedDiameter"
          label="Diameter"
          :value="formattedDiameter"
        />
        <InfoData
          v-if="formattedPopulation"
          label="Population"
          :value="formattedPopulation"
        />
        <InfoData
          v-if="resolvedResidents.length"
          label="Residents"
        >
          <div class="flex flex-wrap -mr-1.5 -mb-1.5">
            <div
              v-for="resident of resolvedResidents"
              :key="resident.id"
              class="mr-1.5 mb-1.5"
            >
              <InfoRibbon
                :image="(resident.images || {}).resized"
                :label="resident.name"
                is-clickable
                @click="onPersonClick(resident.id)"
              />
            </div>
          </div>
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
import formatClimate from '~/utils/format-climate';
import formatDate from '~/utils/format-date';
import formatDiameter from '~/utils/format-diameter';
import formatPopulation from '~/utils/format-population';

import InfoData from '../info-data';
import InfoDescription from '../info-description';
import InfoRibbon from '../info-ribbon';
import InfoSummary from '../info-summary';
import ModalCard from '../modal-card';

export default {
  name: 'ModalCardPlanet',
  components: {
    InfoData,
    InfoDescription,
    InfoRibbon,
    InfoSummary,
    ModalCard,
  },
  inject: [
    'getPerson',
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
    formattedClimate() {
      return formatClimate(this.data.climate);
    },
    formattedCreatedAt() {
      return formatDate(this.data.created);
    },
    formattedDiameter() {
      return formatDiameter(this.data.population);
    },
    formattedPopulation() {
      return formatPopulation(this.data.diameter);
    },
    formattedUpdatedAt() {
      return formatDate(this.data.edited);
    },
    misc() {
      return [
        this.formattedDiameter,
        this.formattedPopulation,
      ];
    },
    resolvedResidents() {
      return this.data.residents.map(this.getPerson).map(({ id, images, name }) => ({
        id,
        images,
        name,
      }));
    },
  },
  methods: {
    onPersonClick(personId) {
      this.modalOpen({ type: 'person', id: personId });
    },
  },
};
</script>

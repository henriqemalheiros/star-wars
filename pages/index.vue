<template>
  <div class="relative w-full max-w-screen-md mx-auto px-5">
    <ModalContainer
      v-if="selectedPerson"
      @close="onModalClose"
    >
      <ModalOverlay
        v-if="selectedPerson"
        @close="onModalClose"
      />
      <ModalCardPerson
        v-if="selectedPerson"
        :person="selectedPerson"
        @close="onModalClose"
      />
    </ModalContainer>
    <div class="relative z-0">
      <Header/>
    </div>
    <div class="relative z-10">
      <People
        :people="PEOPLE"
        :planets="PLANETS"
        @click="onPersonClick"
      />
    </div>
  </div>
</template>

<script>
import Header from '~/components/header';
import ModalCardPerson from '~/components/modal-card-person';
import ModalContainer from '~/components/modal-container';
import ModalOverlay from '~/components/modal-overlay';
import People from '~/components/people';

import people from '~/data/people.json';
import planets from '~/data/planets.json';

export default {
  name: 'PageIndex',
  components: {
    Header,
    ModalCardPerson,
    ModalContainer,
    ModalOverlay,
    People,
  },
  provide() {
    return {
      getPlanet: this.getPlanet,
    };
  },
  data() {
    return {
      selectedPerson: undefined,
    };
  },
  created() {
    this.PEOPLE = people;
    this.PLANETS = planets;

    this.onPersonClick(1);
  },
  methods: {
    getPlanet(planetId) {
      return this.PLANETS.find((planet) => planet.id === planetId);
    },
    onPersonClick(personId) {
      this.selectedPerson = this.PEOPLE.find((p) => p.id === personId);
    },
    onModalClose() {
      this.selectedPerson = undefined;
    },
  },
};
</script>

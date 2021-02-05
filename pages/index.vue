<template>
  <div class="relative w-full max-w-screen-md mx-auto px-5">
    <ModalContainer
      v-if="currentModal"
      @close="modalClose"
    >
      <ModalOverlay
        v-if="currentModal"
        @close="modalClose"
      />
      <component
        :is="currentModal.type === 'person' ? 'ModalCardPerson' : 'ModalCardPlanet'"
        v-if="currentModal"
        :data="currentModal.data"
        :with-back-button="modals.length > 1"
        @back="modalBack"
        @close="modalClose"
      />
    </ModalContainer>
    <div class="relative z-0">
      <Header/>
    </div>
    <div class="relative z-10">
      <People
        :people="PEOPLE"
        :planets="PLANETS"
      />
    </div>
  </div>
</template>

<script>
import Header from '~/components/header';
import ModalCardPerson from '~/components/modal-card-person';
import ModalCardPlanet from '~/components/modal-card-planet';
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
    ModalCardPlanet,
    ModalContainer,
    ModalOverlay,
    People,
  },
  provide() {
    return {
      getPerson: this.getPerson,
      getPlanet: this.getPlanet,
      modalOpen: this.modalOpen,
    };
  },
  data() {
    return {
      modals: [],
    };
  },
  computed: {
    currentModal() {
      return this.modals.length ? this.modals[this.modals.length - 1] : undefined;
    },
  },
  created() {
    this.PEOPLE = people;
    this.PLANETS = planets;
  },
  methods: {
    getPerson(personId) {
      return this.PEOPLE.find((person) => person.id === personId);
    },
    getPlanet(planetId) {
      return this.PLANETS.find((planet) => planet.id === planetId);
    },
    modalBack() {
      this.modals.pop();
    },
    modalClose() {
      this.modals = [];
    },
    modalOpen({ type, id }) {
      if (['person', 'planet'].includes(type)) {
        this.modals.push({ type, data: type === 'person' ? this.getPerson(id) : this.getPlanet(id) });
      }
    },
  },
};
</script>

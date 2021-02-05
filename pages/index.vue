<template>
  <div class="w-full overflow-x-hidden">
    <div class="relative w-full max-w-screen-md mx-auto px-3 sm:px-5 pb-3 sm:pb-5">
      <ModalContainer
        :is-active="Boolean(currentModal)"
        @close="modalClose"
      >
        <transition
          enter-active-class="transition-opacity duration-400"
          enter-class="opacity-0"
          enter-to-class="opacity-100"
          leave-active-class="transition-opacity duration-400"
          leave-class="opacity-100"
          leave-to-class="opacity-0"
        >
          <ModalOverlay
            v-if="currentModal"
            @close="modalClose"
          />
        </transition>
        <transition
          :enter-class="`opacity-0 transform ${modalTransitionEnterClass}`"
          :leave-to-class="`opacity-0 transform ${modalTransitionLeaveToClass}`"
          enter-active-class="transition duration-300"
          enter-to-class="opacity-100"
          leave-active-class="transition duration-300"
          leave-class="opacity-100"
          mode="out-in"
          @before-enter="onModalTransitionEnter"
          @after-leave="onModalTransitionLeave"
        >
          <component
            :is="currentModal.type === 'person' ? 'ModalCardPerson' : 'ModalCardPlanet'"
            v-if="currentModal"
            :key="`${currentModal.type}-${currentModal.data.id}`"
            :data="currentModal.data"
            :with-back-button="modals.length > 1"
            @back="modalBack"
            @close="modalClose"
          />
        </transition>
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
  </div>
</template>

<script>
import { clearAllBodyScrollLocks, disableBodyScroll, enableBodyScroll } from 'body-scroll-lock';

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
      modalTransitionEnterClass: 'translate-y-4',
      modalTransitionLeaveToClass: 'translate-y-4',
    };
  },
  computed: {
    currentModal() {
      return this.modals.length
        ? this.modals[this.modals.length - 1]
        : undefined;
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
      this.modalTransitionEnterClass = '-translate-x-4';
      this.modalTransitionLeaveToClass = 'translate-x-4';

      this.$nextTick(() => {
        this.modals.pop();
      });
    },
    modalClose() {
      this.modalTransitionEnterClass = 'translate-y-6';
      this.modalTransitionLeaveToClass = 'translate-y-6';

      this.$nextTick(() => {
        this.modals = [];
      });
    },
    modalOpen({ type, id }) {
      if (['person', 'planet'].includes(type)) {
        if (this.modals.length) {
          this.modalTransitionEnterClass = 'translate-x-4';
          this.modalTransitionLeaveToClass = '-translate-x-4';
        } else {
          this.modalTransitionEnterClass = 'translate-y-6';
          this.modalTransitionLeaveToClass = 'translate-y-6';
        }

        this.$nextTick(() => {
          this.modals.push({
            type,
            data: type === 'person'
              ? this.getPerson(id)
              : this.getPlanet(id),
          });
        });
      }
    },
    onModalTransitionEnter(el) {
      const target = el.querySelector('[scroll-lock-target]');

      if (target) {
        disableBodyScroll(target, { reserveScrollBarGap: true });
      }
    },
    onModalTransitionLeave(el) {
      const target = el.querySelector('[scroll-lock-target]');

      if (target) {
        enableBodyScroll(target);
      } else {
        clearAllBodyScrollLocks();
      }
    },
  },
};
</script>

<template>
  <div class="relative w-full max-w-screen-md mx-auto px-5">
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
import People from '~/components/people';

import people from '~/data/people.json';
import planets from '~/data/planets.json';

export default {
  name: 'PageIndex',
  components: {
    Header,
    People,
  },
  created() {
    this.PEOPLE = people;
    this.PLANETS = planets;
  },
};
</script>

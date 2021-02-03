<template>
  <div class="relative py-8 sm:py-16">
    <div class="relative z-10">
      <Logo class="block w-1/2 sm:w-1/3 h-auto mx-auto"/>
    </div>
    <div class="w-full max-w-screen-md absolute z-0 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
      <HeaderStars/>
    </div>
  </div>
</template>

<script>
import Logo from './assets/logo.svg?inline';

import HeaderStars from './HeaderStars.vue';

export default {
  name: 'Header',
  components: {
    HeaderStars,
    Logo,
  },
};
</script>

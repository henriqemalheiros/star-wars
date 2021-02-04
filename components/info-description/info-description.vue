<template>
  <div class="space-y-2">
    <div>
      {{ description }}
    </div>
    <div
      v-if="article"
      class="flex justify-end"
    >
      <a
        :href="article"
        target="_blank"
        rel="noopener"
        class="inline-flex space-x-1 text-xs text-gray-400"
      >
        <span>Keep reading on Wookieepedia</span>
        <IconArrowNarrowRight class="w-4 mt-px"/>
      </a>
    </div>
  </div>
</template>

<script>
import IconArrowNarrowRight from './assets/arrow-narrow-right.svg?inline';

export default {
  name: 'InfoDescription',
  components: {
    IconArrowNarrowRight,
  },
  props: {
    article: {
      type: String,
      default: undefined,
    },
    description: {
      type: String,
      required: true,
    },
  },
};
</script>

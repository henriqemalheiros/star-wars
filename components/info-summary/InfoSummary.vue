<template>
  <div class="flex flex-col justify-center items-center space-y-2 xs:space-y-3">
    <div
      v-if="image"
      class="p-1 bg-gray-800 rounded-full"
    >
      <img
        :src="image"
        class="block w-20 xs:w-24 h-20 xs:h-24 rounded-full"
        width="24"
        height="24"
      >
    </div>
    <div class="flex flex-col items-center space-y-1 xs:space-y-2">
      <div
        v-if="nameWithHighlights"
        class="text-center xs:text-lg"
      >
        <span
          v-for="([chunk, isHighlighted], chunkIndex) of nameWithHighlights"
          :key="chunkIndex"
          :class="isHighlighted ? 'text-yellow font-bold' : ''"
        >{{ chunk }}</span>
      </div>
      <div
        v-else-if="name"
        class="text-center xs:text-lg"
      >
        {{ name }}
      </div>
      <div v-if="$scopedSlots.default && $scopedSlots.default().length">
        <slot/>
      </div>
      <div
        v-if="resolvedMisc"
        class="text-center text-xxs xs:text-xs text-gray-500 xs:text-gray-600"
      >
        {{ resolvedMisc }}
      </div>
    </div>
  </div>
</template>

<script>
import isKnown from '~/utils/is-known';

const SIZE_SMALL = 'small';
const SIZE_LARGE = 'large';

export default {
  name: 'InfoSummary',
  props: {
    image: {
      type: String,
      default: undefined,
    },
    misc: {
      type: Array,
      default: undefined,
    },
    nameWithHighlights: {
      type: Array,
      default: undefined,
    },
    name: {
      type: String,
      default: undefined,
    },
    size: {
      type: String,
      default: SIZE_SMALL,
      validator: (value) => [SIZE_SMALL, SIZE_LARGE].includes(value),
    },
  },
  computed: {
    resolvedMisc() {
      return (this.misc || []).filter(isKnown).join(' · ');
    },
  },
};
</script>

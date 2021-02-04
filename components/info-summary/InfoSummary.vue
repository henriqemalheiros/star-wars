<template>
  <div
    :class="isHorizontal ? ['items-center', isLarge ? 'space-x-5' : 'space-x-2 xs:space-x-3'] : ['flex-col justify-center items-center', isLarge ? 'space-y-5' : 'space-y-2 xs:space-y-3']"
    class="flex"
  >
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
    <div
      :class="[isHorizontal ? '' : 'items-center text-center', isLarge ? 'space-y-1' : 'space-y-1 xs:space-y-2']"
      class="flex flex-col"
    >
      <div
        v-if="nameWithHighlights"
        :class="isLarge ? 'text-xl' : 'xs:text-lg'"
      >
        <span
          v-for="([chunk, isHighlighted], chunkIndex) of nameWithHighlights"
          :key="chunkIndex"
          :class="isHighlighted ? 'text-yellow font-bold' : ''"
        >{{ chunk }}</span>
      </div>
      <div
        v-else-if="name"
        :class="isLarge ? 'text-xl' : 'xs:text-lg'"
      >
        {{ name }}
      </div>
      <div v-if="$scopedSlots.default && $scopedSlots.default().length">
        <slot/>
      </div>
      <div
        v-if="resolvedMisc"
        :class="isLarge ? 'text-xs xs:text-sm' : 'text-xxs xs:text-xs'"
        class="text-gray-400 xs:text-gray-500"
      >
        {{ resolvedMisc }}
      </div>
    </div>
  </div>
</template>

<script>
import isKnown from '~/utils/is-known';

export default {
  name: 'InfoSummary',
  props: {
    image: {
      type: String,
      default: undefined,
    },
    isHorizontal: {
      type: Boolean,
      default: false,
    },
    isLarge: {
      type: Boolean,
      default: false,
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
  },
  computed: {
    resolvedMisc() {
      return (this.misc || []).filter(isKnown).join(' · ');
    },
  },
};
</script>

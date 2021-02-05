<template>
  <component
    :is="isClickable ? 'button' : 'div'"
    :class="[image ? 'p-0.5 pr-2' : 'py-0.5 px-2', isClickable ? 'hover:bg-gray-700 focus:outline-none' : undefined]"
    class="flex items-center rounded-full bg-gray-800 space-x-1.5"
    @click="isClickable && $emit('click', $event)"
  >
    <img
      v-if="image"
      :src="image"
      class="block w-5 h-5 rounded-full flex-grow-0 flex-shrink-0"
      width="5"
      height="5"
    >
    <span class="text-xs xs:text-sm leading-none text-gray-300 flex-grow flex-shrink truncate">
      {{ label }}
    </span>
  </component>
</template>

<script>
export default {
  name: 'InfoRibbon',
  props: {
    image: {
      type: String,
      default: undefined,
    },
    isClickable: {
      type: Boolean,
      default: false,
    },
    label: {
      type: String,
      required: true,
    },
  },
};
</script>

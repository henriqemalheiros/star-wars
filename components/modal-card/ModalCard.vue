<template>
  <div class="relative flex z-10 w-full max-w-screen-xs max-h-full p-3 sm:p-5">
    <div class="w-full max-h-full flex flex-col rounded-md bg-gray-900 border border-gray-800 divide-y divide-gray-800">
      <div class="flex items-center space-x-4">
        <div class="w-12 h-12 flex-grow-0 flex-shrink-0">
          <button
            v-if="withBackButton"
            class="block text-white p-3.5 text-gray-500 focus:outline-none"
            @click="$emit('back')"
          >
            <IconArrowLeft class="w-5 h-5"/>
          </button>
        </div>
        <div class="flex-grow flex-shrink text-center truncate text-sm font-bold text-gray-400 uppercase">
          {{ title }}
        </div>
        <div class="w-12 h-12 flex-grow-0 flex-shrink-0">
          <button
            class="block text-white p-3.5 text-gray-500 focus:outline-none"
            @click="$emit('close')"
          >
            <IconX class="w-5 h-5"/>
          </button>
        </div>
      </div>
      <div
        class="max-h-full overflow-auto"
        scroll-lock-target
      >
        <slot/>
      </div>
    </div>
  </div>
</template>

<script>
import IconArrowLeft from './assets/arrow-left.svg?inline';
import IconX from './assets/x.svg?inline';

export default {
  name: 'ModalCard',
  components: {
    IconArrowLeft,
    IconX,
  },
  props: {
    title: {
      type: String,
      default: 'Untitled',
    },
    withBackButton: {
      type: Boolean,
      default: false,
    },
  },
};
</script>

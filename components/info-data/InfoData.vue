<template>
  <div class="flex items-start">
    <div class="h-12 flex items-center px-4 py-3 text-xs text-gray-400 uppercase">
      {{ label }}
    </div>
    <div class="m-h-12 pr-4 py-3">
      <slot
        v-if="$scopedSlots.default && $scopedSlots.default().length"
      />
      <span
        v-else
        class="text-sm"
      >
        {{ value }}
      </span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'InfoData',
  props: {
    label: {
      type: String,
      required: true,
    },
    value: {
      type: String,
      default: undefined,
    },
  },
};
</script>

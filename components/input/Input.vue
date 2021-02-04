<template>
  <div class="w-full relative rounded text-gray-500 focus-within:text-gray-300 border border-gray-800 focus-within:border-gray-400">
    <span
      v-if="iconComponent"
      class="absolute top-0 left-0 w-8 h-8 flex justify-center items-center pointer-events-none"
    >
      <component
        :is="iconComponent"
        class="w-5"
      />
    </span>
    <input
      v-model="innerValue"
      :class="iconComponent ? 'pl-8 pr-3' : 'px-3'"
      :placeholder="placeholder"
      class="w-full appearance-none py-1.5 rounded bg-gray-900 text-sm text-gray-300 focus:text-gray-100 focus:outline-none"
      type="text"
    >
  </div>
</template>

<script>
import IconSearch from './assets/search.svg?inline';

const ICONS = {
  search: IconSearch,
};

export default {
  name: 'Input',
  model: {
    prop: 'value',
    event: 'input',
  },
  props: {
    icon: {
      type: String,
      default: undefined,
    },
    placeholder: {
      type: String,
      default: undefined,
    },
    value: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      innerValue: this.value,
    };
  },
  computed: {
    iconComponent() {
      return typeof this.icon === 'string' && this.icon.length
        ? ICONS[this.icon] || undefined
        : undefined;
    },
  },
  watch: {
    innerValue(newInnerValue) {
      this.$emit('input', newInnerValue);
    },
    value(newValue) {
      if (newValue !== this.innerValue) {
        this.innerValue = newValue;
      }
    },
  },
};
</script>

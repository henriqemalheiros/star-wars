<template>
  <div class="relative rounded text-gray-500 focus-within:text-gray-300 border border-gray-800 focus-within:border-gray-400">
    <select
      v-model="innerValue"
      class="appearance-none pl-3 pr-8 py-1.5 rounded bg-gray-900 text-sm text-gray-300 focus:text-gray-100 focus:outline-none"
    >
      <option
        v-for="option of options"
        :key="option.value"
        :value="option.value"
      >
        {{ option.label }}
      </option>
    </select>
    <span class="absolute top-0 right-0 w-8 h-8 flex justify-center items-center pointer-events-none">
      <IconSelector class="w-5"/>
    </span>
  </div>
</template>

<script>
import IconSelector from './assets/selector.svg?inline';

export default {
  name: 'FieldSelect',
  components: {
    IconSelector,
  },
  model: {
    prop: 'value',
    event: 'change',
  },
  props: {
    options: {
      type: Array,
      default: () => [],
      validator: (value) => value.every((v) => (
        typeof v === 'object'
        && typeof v.label === 'string'
        && typeof v.value === 'string'
        && v.label.length
        && v.value.length
      )),
    },
    value: {
      type: String,
      required: true,
      validator: (value) => value.length,
    },
  },
  data() {
    return {
      innerValue: this.value,
    };
  },
  watch: {
    innerValue(newInnerValue) {
      this.$emit('change', newInnerValue);
    },
    value(newValue) {
      if (newValue !== this.innerValue) {
        this.innerValue = newValue;
      }
    },
  },
};
</script>

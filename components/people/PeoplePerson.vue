<template>
  <div class="flex flex-col items-center px-6 py-5 space-y-2 xs:space-y-3">
    <div
      v-if="person.image"
      class="p-1 bg-gray-800 rounded-full"
    >
      <img
        :src="person.image"
        class="block w-20 xs:w-24 h-20 xs:h-24 rounded-full"
        width="24"
        height="24"
      >
    </div>
    <div class="flex flex-col items-center space-y-1 xs:space-y-2">
      <div
        v-if="person.name"
        class="text-center xs:text-lg"
      >
        {{ person.name }}
      </div>
      <div
        v-if="person.homeworld"
        class="flex items-center space-x-1.5"
      >
        <span class="text-xs xs:text-sm text-gray-400">
          from
        </span>
        <div class="flex items-center p-0.5 pr-2 rounded-full bg-gray-800 space-x-1.5">
          <img
            :src="person.homeworld.image"
            class="block w-5 h-5 rounded-full flex-grow-0 flex-shrink-0"
            width="5"
            height="5"
          >
          <span class="text-xs xs:text-sm leading-none text-gray-300">
            {{ person.homeworld.name }}
          </span>
        </div>
      </div>
      <div
        v-if="person.info"
        class="text-center text-xxs xs:text-xs text-gray-500 xs:text-gray-600"
      >
        {{ person.info }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PeoplePerson',
  props: {
    person: {
      type: Object,
      required: true,
    },
  },
};
</script>

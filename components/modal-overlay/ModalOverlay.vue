<template>
  <div
    class="absolute inset-0 z-0 bg-black bg-opacity-80"
    @click.self="$emit('close')"
  />
</template>

<script>
export default {
  name: 'ModalOverlay',
};
</script>

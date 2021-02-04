<template>
  <div
    class="fixed z-50 inset-0 flex justify-center items-center"
    @click.self="$emit('close')"
  >
    <slot/>
  </div>
</template>

<script>
export default {
  name: 'ModalContainer',
};
</script>

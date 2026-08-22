<script setup lang="ts">
defineProps({
  id: {
    type: String,
    default: undefined,
  },
})
</script>

<template>
  <h2 :id="id">
    <slot />
  </h2>
</template>

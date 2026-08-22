<script setup lang="ts">
defineProps({
  href: {
    type: String,
    default: '',
  },
  target: {
    type: String,
    default: undefined,
    required: false,
  },
})
</script>

<template>
  <a
    :href="href"
    :target="target"
    class="underlined-link"
  >
    <slot />
  </a>
</template>

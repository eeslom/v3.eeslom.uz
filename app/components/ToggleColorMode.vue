<script setup lang="ts">
const colorMode = useColorMode()

const ariaLabel = computed(() => {
  const currentMode = colorMode.value
  const targetMode = currentMode === 'dark' ? 'light' : 'dark'
  return `Switch to ${targetMode} mode (currently ${currentMode})`
})
</script>

<template>
  <button v-if="colorMode" type="button" class="touch-action-manipulation ml-2 px-1 f-ring border-2 border-muted/50 rounded-full border-solid bg-accent h-7 w-12 items-center justify-start relative active:border-muted hover:border-muted motion-safe:transition-colors" :aria-label="ariaLabel" @click="colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'">
    <span class="i-tabler:moon light:i-tabler:sun-high rounded-full bg-primary h-4 w-4 inline-block light:h-4 light:w-4 light:translate-x-5 motion-safe:transition-transform" aria-hidden="true" />
  </button>
</template>

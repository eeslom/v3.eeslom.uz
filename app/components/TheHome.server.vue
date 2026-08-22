<script setup lang="ts">
// const [] = await Promise.all([])
const { data: page } = await useAsyncData('page', async () => queryCollection('page').path('/').first())
</script>

<template>
  <section v-if="page" class="text-lg w-full md:text-xl">
    <ContentRenderer :value="page" />
  </section>
</template>

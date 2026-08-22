<script setup lang="ts">
const route = useRoute('use')

const path = computed(() =>
  route.path.replace(/(index)?\.json$/, '').replace(/\/$/, ''),
)

const { data: page } = await useAsyncData(
  'use',
  async () => {
    if (!import.meta.server && !import.meta.dev)
      return null

    return await queryCollection('page').path(path.value).first()
  },
)

if (!page.value) {
  throw createError({
    status: 404,
    fatal: true,
  })
}
</script>

<template>
  <div class="mx-auto px-4 py-2 flex-grow max-w-4xl w-full w-full md:px-12 md:py-4">
    <header v-if="page" class="leading-none mb-[1vw] mt-[5vw]">
      <h1 class="text-2xl font-bold sm:text-3xl">
        {{ page.title }}
      </h1>
      <p class="text-muted mt-2 italic">
        {{ page?.description }}
      </p>
    </header>
    <main
      id="main-content"
      :class="$style.use"
      class="text-base text-lg text-muted"
    >
      <ContentRenderer v-if="page" :value="page" />
    </main>
  </div>
</template>

<style scoped>

</style>

<style module>
.use {
  h1 {
    @apply font-800 mt-0 mb-2;
  }

  h2 {
    @apply font-700 mt-4 mb-2;
  }

  h3 {
    @apply font-600 mt-3 mb-1.5 op-70;
  }

  h4 {
    @apply font-600 mt-2 mb-1;
  }

  h6 {
    @apply uppercase op-50 font-500;
  }

  ol,
  ul {
    @apply list-disc-inside my-2;
  }

  .prose ol > li {
    @apply relative pl-4;
  }

  ul > li {
    @apply relative pl-4;
  }

  :first-child {
    margin-top: 0;
  }

  :last-child {
    margin-bottom: 0;
  }
}
</style>

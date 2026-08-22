<script setup lang="ts">
const { data: articles } = await useAsyncData('blog', async () => queryCollection('blog').all())
</script>

<template>
  <section class="flex flex-col gap-4 w-full">
    <NuxtLink v-for="{ title, path, date } in articles" :key="path" :to="path" :title="title" class="pb-1 f-ring rounded">
      <article>
        <header class="flex flex-col items-start justify-between md:flex-row">
          <span class="text-base underlined-link sm:text-lg">{{ title }}</span>
          <dl v-if="date" class="text-xs text-muted leading-normal mt-3 uppercase md:mt-1">
            <dt class="sr-only">
              Published
            </dt>
            <dd class="mt-4">
              <NuxtTime :datetime="date" day="numeric" month="long" year="numeric" />
            </dd>
          </dl>
        </header>
      </article>
    </NuxtLink>
  </section>
</template>

<style scoped>
a:focus,
a:active,
a:hover {
  header span {
    view-transition-name: heading;
  }

  dl dt {
    view-transition-name: published-dt;
  }

  dl dd {
    view-transition-name: published-dd;
  }
}
</style>

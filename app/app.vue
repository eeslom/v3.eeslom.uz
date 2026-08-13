<script setup lang="ts">
import { withoutTrailingSlash } from 'ufo'
import { appDescription, appName } from './constants'

const route = useRoute()

const isAdmin = computed(() => route.path === '/admin' || route.path.startsWith('/admin/'))

const highlightIslands = ref(false)
function openSiteUI(e: MouseEvent | KeyboardEvent) {
  if ((e.target as HTMLElement).hasAttribute('data-site-ui')) {
    highlightIslands.value = !highlightIslands.value
  }
}

useHead({
  title: () => (route.meta.title as string) || '',
  titleTemplate: title => (title && title !== appName ? `${title} - ${appName}` : appName),
  bodyAttrs: {
    class: 'font-sans',
  },
})

const PATH_RE = createRegExp(exactly(char.times.any().and(charNotIn('/'))).as('path').and(exactly('/').optionally()).at.lineEnd())

const { path = '/' } = route.fullPath.match(PATH_RE)?.groups ?? {}
const url = withoutTrailingSlash(`https://eeslom.uz${path}`)

useHead({
  meta: () => [
    { property: 'og:url', content: url },
    // {
    //   property: 'og:image',
    //   content: ``,
    //   key: 'og:image',
    // },
    { property: 'og:image:width', content: '1200' },
    { property: 'og:image:height', content: '600' },
    {
      property: 'og:title',
      content: (route.meta.title as string) || appName,
    },
    {
      name: 'description',
      content:
          (route.meta.description as string)
          || appDescription,
    },
    {
      property: 'og:description',
      content:
          (route.meta.description as string)
          || appDescription,
    },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:site', content: '@islomurodov' },
    { name: 'twitter:creator', content: '@islomurodov' },
  ],
  link: [
    { rel: 'canonical', href: url },
    { rel: 'alternate', type: 'application/rss+xml', href: '/rss.xml' },
  ],
  script: [],
})
</script>

<template>
  <VitePwaManifest />
  <div
    id="app"
    class="flex flex-col min-h-screen overflow-x-hidden"
    :class="{ 'highlight-islands': highlightIslands }"
    @click="openSiteUI"
  >
    <a
      href="#main-content"
      class="focus:bg-primary focus:text-background sr-only focus:font-medium focus:px-4 focus:py-2 focus:rounded focus:left-4 focus:top-4 focus:absolute focus:z-50 focus:not-sr-only"
    >
      Skip to main content
    </a>
    <LayoutTheSiteHeader v-if="!isAdmin" />
    <NuxtPage />
    <LayoutTheSiteFooter v-if="!isAdmin" />
  </div>
</template>

<style>
html.dark {
  color-scheme: dark;
}

.highlight-islands [data-island] {
  border: 1px solid red;
}
</style>

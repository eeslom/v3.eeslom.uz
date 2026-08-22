<script setup lang="ts">
const route = useRoute('blog-article')
const slug = route.params.article
if (!slug)
  navigateTo('/blog')

const path = computed(() =>
  route.path.replace(/(index)?\.json$/, '').replace(/\/$/, ''),
)

const { data: page } = await useAsyncData(
  path.value,
  async () => {
    if (!import.meta.server && !import.meta.dev)
      return null

    return await queryCollection('blog').path(path.value).first()
  },
)

if (!page.value) {
  throw createError({
    status: 404,
    fatal: true,
  })
}

route.meta.title = page.value.title

if (import.meta.server) {
  useRoute().meta.description = page.value.description

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    'headline': page.value.title,
    'description': page.value.description,
    'datePublished': page.value.date,
    'author': {
      '@type': 'Person',
      'name': 'Islom Murodov',
      'url': 'https://eeslom.uz',
    },
    'publisher': {
      '@type': 'Person',
      'name': 'Islom Murodov',
      'url': 'https://eeslom.uz',
    },
    'mainEntityOfPage': {
      '@type': 'WebPage',
      '@id': `https://eeslom.uz${path.value}`,
    },
    'keywords': page.value.tags?.join(', '),
  }

  useHead({
    script: [
      {
        type: 'application/ld+json',
        innerHTML: JSON.stringify(articleSchema),
      },
    ],
    link: [],
  })
}
</script>

<template>
  <main id="main-content" class="text-muted mx-auto px-4 py-2 flex-grow max-w-4xl w-full md:px-12 md:py-4">
    <header v-if="page" class="leading-none mb-[1vw] mt-[5vw]">
      <h1 class="text-2xl">
        {{ page.title }}
      </h1>
      <dl v-if="page.date" class="text-xs leading-normal mt-1 flex-row flex-wrap block uppercase md:flex">
        <dt class="sr-only">
          Published
        </dt>
        <dd class="mt-4">
          <NuxtTime
            :datetime="page.date"
            day="numeric"
            month="long"
            year="numeric"
          />
        </dd>
        <template v-if="page.tags && page.tags.length">
          <dt class="mr-2 float-left md:float-none">
            <b>Tags:</b>
          </dt>
          <dd class="mr-4">
            <span
              v-for="(tag, index) in page.tags"
              :key="tag"
              :class="{
                'before:content-empty before:mx-1 before:inline-block': index,
              }"
              v-text="tag"
            />
          </dd>
        </template>
      </dl>
    </header>
    <section v-if="page" :class="$style.blog">
      <!-- <StaticMarkdownRender collection="blog" :path="path" /> -->
      <ContentRenderer :value="page" />
    </section>
  </main>
</template>

<style scoped>
header > h1:first-child {
  view-transition-name: heading;
}

header dl dt:first-of-type {
  view-transition-name: published-dt;
}

header dl dd:first-of-type {
  view-transition-name: published-dd;
}
</style>

<style module>
.blog {
  h2 {
    @apply uppercase text-sm;

    letter-spacing: 0.1rem;
  }

  * + h2,
  * + h3,
  * + h4 {
    @apply mt-8;
  }

  div + div {
    @apply mb-6;
  }

  pre {
    @apply font-mono text-sm my-0;

    /* stylelint-disable-next-line declaration-property-value-no-unknown */
    background-color: theme('colors.neutral.900') !important;
    margin-left: -50vw;
    margin-right: -50vw;
    padding: 1rem 50vw !important;

    @media (width < 767px) {
      white-space: pre-wrap;
    }

    + h2,
    + h3,
    + h4 {
      @apply mt-8;
    }

    + p {
      @apply mt-6;
    }
  }

  ol,
  ul {
    @apply pl-6;

    li {
      @apply my-4;

      counter-increment: list;

      &::before {
        @apply -ml-6 mt-2 mr-2 inline-block leading-none;

        width: 1rem;
      }

      > :first-child:not(strong) {
        @apply inline-block;
      }
    }
  }

  ul li::before {
    content: '›';
  }

  ul:global(.link-grid) {
    display: grid;
    grid-template-columns: auto auto auto;
  }

  ul:global(.link-grid) li {
    @apply my-0;
  }

  ol li::before {
    @apply text-xs;

    content: counter(list);
  }

  /* stylelint-disable-next-line */
  p {
    + pre,
    + p {
      @apply mt-4;
    }

    + ul,
    + ol {
      @apply my-2;
    }

    + table {
      @apply my-4;
    }
  }

  p > code,
  li > code {
    @apply px-2 py-1 mx-1 text-sm text-background bg-primary;
  }

  p + div {
    @apply mt-6 py-1 uppercase text-xs text-neutral-600;

    letter-spacing: 0.15rem;

    /* stylelint-disable-next-line declaration-property-value-no-unknown */
    background-color: theme('colors.neutral.900');
    margin-left: -50vw;
    margin-right: -50vw;
    padding: 1rem 50vw;
  }

  blockquote {
    @apply pl-4 border-l-4 mb-4;
  }
}
</style>

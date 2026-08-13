<script setup lang="ts">
import { projects } from '#build/projects.mjs'

function slug(name: string) {
  return name.toLowerCase().replace(/[\s/]+/g, '-')
}
/**
 i-ri:magic-line
 i-ri:font-size
 i-ri:css3-line
 i-ri:archive-stack-line
 i-ri:font-family
 i-ri:route-line
 i-ri:braces-line
 i-ri:shield-keyhole-line
 i-ri:walk-line
 i-ri:text-spacing
 i-ri:error-warning-line
 i-ri:server-line
 i-ri:exchange-line
 i-ri:cpu-line
 i-ri:list-ordered
 i-ri:archive-line
 i-ri:filter-off-line
 i-ri:bubble-chart-line
 i-ri:database-2-line
 i-ri:database-line
 i-ri:link
 i-ri:vidicon-line
 i-ri:flashlight-line
 i-ri:arrow-up-circle-line
 i-ri:shield-check-line
 i-ri:dashboard-3-line
 i-ri:folder-download-line
 i-ri:toggle-line
 i-ri:file-zip-line
 i-ri:flashlight-line
 i-ri:refresh-line
 i-ri:archive-stack-line
 i-ri:keyboard-line
 i-ri:restaurant-line
 i-ri:reactjs-line
*/
</script>

<template>
  <div>
    <section
      v-for="category in projects"
      :id="slug(category.category)"
      :key="category.category"
      class="mb-16"
    >
      <h2 class="text-lg">
        {{ category.category }}
      </h2>

      <div class="mt-4 w-screen overflow-visible -mx-4 md:-mx-12">
        <ul
          class="px-4 list-none gap-6 grid grid-cols-1 md:px-12 lg:grid-cols-3 sm:grid-cols-2"
        >
          <li
            v-for="item in category.items"
            :key="item.name"
            class="bg-accent flex relative"
            :class="[
              { 'opacity-60': item.archived },
              item.image ? 'flex-col' : '',
            ]"
          >
            <a
              :href="item.url || item.repo"
              target="_blank"
              rel="noopener noreferrer"
              class="f-ring-accent flex flex-grow"
              :class="item.image ? 'flex-col' : 'flex-row items-start gap-3 p-3'"
              :aria-label="item.name"
            >
              <div
                v-if="item.image"
                class="bg-gray-100 flex aspect-video items-center justify-center relative overflow-hidden dark:bg-gray-900"
              >
                <NuxtImg
                  :src="item.image"
                  :alt="`Screenshot of ${item.name}`"
                  loading="lazy"
                  width="640"
                  height="360"
                  class="h-full w-full object-cover"
                />
                <span
                  v-if="item.archived"
                  class="bg-background/80 text-[0.625rem] tracking-[0.15rem] px-2 py-0.5 rounded uppercase left-2 top-2 absolute backdrop-blur-sm"
                >
                  Archived
                </span>
              </div>

              <span
                v-else-if="item.icon"
                class="text-muted mt-0.5 opacity-60 flex-shrink-0 h-8 w-8 inline-block"
                :class="item.icon"
                aria-hidden="true"
              />

              <div
                class="flex flex-grow flex-col"
                :class="item.image ? 'px-3 py-3' : ''"
              >
                <h3 class="font-medium">
                  {{ item.name }}
                </h3>
                <p
                  v-if="item.description"
                  class="text-sm text-gray-600 mt-1 dark:text-gray-400"
                >
                  {{ item.description }}
                </p>
              </div>
            </a>

            <a
              v-if="item.repo && item.repo !== item.url"
              :href="item.repo"
              target="_blank"
              rel="noopener noreferrer"
              class="bg-background/80 hover:bg-background f-ring p-1.5 rounded-full transition-colors right-2 top-2 absolute backdrop-blur-sm"
              :aria-label="`GitHub repository for ${item.name}`"
            >
              <span
                class="i-ri:github-fill h-4 w-4 block"
                aria-hidden="true"
              />
            </a>
          </li>
        </ul>
      </div>
    </section>
  </div>
</template>

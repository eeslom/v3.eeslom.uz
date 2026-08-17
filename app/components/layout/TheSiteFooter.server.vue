<script lang="ts" setup>
import { links } from '#shared/utils/links'
import { appName } from '~/constants'

const year = new Date().getFullYear()
</script>

<template>
  <div>
    <footer
      class="before:content mx-auto px-4 py-2 text-center max-w-[50rem] relative before:mx-auto before:my-4 before:border-t-2 before:border-gray-300 before:border-solid before:w-4 before:block before:content-empty dark:before:border-gray-700"
    >
      <small>
        &copy; 2026-{{ year }} {{ appName }}.
        <a
          class="underlined-link"
          href="https://creativecommons.org/licenses/by-sa/4.0/"
        >
          CC BY-SA 4.0
        </a>
      </small>
      <ul class="my-4 flex flex-row gap-2 items-center justify-center">
        <li
          v-for="{ link, name, icon } in links"
          :key="name"
        >
          <a
            :href="link"
            rel="me noopener noreferrer"
            target="_blank"
            class="touch-action-manipulation p-1 f-ring rounded-full inline-flex items-center"
            :aria-label="`${name} (opens in new tab)`"
          >
            <span
              class="h-4 w-4 fill-current"
              :class="icon"
              aria-hidden="true"
            />
          </a>
        </li>
      </ul>
    </footer>
  </div>
</template>

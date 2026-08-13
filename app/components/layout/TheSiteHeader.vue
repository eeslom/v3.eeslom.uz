<script setup lang="ts">
import { appCreator } from '~/constants'

const config = useRuntimeConfig()

const mobileMenuRef = ref<HTMLElement | null>(null)
const showMenu = ref(false)

const showAdminLink = ref(false)

const menu = computed(() => [
  {
    name: 'Home',
    path: '/',
  },
  {
    name: 'Projects',
    path: '/projects',
  },
  // {
  //   name: 'Uses',
  //   path: '/uses',
  // },
  ...(showAdminLink.value ? [{ name: 'Admin', path: '/admin' }] : []),
])

useRouter().afterEach(() => {
  mobileMenuRef.value?.hidePopover()
})

function onPopoverToggle(event: ToggleEvent) {
  const isOpen = event.newState === 'open'
  showMenu.value = isOpen
  document.body.classList.toggle('overflow-hidden', isOpen)
}
</script>

<template>
  <nav aria-label="Main navigation" class="px-4 py-4 flex flex-row uppercase items-center justify-between md:tracking-[0.15rem] md:px-12 md:py-8 md:pt-4">
    <ul class="text-sm flex flex-grow flex-row items-center justify-between md:text-base md:flex-grow-0">
      <li>
        <NuxtLink
          class="underlined-link mr-6 py-2"
          to="/"
          :class="{
            'not-[:hover,:focus,:active]:after:border-transparent':
              $route.path !== '/',
          }"
        >
          {{ appCreator }}
          <span class="ml-1">
            <span class="sr-only">is currently in {{ }}</span>
            {{ }}
          </span>
        </NuxtLink>
      </li>
      <template v-for="link in menu.slice(1)" :key="link.name">
        <li>
          <NuxtLink
            :to="link.path"
            class="underlined-link hover:text-primary active:text-primary focus:text-primary px-2 py-2 hidden transition-colors md:inline-block"
            :class="{
              'not-[:hover,:focus,:active]:after:border-transparent text-muted':
                $route.path !== link.path,
            }"
          >
            {{ link.name }}
          </NuxtLink>
        </li>
      </template>
    </ul>
    <div class="ml-2 mr-1 flex flex-shrink-0 items-center justify-between md:gap-2">
      <div class="md:hidden">
        <button type="button" class="f-ring ml-4 rounded" popovertarget="mobile-menu">
          <span aria-hidden="true" class="i-ri:add-line menu-icon h-8 w-8 md:h-6 md:w-6" />
          <span class="sr-only">Open mobile navigation menu</span>
        </button>
        <div id="mobile-menu" ref="mobileMenuRef" popover class="text-muted bg-accent m-0 border-none h-full max-h-full max-w-full w-full inset-0" @toggle="onPopoverToggle">
          <div class="flex flex-col h-full items-center justify-center">
            <button
              type="button"
              class="f-ring-accent p-8 rounded right-0 top-0 fixed"
              popovertarget="mobile-menu"
              popovertargetaction="hide"
            >
              <span
                class="menu-icon i-ri:close-fill h-8 w-8"
                aria-hidden="true"
              />
              <span class="sr-only"> Close mobile navigation menu </span>
            </button>
            <nav aria-label="Mobile navigation">
              <ul class="text-2xl tracking-[0.15rem] flex flex-col gap-6 max-w-xl uppercase items-center">
                <li v-for="link in menu" :key="link.name">
                  <NuxtLink
                    class="underlined-link px-2 py-2"
                    :to="link.path"
                    :class="{
                      'not-[:hover,:focus,:active]:after:border-transparent':
                        $route.path !== link.path,
                    }"
                  >
                    {{ link.name }}
                  </NuxtLink>
                </li>
                <li><ToggleColorMode class="flex" /></li>
              </ul>
            </nav>
          </div>
        </div>
      </div>
      <ToggleColorMode class="hidden md:flex" />
    </div>
  </nav>
</template>

<style>
@media (prefers-reduced-motion: no-preference) {
  #mobile-menu {
    transition:
      opacity 0.2s ease,
      overlay 0.2s ease allow-discrete,
      display 0.2s ease allow-discrete;
    opacity: 0;
  }

  #mobile-menu:popover-open {
    opacity: 1;
  }

  @starting-style {
    #mobile-menu:popover-open {
      opacity: 0;
    }
  }

  #mobile-menu .menu-icon {
    transition: transform 0.2s ease;
    transform: rotate(-45deg);
  }

  #mobile-menu:popover-open .menu-icon {
    transform: rotate(0deg);
  }

  @starting-style {
    #mobile-menu:popover-open .menu-icon {
      transform: rotate(-45deg);
    }
  }
}
</style>

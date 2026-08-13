import type { HmrOptions } from 'vite'
import process from 'node:process'

import { defineNuxtConfig } from 'nuxt/config'

import { isTest } from 'std-env'

import { pwa } from './app/config/pwa'

const isDev = process.env.NODE_ENV === 'development'

export default defineNuxtConfig({
  modules: [
    '@vueuse/nuxt',
    '@unocss/nuxt',
    '@pinia/nuxt',
    'magic-regexp/nuxt',
    '@nuxtjs/color-mode',
    '@vite-pwa/nuxt',
    '@nuxt/eslint',
    '@nuxt/fonts',
    'nuxt-gtag',
    '@nuxt/scripts',
    '@nuxtjs/html-validator',
    '@nuxt/image',
    '@nuxtjs/i18n',
  ],

  $development: {
    modules: [
      function (_options, nuxt) {
        if (process.env.IDX_CHANNEL) {
          nuxt.hook('modules:done', () => {
            nuxt.options.vite.server ||= {}
            nuxt.options.vite.server.hmr ||= {}
            ;(nuxt.options.vite.server.hmr as HmrOptions).protocol = 'wss'
          })
        }
      },
    ],
  },

  components: [
    '~/components',
  ],

  imports: {
    polyfills: true,
  },

  devtools: {
    enabled: isDev,
  },

  app: {
    head: {
      htmlAttrs: {
        lang: 'en',
      },
      viewport: 'width=device-width,initial-scale=1',
      link: [
        { rel: 'icon', href: '/favicon.ico', sizes: 'any' },
        { rel: 'icon', type: 'image/svg+xml', href: '/nuxt.svg' },
        { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' },
      ],
      meta: [
        { name: 'apple-mobile-web-app-status-bar-style', content: 'black-translucent' },
        // { name: 'theme-color', media: '(prefers-color-scheme: light)', content: 'white' },
        // { name: 'theme-color', media: '(prefers-color-scheme: dark)', content: '#222222' },
      ],
    },
    pageTransition: false,
    layoutTransition: false,
  },

  css: ['@unocss/reset/tailwind.css', '~/assets/main.css'],

  colorMode: {
    classSuffix: '',
  },

  runtimeConfig: {
    admin: {},
    public: {
      githubClientId: '',
    },
    botToken: process.env.BOT_TOKEN,
  },

  routeRules: {
    '/': { swr: 60 * 60 },
    '/projects': { swr: 60 * 60 },
    '/contact': { swr: 60 * 60 },
    '/uses': { swr: 60 * 60 },
    '/admin/**': { prerender: false },
    '/blog/**': { swr: 60 * 60 },
    // redirects
    '/feed.xml': { redirect: '/rss.xml' },
  },

  sourcemap: {
    client: false,
    server: false,
  },

  future: {
    compatibilityVersion: 4,
  },

  experimental: {
    typedPages: true,
    viewTransition: true,
    renderJsonPayloads: true,
    payloadExtraction: true,
  },

  compatibilityDate: '2024-08-14',

  nitro: {
    preset: 'cloudflare_pages',
    replace: {
      'import.meta.test': isTest,
    },
    esbuild: {
      options: {
        target: 'esnext',
      },
    },
    typescript: {
      tsConfig: {
        compilerOptions: {
          noUncheckedIndexedAccess: true,
          allowImportingTsExtensions: true,
          noEmit: true,
        },
      },
    },
  },

  vite: {
    optimizeDeps: {
      include: [
        'gsap',
        'magic-regexp',
      ],
    },
    vue: {
      features: {
        optionsAPI: false,
      },
    },
  },

  typescript: {
    tsConfig: {
      compilerOptions: {
        allowImportingTsExtensions: true,
        noEmit: true,
      },
    },
    nodeTsConfig: {
      // include: ['../scripts'],
      compilerOptions: {
        allowImportingTsExtensions: true,
        noEmit: true,
      },
    },
    sharedTsConfig: {
      compilerOptions: {
        allowImportingTsExtensions: true,
        noEmit: true,
      },
    },
  },

  eslint: {
    config: {
      standalone: false,
      nuxt: {
        sortConfigKeys: true,
      },
    },
  },

  fonts: {
    families: [
      { name: 'Inter', preload: true },
    ],
  },

  gtag: {
    id: 'G-L4L7VHMGCC',
  },

  htmlValidator: {
    failOnError: true,
    options: {
      rules: {
        'unrecognized-char-ref': 'off',
        'wcag/h37': 'warn',
        'element-permitted-content': 'warn',
        'element-required-attributes': 'warn',
        'attribute-empty-style': 'off',
      },
    },
  },

  i18n: {
    langDir: 'internalization',
    strategy: 'no_prefix',
    detectBrowserLanguage: {
      useCookie: true,
      fallbackLocale: 'en',
    },
    locales: [
      {
        name: 'English',
        code: 'en',
        file: 'en.json',
      },
    ],
    defaultLocale: 'en',
  },

  image: {
    quality: 80,
    domains: [],
  },

  pwa,

  scripts: {
    defaultScriptOptions: {
      bundle: true,
    },
  },
})

import type { HmrOptions } from 'vite'
import { resolve as resolvePath } from 'node:path'
import process from 'node:process'

import { defineNuxtConfig } from 'nuxt/config'

import { isTest } from 'std-env'

import { pageMeta } from './modules/shared/page-meta'

const isDev = process.env.NODE_ENV === 'development'

export default defineNuxtConfig({
  modules: [
    '@vueuse/nuxt',
    '@unocss/nuxt',
    '@pinia/nuxt',
    'magic-regexp/nuxt',
    '@nuxtjs/color-mode',
    '@nuxt/eslint',
    'nuxt-gtag',
    '@nuxt/scripts',
    '@nuxtjs/html-validator',
    '@nuxt/image',
    '@nuxtjs/i18n',
    '@nuxt/content',
    function (_options, nuxt) {
      nuxt.hook('nitro:init', (nitro) => {
        if (nitro.options.preset !== 'cloudflare-pages')
          return

        nitro.options.alias ||= {}
        nitro.options.alias['#content/local-adapter'] = resolvePath(
          nuxt.options.rootDir,
          'server/utils/cloudflare-content-local-adapter.ts',
        )
      })
    },
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

  content: {
    database: {
      type: 'd1',
      bindingName: 'DB',
    },
    build: {
      markdown: {
        highlight: {
          theme: {
            default: 'vitesse-light',
            dark: 'vitesse-dark',
          },
          langs: ['js', 'ts', 'html', 'css', 'vue', 'bash', 'json'],
        },
      },
    },
  },

  runtimeConfig: {
    admin: {},
    public: {
      githubClientId: process.env.GITHUB_CLIENT_ID,
    },
    github: {
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    },
    sessionPassword: process.env.SESSION_PASSWORD,
    pushover: {
      token: process.env.PUSHOVER_TOKEN,
      userKey: process.env.PUSHOVER_USER_KEY,
    },
    botToken: process.env.BOT_TOKEN,
  },

  routeRules: isDev ? {} : {
    ...Object.fromEntries(Object.keys(pageMeta).flatMap(path => [
      [path, { swr: 60 * 60 }],
      [`${path}/_payload.json`, { swr: 60 * 60 }],
      [`${path}.md`, { swr: 60 * 60 }],
    ])),
    '/admin/**': { prerender: false },
    '/blog/**': { swr: 60 * 60 },
    // redirects
    '/feed.xml': { redirect: '/rss.xml' },
  },

  sourcemap: {
    client: true,
    server: false,
  },

  future: {
    compatibilityVersion: 4,
  },

  experimental: {
    payloadExtraction: true,
    renderJsonPayloads: true,
    typedPages: true,
    viewTransition: true,
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
    future: {
      nativeSWR: true,
    },
    prerender: {
      crawlLinks: true,
      routes: ['/rss.xml'],
      autoSubfolderIndex: false,
    },
    hooks: {
      'prerender:generate': function (route) {
        if (route.fileName) {
          route.fileName = route.fileName.replace(
            /(\.\w{2,3})\/index.html$/,
            '$1',
          )
        }

        if (route.error) {
          if (route.route.startsWith('/_ipx')) {
            console.warn('Could not prerender', route.route)
            // ignore IPX rendering errors
            delete route.error
          }
          else {
            console.error(route.route, route.error, route)
            process.exit(1)
          }
        }
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
      include: ['../scripts'],
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
      {
        name: 'Uzbek',
        code: 'uz',
        file: 'uz.json',
      },
    ],
    defaultLocale: 'en',
  },

  image: {
    quality: 80,
    domains: [],
  },

  scripts: {
    defaultScriptOptions: {
      bundle: true,
    },
  },
})

import { createResolver } from 'nuxt/kit'

import {
  defineConfig,
  presetAttributify,
  presetIcons,
  presetTypography,
  presetWind4,
  transformerDirectives,
  transformerVariantGroup,
} from 'unocss'

export default defineConfig({
  shortcuts: [
    {
      'underlined-link':
        'relative inline-block after:block after:my-[-0.5em] after:mx-[-0.25em] after:opacity-10 after:border-current after:content-empty after:duration-300 after:transition-border-color after:transition-opacity after:border-b-[0.5em] outline-none hover:after:opacity-35 active:after:opacity-35 focus-visible:after:opacity-35',
      'f-ring':
        'outline-none focus-visible:ring-2 focus-visible:ring-primary/80 focus-visible:ring-offset-2 focus-visible:ring-offset-background',
      'f-ring-accent':
        'outline-none focus-visible:ring-2 focus-visible:ring-primary/80 focus-visible:ring-offset-2 focus-visible:ring-offset-accent',
      'f-ring-inset':
        'outline-none focus-visible:ring-2 focus-visible:ring-primary/80 focus-visible:ring-inset',
      'f-tray-item':
        'outline-none rounded-full focus-visible:ring-2 focus-visible:ring-primary/80 focus-visible:ring-offset-1 focus-visible:ring-offset-accent',
      'btn':
        'rounded w-full bg-secondary px-3 py-2 text-base cursor-pointer disabled:opacity-50 disabled:cursor-default',
      'inp':
        'rounded w-full bg-secondary px-3 py-2 text-base f-ring-inset',
    },
  ],
  variants: [
    {
      order: -10,
      match: (matcher) => {
        if (!matcher.startsWith('*:'))
          return matcher
        matcher = matcher.slice('*:'.length)
        const child = matcher.match(/(first|last):/)?.[1]
        if (child) {
          matcher = matcher.slice(child.length + 1)
          return {
            matcher,
            selector: s => `${s} > *:${child}-child`,
          }
        }
        return {
          matcher,
          selector: s => `${s} > *`,
        }
      },
    },
  ],
  theme: {
    colors: {
      primary: 'var(--primary)',
      secondary: 'var(--secondary)',
      accent: 'var(--accent)',
      muted: 'rgb(var(--muted) / var(--un-bg-opacity, 1))',
      background: 'var(--background)',
    },
    fontFamily: {
      sans: 'Inter',
      code: 'DM Mono, Input Mono, Fira Code, monospace',
      serif: 'Vollkorn, serif',
    },
  },
  presets: [
    presetWind4(),
    presetAttributify(),
    presetIcons({
      extraProperties: {
        'display': 'inline-block',
        'vertical-align': 'middle',
      },
    }),
    presetTypography(),
  ],
  transformers: [
    transformerDirectives(),
    transformerVariantGroup(),
  ],
})

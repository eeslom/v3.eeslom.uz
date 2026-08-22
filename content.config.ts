import { defineCollection, defineContentConfig } from '@nuxt/content'
import { z } from 'zod'

export default defineContentConfig({
  collections: {
    blog: defineCollection({
      type: 'page',
      source: 'blog/**/*.md',
      schema: z.object({
        title: z.string(),
        date: z.date(),
        description: z.string().optional(),
        tags: z.array(z.string()).optional(),
      }),
    }),
    page: defineCollection({
      type: 'page',
      source: '**/*.md',
    }),
  },
})

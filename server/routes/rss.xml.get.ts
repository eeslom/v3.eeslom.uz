import { queryCollection } from '@nuxt/content/server'
import { Feed } from 'feed'
import { defineEventHandler } from 'h3'

export default defineEventHandler(async (event) => {
  if (!import.meta.dev && !import.meta.prerender)
    return

  const feed = new Feed({
    title: `Islom Murodov`,
    description: 'The personal website of Islom Murodov',
    feed: 'https://eeslom.uz/rss.xml',
    id: 'https://eeslom.uz/',
    link: 'https://eeslom.uz/blog',
    language: 'en',
    copyright: `© 2026-${new Date().getFullYear()} Islom Murodov. All rights reserved.`,
    author: {
      name: 'Islom Murodov',
      email: 'hi@eeslom.uz',
      link: 'https://eeslom.uz/',
    },
  })

  const articles = await queryCollection(event, 'blog').order('date', 'DESC').all()

  for (const article of articles) {
    feed.addItem({
      title: article.title,
      link: `https://eeslom.uz/blog/${article.path}`,
      description: article.description,
      category: article.tags?.map((tag: string) => ({ name: tag })),
      author: [
        {
          name: 'Islom Murodov',
          email: 'hi@eeslom.uz',
          link: 'https://eeslom.uz',
        },
      ],
      date: new Date(article.date),
    })
  }

  setHeader(event, 'content-type', 'application/xml')

  return feed.rss2()
})

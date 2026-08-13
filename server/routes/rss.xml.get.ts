import { Feed } from 'feed'

export default defineEventHandler(async () => {
  if (!import.meta.dev && !import.meta.prerender)
    return

  const feed = new Feed({
    title: 'Islom Murodov',
    description: 'The personal website of Islom Murodov',
    feed: 'https://eeslom.uz/rss.xml',
    id: 'https://eeslom.uz/',
    language: 'en',
    copyright: `© 2026-${new Date().getFullYear()} Islom Murodov. All rights reserved.`,
    author: {
      name: 'Islom Murodov',
      email: 'hi@eeslom.uz',
      link: 'https://eeslom.uz/',
    },
  })

  return feed.rss2()
})

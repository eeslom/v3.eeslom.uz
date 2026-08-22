export interface PageMeta {
  title: string
  description?: string
}

export const pageMeta: Record<string, PageMeta> = {
  '/': {
    title: 'Islom Murodov',
    description: 'The personal website of Islom Murodov, Nuxt core team lead',
  },
  '/projects': {
    title: 'Projects',
    description: 'Open source projects, libraries and sites by Islom Murodov',
  },
  '/contact': {
    title: 'Contact Me',
    description: 'Contact me',
  },
  '/use': {
    title: 'Use',
    description: 'Tools, software, and hardware I am using',
  },
}

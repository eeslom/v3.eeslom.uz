export interface PageMeta {
  title: string
  description?: string
  /** Short label used in llms.txt page index. Pages without this are excluded from llms.txt. */
  llmLabel?: string
}

export const pageMeta: Record<string, PageMeta> = {
  '/': {
    title: 'Islom Murodov',
    description: 'The personal website of Islom Murodov, Nuxt core team lead',
  },
  '/projects': {
    title: 'Projects',
    description: 'Open source projects, libraries and sites by Islom Murodov',
    llmLabel: 'Open source projects, libraries and sites',
  },
  '/uses': {
    title: 'Uses',
    description: 'Tools, software, and hardware that Islom Murodov uses',
    llmLabel: 'Tools and software',
  },
}

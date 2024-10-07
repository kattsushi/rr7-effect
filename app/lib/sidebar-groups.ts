export type Pages = {
  id: string
  category: string
  title?: string
  status?: string
  slug?: string
}

const pages = [
  { id: 'introduction', category: 'overview', title: 'Introduction', status: 'new', slug: 'introduction' },
  { id: 'getting-started', category: 'overview', title: 'Getting Started', status: 'new', slug: 'getting-started' },
  { id: 'figma', category: 'overview', title: 'Figma', status: 'new', slug: 'figma' },
  { id: 'changelog', category: 'overview', title: 'Changelog', status: 'new', slug: 'changelog' },
  { id: 'about', category: 'overview', title: 'About', status: 'new', slug: 'about' },
]
export const getSidebarGroups = (): Pages[][] => {
  const categories = ['overview', 'theme', 'typography', 'components']
  const overviewPriority = ['introduction', 'getting-started', 'figma', 'changelog', 'about']

  const sortedCategories = pages.reduce<Record<string, Pages[]>>((acc, page) => {
    const category = page.category
    if (categories.includes(category)) {
      if (!acc[category]) {
        acc[category] = []
      }
      acc[category].push(page)
    }
    return acc
  }, {})

  // Sort pages within the 'overview' category by priority
  if (sortedCategories.overview) {
    sortedCategories.overview.sort((a, b) => overviewPriority.indexOf(a.id) - overviewPriority.indexOf(b.id))
  }

  return (
    categories
      // biome-ignore lint/suspicious/noPrototypeBuiltins: This line is safe as `categories` is predefined and not from external input
      .filter((category) => sortedCategories.hasOwnProperty(category))
      .map((category) => sortedCategories[category])
  )
}

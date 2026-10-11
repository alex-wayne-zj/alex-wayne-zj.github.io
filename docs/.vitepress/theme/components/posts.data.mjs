import { createContentLoader } from 'vitepress'

// Read frontmatter at build time; never ship article bodies in the blog index.
export default createContentLoader('*/index.md', {
  includeSrc: false,
  render: false,
  excerpt: false,
  transform(pages) {
    return pages
      .filter(page => !page.frontmatter.hide)
      .map(({ url, frontmatter }) => ({
        url,
        title: frontmatter.title,
        date: new Date(frontmatter.date).toISOString(),
        tags: frontmatter.tags ?? [],
        cover: url + frontmatter.cover.replace(/^\.?\//, ''),
      }))
      .sort((a, b) => Date.parse(b.date) - Date.parse(a.date))
  },
})

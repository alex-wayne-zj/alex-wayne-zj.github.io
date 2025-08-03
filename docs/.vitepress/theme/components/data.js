const modules = import.meta.glob('../../../**/*.md', { eager: true })
const imageMap = import.meta.glob('../../../**/*.{png,jpeg,jpg,webp}', { query: '?url', import: 'default', eager: true })

export const blogs = Object.entries(modules)
  .filter(([_, mod]) => !mod.__pageData.frontmatter.hide)
  .map(([path, mod]) => {
    return {
      title: mod.__pageData.frontmatter.title,
      date: new Date(mod.__pageData.frontmatter.date),
      tags: mod.__pageData.frontmatter.tags,
      url: "../" + path.split('/')[3] + "/",
      cover: imageMap["../../../" + path.split('/')[3] + "/" + mod.__pageData.frontmatter.cover.replace(/^\.?\//, '')],
    }
  }).sort((a, b) => b.date.getTime() - a.date.getTime())
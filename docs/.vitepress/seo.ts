import type { HeadConfig, PageData, TransformContext } from 'vitepress'

export const siteUrl = 'https://alex-wayne-zj.github.io/'
export const siteDescription = 'Alex 的个人博客，记录技术、文艺与生活随笔，分享实用指北。'

function pageUrl(relativePath: string) {
  const route = relativePath.replace(/(^|\/)index\.md$/, '$1').replace(/\.md$/, '')
  return new URL(route, siteUrl).href
}

export function pageSeo(pageData: PageData) {
  const { frontmatter } = pageData
  const url = pageUrl(pageData.relativePath)
  const title = frontmatter.title || pageData.title || "Alex's Blogs"
  const description = pageData.description || siteDescription
  const head: HeadConfig[] = [
    ['link', { rel: 'canonical', href: url }],
    ['meta', { property: 'og:type', content: frontmatter.layout === 'home' ? 'website' : 'article' }],
    ['meta', { property: 'og:site_name', content: "Alex's Blogs" }],
    ['meta', { property: 'og:locale', content: 'zh_CN' }],
    ['meta', { property: 'og:url', content: url }],
    ['meta', { property: 'og:title', content: title }],
    ['meta', { property: 'og:description', content: description }],
    ['meta', { name: 'twitter:card', content: frontmatter.cover ? 'summary_large_image' : 'summary' }],
    ['meta', { name: 'twitter:title', content: title }],
    ['meta', { name: 'twitter:description', content: description }],
  ]
  frontmatter.head = [...(frontmatter.head || []), ...head]
  return { description }
}

export function builtPageSeo({ page, content }: TransformContext): HeadConfig[] {
  if (page === '404.md') return [['meta', { name: 'robots', content: 'noindex' }]]

  // The rendered header has Vite's final hashed image URL, unlike frontmatter.
  // Reuse that asset for crawlers instead of emitting another copy of the cover.
  const image = content.match(/<img\b(?=[^>]*\bdata-blog-cover(?:\s|=|>))[^>]*\bsrc="([^"]+)"/)
  const url = new URL(image?.[1].replace(/&amp;/g, '&') || '/logo.webp', siteUrl).href
  return [
    ['meta', { property: 'og:image', content: url }],
    ['meta', { name: 'twitter:image', content: url }],
  ]
}

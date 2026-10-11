import type { DefaultTheme } from 'vitepress'

export const localSearchOptions: DefaultTheme.LocalSearchOptions = {
  translations: {
    button: { buttonText: '搜索', buttonAriaLabel: '搜索文章' },
    modal: {
      displayDetails: '显示正文摘要',
      resetButtonTitle: '清空搜索',
      backButtonTitle: '关闭搜索',
      noResultsText: '没有找到相关文章',
      footer: {
        selectText: '打开',
        selectKeyAriaLabel: '回车键',
        navigateText: '切换结果',
        navigateUpKeyAriaLabel: '上箭头',
        navigateDownKeyAriaLabel: '下箭头',
        closeText: '关闭',
        closeKeyAriaLabel: 'Esc 键',
      },
    },
  },
  miniSearch: {
    options: {
      // This function is serialized to the browser: keep it self-contained
      // so indexing and queries use exactly the same Chinese word segmentation.
      tokenize: (text: string) => Array.from(
        new Intl.Segmenter('zh-CN', { granularity: 'word' }).segment(text),
      ).filter(word => word.isWordLike).map(word => word.segment),
    },
    searchOptions: { prefix: true, fuzzy: false, combineWith: 'AND' },
  },
  _render(src, env, md) {
    const html = md.render(src, env)
    if (env.frontmatter?.hide || env.frontmatter?.search === false) return ''
    const title = env.frontmatter?.title
    if (!title) return html

    // Article titles live in our Vue header, outside the Markdown headings.
    // Add an index-only heading with an empty anchor to link to the article root.
    return `<h1>${md.utils.escapeHtml(String(title))}<a href="#"></a></h1>\n${html}`
  },
}

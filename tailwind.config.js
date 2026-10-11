export default {
  content: [
    // Scan authored components, never generated bundles or cached search data.
    './docs/.vitepress/theme/**/*.{js,mjs,ts,vue}',
    './docs/**/*.md'
  ],
  theme: {
    extend: {},
  },
  darkMode: 'class',
  plugins: [],
}

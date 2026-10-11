import DefaultTheme from 'vitepress/theme'
import type { Theme } from 'vitepress';
import Layout from "./Layout.vue";
import "./tailwind.css";
import { watch } from 'vue';
import { blogs } from './components/data.js';
import { siteUrl } from '../seo';

export default {
  ...DefaultTheme,
  Layout: Layout,
  enhanceApp(ctx) {
    DefaultTheme.enhanceApp?.(ctx);
    if (import.meta.env.SSR) return;

    // These tags are rendered by transformHead, outside VitePress's managed
    // frontmatter tags. Keep the same hashed cover URLs during SPA navigation.
    watch(() => ctx.router.route.path, (route) => {
      const cover = blogs.find(blog => blog.url === route)?.cover || '/logo.webp';
      const image = new URL(cover, siteUrl).href;
      for (const [attribute, key] of [['property', 'og:image'], ['name', 'twitter:image']]) {
        let meta = document.head.querySelector<HTMLMetaElement>(`meta[${attribute}="${key}"]`);
        if (!meta) {
          meta = document.createElement('meta');
          meta.setAttribute(attribute, key);
          document.head.appendChild(meta);
        }
        meta.content = image;
      }
    }, { immediate: true, flush: 'post' });
  },
} satisfies Theme

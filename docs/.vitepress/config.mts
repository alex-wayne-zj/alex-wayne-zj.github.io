import { defineConfig, HeadConfig } from "vitepress";
import svgLoader from "vite-svg-loader";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Alex's Blogs",
  description: "Stay Sharp, Stay Gentle.",
  cleanUrls: true,
  base: "/",
  vite: {
    plugins: [svgLoader()],
  },
  head: [
    ["link", { rel: "icon", href: "/logo.ico" }],
    // Add meta keywords for SEO
    [
      "meta",
      {
        name: "keywords",
        content:
          "Alex's Blogs,科技,程序员,影评,书评,生活,互联网,编程,前端,Vue,后端,Golang,Python,博客"
      },
    ],
    // add Google Analycs
    [
      'script',
      { async: '', src: 'https://www.googletagmanager.com/gtag/js?id=G-5C9535TJJS' }
    ],
    [
      'script',
      {},
      `window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'G-5C9535TJJS');`
    ]
  ],
  transformHead: ({ pageData }) => {
    const head: HeadConfig[] = [];
    const title = pageData?.frontmatter?.title || "Alex's Blogs";
    const description = pageData?.frontmatter?.description || "Stay Sharp, Stay Gentle.";
    const cover = pageData?.frontmatter?.cover || "/logo.ico";

    head.push(["meta", { property: "og:title", content: title }]);
    head.push(["meta", { property: "og:description", content: description }]);
    head.push(["meta", { property: "og:image", content: cover }]);

    return head;
  },
  themeConfig: {
    logo: "/logo.ico",
    nav: [
      { text: "About", link: "https://github.com/alex-wayne-zj" },
    ],
    socialLinks: [
      {
        icon: "github",
        link: "https://github.com/alex-wayne-zj/alex-wayne-zj.github.io",
      },
      {
        icon: "x",
        link: "https://x.com/AlexWayne303",
      },
    ],
    outlineTitle: "本文导览",
    search: {
      provider: 'local'
    }
  },
});

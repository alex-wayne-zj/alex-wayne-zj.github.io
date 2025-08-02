import { defineConfig, HeadConfig } from "vitepress";

export default defineConfig({
  title: "Alex's Blogs",
  description: "Stay Sharp, Stay Gentle.",
  cleanUrls: true,
  base: "/",
  head: [
    ["link", { rel: "icon", href: "/logo.ico" }],
    // Add meta keywords for SEO
    [
      "meta",
      {
        name: "keywords",
        content:
          "Alex's Blogs,科技,程序员,前端,Vue,后端,Golang,Python,AI,电影,电视剧,书籍,音乐,生活,写作,博客,美食,摄影,播客,游戏,理财,英语,德语,日语,健身,哲学,社会学"
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
    socialLinks: [
      {
        icon: "github",
        link: "https://github.com/alex-wayne-zj",
      },
      {
        icon: "x",
        link: "https://x.com/AlexWayne303",
      },
    ],
    outlineTitle: "本文导览",
  },
});

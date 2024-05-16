import { defineConfig } from "vitepress";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Alex's Blogs",
  description: "To be or not to be?",
  cleanUrls: true,
  head: [["link", { rel: "icon", href: "/logo.jpg" }]],
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    logo: "logo.jpg",
    nav: [
      { text: "Home", link: "/" },
      { text: "Coding", link: "/coding/" },
      { text: "Passion", link: "/passion/" },
      { text: "Life", link: "/life/" },
    ],
    sidebar: {
      "/coding/": [
        {
          text: "Coding",
          items: [
            { text: "Markdown Examples", link: "/markdown-examples" },
            { text: "Runtime API Examples", link: "/api-examples" },
          ],
        },
      ],
      "/passion/": [
        {
          text: "Passion",
          items: [
            { text: "Markdown Examples", link: "/markdown-examples" },
            { text: "Runtime API Examples", link: "/api-examples" },
          ],
        },
      ],
      "/life/": [
        {
          text: "Life",
          items: [
            { text: "Markdown Examples", link: "/markdown-examples" },
            { text: "Runtime API Examples", link: "/api-examples" },
          ],
        },
      ],
    },

    socialLinks: [
      {
        icon: "github",
        link: "https://github.com/HolyDragon57/holydragon57.github.io",
      },
    ],
  },
});

import { defineConfig } from "vitepress";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Alex's Blogs",
  description: "",
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
            { text: "K8s", link: "/coding/K8s" },
            { text: "计算机图形学常见概念", link: "/coding/computer_graphics"},
            { text: "Golang", link: "/coding/Golang_notes"}, 
            { text: "Linux", link: "/coding/linux"},
          ],
        },
      ],
      "/passion/": [
        {
          text: "Passion",
          items: [
            { text: "Financing principles", link: "/passion/financing-principles" },
            { text: "Financing terminologies", link: "/passion/financing-terminologies" },
            { text: "草东没有派对", link: "/passion/no-party-for-caodong" },
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
        link: "https://github.com/alex-wayne-zj/alex-wayne-zj.github.io",
      },
    ],
  },
});

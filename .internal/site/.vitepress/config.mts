import { defineConfig } from "vitepress";

export default defineConfig({
  title: "Web App Template",
  description:
    "From Zero to Service: Build with Best Practices, Minimal Code, and Essential Tools.",
  srcDir: "src",
  lang: "en",
  themeConfig: {
    logo: "images/icon.png",
    nav: [
      { text: "Home", link: "/" },
      { text: "Getting Started", link: "getting-started" },
    ],
    sidebar: [
      {
        text: "Introduction",
        items: [
          {
            text: "What is web app template?",
            link: "/what-is-web-app-template",
          },
          {
            text: "Challenges Solved",
            link: "/challenges-solved",
          },
          { text: "Getting Started", link: "/getting-started" },
        ],
      },
      {
        text: "Writing",
        items: [
          {
            text: "Auth",
            link: "/auth",
          },
        ],
      },
    ],
    socialLinks: [
      { icon: "github", link: "https://github.com/hiroppy/web-app-template" },
      { icon: "twitter", link: "https://x.com/about_hiroppy" },
      { icon: "homeadvisor", link: "https://hiroppy.me/" },
    ],
  },
  locales: {
    root: {
      label: "English",
      lang: "en",
    },
    ja: {
      label: "Japanese",
      lang: "ja",
      link: "/ja/guide",
    },
  },
});

import { defineConfig } from "vitepress";

export default defineConfig({
  title: "Web App Template",
  description:
    "From Zero to Service: Build with Best Practices, Minimal Code, and Essential Tools.",
  srcDir: "src",
  themeConfig: {
    nav: [
      { text: "Home", link: "/" },
      { text: "Examples", link: "/markdown-examples" },
    ],

    sidebar: [
      {
        text: "Examples",
        items: [
          { text: "Markdown Examples", link: "/markdown-examples" },
          { text: "Runtime API Examples", link: "/api-examples" },
        ],
      },
    ],

    socialLinks: [
      { icon: "github", link: "https://github.com/hiroppy/web-app-template" },
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

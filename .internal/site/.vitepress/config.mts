import { defineConfig } from "vitepress";

export default defineConfig({
  title: "Web App Template",
  description:
    "From Zero to Service: Build with Best Practices, Minimal Code, and Essential Tools.",
  srcDir: "src",
  lang: "en",
  base: "/web-app-template/",
  themeConfig: {
    logo: "images/icon.png",
    nav: [
      { text: "Home", link: "/" },
      { text: "Getting Started", link: "/introduction/getting-started" },
    ],
    sidebar: [
      {
        text: "Introduction",
        items: [
          {
            text: "What is web app template?",
            link: "/introduction/what-is-web-app-template",
          },
          {
            text: "Challenges Solved",
            link: "/introduction/challenges-solved",
          },
          { text: "Getting Started", link: "/introduction/getting-started" },
        ],
      },
      {
        text: "Features",
        items: [
          {
            text: "Next.js",
            link: "/features/nextjs",
          },
          {
            text: "NextAuth.js",
            link: "/features/next-auth",
          },
          {
            text: "Prisma",
            link: "/features/prisma",
          },
          {
            text: "Unit Testing",
            link: "/features/unit-testing",
          },
          {
            text: "E2E Testing",
            link: "/features/e2e-testing",
          },
          {
            text: "Observability",
            link: "/features/observability",
          },
          {
            text: "Git",
            link: "/features/git",
          },
        ],
      },
    ],
    socialLinks: [
      { icon: "github", link: "https://github.com/hiroppy/web-app-template" },
      { icon: "twitter", link: "https://x.com/about_hiroppy" },
    ],
    editLink: {
      // TODO
      pattern: "https://github.com/vuejs/vitepress/edit/main/docs/:path",
      text: "Edit this page on GitHub",
    },
    lastUpdated: {
      text: "Updated at",
      formatOptions: {
        dateStyle: "full",
        timeStyle: "medium",
      },
    },
  },
  locales: {
    root: {
      label: "English",
      lang: "en",
    },
    // ja: {
    //   label: "Japanese",
    //   lang: "ja",
    //   link: "/ja/guide",
    // },
  },
});

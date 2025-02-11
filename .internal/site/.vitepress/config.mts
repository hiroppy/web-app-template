import { defineConfig } from "vitepress";

export default defineConfig({
  title: "Web App Template",
  description:
    "From Zero to Service: Build with Best Practices, Minimal Code, and Essential Tools.",
  srcDir: "src",
  lang: "en",
  head: [
    ["link", { rel: "icon", href: "/favicon.ico" }],
    // [
    //   "script",
    //   { async: "", src: "https://www.googletagmanager.com/gtag/js?id=TAG_ID" },
    // ],
    // [
    //   "script",
    //   {},
    //   `window.dataLayer = window.dataLayer || [];
    //   function gtag(){dataLayer.push(arguments);}
    //   gtag('js', new Date());
    //   gtag('config', 'TAG_ID');`,
    // ],
  ],
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
          { text: "Tasks", link: "/introduction/tasks" },
          {
            text: ".env",
            link: "/introduction/dotenv",
          },
          {
            text: "Routing",
            link: "/introduction/routing",
          },
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
            text: "Stripe",
            link: "/features/stripe",
          },
          {
            text: "Observability",
            link: "/features/observability",
          },
          {
            text: "Code Quality Automation",
            link: "/features/code-quality-automation",
          },
          {
            text: "Copilot Edits",
            link: "/features/copilot",
          },
        ],
      },
    ],
    socialLinks: [
      { icon: "github", link: "https://github.com/hiroppy/web-app-template" },
      { icon: "twitter", link: "https://x.com/about_hiroppy" },
    ],
    editLink: {
      pattern:
        "https://github.com/hiroppy/web-app-template/tree/main/.internal/site/src/:path",
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

# What is web app template?

This template enables rapid web service creation.

## Why not use create-next-app?

The create-next-app focuses on only next.js but actually, when you create a web service, you need to set up Test environment, CI, Formatter, Linter, and many libraries like Form, Observability, etc.

[hiroppy](https://x.com/about_hiroppy) develops more than three services annually but often finds tasks like setting up frontend infrastructure, CI environments, and directory structures to be tedious. To address this, a comprehensive template like this was created.

He also has Terraform configurations for deploying to Google Cloud but he doesn't know it's good to depend on the vendor, so those are not included in this template.

## Why not start with a blank slate?

As you can see in this template, there are a few pre-existing pages and a database model. For those experienced with frontend development, the Next.js pages, Zod, and React Hook Form code might seem unnecessary—they usually delete everything at the start.

However, by intentionally leaving best-practice examples in the code, the template becomes more accessible for beginners. The goal is to provide a balance: reducing the overall code volume while including reference implementations.

In the future, a "blank slate" option might be added as a flag.

## Goal

- Set up various configurations so **you can focus on application development**
- Provide best-practice code examples while keeping the overall codebase minimal

## Using Libraries

These are the main libraries that are installed. However, Playwright and OpenTelemetry can be opted out at install time. If you have any unnecessary libraries, please delete them after the initial creation.

|             |                                                                                                                            |                                                                                                                             |                                                                                                                  |
| ----------- | -------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| **App**     | <div align="center"><img src="/images/libs/nextjs.png" alt="nextjs" width="42"><br>Next.js</div>                           | <div align="center"><img src="/images/libs/tailwind.png" alt="tailwind" width="42"><br>Tailwind CSS</div>                   | <div align="center"><img src="/images/libs/next-auth.png" alt="next-auth" width="42"><br>NextAuth.js</div>       |
|             | <div align="center"><img src="/images/libs/react-hook-form.png" alt="react-hook-form" width="42"><br>React Hook Form</div> | <div align="center"><img src="/images/libs/zod.svg" alt="zod" width="42"><br>Zod </div>                                     | <div align="center"><img src="/images/libs/otel.png" alt="otel" width="42"><br>OpenTelemetry </div>              |
|             | <div align="center"><img src="/images/libs/prisma.png" alt="prisma" width="42"><br>Prisma </div>                           | <div align="center"><img src="/images/libs/postgresql.png" alt="prisma" width="42"><br>PostgreSQL</div>                     |                                                                                                                  |
|             |                                                                                                                            |                                                                                                                             |                                                                                                                  |
| **Tools**   | <div align="center"><img src="/images/libs/typescript.png" alt="typescirpt" width="42"><br>TypeScript</div>                | <div align="center"><img src="/images/libs/pnpm.svg" alt="pnpm" width="42"><br>pnpm</div>                                   | <div align="center"><img src="/images/libs/lint-staged.png" alt="lint-staged" width="42"><br> lint-staged </div> |
|             | <div align="center"><img src="/images/libs/biome.png" alt="biome" width="42"><br>Biome </div>                              | <div align="center"><img src="/images/libs/prettier.png" alt="prettier" width="42"><br> Prettier</div>                      | <div align="center"><img src="/images/libs/docker.png" alt="docker" width="42"><br> Docker</div>                 |
|             |                                                                                                                            |                                                                                                                             |                                                                                                                  |
| **Testing** | <div align="center"><img src="/images/libs/vitest.png" alt="vitest" width="42"><br> Vitest</div>                           | <div align="center"><img src="/images/libs/testing-library.png" alt="testing-library" width="42"><br> Testing Library</div> | <div align="center"><img src="/images/libs/playwright.png" alt="playwright" width="42"><br> Playwright</div>     |
|             | <div align="center"><img src="/images/libs/testcontainers.png" alt="testcontainers" width="42"><br> Testcontainers</div>   |                                                                                                                             |
|             |                                                                                                                            |                                                                                                                             |                                                                                                                  |
| **Others**  | <div align="center"><img src="/images/libs/github-actions.png" alt="actions" width="42"><br> GitHub Actions</div>          | <div align="center"><img src="/images/libs/renovate.png" alt="renovate" width="42"><br> Renovate</div>                      | <div align="center"><img src="/images/libs/vscode.png" alt="vscode" width="42"><br> VSCode</div>                 |

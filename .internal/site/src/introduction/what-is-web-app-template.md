# What is web app template?

This template based on Next.js enables rapid web service creation.

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

|             |                                                                                                                     |                                                                                                                             |                                                                                                              |                                                                                                                            |
| ----------- | ------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------- |
| **App**     | <div align="center"><img src="/images/libs/nextjs.png" alt="nextjs" width="44"><br>Next.js</div>                    | <div align="center"><img src="/images/libs/tailwind.png" alt="tailwind" width="44"><br>Tailwind CSS</div>                   | <div align="center"><img src="/images/libs/next-auth.png" alt="next-auth" width="44"><br>NextAuth.js</div>   | <div align="center"><img src="/images/libs/react-hook-form.png" alt="react-hook-form" width="44"><br>React Hook Form</div> |
|             | <div align="center"><img src="/images/libs/zod.svg" alt="zod" width="44"><br>Zod </div>                             | <div align="center"><img src="/images/libs/otel.png" alt="otel" width="44"><br>OpenTelemetry </div>                         | <div align="center"><img src="/images/libs/prisma.png" alt="prisma" width="44"><br>Prisma </div>             | <div align="center"><img src="/images/libs/postgresql.png" alt="prisma" width="44"><br>PostgreSQL</div>                    |
|             |                                                                                                                     |                                                                                                                             |                                                                                                              |
| **Tools**   | <div align="center"><img src="/images/libs/typescript.png" alt="typescirpt" width="44"><br>TypeScript</div>         | <div align="center"><img src="/images/libs/pnpm.svg" alt="pnpm" width="44"><br>pnpm</div>                                   | <div align="center"><img src="/images/libs/biome.png" alt="biome" width="44"><br>Biome </div>                | <div align="center"><img src="/images/libs/prettier.png" alt="prettier" width="44"><br> Prettier</div>                     |
|             | <div align="center"><img src="/images/libs/editorconfig.png" alt="editorconfig" width="44"><br> EditorConfig </div> | <div align="center"><img src="/images/libs/lefthook.png" alt="lefthook" width="44"><br> lefthook</div>                      | <div align="center"><img src="/images/libs/docker.png" alt="docker" width="44"><br> Docker </div>            |                                                                                                                            |
|             |                                                                                                                     |                                                                                                                             |                                                                                                              |
| **Testing** | <div align="center"><img src="/images/libs/vitest.png" alt="vitest" width="44"><br> Vitest</div>                    | <div align="center"><img src="/images/libs/testing-library.png" alt="testing-library" width="44"><br> Testing Library</div> | <div align="center"><img src="/images/libs/playwright.png" alt="playwright" width="44"><br> Playwright</div> | <div align="center"><img src="/images/libs/testcontainers.png" alt="testcontainers" width="44"><br> Testcontainers</div>   |
|             |                                                                                                                     |                                                                                                                             |
| **Others**  | <div align="center"><img src="/images/libs/github-actions.png" alt="actions" width="44"><br> GitHub Actions</div>   | <div align="center"><img src="/images/libs/renovate.png" alt="renovate" width="44"><br> Renovate</div>                      | <div align="center"><img src="/images/libs/vscode.png" alt="vscode" width="44"><br> VSCode</div>             | <div align="center"><img src="/images/libs/copilot.png" alt="copilot edits" width="44"><br> Copilot Edits</div>            |

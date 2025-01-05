<!-- 👉 remove -->

<div align="center">
  <h1>️️A minimal template for web app 🎃</h1>
  <img src=".internal/site/src/public/images/icon.png" alt="icon" width="120">
  <p>From Zero to Service, Build with Best Practices, Minimal Code, and Essential Tools</p>
  <br />
  <a href="https://hiroppy.github.io/web-app-template/"target="_blank" >📜 Read The Docs 📜</a>
  <br />
  <br />
</div>

|             |                                                                                                                                                     |                                                                                                                                                      |                                                                                                                                           |
| ----------- | --------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| **App**     | <div align="center"><img src=".internal/site/src/public/images/libs/nextjs.png" alt="nextjs" width="42"><br>Next.js</div>                           | <div align="center"><img src=".internal/site/src/public/images/libs/tailwind.png" alt="tailwind" width="42"><br>Tailwind CSS</div>                   | <div align="center"><img src=".internal/site/src/public/images/libs/next-auth.png" alt="next-auth" width="42"><br>NextAuth.js</div>       |
|             | <div align="center"><img src=".internal/site/src/public/images/libs/react-hook-form.png" alt="react-hook-form" width="42"><br>React Hook Form</div> | <div align="center"><img src=".internal/site/src/public/images/libs/zod.svg" alt="zod" width="42"><br>Zod </div>                                     | <div align="center"><img src=".internal/site/src/public/images/libs/otel.png" alt="otel" width="42"><br>OpenTelemetry </div>              |
|             | <div align="center"><img src=".internal/site/src/public/images/libs/prisma.png" alt="prisma" width="42"><br>Prisma </div>                           | <div align="center"><img src=".internal/site/src/public/images/libs/postgresql.png" alt="prisma" width="42"><br>PostgreSQL</div>                     |                                                                                                                                           |
|             |                                                                                                                                                     |                                                                                                                                                      |                                                                                                                                           |
| **Tools**   | <div align="center"><img src=".internal/site/src/public/images/libs/typescript.png" alt="typescirpt" width="42"><br>TypeScript</div>                | <div align="center"><img src=".internal/site/src/public/images/libs/pnpm.svg" alt="pnpm" width="42"><br>pnpm</div>                                   | <div align="center"><img src=".internal/site/src/public/images/libs/lint-staged.png" alt="lint-staged" width="42"><br> lint-staged </div> |
|             | <div align="center"><img src=".internal/site/src/public/images/libs/biome.png" alt="biome" width="42"><br>Biome </div>                              | <div align="center"><img src=".internal/site/src/public/images/libs/prettier.png" alt="prettier" width="42"><br> Prettier</div>                      | <div align="center"><img src=".internal/site/src/public/images/libs/docker.png" alt="docker" width="42"><br> Docker</div>                 |
|             |                                                                                                                                                     |                                                                                                                                                      |                                                                                                                                           |
| **Testing** | <div align="center"><img src=".internal/site/src/public/images/libs/vitest.png" alt="vitest" width="42"><br> Vitest</div>                           | <div align="center"><img src=".internal/site/src/public/images/libs/testing-library.png" alt="testing-library" width="42"><br> Testing Library</div> | <div align="center"><img src=".internal/site/src/public/images/libs/playwright.png" alt="playwright" width="42"><br> Playwright</div>     |
|             | <div align="center"><img src=".internal/site/src/public/images/libs/testcontainers.png" alt="testcontainers" width="42"><br> Testcontainers</div>   |                                                                                                                                                      |
|             |                                                                                                                                                     |                                                                                                                                                      |                                                                                                                                           |
| **Others**  | <div align="center"><img src=".internal/site/src/public/images/libs/github-actions.png" alt="actions" width="42"><br> GitHub Actions</div>          | <div align="center"><img src=".internal/site/src/public/images/libs/renovate.png" alt="renovate" width="42"><br> Renovate</div>                      | <div align="center"><img src=".internal/site/src/public/images/libs/vscode.png" alt="vscode" width="42"><br> VSCode</div>                 |

## Prerequisites

- Node.js v20 or higher
- [Docker](https://docs.docker.com/engine/install/)

## Installation

When installing the repository, you can skip the setup section, as the init script will do the equivalent of setup.

### Using CLI (recommended)

```sh
$ npx create-app-foundation@latest
```

The CLI creates a project directory and run internal/init script so it's easy to get started.

### Using GitHub Template

This repo is a GitHub template, so click the ["Use this template"](https://github.com/new?template_owner=hiroppy&template_name=web-app-template) button to create your repo. Then, you need to execute the below to finish setting it up.

```sh
$ node .internal/setup/init.mjs
```

<!-- ######## -->

## Setup

```sh
# enable git hooks and corepack
$ npm run setup
# install deps
$ pnpm i
# create ".env" and modifying environment variables
$ cp .env.sample .env
```

## Development

```sh
$ pnpm dev
```

## Production

```sh
$ pnpm db:up
$ pnpm build
$ pnpm start
```

<!-- otel -->

### Observability

This template uses Jaeger as a tracing platform. The local environment doesn't require `TRACE_EXPORTER_URL` environment value.

```sh
# open Jaeger
$ open http://localhost:16686/
```

<!-- ######## otel -->

## Test

### Unit Test

```sh
$ pnpm test
$ pnpm test:watch
```

<!-- e2e -->

### E2E Test

A build task must be executed before running tests to bypass JWT logic.

```sh
# install chrome
$ pnpm exec playwright install chrome
# build using test environments since it needs to change encode/decode functions of next-auth
$ pnpm build:test

$ pnpm test:e2e
# execute with UI
$ pnpm test:e2e:ui
```

<!-- ######## e2e -->

## Database

```sh
# create new migration
$ pnpm db:migrate
# reset the DB
$ pnpm db:reset
# view the database items
$ pnpm db:studio
```

## Links

- [Database ER diagram](/prisma/ERD.md)

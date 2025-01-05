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

|             |                                                                                                                                                            |                                                                                                                                                                              |                                                                                                                                                       |
| ----------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| **App**     | <div align="center"><img src=".internal/site/src/public/images/libs/nextjs.png" alt="nextjs" width="42"><br>Next.js (Framework)</div>                      | <div align="center"><img src=".internal/site/src/public/images/libs/tailwind.png" alt="tailwind" width="42"><br>Tailwind CSS (CSS)</div>                                     |                                                                                                                                                       |
|             | <div align="center"><img src=".internal/site/src/public/images/libs/react-hook-form.png" alt="react-hook-form" width="42"><br>React Hook Form (Form)</div> | <div align="center"><img src=".internal/site/src/public/images/libs/zod.svg" alt="zod" width="42"><br>Zod (Schema Validator) </div>                                          |                                                                                                                                                       |
|             | <div align="center"><img src=".internal/site/src/public/images/libs/prisma.svg" alt="prisma" width="42"><br>Prisma (ORM)</div>                             | <div align="center"><img src=".internal/site/src/public/images/libs/next-auth.png" alt="next-auth" width="42"><br>NextAuth.js (Auth)</div>                                   | <div align="center"><img src=".internal/site/src/public/images/libs/otel.png" alt="otel" width="42"><br>OpenTelemetry (Observability)</div>           |
|             |                                                                                                                                                            |                                                                                                                                                                              |                                                                                                                                                       |
| **Tools**   | <div align="center"><img src=".internal/site/src/public/images/libs/typescript.png" alt="typescirpt" width="42"><br>TypeScript (Language)</div>            | <div align="center"><img src=".internal/site/src/public/images/libs/pnpm.svg" alt="pnpm" width="42"><br>pnpm (Package Manager)</div>                                         | <div align="center"><img src=".internal/site/src/public/images/libs/lint-staged.png" alt="lint-staged" width="42"><br> lint-staged (Pre Commit)</div> |
|             | <div align="center"><img src=".internal/site/src/public/images/libs/biome.png" alt="biome" width="42"><br>Biome (Linter, Formatter)</div>                  | <div align="center"><img src=".internal/site/src/public/images/libs/prettier.png" alt="prettier" width="42"><br> Prettier (Formatter)</div>                                  | <div align="center"><img src=".internal/site/src/public/images/libs/docker.png" alt="docker" width="42"><br> Docker (Container)</div>                 |
|             |                                                                                                                                                            |                                                                                                                                                                              |                                                                                                                                                       |
| **Testing** | <div align="center"><img src=".internal/site/src/public/images/libs/vitest.png" alt="vitest" width="42"><br> Vitest (Test Runner)</div>                    | <div align="center"><img src=".internal/site/src/public/images/libs/testing-library.png" alt="testing-library" width="42"><br> Testing Library (DOM testing utilities)</div> | <div align="center"><img src=".internal/site/src/public/images/libs/playwright.png" alt="playwright" width="42"><br> Playwright (E2E Testing)</div>   |
|             | <div align="center"><img src=".internal/site/src/public/images/libs/testcontainers.png" alt="testcontainers" width="42"><br> Testcontainers (Docker)</div> |                                                                                                                                                                              |
|             |                                                                                                                                                            |                                                                                                                                                                              |                                                                                                                                                       |
| **Others**  | <div align="center"><img src=".internal/site/src/public/images/libs/github-actions.png" alt="actions" width="42"><br> GitHub Actions (CI)</div>            | <div align="center"><img src=".internal/site/src/public/images/libs/renovate.png" alt="renovate" width="42"><br> Renovate (Deps Manager)</div>                               | <div align="center"><img src=".internal/site/src/public/images/libs/vscode.png" alt="vscode" width="42"><br> VSCode (Editor)</div>                    |

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
# start docker compose, migrations(generating the client), and next dev
$ pnpm dev
```

## Database

```sh
# create new migration
$ pnpm db:migrate
# reset the DB
$ pnpm db:reset
# view the database items
$ pnpm db:studio
```

## Test

Test uses real DB via testcontaiers.

### Unit Test

```sh
# execute
$ pnpm test
# watch the unit test
$ pnpm test:watch
```

<!-- e2e -->

### E2E Test

```sh
# install chrome
$ pnpm exec playwright install chrome
# build using test environments since it needs to change encode/decode functions of next-auth
$ pnpm build:test
# execute
$ pnpm test:e2e
# execute with UI
$ pnpm test:e2e:ui
```

<!-- ######## e2e -->

## Production

```sh
$ pnpm db:up
$ pnpm build
$ pnpm start
```

If you set `POSTGRESQL_URL` as GitHub secrets, you will be able to execute migration for database on GitHub actions(`.github/workflows/migration.yml`).

<!-- otel -->

## Observability

This project has [OpenTelemetry](https://opentelemetry.io/) and it works only production environment.

### Local

```sh
$ pnpm db:up
$ pnpm build
$ pnpm start
# open Jaeger
$ open http://localhost:16686/
```

### Server

Please add a exporter url to `.env`.

```
TRACE_EXPORTER_URL=
```

<!-- ######## otel -->

## Links

- [Database ER diagram](/prisma/ERD.md)

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

Installing this template automatically sets up the following libraries/tools. By saving you significant effort, it allows you to focus entirely on writing your product code.🤗

|             |                                                                                                                                              |                                                                                                                                                      |                                                                                                                                       |                                                                                                                                                     |
| ----------- | -------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| **App**     | <div align="center"><img src=".internal/site/src/public/images/libs/nextjs.png" alt="nextjs" width="44"><br>Next.js</div>                    | <div align="center"><img src=".internal/site/src/public/images/libs/tailwind.png" alt="tailwind" width="44"><br>Tailwind CSS</div>                   | <div align="center"><img src=".internal/site/src/public/images/libs/next-auth.png" alt="next-auth" width="44"><br>NextAuth.js</div>   | <div align="center"><img src=".internal/site/src/public/images/libs/react-hook-form.png" alt="react-hook-form" width="44"><br>React Hook Form</div> |
|             | <div align="center"><img src=".internal/site/src/public/images/libs/zod.svg" alt="zod" width="44"><br>Zod </div>                             | <div align="center"><img src=".internal/site/src/public/images/libs/otel.png" alt="otel" width="44"><br>OpenTelemetry </div>                         | <div align="center"><img src=".internal/site/src/public/images/libs/prisma.png" alt="prisma" width="44"><br>Prisma </div>             | <div align="center"><img src=".internal/site/src/public/images/libs/postgresql.png" alt="prisma" width="44"><br>PostgreSQL</div>                    |
|             |                                                                                                                                              |                                                                                                                                                      |                                                                                                                                       |
| **Tools**   | <div align="center"><img src=".internal/site/src/public/images/libs/typescript.png" alt="typescirpt" width="44"><br>TypeScript</div>         | <div align="center"><img src=".internal/site/src/public/images/libs/pnpm.svg" alt="pnpm" width="44"><br>pnpm</div>                                   | <div align="center"><img src=".internal/site/src/public/images/libs/biome.png" alt="biome" width="44"><br>Biome </div>                | <div align="center"><img src=".internal/site/src/public/images/libs/prettier.png" alt="prettier" width="44"><br> Prettier</div>                     |
|             | <div align="center"><img src=".internal/site/src/public/images/libs/editorconfig.png" alt="editorconfig" width="44"><br> EditorConfig </div> | <div align="center"><img src=".internal/site/src/public/images/libs/lefthook.png" alt="lefthook" width="44"><br> lefthook</div>                      | <div align="center"><img src=".internal/site/src/public/images/libs/docker.png" alt="docker" width="44"><br> Docker </div>            |                                                                                                                                                     |
|             |                                                                                                                                              |                                                                                                                                                      |                                                                                                                                       |
| **Testing** | <div align="center"><img src=".internal/site/src/public/images/libs/vitest.png" alt="vitest" width="44"><br> Vitest</div>                    | <div align="center"><img src=".internal/site/src/public/images/libs/testing-library.png" alt="testing-library" width="44"><br> Testing Library</div> | <div align="center"><img src=".internal/site/src/public/images/libs/playwright.png" alt="playwright" width="44"><br> Playwright</div> | <div align="center"><img src=".internal/site/src/public/images/libs/testcontainers.png" alt="testcontainers" width="44"><br> Testcontainers</div>   |
|             |                                                                                                                                              |                                                                                                                                                      |
| **Others**  | <div align="center"><img src=".internal/site/src/public/images/libs/github-actions.png" alt="actions" width="44"><br> GitHub Actions</div>   | <div align="center"><img src=".internal/site/src/public/images/libs/renovate.png" alt="renovate" width="44"><br> Renovate</div>                      | <div align="center"><img src=".internal/site/src/public/images/libs/vscode.png" alt="vscode" width="44"><br> VSCode</div>             | <div align="center"><img src=".internal/site/src/public/images/libs/copilot.png" alt="copilot edits" width="44"><br> Copilot Edits</div>            |

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

### Opt-out

The following items will be asked whether they are required when the project is initialized:

- Sample Application Code
- Dockerfile
- E2E Testing
- Observability feature

<!-- ######## -->

## Setup

```sh
# enable corepack
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

<!-- start: otel -->

### Observability

This template uses Jaeger as a tracing platform. The local environment doesn't require `TRACE_EXPORTER_URL` environment value.

```sh
# open Jaeger
$ open http://localhost:16686/
```

<!-- end: otel -->

## Test

### Unit Test

```sh
$ pnpm test
$ pnpm test:watch
```

<!-- start: e2e -->

### E2E Test

A build task must be executed before running tests to bypass JWT logic.

```sh
# install chrome
$ pnpm exec playwright install chrome
# build using test environments since it needs to change encode/decode functions of next-auth
$ pnpm build:test

$ pnpm test:e2e
$ pnpm test:e2e:ui
```

<!-- end: e2e -->

## Database

```sh
$ pnpm db:migrate
$ pnpm db:reset
# view the database items
$ pnpm db:studio
```

## Links

- [Database ER diagram](/prisma/ERD.md)
- [Web App Template](https://hiroppy.github.io/web-app-template/)

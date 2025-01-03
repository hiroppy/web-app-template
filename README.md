<!-- 👉 remove -->

<div align="center">
  <strong>️️A minimal template for web app 🎃</strong>
</div>

<br />
<br />

This template is based on create-next-app but has below new tech and configs.

|             |                           |                         |                               |
| ----------- | ------------------------- | ----------------------- | ----------------------------- |
| **App**     | Next.js (Framework)       | Tailwind CSS (CSS)      |                               |
|             | React Hook Form (Form)    | Zod (Schema Validator)  |                               |
|             | Prisma (ORM)              | NextAuth.js (Auth)      | OpenTelemetry (Observability) |
|             |                           |                         |                               |
| **Tools**   | TypeScript (Language)     | pnpm (Package Manager)  |                               |
|             | Biome (Linter, Formatter) | Prettier (Formatter)    |                               |
|             | lint-staged (Pre Commit)  | Docker Compose (Docker) |                               |
|             |                           |                         |                               |
| **Testing** | Vitest (Test Runner)      | Testing Library (React) | Playwright (E2E Testing)      |
|             | Testcontainers (Docker)   |                         |
|             |                           |                         |                               |
| **Others**  | GitHub Workflows (CI)     | Renovate (Deps Manager) | .vscode (Editor)              |

Just running create-next-app does not satisfy the dependencies, development environment, and CI environment to create a web application. In addition, many dependencies require setting configs for example, `@next-auth/prisma-adapter` requires adding many schemas to `schema.prisma` but we don't know what we add so always need to check the docs every time. This project is created as a template with minimal code in advance so that you can focus on development.

## 🐕 What does this project support?

<details>
  <summary>Next.js</summary>

- introducing parallel route and intercepting route
- introducing server actions using Zod
- setting common files like robots, opengraph-image, etc
- supporting Docker
- supporting observability using OpenTelemetry

</details>

<details>
  <summary>Prisma</summary>

- introducing dev/test env using Docker Compose and PostgreSQL
- fixing [well-known Next.js issue](https://www.prisma.io/docs/orm/more/help-and-troubleshooting/help-articles/nextjs-prisma-client-dev-practices)
- generating ERD automatically
- running migration on github actions

</details>

<details>
  <summary>NextAuth.js</summary>

- introducing Google Oauth provider
- defining [Prisma schema](https://authjs.dev/reference/adapter/prisma#create-the-prisma-schema-from-scratch) and connecting database
- setting Next.js api route using app router

</details>

<details>
  <summary>Biome, Prettier</summary>
  
  - introducing how to control these when pre-commit
  - assigning Prisma, Biome, Prettier to each language for vscode
</details>

<details>
  <summary>Playwright</summary>

- introducing [Page object models](https://playwright.dev/docs/pom) for e2e to make it resistant to change code
- introducing how to avoid OAuth Providers with NextAuth.js

</details>

<details>
  <summary>CI</summary>

- CI tasks: lint, build, unit test, e2e test
- Prod tasks: migrating DB when main branch

</details>

## Required

- Node.js ^v20
- [Docker](https://docs.docker.com/engine/install/)

## Install

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

## Production

```sh
$ pnpm db:up
$ pnpm build
$ pnpm start
```

If you set `POSTGRESQL_URL` as GitHub secrets, you will be able to execute migration for database on GitHub actions(`.github/workflows/migration.yml`).

## Observability (optional)

_This feature can be opted out._

This project has [OpenTelemetry](https://opentelemetry.io/) and it works only production environment.

### Local

```sh
$ pnpm db:up
$ pnpm build
$ pnpm start
# open Jaeger
$ open http://localhost:16686/
```

<!-- 👉 remove -->

![jaeger](.github/assets/jaeger.png)

<!-- ######## -->

### Server

Please add a exporter url to `.env`.

```
TRACE_EXPORTER_URL=
```

## Links

- [Database ER diagram](/prisma/ERD.md)

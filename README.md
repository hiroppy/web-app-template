<div align="center">
  <strong>️️A minimal template for web app 🎃</strong>
</div>

<br />
<br />

**This repo is a github template so please click "Use this template" button and you will create your repo.**

This template is based on create-next-app but has below new tech and configs.

| kind        |                         |                          |                         |
| ----------- | ----------------------- | ------------------------ | ----------------------- |
| **app**     | Next.js (framework)     | Tailwind CSS (css)       | NextAuth.js (auth)      |
|             | Prisma (orm)            | React Hook Form (form)   | Zod (validator)         |
| **tools**   | TypeScript (language)   | Biome (linter, fmt)      | Prettier (linter)       |
|             | ESLint (linter)         | lint-staged (pre-commit) |                         |
| **testing** | Vitest (test runner)    | Playwright (e2e testing) |                         |
| **others**  | workflows (ci)          | .vscode (editor)         | Docker Compose (docker) |
|             | Renovate (deps manager) |                          |                         |

Just running create-next-app does not satisfy the dependencies, development environment, and CI environment to create a web application. In addition, many dependencies require setting configs for example, `@next-auth/prisma-adapter` requires adding many schemas to `schema.prisma` but we don't know what we add so always need to check the docs every time. This project is created as a template with minimal code in advance so that you can focus on development.

## What does this project support?

<details>
  <summary>Next.js</summary>

- introducing parallel route and intercepting route
- introducing server actions using Zod
- setting common files like robots, opengraph-image, etc

</details>

<details>
  <summary>Prisma</summary>

- introducing dev/test env using Docker Compose and PostgreSQL
- fixing [well-known Next.js issue](https://www.prisma.io/docs/orm/more/help-and-troubleshooting/help-articles/nextjs-prisma-client-dev-practices)
- generating ERD automatically

</details>

<details>
  <summary>NextAuth.js</summary>

- introducing Google Oauth provider
- defining [Prisma schema](https://authjs.dev/reference/adapter/prisma#create-the-prisma-schema-from-scratch) and connecting database
- setting Next.js api route using app router

</details>

<details>
  <summary>Biome, Prettier, ESLint</summary>
  
  - introducing how to control these when pre-commit
</details>

<details>
  <summary>Playwright</summary>

- introducing [Page object models](https://playwright.dev/docs/pom) for e2e to make it resistant to change code
- introducing how to avoid OAuth Providers with NextAuth.js

</details>

<details>
  <summary>Visual Studio Code</summary>

- assigning Prisma, Biome, Prettier to each language
- introducing cSpell to notice a typo

</details>

## Setup

**Enabling git hook and corepack**

```sh
$ npm run setup
```

**Creating `.env.local` and modifying env**

```sh
$ cp .env.sample .env.local
```

**Creating DB migration files**

```sh
$ pnpm dev:db:setup
```

**Removing the below code and committing migration files**

```diff
.gitignore

- ### 👉 please remove ###
- migrations
- ########################
```

```diff
.github/workflows/ci.yml

- ### 👉 please remove ###
- - run: cp ./.env.sample ./.env.local
- - run: pnpm dev:db:setup
- env:
-   POSTGRES_URL: "postgresql://dev:1234@localhost:5432/dev?schema=public"
-   NEXT_PUBLIC_SITE_URL: "http://localhost:3000"
- ########################
```

## Dev

```sh
# start docker-compose, migrations(generating the client), and next dev
$ pnpm dev
# create new migration
$ pnpm dev:db:migrate
# reset the DB
$ pnpm dev:db:reset
# view the contents
$ pnpm dev:db:studio
```

## Test

Test uses also DB so need to start DB first.

```sh
# unit tests

# run the DB and generate the client
$ pnpm test:db:setup
# execute
$ pnpm test
# watch the unit tests
$ pnpm test:watch
# reset the DB
$ pnpm test:db:reset

# e2e

# install chrome
$ pnpm exec playwright install chrome
# run the DB and generate the client
$ pnpm test:db:setup
# test uses a built app since next.js has different cache behavior between development and production
$ pnpm build
# execute
$ pnpm test:e2e
```

💁‍♀️ This template recommends using a real database but when you face not keeping idempotency, you might consider using mock.

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
  <ul>
    <li>introducing parallel route and intercepting route</li>
    <li>introducing server actions using Zod</li>
    <li>setting common files like robots, opengraph-image, etc</li>
  </ul>
</details>

<details>
  <summary>Prisma</summary>
  <ul>
    <li>introducing dev/test env using Docker Compose and PostgreSQL</li>
    <li>fixing 
      <a href="https://www.prisma.io/docs/orm/more/help-and-troubleshooting/help-articles/nextjs-prisma-client-dev-practices">
        well-known Next.js issue
      </a>
    </li>
    <li>generating ERD automatically</li>
  </ul>
</details>

<details>
  <summary>NextAuth.js</summary>
  <ul>
    <li>introducing Google Oauth provider</li>
    <li>defining 
      <a href="https://authjs.dev/reference/adapter/prisma#create-the-prisma-schema-from-scratch">
        Prisma schema
      </a>
      and connecting database
    </li>
    <li>setting Next.js api route using app router</li>
  </ul>
</details>

<details>
  <summary>Biome, Prettier, ESLint</summary>
  <ul>
    <li>introducing how to control these when pre-commit</li>
  </ul>
</details>

<details>
  <summary>Playwright</summary>
  <ul>
    <li>
      introducing <a href="https://playwright.dev/docs/pom">Page object models</a> for e2e to make it resistant to change code
    </li>
    <li>introducing how to avoid OAuth Providers with NextAuth.js</li>
  </ul>
</details>

<details>
  <summary>Visual Studio Code</summary>
  <ul>
    <li>assigning Prisma, Biome, Prettier to each language</li>
    <li>introducing cSpell to notice a typo</li>
  </ul>
</details>

## Setup

**Enabling git hook and corepack**

```sh
$ npm run setup
```

**Creating `.env.local` and modify envs**

```sh
$ cp .env.sample .env.local
```

**Creating DB migration files**

```sh
$ pnpm dev:db:setup
```

**Removing the below code and commit migration files**

```diff
.gitignore

- ### 👉 please remove ###
- migrations
- ########################
```

```diff
.github/workflows/ci.yml

- ### 👉 please remove ###
- - run: pnpm dev:db:setup
- env:
-   POSTGRES_URL: "postgresql://dev:1234@localhost:5432/mydb?schema=public"
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

# test uses a built app since next.js has different cache behavior between development and production
$ pnpm build
# run the DB and generate the client
$ pnpm test:db:setup
# execute
$ pnpm test:e2e
```

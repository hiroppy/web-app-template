<div align="center">
  <strong>️️A minimal template for web app 🎃</strong>
</div>

<br />

This template is based on create-next-app but has below new tech and configs.

| kind        |                          |                          |                         |                         |
| ----------- | ------------------------ | ------------------------ | ----------------------- | ----------------------- |
| **app**     | next.js (framework)      | tailwindcss (css)        | next-auth (auth)        | prisma (orm)            |
|             | react-hook-form (form)   | zod (validator)          |                         |                         |
| **tools**   | typescript (language)    | biome (linter, fmt)      | prettier (linter)       | eslint (linter)         |
|             | lint-staged (pre-commit) |                          |                         |                         |
| **testing** | vitest (test runner)     | playwright (e2e testing) |                         |                         |
| **others**  | workflows (ci)           | .vscode (editor)         | docker-compose (docker) | renovate (deps manager) |

Just running create-next-app does not satisfy the dependencies, development environment, and CI environment to create a web application. In addition, many dependencies require setting configs for example, `@next-auth/prisma-adapter` requires adding many schemas to `schema.prisma` but we don't know what we add so always need to check the docs every time. This project is created as a template with minimal code in advance so that you can focus on development.

## What does this project support?

<details>
  <summary>next.js</summary>
  <ul>
    <li>introducing parallel route and intercepting route</li>
    <li>introducing server actions</li>
    <li>setting common files like robots, opengraph-image, etc</li>
  </ul>
</details>

<details>
  <summary>prisma</summary>
  <ul>
    <li>introducing dev/test env using docker-compose and postgresql</li>
    <li>fixing 
      <a href="https://www.prisma.io/docs/orm/more/help-and-troubleshooting/help-articles/nextjs-prisma-client-dev-practices" target="_blank">
        well-known next.js issue
      </a>
    </li>
    <li>generating ERD automatically</li>
  </ul>
</details>

<details>
  <summary>next-auth</summary>
  <ul>
    <li>introducing Google Oauth provider</li>
    <li>defining 
      <a href="https://authjs.dev/reference/adapter/prisma#create-the-prisma-schema-from-scratch" target="_blank">
        prisma schema
      </a>
      and connecting database
    </li>
    <li>setting next.js api route using app router</li>
  </ul>
</details>

<details>
  <summary>biome, prettier, eslint</summary>
  <ul>
    <li>introducing how to control these when pre-commit</li>
  </ul>
</details>

<details>
  <summary>playwright</summary>
  <ul>
    <li>
      introducing <a href="https://playwright.dev/docs/pom" target="_blank">Page object models</a> for e2e to make it resistant to change code
    </li>
    <li>introducing how to avoid OAuth Providers with next-auth</li>
  </ul>
</details>

<details>
  <summary>vscode</summary>
  <ul>
    <li>assigning prisma, biome, prettier to each language</li>
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

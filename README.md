<div align="center">
  <strong>️️Web App Minimum Template 🎃</strong>
</div>

<br />

This template is based on create-next-app but has below new tech and configs.

| kind        |                  |             |                |          |
| ----------- | ---------------- | ----------- | -------------- | -------- |
| **app**     | next.js          | tailwindcss | next-auth      | prisma   |
|             | react-hook-form  | zod         |                |          |
| **tools**   | typescript       | biome       | prettier       | eslint   |
|             | lint-staged      |             |                |          |
| **testing** | vitest           | playwright  |                |          |
| **others**  | github workflows | .vscode     | docker-compose | renovate |

Just running create-next-app does not satisfy the dependencies, development environment, and CI environment to create a web application. In addition, many dependencies require setting configs for example, `@next-auth/prisma-adapter` requires adding many schemas to `schema.prisma` but we don't know what we add so always need to check the docs every time. This project is created as a template with minimal code in advance so that you can focus on development.

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
# stop the DB
$ pnpm dev:db:stop
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
# stop the DB
$ pnpm test:db:stop

# e2e

# test uses a built app since next.js has different cache behavior between development and production
$ pnpm build
# run the DB and generate the client
$ pnpm test:db:setup
# execute
$ pnpm test:e2e
```

This project introduces [Page object models](https://playwright.dev/docs/pom) for e2e to make it resistant to change code.

# Getting Started

## Prerequisites

- Node.js v20 or higher
- [Docker](https://docs.docker.com/engine/install/)

Since web-app-template uses Docker to set up the database, you must install Docker before running the initialization script. Also, older Docker versions that cannot run Docker compose are not supported.

## Installation

Two deployment methods are provided:

### Using CLI (recommended)

```sh
$ npx create-app-foundation@latest
```

> [!NOTE]
> The CLI creates the project directory after asking for the directory name and then executes an init script automatically

### Using GitHub Template

This repo is a GitHub Template. When you click [this link](https://github.com/new?template_owner=hiroppy&template_name=web-app-template), this template will be pre-selected on the repository creation screen so that you can create it from here.

After creating the repository, you need to run the following commands to clean and set up the repository.

```sh
$ node .internal/setup/init.mjs
```

## Configuration

### Rewriting .env

This repository uses Google Oauth provider via next-auth so needs to set up.

> [!CAUTION]
> If you don't use Google Oauth, please skip this section and delete the provider from [nextAuthConfig.ts](https://github.com/hiroppy/web-app-template/blob/main/src/app/_clients/nextAuthConfig.ts)
> ::: details See Full Code
>
> <!-- prettier-ignore -->
> <<< ../../../../src/app/_clients/nextAuthConfig.ts {28-41}
> :::

1. Creating [a project](https://console.cloud.google.com/projectcreate) on Google Cloud
2. Accessing [the credentials page](https://console.cloud.google.com/apis/credentials) and set below values

- `AUTHORIZED JAVASCRIPT ORIGINS`

```
http://localhost:3000
```

- `AUTHORIZED REDIRECT URIS`

```
http://localhost:3000/api/auth/callback/google
```

3. After creating the OAuth 2.0 client, please fill below to `.env`

```
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
```

## NPM scripts

### Development

```sh
$ pnpm dev
```

`pnpm dev` runs Docker Compose, migrates, generates Prisma client code, and finally runs `next dev`.

### Production

```sh
# need to boot Database
$ pnpm db:up
$ pnpm build
$ pnpm start
```

#### Observability <Badge type="warning" text="Optional" />

This template uses [Jaeger](https://www.jaegertracing.io/) as a tracing platform. The local environment doesn't require `TRACE_EXPORTER_URL` environment value.

```sh
# open Jaeger
$ open http://localhost:16686/
```

### Test

#### Unit Test

```sh
$ pnpm test
$ pnpm test:watch
```

#### E2E Test <Badge type="warning" text="Optional" />

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

### Database

```sh
$ pnpm db:up
$ pnpm db:migrate
$ pnpm db:reset
# view the database items
$ pnpm db:studio
```

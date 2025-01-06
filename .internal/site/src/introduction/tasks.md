# Tasks

## Development

```sh
$ pnpm dev
```

`pnpm dev` runs Docker Compose, migrates, generates Prisma client code, and finally runs `next dev`.

## Production

```sh
# need to boot Database
$ pnpm db:up
$ pnpm build
$ pnpm start
```

### Observability <Badge type="warning" text="Optional" />

This template uses [Jaeger](https://www.jaegertracing.io/) as a tracing platform. The local environment doesn't require `TRACE_EXPORTER_URL` environment value.

```sh
# open Jaeger
$ open http://localhost:16686/
```

## Test

### Unit Test

```sh
$ pnpm test
$ pnpm test:watch
```

### E2E Test <Badge type="warning" text="Optional" />

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

## Database

```sh
$ pnpm db:up
$ pnpm db:migrate
$ pnpm db:reset
# view the database items
$ pnpm db:studio
```

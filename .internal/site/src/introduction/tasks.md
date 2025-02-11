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

## Payment <Badge type="warning" text="Optional" />

1. Create a subscription [here](https://dashboard.stripe.com/test/products?active=true&create=product&source=product_list) and get `price_id`.

2. Modify the environment variables. The test API key is [here](https://dashboard.stripe.com/test/apikeys).

```
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
STRIPE_PRICE_ID=
```

3. [Install stripe CLI](https://docs.stripe.com/stripe-cli) to bypass the webhook.

4. Execute the following command in another terminal.

```sh
$ stripe listen --forward-to localhost:3000/api/payment/webhook
```

5. After signing in, you can go to the `http://localhost:3000/me/payment` page to see how to make a payment.

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

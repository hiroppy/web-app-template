# Prisma

|                                                             |                                                             |                                                         |                                                                     |
| :---------------------------------------------------------: | :---------------------------------------------------------: | :-----------------------------------------------------: | ------------------------------------------------------------------- |
| <img src="/images/libs/prisma.png" alt="prisma" width="40"> | <img src="/images/libs/nextjs.png" alt="nextjs" width="40"> | <img src="/images/libs/otel.png" alt="otel" width="40"> | <img src="/images/libs/postgresql.png" alt="postgresql" width="40"> |

## Schema <Badge type="tip" text="Best Practice" />

[@auth/prisma-adapter](https://authjs.dev/getting-started/adapters/prisma) requires some models for PostgreSQL but some models like `Session`, `VerificationToken` are unused when using JWT strategy of next-auth. This template pre-deletes them.

<<< ../../../../prisma/schema.prisma

- [Prisma Adapter#schema](https://authjs.dev/getting-started/adapters/prisma#schema)

## ER diagram

[prisma-erd-generator](https://github.com/keonik/prisma-erd-generator) can generate ERD from the schema. The current template ERD is [here](https://github.com/hiroppy/web-app-template/blob/main/prisma/ERD.md).

::: details See Full Code
<<< ../../../../prisma/schema/ERD.md
:::

## Making single client instance in Development <Badge type="tip" text="Best Practice" />

In development, prisma requires avoiding multiple Prisma Client instances but Hot Module Replacement creates them. So this template prepares code to resolve this issue.

::: code-group

<!-- prettier-ignore -->
<<< ../../../../src/app/_clients/prisma.ts

<!-- prettier-ignore -->
<<< ../../../../src/app/_utils/db.ts
:::

> [!TIP] > `datasources.db.url` is always set for parallel execution by testing

- [Comprehensive Guide to Using Prisma ORM with Next.js](https://www.prisma.io/docs/orm/more/help-and-troubleshooting/nextjs-help)

## Observability <Badge type="tip" text="Best Practice" />

Prisma provides OpenTelemetry tracing feature. This template uses `@prisma/instrumentation` and you can view Prisma Query, Engine, and Database Query on Jeager via otel-collector. Learn more [here](/features/observability)

![query metric](/images/otel/query.png)

- [OpenTelemetry tracing](https://www.prisma.io/docs/orm/prisma-client/observability-and-logging/opentelemetry-tracing)

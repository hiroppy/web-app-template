# Challenges Solved

## Next.js

- Using App Router
- Setting up the directory structure that you will probably make when actually creating a service
- Providing examples based on several code patterns
  - Server Components + Form + Server Actions
  - Client Components + `useTransition` + react-hook-form + Server Actions
  - Client Components + `useActionState` + Form + Server Actions
  - Parallel Route + intercepting route
- Adding tests including middleware, server actions, etc
- Supporting Instrumentations
- Supporting `Dockerfile`
- Supporting Stripe using Server Actions and Route Handlers

> [!NOTE]
> This repository will use [dynamicIO](https://nextjs.org/docs/app/api-reference/directives/use-cache) so the code will be changed when the canary version will be stable from now on

## Auth

- Introducing Google Oauth provider
- Connecting to Prisma
- Setting up Next.js api routes
- Using JWT strategy to authenticate users on [middleware](https://next-auth.js.org/tutorials/securing-pages-and-api-routes#nextjs-middleware)
- Supporting updating all JWTs for the same user, allowing access from multiple devices
- [Separating the edge-compatible configuration from the rest](https://authjs.dev/getting-started/migrating-to-v5#edge-compatibility), as some adapters may not support Edge

## Prisma

- Adding [schema](https://authjs.dev/getting-started/adapters/prisma#schema) required by [@auth/prisma-adapter](https://authjs.dev/getting-started/adapters/prisma)
- Generating Database ER diagram by [prisma-erd-generator](https://github.com/keonik/prisma-erd-generator) automatically
- Resolving Next.js’s HMR [issue](https://www.prisma.io/docs/orm/more/help-and-troubleshooting/nextjs-help) when development

## Unit Test

- Supporting parallel execution using a real isolated database in a sandbox
- Using testing-library with vitest

## E2E Test <Badge type="warning" text="Optional" />

- Supporting Multiple dummy accounts using `storageState` to skip logging in multiple times
- Mocking and working around next-auth's JWT strategy
- Writing code using [Page Object Models](https://playwright.dev/docs/pom) suggested by Playwright

## Accessibility Test <Badge type="warning" text="Optional" />

- Checking all pages's accessibility via Playwright

## Observability <Badge type="warning" text="Optional" />

- Setting up OpenTelemetry on Next.js
- Building [Opentelemetry Collector](https://opentelemetry.io/docs/collector/) and [Jaeger](https://www.jaegertracing.io/)

## Payment <Badge type="warning" text="Optional" />

- Building payment codebase and database schema using Stripe
- Supporting webhook to change status by Stripe for example expired subscription

## Git

- Setting up pre-commit as git hook
- Checking code of TypeScript, JavaScript, Markdown, JSON, YAML, and Prisma by biome, prettier, prisma at pre-commit phase.

## Linter and Formatter

- Setting up editorconfig, biome, and prettier
- Removing unused variables, functions, etc by Knip

## CI

- Adding Lint, Build, unit-test, and e2e-test jobs

## Dependencies

- Supporting renovate configuration like grouping deps
- Fixing version of packages using pnpm

## VSCode

- Supporting recommended extensions for team members
- Setting up some workspace configurations mainly linter, formatter, and cSpell
- Supporting instructions for GitHub Copilot Edits

<br />
<br />
<br />

> [!IMPORTANT]
> If you find yourself writing similar code often or think this repository can be optimized more than now, please submit [an issue](https://github.com/hiroppy/web-app-template/issues/new) !

# Next.js

|                                                             |                                                                               |                                                       |                                                             |
| :---------------------------------------------------------: | :---------------------------------------------------------------------------: | :---------------------------------------------------: | :---------------------------------------------------------: |
| <img src="/images/libs/nextjs.png" alt="nextjs" width="40"> | <img src="/images/libs/react-hook-form.png" alt="react-hook-form" width="40"> | <img src="/images/libs/zod.svg" alt="zod" width="40"> | <img src="/images/libs/docker.png" alt="docker" width="40"> |

## Server Actions

### Result Type <Badge type="tip" text="Best Practice" />

If you throw an Error in a server action, it will be caught by ErrorBoundary and error.tsx will be called. However, this is only an unexpected error; in most cases of the real world, errors will be expected. In that case, returning an object such as a `message` is common instead of throwing an error. Also, the Result type is friendly for `useActionState`.

::: code-group

<!-- prettier-ignore -->
<<< ../../../../src/app/_actions/types.ts

<!-- prettier-ignore -->
<<< ../../../../src/app/_actions/users.ts{18-21}
:::

::: warning
The `action` of Form requires `Promise<void>` so when using Form directly, need to avoid using the Result type.

```ts
<form action={submitAction} />
```

:::

- [Error Handling](https://nextjs.org/docs/app/building-your-application/routing/error-handling)

## Middleware

### Authentication and Authorization <Badge type="tip" text="Best Practice" />

It is common to use middleware to check a user's role, etc., and restrict access to pages. This template uses JSON Web Token as session tokens to check the permissions.
Learn more [here](/features/next-auth).

<<< ../../../../src/middleware.ts

- [Middleware](https://nextjs.org/docs/app/building-your-application/routing/middleware)

### Testing

::: warning
This feature is experimental
:::

Next.js provides utilities to help unit test middleware files.

conducting tests based on the following aspects:

- Is the routing working correctly? (without executing the middleware logic)
  - `unstable_doesMiddlewareMatch`
- Is the middleware logic functioning as expected?
  - `isRewrite` and `getRewrittenUrl`

::: details See Full Code
<<< ../../../../src/middleware.test.ts
:::

- [Middleware#unit-testing-experimental](https://nextjs.org/docs/app/building-your-application/routing/middleware#unit-testing-experimental)

## Building with Docker <Badge type="warning" text="Optional" />

This template provides a `Dockerfile` for your application.

::: details See Full Code
<<< ../../../../Dockerfile
:::

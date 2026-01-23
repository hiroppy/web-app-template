# Routing

This template provides 3 pages(+ intercepting) based on Next.js App Router.

```
app
 ├── (private)
 │   ├── layout.tsx
 │   └── me
 │       └── page.tsx
 ├── (public)
 │   ├── layout.tsx
 │   ├── page.tsx
 │   └── signin
 │       └── page.tsx
 ├── @dialog
 │   ├── (.)create
 │   │   ├── Content.tsx
 │   │   ├── default.tsx
 │   │   └── page.tsx
 │   ├── _components
 │   ├── default.tsx
 │   └── page.tsx
 ├── layout.tsx
 └── not-found.tsx
```

## Top (`/`)

### What can you learn from this page?

- Server Components
- Server Components + Form + Server Actions
- How to use Suspense
- How to retrieve the session with nextAuth on Server Components

### Affected Layouts

- `app/layout.tsx`
- `app/(public)/layout.tsx`
- `app/(public)/page.tsx`

::: details See Full Code
::: code-group

<<< ../../../../src/app/(public)/page.tsx
<<< ../../../../src/app/(public)/layout.tsx
<<< ../../../../src/app/layout.tsx
:::

## SignIn (`/signin`)

### What can you learn from this page?

- Client Components
- How to use React Hooks
- How to sign in via NextAuth

### Affected Layouts

- `app/layout.tsx`
- `app/(public)/layout.tsx`
- `app/(public)/signin/page.tsx`

::: details See Full Code
::: code-group

<<< ../../../../src/app/(public)/signin/page.tsx
<<< ../../../../src/app/(public)/layout.tsx
<<< ../../../../src/app/layout.tsx
:::

## Me (`/me`)

### What can you learn from this page?

- Client Components
- Client Components + Form + `useActionState` + Server Actions
- How to retrieve the session with nextAuth on Client Components
- Handling NotFound

### Affected Layouts

- `app/layout.tsx`
- `app/(private)/layout.tsx`
- `app/(private)/me/page.tsx`

::: details See Full Code
::: code-group

<<< ../../../../src/app/(private)/me/page.tsx
<<< ../../../../src/app/(private)/layout.tsx
<<< ../../../../src/app/layout.tsx
:::

## Why use Route Groups?

```
app
 ├── (private)
 └── (public)
```

The App Router inherits the parent's layout, making it challenging to differentiate the UI between logged-in and non-logged-in users. While it is possible to create separate directories, this approach results in the paths being reflected in the URL (e.g., `/signed-in`, `/no-signed-in`), which may not be the desired outcome.

Route Groups allow you to create directories without exposing them as paths, providing a flexible solution to this issue. It is recommended to adopt this structure from the beginning.

- [Route Groups](https://nextjs.org/docs/app/building-your-application/routing/route-groups)

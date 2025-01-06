# TypeScript

- When importing types, always use the `type` keyword.

# React

## Components

- Components should be defined using the `function` keyword, not arrow functions.
- Define a type for the component's props.
- Use `PropsWithChildren` if the component has children.
- File names should follow UpperCamelCase naming convention.
- To access session information, use \_clients/nextAuth.
- Use `Tailwind CSS` for styling, and `clsx` for combining classes.
- For shared components, place them in src/app/\_components. Components that are likely to be used only on a specific page should be placed in the \_components directory within that page. If the directory does not exist, create it.

## Hooks

- Hooks should be defined using the `function` keyword, not arrow functions.
- Hooks should be created in the src/app/\_hooks directory.
- The file name and function name should match, and the function name should start with the prefix use.
- Avoid default exports; instead, use named exports.
- Use useMemo or useCallback to memoize variables and functions when necessary.
- Return values should be in an object format with `<const>` for better type inference.

## Server Actions

- directory: src/app/\_actions
- rules:
  - Use the `Result` type for return values, and if there is a result, store it in data.
    - the `Result` type is src/app/\_actions/types.ts
  - Always enforce authentication.

# Next.js

## Pages

- Pages are located under src/app.
- Top Page
  - path: src/app/(public)/page.tsx
- SignIn Page
  - path: src/app/(public)/signin/page.tsx
- Me Page
  - path: src/app/(private)/me/page.tsx

# Unit Test

- Use `vitest`, and import `describe`, `test`, etc. instead of using the global definitions.
- `@testing-library/react-hooks` is deprecated, so use `@testing-library/react` instead.
- Tests should be created in the same directory, and the file name should be the hook name followed by `.test.ts`.

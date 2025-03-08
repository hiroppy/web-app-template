# Web App Template Commands & Style Guide

## Commands

- `pnpm dev` - Start development server with DB
- `pnpm build` - Build for production
- `pnpm lint` - Run Biome linter and Knip
- `pnpm fmt` - Format code with Biome and Prettier
- `pnpm test` - Run all unit tests
- `pnpm test:watch` - Run unit tests in watch mode
- `pnpm test -- -t "test name"` - Run specific test by name
- `pnpm test -- path/to/file.test.ts` - Run tests in specific file
- `pnpm test:e2e` - Run E2E tests with Playwright

## Style Guide

- **TypeScript**: Use `type` keyword for type imports
- **React Components**:
  - Use function declarations, not arrow functions
  - Follow UpperCamelCase for filenames
  - Use Tailwind CSS with clsx for styling
- **Hooks**: Named exports with `use` prefix, return as `const` objects
- **Testing**: Use Vitest with @testing-library/react
- **Imports**: No import aliases, organize with Biome
- **Auth**: Use `getSessionOrReject()` for auth checks
- **Server Actions**: Return `Result` type from src/app/\_actions/types.ts
- **Formatting**: 2 space indentation, 80 char line width

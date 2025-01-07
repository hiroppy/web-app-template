# Dotenv

Dotenv is the de facto standard, but it lacks validation, making it prone to errors. In this template, we use zod to validate the required environment variables in files like `next.config.ts`. If any required variables are missing or invalid, the application will fail to execute. This approach ensures robustness at runtime.

::: code-group

<<< ../../../../.env.sample

<<< ../../../../env.ts

:::

If you need to add new environment variables, make sure to add them to both `.env` and `.env.test`, and update the `env.ts` with the corresponding zod validation.

## Why not use .env.local?

Prisma can read the `.env` file, and the `DATABASE_URL` is a required key for migration. While Next.js prioritizes `.env.local`, splitting the dotenv files can be inefficient. Therefore, to maintain consistency with Prisma, this template uses `.env`.

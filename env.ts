import { loadEnvConfig } from "@next/env";
import { z } from "zod";

export type Schema = z.infer<typeof schema>;

export const schema = z.object({
  NODE_ENV: z
    .union([
      z.literal("development"),
      z.literal("test"),
      z.literal("production"),
    ])
    .default("development"),

  // for client and server
  NEXT_PUBLIC_SITE_URL: z.string().url(),

  // for server
  DATABASE_USER: z.string().min(1),
  DATABASE_PASSWORD: z.string().min(1),
  DATABASE_DB: z.string().min(1),
  DATABASE_HOST: z.string().min(1),
  DATABASE_PORT: z.coerce.number().min(1),
  DATABASE_SCHEMA: z.string().min(1),
  DATABASE_URL: z.string().min(1),

  GOOGLE_CLIENT_ID: z.string().min(1),
  GOOGLE_CLIENT_SECRET: z.string().min(1),

  NEXTAUTH_URL: z.string().min(1),
  NEXTAUTH_SECRET: z.string().min(1),

  TRACE_EXPORTER_URL: z.string().url().optional().or(z.literal("")),
});

export function config() {
  const { combinedEnv } = loadEnvConfig(process.cwd());
  const res = schema.safeParse(combinedEnv);

  if (res.error) {
    console.error("\x1b[31m%s\x1b[0m", "[Errors] environment variables");
    console.error(JSON.stringify(res.error.errors, null, 2));
    process.exit(1);
  }
}

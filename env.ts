import { loadEnvConfig } from "@next/env";
import { z } from "zod";

const staticEnv = z.object({
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

  GOOGLE_CLIENT_ID: z.string().min(1),
  GOOGLE_CLIENT_SECRET: z.string().min(1),

  NEXTAUTH_URL: z.string().min(1),
  NEXTAUTH_SECRET: z.string().min(1),

  /* start: otel */
  TRACE_EXPORTER_URL: z.string().url().optional().or(z.literal("")),
  /* end: otel */

  /* start: stripe */
  STRIPE_PRICE_ID: z.string().min(1),
  STRIPE_SECRET_KEY: z.string().min(1),
  STRIPE_WEBHOOK_SECRET: z.string().min(1),
  /* end: stripe */
});

const runtimeEnv = z.object({});

export type Schema = z.infer<typeof schema>;

const schema = z.intersection(staticEnv, runtimeEnv);

export function config(kind: "static" | "runtime" = "static") {
  const { combinedEnv } = loadEnvConfig(process.cwd());
  const res =
    kind === "static"
      ? staticEnv.safeParse(combinedEnv)
      : runtimeEnv.safeParse(combinedEnv);

  if (res.error) {
    console.error("\x1b[31m%s\x1b[0m", "[Errors] environment variables");
    console.error(JSON.stringify(res.error.errors, null, 2));
    process.exit(1);
  }
}

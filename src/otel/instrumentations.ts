import { HttpInstrumentation } from "@opentelemetry/instrumentation-http";
import { PrismaInstrumentation } from "@prisma/instrumentation";

export const instrumentations = [
  new HttpInstrumentation(),
  new PrismaInstrumentation(),
];

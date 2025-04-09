import { defineConfig } from "prisma/config";
import { config } from "./env";

config();

export default defineConfig({
  earlyAccess: true,
  schema: "./prisma/schema",
});

import type { setupDB } from "../test-db.setup";

declare global {
  declare var down: Awaited<ReturnType<typeof setupDB>>["down"];
}

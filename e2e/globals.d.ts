import type { setupDB } from "../tests/test-db.setup";

declare global {
  declare var down: Awaited<ReturnType<typeof setupDB>>["down"];
}

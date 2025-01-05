import type { setupDB } from "../tests/db.setup";

declare global {
  declare var down: Awaited<ReturnType<typeof setupDB>>["down"];
}

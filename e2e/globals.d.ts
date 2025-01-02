import type { setupDB } from "../dbSetup.test";

declare global {
  declare var down: Awaited<ReturnType<typeof setupDB>>["down"];
}

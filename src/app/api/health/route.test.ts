import { describe, expect, it } from "vitest";
import { GET } from "./route";

describe("api/health", () => {
  describe("GET /", () => {
    it("should return 200", async () => {
      const res = await GET();

      expect(await res.json()).toMatchInlineSnapshot(`
        {
          "status": "ok",
        }
      `);
      expect(res.status).toBe(200);
    });
  });
});

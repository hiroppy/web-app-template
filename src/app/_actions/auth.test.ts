import { describe, expect, test } from "vitest";
import { setup } from "../../../tests/vitest.helper";

// need to import after vitest.helper
import { getSessionOrReject } from "./auth";

const { createUser } = await setup();

describe("actions/auth", () => {
  describe("getSessionOrReject", () => {
    test("should return session data", async () => {
      await createUser();

      expect(await getSessionOrReject()).toMatchInlineSnapshot(`
        {
          "data": {
            "user": {
              "email": "hello@a.com",
              "id": "id",
              "image": "https://a.com",
              "name": "name",
              "role": "USER",
            },
          },
          "success": true,
        }
      `);
    });

    test("should return error when session is invalid", async () => {
      expect(await getSessionOrReject()).toMatchInlineSnapshot(`
        {
          "message": "no session token",
          "success": false,
        }
      `);
    });
  });
});

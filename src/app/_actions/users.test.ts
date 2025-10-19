import { beforeEach, describe, expect, test } from "vitest";
import { setup } from "../../../tests/vitest.helper";

// need to import after vitest.helper
import { updateMe } from "./users";

const { mock, createUser, getUser } = await setup();

describe("actions/users", () => {
  beforeEach(async () => {
    await createUser();
  });

  describe("updateMe", () => {
    test("should update me", async () => {
      const formData = new FormData();
      const expected = {
        name: "foo",
        email: "b@c.com",
      };

      formData.append("name", expected.name);
      formData.append("email", expected.email);

      expect(await updateMe({ success: false }, formData)).toMatchObject({
        success: true,
        data: expected,
      });
      expect(mock.revalidatePath.mock.calls).toMatchInlineSnapshot(`
        [
          [
            "/",
          ],
          [
            "/me",
          ],
        ]
      `);
      expect(await getUser()).toMatchInlineSnapshot(`
        {
          "email": "b@c.com",
          "id": "id",
          "image": "https://a.com",
          "name": "foo",
          "role": "USER",
          "stripeId": null,
        }
      `);
    });

    test("should throw an error if the schema is invalid", async () => {
      const formData = new FormData();

      formData.append("name", "a".repeat(21));

      expect(
        await updateMe({ success: false }, formData),
      ).toMatchInlineSnapshot(`
        {
          "data": {
            "email": "hello@a.com",
            "image": "https://a.com",
            "name": "aaaaaaaaaaaaaaaaaaaaa",
          },
          "message": "invalid fields",
          "success": false,
          "zodErrors": {
            "name": [
              "name is too long",
            ],
          },
        }
      `);
    });

    test("should throw an error if there is no session token", async () => {
      mock.getSession.mockResolvedValueOnce(null);

      const formData = new FormData();

      expect(
        await updateMe({ success: false }, formData),
      ).toMatchInlineSnapshot(`
        {
          "message": "no session token",
          "success": false,
        }
      `);
    });
  });
});

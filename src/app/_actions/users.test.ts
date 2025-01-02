import { beforeEach, describe, expect, test } from "vitest";
import { setup } from "./_test.helper";

// need to import after test.helper
import { updateMe } from "./users";

const { prisma, mock, createUser } = await setup();

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
        message: "updated",
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
      expect(await prisma.user.findMany()).toMatchObject([expected]);
    });

    test("should throw an error if the schema is invalid", async () => {
      const formData = new FormData();

      formData.append("name", "foo".repeat(1000));

      expect(
        await updateMe({ success: false }, formData),
      ).toMatchInlineSnapshot(`
        {
          "message": "invalid fields",
          "success": false,
        }
      `);
    });

    test("should throw an error if there is no session token", async () => {
      mock.auth.mockReturnValueOnce(null);

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
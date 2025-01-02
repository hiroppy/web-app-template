import { beforeEach, describe, expect, test } from "vitest";
import { setup } from "./_test.helper";

// need to import after test.helper
import { create, deleteAll } from "./items";

const { prisma, mock, createUser } = await setup();

describe("actions/items", () => {
  beforeEach(async () => {
    await createUser();
  });

  describe("create", () => {
    test("should create an item", async () => {
      const expected = {
        content: "hello",
        userId: "id",
      };

      expect(
        await create({
          content: "hello",
        }),
      ).toMatchObject({
        success: true,
        data: expected,
      });
      expect(mock.revalidatePath.mock.calls).toMatchInlineSnapshot(`
      [
        [
          "/",
        ],
      ]
    `);
      expect(await prisma.item.findMany()).toMatchObject([expected]);
    });

    test("should throw an error if there is no session token", async () => {
      mock.auth.mockReturnValueOnce(null);

      expect(await create({ content: "hello" })).toMatchInlineSnapshot(`
        {
          "message": "no session token",
          "success": false,
        }
      `);
    });

    test("should throw an error if the schema is invalid", async () => {
      expect(await create({ content: "" })).toMatchInlineSnapshot(`
        {
          "message": "invalid fields",
          "success": false,
        }
      `);
    });
  });

  describe("deleteAll", () => {
    beforeEach(async () => {
      await prisma.item.createMany({
        data: [
          {
            content: "foo",
            userId: "id",
          },
          {
            content: "bar",
            userId: "id",
          },
        ],
      });
    });

    test("should delete all items", async () => {
      expect(await prisma.item.count()).toBe(2);
      await deleteAll();
      expect(await prisma.item.count()).toBe(0);

      expect(mock.revalidatePath.mock.calls).toMatchInlineSnapshot(`
        [
          [
            "/",
          ],
        ]
      `);
    });

    test("should throw an error if there is no session token", async () => {
      mock.auth.mockReturnValueOnce(null);

      await expect(deleteAll()).rejects.toThrow("no session token");
    });
  });
});

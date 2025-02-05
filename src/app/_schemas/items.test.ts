import { describe, expect, test } from "vitest";
import { type ItemSchema, itemSchema } from "./items";

describe("schemas/items", () => {
  describe("create", () => {
    test("should be valid", () => {
      const fixtures: ItemSchema[] = [
        {
          content: "hello",
        },
        {
          content: "a",
        },
        {
          content: "a".repeat(20),
        },
      ];

      for (const fixture of fixtures) {
        expect(itemSchema.safeParse(fixture).success).toBeTruthy();
      }
    });

    test("should be invalid", () => {
      const fixtures: [ItemSchema, string[]][] = [
        [
          {
            content: "",
          },
          ["content is too short"],
        ],
        [
          {
            content: "a".repeat(21),
          },
          ["content is too long"],
        ],
      ];

      for (const [fixture, errors] of fixtures) {
        const res = itemSchema.safeParse(fixture);

        expect(res.success).toBeFalsy();

        if (!res.success) {
          expect(errors).toEqual(res.error.errors.map((e) => e.message));
        }
      }
    });
  });
});

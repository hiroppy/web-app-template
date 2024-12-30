import { describe, expect, test } from "vitest";
import { type ItemCreateSchema, itemCreateSchema } from "./items";

describe("schema/items/create", () => {
  test("should be valid", () => {
    const fixtures: ItemCreateSchema[] = [
      {
        content: "hello",
      },
      {
        content: "a",
      },
      {
        content: "aaaaaaaaaaaaaaaaaaaa",
      },
    ];

    for (const fixture of fixtures) {
      expect(itemCreateSchema.safeParse(fixture).success).toBeTruthy();
    }
  });

  test("should be invalid", () => {
    const fixtures: [ItemCreateSchema, string[]][] = [
      [
        {
          content: "",
        },
        ["content is too short"],
      ],
      [
        {
          content: "aaaaaaaaaaaaaaaaaaaaa",
        },
        ["content is too long"],
      ],
    ];

    for (const [fixture, errors] of fixtures) {
      const res = itemCreateSchema.safeParse(fixture);

      expect(res.success).toBeFalsy();

      if (!res.success) {
        expect(errors).toEqual(res.error.errors.map((e) => e.message));
      }
    }
  });
});

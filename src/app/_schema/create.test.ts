import { describe, expect, test } from "vitest";
import { type Schema, schema } from "./create";

describe("schema/create", () => {
  test("should be valid", () => {
    const fixtures: Schema[] = [
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
      expect(schema.safeParse(fixture).success).toBeTruthy();
    }
  });

  test("should be invalid", () => {
    const fixtures: [Schema, string[]][] = [
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
      const res = schema.safeParse(fixture);

      expect(res.success).toBeFalsy();

      if (!res.success) {
        expect(errors).toEqual(res.error.errors.map((e) => e.message));
      }
    }
  });
});

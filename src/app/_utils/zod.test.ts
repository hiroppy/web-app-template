import { describe, expect, test } from "vitest";
import { z } from "zod";
import { getFieldErrors } from "./zod";

describe("utils/zod", () => {
  describe("getFieldErrors", () => {
    test("should return field errors", () => {
      const schema = z.object({
        name: z.string().min(1, "Name is required"),
      });

      const parsedValues = schema.safeParse({
        name: "",
      });

      expect(getFieldErrors(parsedValues)).toMatchInlineSnapshot(`
      {
        "name": [
          "Name is required",
        ],
      }
    `);
    });

    test("should return an empty object", () => {
      const schema = z.object({
        name: z.string().min(1, "Name is required"),
      });

      const parsedValues = schema.safeParse({
        name: "foo",
      });

      // biome-ignore lint: snapshot
      expect(getFieldErrors(parsedValues)).toMatchInlineSnapshot(`{}`);
    });
  });
});

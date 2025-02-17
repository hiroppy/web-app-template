import { describe, expect, test } from "vitest";
import { format } from "./date";

describe("utils/date", () => {
  describe("format", () => {
    test("should format date", () => {
      expect(format(new Date("2024-02-29T10:30:10"))).toMatchInlineSnapshot(
        `"2月29日 19:30"`,
      );
    });
  });
});

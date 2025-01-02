import { describe, expect, test } from "vitest";
import { type UserMeSchema, userMeSchema } from "./users";

describe("schemas/users", () => {
  describe("me", () => {
    test("should be valid", () => {
      const fixtures: UserMeSchema[] = [
        {
          name: "John",
          email: "a@b.com",
          image: "https://a.com",
        },
      ];

      for (const fixture of fixtures) {
        expect(userMeSchema.safeParse(fixture).success).toBeTruthy();
      }
    });

    test("should be invalid", () => {
      const base: UserMeSchema = {
        name: "a",
        email: "a@b.com",
        image: "https://a.com",
      };

      const fixtures: [UserMeSchema, string[]][] = [
        // name
        [
          {
            ...base,
            name: "",
          },
          ["name is too short"],
        ],
        [
          {
            ...base,
            name: "a".repeat(21),
          },
          ["name is too long"],
        ],
        // email
        [
          {
            ...base,
            email: "",
          },
          ["email is invalid", "email is too short"],
        ],
        [
          {
            ...base,
            email: "a".repeat(51),
          },
          ["email is invalid", "email is too long"],
        ],
        [
          {
            ...base,
            email: ".com",
          },
          ["email is invalid"],
        ],
        // image
        [
          {
            ...base,
            image: "",
          },
          ["image is invalid"],
        ],
        [
          {
            ...base,
            image: "image",
          },
          ["image is invalid"],
        ],
        [
          {
            ...base,
            image: "https://a.com".repeat(2000),
          },
          ["image is too long"],
        ],
      ];

      for (const [fixture, errors] of fixtures) {
        const res = userMeSchema.safeParse(fixture);

        expect(res.success).toBeFalsy();

        if (!res.success) {
          expect(errors).toEqual(res.error.errors.map((e) => e.message));
        }
      }
    });
  });
});

import { NextRequest } from "next/server";
import { beforeEach, describe, expect, test, vi } from "vitest";
import { setup } from "../../../../../tests/vitest.helper";

// need to import after vitest.helper
import { GET } from "./route";

const { mock, createUser } = await setup();
const { retrieve } = vi.hoisted(() => ({
  retrieve: vi.fn(),
}));

describe("api/payment/success", () => {
  beforeEach(() => {
    vi.mock("../../../_clients/stripe", async (actual) => {
      return {
        ...(await actual<typeof import("../../../_clients/stripe")>()),
        stripe: {
          checkout: {
            sessions: {
              retrieve,
            },
          },
        },
      };
    });
  });

  describe("GET", () => {
    test("should return 400 if session_id is not provided", async () => {
      const req = new NextRequest(
        `${process.env.NEXT_PUBLIC_SITE_URL}/api/payment/success`,
      );
      const res = await GET(req);

      expect(res.status).toBe(400);
      expect(await res.text()).toMatchInlineSnapshot(`"Invalid session_id"`);
    });

    test("should return 401 if session is not valid", async () => {
      const req = new NextRequest(
        `${process.env.NEXT_PUBLIC_SITE_URL}/api/payment/success?session_id=123`,
      );
      const res = await GET(req);

      expect(res.status).toBe(401);
      expect(await res.text()).toMatchInlineSnapshot(`"no session token"`);
    });

    test("should redirect to /me/payment if payment is complete", async () => {
      await createUser();

      retrieve.mockReturnValueOnce({
        status: "complete",
        customer: "cus_123",
        subscription: "sub_123",
      });

      const req = new NextRequest(
        `${process.env.NEXT_PUBLIC_SITE_URL}/api/payment/success?session_id=123`,
      );
      const res = await GET(req);

      expect(res).toBeUndefined();
      expect(retrieve.mock.calls).toMatchInlineSnapshot(`
        [
          [
            "123",
          ],
        ]
      `);
      expect(mock.redirect.mock.calls).toMatchInlineSnapshot(`
        [
          [
            "/me/payment",
          ],
        ]
      `);
    });

    test("should redirect to /me/payment if payment is incomplete", async () => {
      await createUser();

      retrieve.mockReturnValueOnce({
        status: "incomplete",
        customer: "cus_123",
        subscription: "sub_123",
      });

      const req = new NextRequest(
        `${process.env.NEXT_PUBLIC_SITE_URL}/api/payment/success?session_id=123`,
      );
      const res = await GET(req);

      expect(res).toBeUndefined();
      expect(retrieve.mock.calls).toMatchInlineSnapshot(`
        [
          [
            "123",
          ],
        ]
      `);
      expect(mock.redirect.mock.calls).toMatchInlineSnapshot(`
        [
          [
            "/me/payment?status=incomplete",
          ],
        ]
      `);
    });
  });
});

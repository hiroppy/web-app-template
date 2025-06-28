import { NextRequest } from "next/server";
import { beforeEach, describe, expect, test, vi } from "vitest";
import { setup } from "../../../../../tests/vitest.helper";

// need to import after vitest.helper
import { GET } from "./route";

const { prisma, mock, createUser, getUser } = await setup();
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

      expect(await getUser()).toMatchInlineSnapshot(`
        {
          "email": "hello@a.com",
          "emailVerified": null,
          "id": "id",
          "image": "https://a.com",
          "name": "name",
          "role": "USER",
          "stripeId": null,
        }
      `);
      expect(await prisma.subscription.count()).toBe(0);

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
      expect(await getUser()).toMatchInlineSnapshot(`
        {
          "email": "hello@a.com",
          "emailVerified": null,
          "id": "id",
          "image": "https://a.com",
          "name": "name",
          "role": "USER",
          "stripeId": "cus_123",
        }
      `);
      expect(await prisma.subscription.findFirst()).contain({
        subscriptionId: "sub_123",
        status: "complete",
        currentPeriodEnd: null,
        cancelAtPeriodEnd: false,
        userId: "id",
      });
    });

    test("should redirect to /me/payment if payment is incomplete", async () => {
      await createUser();
    });
  });
});

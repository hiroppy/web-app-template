import { beforeEach, describe, expect, test, vi } from "vitest";
import { setup } from "../../../tests/vitest.helper";

// need to import after vitest.helper
import { checkout, redirectToBillingPortal, update } from "./payment";

const { mock, createUser, getUser, prisma } = await setup();

const {
  createCustomer,
  createSession,
  updateSubscription,
  createPortalSession,
} = vi.hoisted(() => ({
  createCustomer: vi.fn(),
  createSession: vi.fn(),
  updateSubscription: vi.fn(),
  createPortalSession: vi.fn(),
}));

const stripeId = "cus_1";

describe("actions/payment", () => {
  beforeEach(async () => {
    await createUser();

    vi.mock("../_clients/stripe", async (actual) => {
      return {
        ...(await actual<typeof import("../_clients/stripe")>()),
        stripe: {
          customers: {
            create: createCustomer,
          },
          checkout: {
            sessions: {
              create: createSession,
            },
          },
          subscriptions: {
            update: updateSubscription,
          },
          billingPortal: {
            sessions: {
              create: createPortalSession,
            },
          },
        },
      };
    });
  });

  describe("checkout", () => {
    test("should throw an error if there is no session token", async () => {
      mock.auth.mockReturnValueOnce(null);

      expect(await checkout()).toMatchInlineSnapshot(`
        {
          "message": "no session token",
          "success": false,
        }
      `);
    });

    test("should throw an error if the user is not found", async () => {
      await prisma.user.deleteMany();

      expect(await checkout()).toMatchInlineSnapshot(`
        {
          "message": "user not found",
          "success": false,
        }
      `);
    });

    test("should throw an error if there is no checkout session", async () => {
      createCustomer.mockResolvedValueOnce({
        id: stripeId,
      });
      createSession.mockResolvedValueOnce({});

      expect(await checkout()).toMatchInlineSnapshot(`
        {
          "message": "checkoutSession url not found",
          "success": false,
        }
      `);
    });

    test("should create a new stripe customer and redirect to the checkout session url", async () => {
      createCustomer.mockResolvedValueOnce({
        id: stripeId,
      });
      createSession.mockResolvedValueOnce({
        url: "https://example.com",
      });

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

      await checkout();

      expect(createCustomer.mock.calls).toMatchInlineSnapshot(`
        [
          [
            {
              "email": "hello@a.com",
              "name": "name",
            },
          ],
        ]
      `);
      expect(createSession.mock.calls).toMatchInlineSnapshot(`
        [
          [
            {
              "automatic_tax": {
                "enabled": true,
              },
              "cancel_url": "http://localhost:3000",
              "currency": "jpy",
              "customer": "cus_1",
              "customer_update": {
                "address": "auto",
              },
              "line_items": [
                {
                  "price": "dummy",
                  "quantity": 1,
                },
              ],
              "mode": "subscription",
              "success_url": "http://localhost:3000/me/payment?sessionId={CHECKOUT_SESSION_ID}",
            },
          ],
        ]
      `);
      expect(mock.redirect.mock.calls).toMatchInlineSnapshot(`
        [
          [
            "https://example.com",
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
          "stripeId": "cus_1",
        }
      `);
    });

    test("should use existing stripe customer and redirect to the checkout session url", async () => {
      await prisma.user.update({
        where: {
          id: "id",
        },
        data: {
          stripeId: "existing_cus_123",
        },
      });

      createSession.mockResolvedValueOnce({
        url: "https://example.com",
      });

      expect(await getUser()).toMatchInlineSnapshot(`
        {
          "email": "hello@a.com",
          "emailVerified": null,
          "id": "id",
          "image": "https://a.com",
          "name": "name",
          "role": "USER",
          "stripeId": "existing_cus_123",
        }
      `);

      await checkout();

      expect(createCustomer).not.toHaveBeenCalled();

      expect(createSession.mock.calls).toMatchInlineSnapshot(`
        [
          [
            {
              "automatic_tax": {
                "enabled": true,
              },
              "cancel_url": "http://localhost:3000",
              "currency": "jpy",
              "customer": "existing_cus_123",
              "customer_update": {
                "address": "auto",
              },
              "line_items": [
                {
                  "price": "dummy",
                  "quantity": 1,
                },
              ],
              "mode": "subscription",
              "success_url": "http://localhost:3000/me/payment?sessionId={CHECKOUT_SESSION_ID}",
            },
          ],
        ]
      `);
      expect(mock.redirect.mock.calls).toMatchInlineSnapshot(`
        [
          [
            "https://example.com",
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
          "stripeId": "existing_cus_123",
        }
      `);
    });

    test("should return an error if stripe customer creation fails", async () => {
      createCustomer.mockRejectedValueOnce(new Error("Stripe error"));

      expect(await checkout()).toMatchInlineSnapshot(`
        {
          "message": "failed to create stripe customer",
          "success": false,
        }
      `);
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
    });
  });

  describe("update", () => {
    beforeEach(async () => {
      await prisma.user.update({
        where: {
          id: "id",
        },
        data: {
          stripeId,
        },
      });
    });

    test("should throw an error if there is no session token", async () => {
      mock.auth.mockReturnValueOnce(null);

      expect(await update(true)).toMatchInlineSnapshot(`
        {
          "message": "subscription not found",
          "success": false,
        }
      `);
    });

    test("should throw an error if there is no subscription", async () => {
      expect(await update(true)).toMatchInlineSnapshot(`
        {
          "message": "subscription not found",
          "success": false,
        }
      `);
    });

    test('should update the subscription with "cancelAtPeriodEnd"', async () => {
      updateSubscription.mockResolvedValueOnce({
        id: "sub_1",
        items: {
          data: [
            {
              current_period_end: 123456789,
            },
          ],
        },
        cancel_at_period_end: true,
        customer: stripeId,
        status: "active",
      });

      const { id } = await getUser();

      await prisma.subscription.create({
        data: {
          userId: id,
          cancelAtPeriodEnd: false,
          subscriptionId: "sub_1",
          status: "active",
        },
      });

      const res = await update(true);

      expect(updateSubscription.mock.calls).toMatchInlineSnapshot(`
        [
          [
            "sub_1",
            {
              "cancel_at_period_end": true,
            },
          ],
        ]
      `);
      expect(res).toMatchInlineSnapshot(`
        {
          "data": {
            "cancelAtPeriodEnd": true,
            "currentPeriodEnd": 1973-11-29T21:33:09.000Z,
            "subscriptionId": "sub_1",
          },
          "success": true,
        }
      `);
      expect(mock.revalidatePath.mock.calls).toMatchInlineSnapshot(`
        [
          [
            "/me/payment",
          ],
        ]
      `);
    });

    test("should return an error if the subscription update fails", async () => {
      updateSubscription.mockRejectedValueOnce(new Error("error"));

      const { id } = await getUser();

      await prisma.subscription.create({
        data: {
          userId: id,
          cancelAtPeriodEnd: false,
          subscriptionId: "sub_1",
          status: "active",
        },
      });

      expect(await update(true)).toMatchInlineSnapshot(`
        {
          "message": "subscription update failed",
          "success": false,
        }
      `);
    });
  });

  describe("redirectToBillingPortal", () => {
    test("should throw an error if there is no session token", async () => {
      mock.auth.mockReturnValueOnce(null);

      await expect(redirectToBillingPortal()).rejects.toThrow(
        "no session token",
      );
    });

    test("should throw an error if the user is not found", async () => {
      await prisma.user.deleteMany();

      await expect(redirectToBillingPortal()).rejects.toThrow("user not found");
    });

    test("should throw an error if the user has no stripeId", async () => {
      await expect(redirectToBillingPortal()).rejects.toThrow("user not found");
    });

    test("should redirect to the billing portal", async () => {
      await prisma.user.update({
        where: {
          id: "id",
        },
        data: {
          stripeId,
        },
      });

      createPortalSession.mockResolvedValueOnce({
        url: "https://billing.stripe.com/session/test_123",
      });

      await redirectToBillingPortal();

      expect(createPortalSession.mock.calls).toMatchInlineSnapshot(`
        [
          [
            {
              "customer": "cus_1",
              "return_url": "http://localhost:3000/me/payment",
            },
          ],
        ]
      `);
      expect(mock.redirect.mock.calls).toMatchInlineSnapshot(`
        [
          [
            "https://billing.stripe.com/session/test_123",
          ],
        ]
      `);
    });
  });
});

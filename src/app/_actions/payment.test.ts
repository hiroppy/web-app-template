import { beforeEach, describe, expect, test, vi } from "vitest";
import { setup } from "../../../tests/vitest.helper";

// need to import after vitest.helper
import { checkout, status, update } from "./payment";

const { mock, createUser, getUser, prisma } = await setup();

const { createCustomer, createSession, updateSubscription } = vi.hoisted(
  () => ({
    createCustomer: vi.fn(),
    createSession: vi.fn(),
    updateSubscription: vi.fn(),
  }),
);

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

    test("should redirect to the checkout session url", async () => {
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
                "shipping": "auto",
              },
              "line_items": [
                {
                  "price": "dummy",
                  "quantity": 1,
                },
              ],
              "mode": "subscription",
              "shipping_address_collection": {
                "allowed_countries": [
                  "JP",
                ],
              },
              "success_url": "http://localhost:3000/api/payment/success?session_id={CHECKOUT_SESSION_ID}",
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

  describe("status", () => {
    test("should throw an error if there is no session token", async () => {
      mock.auth.mockReturnValueOnce(null);

      expect(await status()).toMatchInlineSnapshot(`
        {
          "message": "no session token",
          "success": false,
        }
      `);
    });

    test("should return an error if the subscription is not found", async () => {
      expect(await status()).toMatchInlineSnapshot(`
        {
          "data": null,
          "message": "subscription not found",
          "success": true,
        }
      `);
    });

    test("should return the subscription status", async () => {
      const { id } = await getUser();

      await prisma.subscription.createMany({
        data: [
          {
            userId: id,
            cancelAtPeriodEnd: false,
            subscriptionId: "sub_1",
            status: "expired",
          },
          {
            userId: id,
            cancelAtPeriodEnd: false,
            subscriptionId: "sub_2",
            status: "active",
          },
          {
            userId: id,
            cancelAtPeriodEnd: true,
            subscriptionId: "sub_3",
            status: "complete",
          },
        ],
      });

      expect(await status()).toMatchInlineSnapshot(`
        {
          "data": {
            "cancelAtPeriodEnd": false,
            "currentPeriodEnd": null,
            "subscriptionId": "sub_2",
          },
          "success": true,
        }
      `);

      await prisma.subscription.delete({
        where: {
          subscriptionId: "sub_2",
        },
      });

      expect(await status()).toMatchInlineSnapshot(`
        {
          "data": {
            "cancelAtPeriodEnd": true,
            "currentPeriodEnd": null,
            "subscriptionId": "sub_3",
          },
          "success": true,
        }
      `);
    });
  });
});

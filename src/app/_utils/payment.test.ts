import { beforeEach, describe, expect, test, vi } from "vitest";
import { setup } from "../../../tests/vitest.helper";
import { handleSubscriptionUpsert } from "./payment";

const { createUser, prisma } = await setup();

const stripeId = "cus_123";

describe("utils/payment", () => {
  beforeEach(async () => {
    const { id } = await createUser();

    await prisma.user.update({
      where: {
        id,
      },
      data: {
        stripeId,
      },
    });

    vi.spyOn(console, "warn").mockImplementation(() => undefined);
  });

  describe("handleSubscriptionUpsert", () => {
    test("should return undefined when user not found", async () => {
      const subscription = {
        id: "sub_123",
        customer: "cus_12345",
        items: {
          data: [
            {
              current_period_end: null,
            },
          ],
        },
      };

      // @ts-expect-error don't need to pass all the properties
      const result = await handleSubscriptionUpsert(subscription);

      expect(result).toBe(undefined);
    });

    test("should create a subscription", async () => {
      const subscription = {
        id: "sub_123",
        customer: stripeId,
        items: {
          data: [
            {
              current_period_end: null,
            },
          ],
        },
        status: "active",
        cancel_at_period_end: false,
      };

      expect(await prisma.subscription.count()).toBe(0);

      // @ts-expect-error don't need to pass all the properties
      const res = await handleSubscriptionUpsert(subscription);

      if (!res) {
        throw new Error("Subscription not created");
      }

      expect(await prisma.subscription.count()).toBe(1);

      const { id, createdAt, updatedAt, ...rest } = res;

      expect(rest).toMatchInlineSnapshot(`
        {
          "cancelAtPeriodEnd": false,
          "currentPeriodEnd": 1970-01-01T00:00:00.000Z,
          "status": "active",
          "subscriptionId": "sub_123",
          "userId": "id",
        }
      `);

      {
        const res = await prisma.subscription.findFirst();

        if (!res) {
          throw new Error("Subscription not found");
        }

        const { id, createdAt, updatedAt, ...rest } = res;

        expect(rest).toMatchInlineSnapshot(`
          {
            "cancelAtPeriodEnd": false,
            "currentPeriodEnd": 1970-01-01T00:00:00.000Z,
            "status": "active",
            "subscriptionId": "sub_123",
            "userId": "id",
          }
        `);
      }
    });

    test("should update a subscription", async () => {
      const subscription = {
        id: "sub_123",
        customer: stripeId,
        items: {
          data: [
            {
              current_period_end: null,
            },
          ],
        },
        status: "active",
        cancel_at_period_end: false,
      };

      expect(await prisma.subscription.count()).toBe(0);

      // @ts-expect-error don't need to pass all the properties
      await handleSubscriptionUpsert(subscription);

      expect(await prisma.subscription.count()).toBe(1);

      {
        const updatedSubscription = {
          ...subscription,
          status: "canceled",
          items: {
            data: [
              {
                current_period_end: 123456789,
              },
            ],
          },
          cancel_at_period_end: true,
        };

        // @ts-expect-error don't need to pass all the properties
        const res = await handleSubscriptionUpsert(updatedSubscription);

        if (!res) {
          throw new Error("Subscription not updated");
        }

        const { id, createdAt, updatedAt, ...rest } = res;

        expect(rest).toMatchInlineSnapshot(`
          {
            "cancelAtPeriodEnd": true,
            "currentPeriodEnd": 1973-11-29T21:33:09.000Z,
            "status": "canceled",
            "subscriptionId": "sub_123",
            "userId": "id",
          }
        `);
      }
    });
  });
});

import { beforeEach, describe, expect, test, vi } from "vitest";
import { setup } from "../../../../../tests/vitest.helper";

// need to import after vitest.helper
import { POST } from "./route";

const { prisma, createUser } = await setup();
const { constructEvent, handleSubscriptionUpsert } = vi.hoisted(() => ({
  constructEvent: vi.fn(),
  handleSubscriptionUpsert: vi.fn(),
}));
const req = new Request("http://localhost", {
  method: "POST",
  headers: { "stripe-signature": "test-signature" },
});
const stripeId = "cus_123";

describe("api/payment/webhook", () => {
  beforeEach(() => {
    vi.mock("../../../_clients/stripe", async (actual) => {
      return {
        ...(await actual<typeof import("../../../_clients/stripe")>()),
        stripe: {
          webhooks: {
            constructEvent,
          },
        },
      };
    });
    vi.mock("../../../_utils/payment", async (actual) => {
      return {
        ...(await actual<typeof import("../../../_utils/payment")>()),
        handleSubscriptionUpsert,
      };
    });
  });

  function spyArrayBuffer() {
    vi.spyOn(req, "arrayBuffer").mockResolvedValueOnce(new ArrayBuffer(0));
  }

  describe("POST", () => {
    test("should return 400 if stripe-signature is missing", async () => {
      const req = new Request("http://localhost", { method: "POST" });
      const res = await POST(req);

      expect(res.status).toBe(400);
      expect(await res.text()).toMatchInlineSnapshot(
        `"Missing stripe-signature"`,
      );
    });

    test("should return 400 if request body cannot be read", async () => {
      vi.spyOn(req, "arrayBuffer").mockRejectedValueOnce(
        new Error("Error reading request body"),
      );

      const res = await POST(req);

      expect(res.status).toBe(400);
      expect(await res.text()).toMatchInlineSnapshot(
        `"Error reading request body"`,
      );
    });

    test("returns 400 if webhook signature verification fails", async () => {
      constructEvent.mockImplementationOnce(() => {
        throw new Error("Webhook signature verification failed");
      });
      spyArrayBuffer();

      const res = await POST(req);

      expect(res.status).toBe(400);
      expect(await res.text()).toBe("Webhook signature verification failed");
    });

    test("handles customer.subscription.created event", async () => {
      spyArrayBuffer();

      constructEvent.mockReturnValueOnce({
        type: "customer.subscription.created",
        data: { object: {} },
      });

      const res = await POST(req);

      expect(res.status).toBe(200);
      expect(await res.text()).toMatchInlineSnapshot(`"received"`);
      expect(handleSubscriptionUpsert).toBeCalled();
    });

    test("handles customer.subscription.deleted event", async () => {
      spyArrayBuffer();

      constructEvent.mockReturnValueOnce({
        type: "customer.subscription.deleted",
        data: { object: {} },
      });

      const res = await POST(req);

      expect(res.status).toBe(200);
      expect(await res.text()).toMatchInlineSnapshot(`"received"`);
      expect(handleSubscriptionUpsert).toBeCalled();
    });

    test("handles customer.subscription.updated event", async () => {
      spyArrayBuffer();

      constructEvent.mockReturnValueOnce({
        type: "customer.subscription.updated",
        data: { object: {} },
      });

      const res = await POST(req);

      expect(res.status).toBe(200);
      expect(await res.text()).toMatchInlineSnapshot(`"received"`);
      expect(handleSubscriptionUpsert).toBeCalled();
    });

    test("handles customer.deleted event", async () => {
      const { id } = await createUser();

      await prisma.user.update({
        where: {
          id,
        },
        data: {
          stripeId,
          subscriptions: {
            createMany: {
              data: [
                {
                  subscriptionId: "sub_123",
                  status: "active",
                },
                {
                  subscriptionId: "sub_456",
                  status: "canceled",
                },
              ],
            },
          },
        },
      });

      spyArrayBuffer();

      constructEvent.mockReturnValueOnce({
        type: "customer.deleted",
        data: {
          object: {
            id: stripeId,
          },
        },
      });

      const res = await POST(req);

      expect(res.status).toBe(200);
      expect(await res.text()).toMatchInlineSnapshot(`"received"`);
      expect(
        (
          await prisma.user.findUnique({
            where: {
              id,
            },
          })
        )?.stripeId,
      ).toBeNull();
      expect(
        await prisma.subscription.count({
          where: {
            userId: id,
          },
        }),
      ).toBe(0);
    });
  });
});

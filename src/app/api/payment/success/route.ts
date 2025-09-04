import { redirect } from "next/navigation";
import { type NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../_clients/prisma";
import { stripe } from "../../../_clients/stripe";
import { getSessionOrReject } from "../../../_utils/auth";

export async function GET(req: NextRequest) {
  const sessionId = req.nextUrl.searchParams.get("session_id");

  if (!sessionId) {
    return new NextResponse("Invalid session_id", { status: 400 });
  }

  const session = await getSessionOrReject();

  if (!session.success) {
    return new NextResponse(session.message, { status: 401 });
  }

  const { user } = session.data;
  const paymentInfo = await stripe.checkout.sessions.retrieve(sessionId);

  if (paymentInfo.status === "complete") {
    try {
      await prisma.$transaction(async (prisma) => {
        await prisma.user.update({
          where: {
            id: user.id,
          },
          data: {
            stripeId: `${paymentInfo.customer}`,
            subscriptions: {
              create: {
                subscriptionId: `${paymentInfo.subscription}`,
                status: `${paymentInfo.status}`,
              },
            },
          },
        });
      });
    } catch {
      // session is expired
      redirect("/me/payment?status=incomplete");
    }

    redirect("/me/payment");
  } else {
    redirect("/me/payment?status=incomplete");
  }
}

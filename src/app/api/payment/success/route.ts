import { redirect } from "next/navigation";
import { type NextRequest, NextResponse } from "next/server";
import { auth } from "../../../_clients/nextAuth";
import { prisma } from "../../../_clients/prisma";
import { stripe } from "../../../_clients/stripe";

export async function GET(req: NextRequest) {
  const session = await auth();

  if (!session) {
    return NextResponse.json({ message: "error" }, { status: 401 });
  }

  const sessionId = req.nextUrl.searchParams.get("session_id");

  if (!sessionId) {
    return NextResponse.json({ message: "error" }, { status: 400 });
  }

  const paymentInfo = await stripe.checkout.sessions.retrieve(sessionId);

  if (paymentInfo.status === "complete") {
    try {
      await prisma.$transaction(async (prisma) => {
        await prisma.user.update({
          where: {
            id: session.user.id,
          },
          data: {
            // TODO
            stripeId: paymentInfo.customer as string,
            subscriptions: {
              create: {
                subscriptionId: paymentInfo.subscription as string,
                status: paymentInfo.status as string,
                invoiceId: paymentInfo.invoice as string,
              },
            },
          },
        });
      });
    } catch (e) {
      // TODO:
    }

    redirect("/");
  } else {
    redirect("/payment");
  }
}

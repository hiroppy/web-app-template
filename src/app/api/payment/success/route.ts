import { redirect } from "next/navigation";
import { type NextRequest, NextResponse } from "next/server";
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

  const paymentInfo = await stripe.checkout.sessions.retrieve(sessionId);

  if (paymentInfo.status === "complete") {
    redirect("/me/payment");
  } else {
    // session is expired
    redirect("/me/payment?status=incomplete");
  }
}

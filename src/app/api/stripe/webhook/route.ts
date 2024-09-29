import { getStripeConfig } from "@/backend/stripe/config";
import { processPayment } from "@/backend/stripe/service";
import { NextAuthRequest } from "@/backend/user/types";
import { NextResponse } from "next/server";
import stripe from "stripe";

export async function POST(request: NextAuthRequest) {
  const { webhookSecret } = getStripeConfig();

  const payload = await request.text();

  const signature = request.headers.get("stripe-signature");

  if (!signature) return new NextResponse("Signature not provided", { status: 400 });

  try {
    const event = stripe.webhooks.constructEvent(payload, signature, webhookSecret);

    if (event.type === "checkout.session.completed" || event.type === "checkout.session.async_payment_succeeded") {
      processPayment(event.data.object.id);
    }
  } catch (err: any) {
    return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 });
  }

  return new NextResponse("", { status: 200 });
}

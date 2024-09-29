"use server";

import stripe from "stripe";
import { getStripeConfig } from "../config";
import { CreateStripeSessionParams } from "../types";
import prisma from "@/backend/prisma";

export const createStripeSession = async ({ email, priceId, baseUrl }: CreateStripeSessionParams) => {
  const { secretKey } = getStripeConfig();

  const stripeClient = new stripe(secretKey);

  // Create Checkout Sessions from body params.
  const session = await stripeClient.checkout.sessions.create({
    customer_email: email,
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    mode: "subscription",
    success_url: `${baseUrl}/account/stripe/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${baseUrl}/account/stripe/cancel?session_id={CHECKOUT_SESSION_ID}`,
    automatic_tax: { enabled: true },
    allow_promotion_codes: true,
  });

  return session.url;
};

export const processPayment = async (sessionId: string) => {
  const { secretKey } = getStripeConfig();
  const stripeClient = new stripe(secretKey);

  const checkoutSession = await stripeClient.checkout.sessions.retrieve(sessionId, {
    expand: ["line_items", "subscription"],
  });

  if (checkoutSession.payment_status === "paid" && checkoutSession.customer_email) {
    const subscription = checkoutSession.subscription as stripe.Subscription;

    const user = await prisma.user.findUnique({
      where: {
        email: checkoutSession.customer_email,
      },
    });

    if (!user?.chatUserId) throw new Error("User not found");

    await prisma.chatUser.update({
      where: {
        id: user?.chatUserId,
      },
      data: {
        stripeCustomerId: checkoutSession.customer as string,
        stripeSubscriptionId: subscription.id,
        stripeSubscriptionStatus: subscription.status,
        stripeSubscriptionPlanId: subscription.items.data[0].price.id,
        stripeSubscriptionCreatedAt: new Date(subscription.created * 1000),
      },
    });
  }
};

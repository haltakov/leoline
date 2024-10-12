"use server";

import stripe from "stripe";
import { getStripeConfig } from "../config";
import { CreateCustomerPortalSessionParams, CreateStripeSessionParams } from "../types";
import prisma from "@/backend/prisma";
import { auth } from "@/auth";

export const createStripeSession = async ({ priceId, baseUrl }: CreateStripeSessionParams) => {
  // Get the email of the logged in user from the session
  const session = await auth();
  const email = session?.user?.email;
  if (!email) throw Error("No logged in user found");

  // Initialize the stripe client
  const { secretKey } = getStripeConfig();
  const stripeClient = new stripe(secretKey);

  // Create Checkout Sessions from body params.
  const stripeSession = await stripeClient.checkout.sessions.create({
    customer_email: email,
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    payment_method_types: ["card"],
    mode: "subscription",
    success_url: `${baseUrl}/account/subscription?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${baseUrl}/account`,
    automatic_tax: { enabled: true },
    allow_promotion_codes: true,
  });

  return stripeSession.url;
};

export const createCustomerPortalSession = async ({ baseUrl }: CreateCustomerPortalSessionParams) => {
  // Get the email of the logged in user from the session
  const session = await auth();
  const email = session?.user?.email;
  if (!email) throw Error("No logged in user found");

  // Get the customer ID from the users email
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw Error("User not found");
  if (!user.stripeCustomerId) throw Error("User not subscribed to Stripe");

  // Initialize the stripe client
  const { secretKey } = getStripeConfig();
  const stripeClient = new stripe(secretKey);

  // Create Checkout Sessions from body params.
  const stripeSession = await stripeClient.billingPortal.sessions.create({
    customer: user.stripeCustomerId,
    return_url: `${baseUrl}/account`,
  });

  return stripeSession.url;
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

    await prisma.user.update({
      where: {
        id: user?.id,
      },
      data: {
        stripeCustomerId: checkoutSession.customer as string,
        stripeSubscriptionId: subscription.id,
        stripeSubscriptionStatus: subscription.status,
        stripeSubscriptionPriceId: subscription.items.data[0].price.id,
        stripeSubscriptionCreatedAt: new Date(subscription.created * 1000),
      },
    });
  }
};

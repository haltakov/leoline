import { SubscriptionStatus } from "../types";

export const convertStripeSubscriptionStatus = (stripeSubscriptionStatus?: string): SubscriptionStatus => {
  if (!stripeSubscriptionStatus) return SubscriptionStatus.NONE;

  switch (stripeSubscriptionStatus) {
    case "active":
      return SubscriptionStatus.ACTIVE;
    case "canceled":
      return SubscriptionStatus.NONE;
    default:
      return SubscriptionStatus.PROBLEM;
  }
};

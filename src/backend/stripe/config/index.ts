const stripeConfig = {
  dev: {
    publishableKey:
      "pk_test_51PqhZ0BHQCjJBeUdbCYjxL5cp2dkFRoA3bd1cXcWUT03jXfEa9sLYu1Ucjrd1ph0O6SadPsWlDB9gQhRtVm5YnMS00voFXBvlF",
    monthlyPriceId: "price_1Q9D1sBHQCjJBeUdsUp0OXUe",
    yearlyPriceId: "price_1Q9D2LBHQCjJBeUdWBCg8lnT",
    secretKey: process.env.STRIPE_SECRET_KEY || "",
    webhookSecret: process.env.STRIPE_WEBHOOK_SECRET || "",
  },
  prod: {
    publishableKey:
      "pk_test_51PqhZ0BHQCjJBeUdbCYjxL5cp2dkFRoA3bd1cXcWUT03jXfEa9sLYu1Ucjrd1ph0O6SadPsWlDB9gQhRtVm5YnMS00voFXBvlF",
    monthlyPriceId: "price_1Q9D1sBHQCjJBeUdsUp0OXUe",
    yearlyPriceId: "price_1Q9D2LBHQCjJBeUdWBCg8lnT",
    secretKey: process.env.STRIPE_SECRET_KEY || "",
    webhookSecret: process.env.STRIPE_WEBHOOK_SECRET || "",
  },
};

export const getStripeConfig = () => {
  const env = process.env.NEXT_PUBLIC_ENVIRONMENT;

  if (!env) throw new Error("NEXT_PUBLIC_ENVIRONMENT is not set");
  if (!(env in stripeConfig)) throw new Error(`NEXT_PUBLIC_ENVIRONMENT ${env} is not defined`);

  return stripeConfig[env as keyof typeof stripeConfig];
};

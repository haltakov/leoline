export interface StripeSession {
  clientSecret: string;
}

export interface CreateStripeSessionParams {
  priceId: string;
  baseUrl: string;
}

export interface CreateCustomerPortalSessionParams {
  baseUrl: string;
}

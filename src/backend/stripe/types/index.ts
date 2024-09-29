export interface StripeSession {
  clientSecret: string;
}

export interface CreateStripeSessionParams {
  email: string;
  priceId: string;
  baseUrl: string;
}

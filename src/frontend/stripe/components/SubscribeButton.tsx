"use client";

import { createStripeSession } from "@/backend/stripe/service";
import Button from "@/frontend/account/components/utils/Button";

export interface Props {
  email: string;
  priceId: string;
  label: string;
}

const SubscribeButton = ({ email, priceId, label }: Props) => {
  const subscribe = async () => {
    const sessionUrl = await createStripeSession({ email, priceId, baseUrl: window.location.origin });

    if (sessionUrl) {
      window.location.href = sessionUrl;
    }
  };

  return <Button onClick={subscribe}>{label}</Button>;
};

export default SubscribeButton;

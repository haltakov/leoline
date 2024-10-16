"use client";

import { createStripeSession } from "@/backend/stripe/service";
import Button from "@/frontend/account/components/utils/Button";

export interface Props {
  priceId: string;
  label: string;
}

const SubscribeButton = ({ priceId, label }: Props) => {
  const subscribe = async () => {
    const sessionUrl = await createStripeSession({ priceId, baseUrl: window.location.origin });

    if (sessionUrl) {
      window.location.href = sessionUrl;
    }
  };

  return <Button onClick={subscribe}>{label}</Button>;
};

export default SubscribeButton;

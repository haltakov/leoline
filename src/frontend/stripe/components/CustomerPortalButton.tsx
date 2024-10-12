"use client";

import { createCustomerPortalSession } from "@/backend/stripe/service";
import Button from "@/frontend/account/components/utils/Button";

export interface Props {
  label: string;
}

const CustomerPortalButton = ({ label }: Props) => {
  const subscribe = async () => {
    const sessionUrl = await createCustomerPortalSession({ baseUrl: window.location.origin });

    if (sessionUrl) {
      window.location.href = sessionUrl;
    }
  };

  return <Button onClick={subscribe}>{label}</Button>;
};

export default CustomerPortalButton;

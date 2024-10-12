"use client";

import Button from "./utils/Button";
import Heading from "./utils/Heading";
import Section from "./Section";
import SubscribeButton from "@/frontend/stripe/components/SubscribeButton";
import { getStripeConfig } from "@/backend/stripe/config";
import { convertStripeSubscriptionStatus } from "../utils";
import useUser from "@/frontend/user/hooks/useUser";
import { useEffect, useMemo, useState } from "react";
import { SubscriptionStatus } from "../types";
import { signOut } from "next-auth/react";
import LoadingSpinner from "@/frontend/common/components/LoadingSpinner";
import CustomerPortalButton from "@/frontend/stripe/components/CustomerPortalButton";
import { getStripeSubscriptionStatus } from "@/backend/stripe/service";

const Account = () => {
  const { monthlyPriceId, yearlyPriceId } = getStripeConfig();

  const { userPublic } = useUser();

  const [subscriptionStatus, setSubscriptionStatus] = useState<SubscriptionStatus | undefined>();

  useEffect(() => {
    (async () => {
      const status = await getStripeSubscriptionStatus();
      setSubscriptionStatus(convertStripeSubscriptionStatus(status));
    })();
  }, []);

  if (!userPublic || subscriptionStatus === undefined) {
    return (
      <div className="flex justify-center items-center p-16">
        <LoadingSpinner className="text-orange-600" />
      </div>
    );
  }

  return (
    <div className="space-y-10 flex flex-col items-center">
      <Heading>Account</Heading>

      <Section title="Information">
        Email: <b>{userPublic?.email}</b>
      </Section>

      <Section title="Subscription">
        <div className="space-y-4">
          <div>
            {subscriptionStatus === SubscriptionStatus.NONE &&
              "Please subscribe below to unlock 200 stories/month. You can save 16% by subscribing for an year."}
            {subscriptionStatus === SubscriptionStatus.ACTIVE &&
              "You are subscribed for 200 stories/month! You can manage your subscription below."}
            {subscriptionStatus === SubscriptionStatus.PROBLEM &&
              "There is a problem with your subscription. Please update your subscription details to unlock 200 stories per month."}
          </div>

          <div className="flex flex-row gap-2 justify-around">
            {subscriptionStatus === SubscriptionStatus.NONE ? (
              <>
                <SubscribeButton priceId={monthlyPriceId} label="$9 per month" />
                <SubscribeButton priceId={yearlyPriceId} label="$90 per year" />
              </>
            ) : (
              <>
                <CustomerPortalButton label="Update or cancel subscription" />
              </>
            )}
          </div>
        </div>
      </Section>

      <Section title="Statistics">
        <div>
          Stories created: <b>35</b>
        </div>
        <div>
          Minutes listened: <b>2 hours and 15 minutes</b>
        </div>
      </Section>

      <Button onClick={async () => await signOut()}>Sign Out</Button>
    </div>
  );
};

export default Account;

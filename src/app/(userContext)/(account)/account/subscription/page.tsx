"use client";

import BackgroundBlur from "@/frontend/common/components/BackgroundBlur";
import Modal from "@/frontend/account/components/utils/Modal";
import Heading from "@/frontend/account/components/utils/Heading";
import { useEffect, useState } from "react";
import { fulfillSubscription } from "@/backend/stripe/service";
import { useSearchParams } from "next/navigation";
import LoadingSpinner from "@/frontend/common/components/LoadingSpinner";
import Link from "@/frontend/account/components/utils/Link";

const StripeSuccessPage = () => {
  const searchParams = useSearchParams();

  const [subscriptionSuccessful, setSubscriptionSuccessful] = useState<boolean | undefined>();

  useEffect(() => {
    (async () => {
      const sessionId = searchParams.get("session_id");

      if (!sessionId) {
        setSubscriptionSuccessful(false);
        return;
      }

      // Try to fulfill the subscription
      try {
        await fulfillSubscription(sessionId);
        setSubscriptionSuccessful(true);
      } catch (err: any) {
        console.error(err);
        setSubscriptionSuccessful(false);
      }
    })();
  }, [searchParams]);

  return (
    <>
      <BackgroundBlur />

      <Modal>
        <div className="space-y-8 flex flex-col items-center">
          {subscriptionSuccessful === undefined && (
            <>
              <Heading>Processing subscription</Heading>
              <div>Please wait a moment until your subscriptions is confirmed...</div>
              <LoadingSpinner className="text-orange-600" />
            </>
          )}

          {subscriptionSuccessful === false && (
            <>
              <Heading>Subscription failed</Heading>
              <div>
                There was an error processing your subscription. We will review the payment and get back to you.
              </div>
            </>
          )}

          {subscriptionSuccessful && (
            <>
              <Heading>Subscription successful</Heading>
              <div>Thank you for subscribing to Leoline! You can now listen to 200 stories per month.</div>
            </>
          )}

          {subscriptionSuccessful !== undefined && <Link href="/account">Go back to account</Link>}
        </div>
      </Modal>
    </>
  );
};

export default StripeSuccessPage;

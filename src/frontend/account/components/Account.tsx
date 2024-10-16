"use client";

import Button from "./utils/Button";
import Heading from "./utils/Heading";
import Section from "./Section";
import SubscribeButton from "@/frontend/stripe/components/SubscribeButton";
import { getStripeConfig } from "@/backend/stripe/config";
import { convertStripeSubscriptionStatus } from "../utils";
import useUser from "@/frontend/user/hooks/useUser";
import { useEffect, useState } from "react";
import { SubscriptionStatus } from "../types";
import { signOut } from "next-auth/react";
import LoadingSpinner from "@/frontend/common/components/LoadingSpinner";
import CustomerPortalButton from "@/frontend/stripe/components/CustomerPortalButton";
import { getStripeSubscriptionStatus } from "@/backend/stripe/service";
import { getUserStats } from "@/backend/user/service";
import { UserStats } from "@/backend/user/types";
import { MAX_SUBSCRIBED_STORIES_PER_MONTH } from "@/backend/user/const";
import Image from "next/image";
import Link from "next/link";
import LinkButton from "@/frontend/account/components/utils/Link";

const Account = () => {
  const { monthlyPriceId, yearlyPriceId } = getStripeConfig();

  const { userPublic } = useUser();

  const [subscriptionStatus, setSubscriptionStatus] = useState<SubscriptionStatus | undefined>();
  const [userStats, setUserStats] = useState<UserStats | undefined>();

  // Get the user stats
  useEffect(() => {
    (async () => {
      const userStats = await getUserStats();
      setUserStats(userStats);
    })();
  }, []);

  // Get the subscription status
  useEffect(() => {
    (async () => {
      const status = await getStripeSubscriptionStatus();
      setSubscriptionStatus(convertStripeSubscriptionStatus(status));
    })();
  }, []);

  if (!userPublic || !userStats || subscriptionStatus === undefined) {
    return (
      <div className="flex justify-center items-center p-16">
        <LoadingSpinner className="text-orange-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6 md:space-y-10 flex flex-col items-center">
      <div className="flex flex-row justify-between items-center w-full">
        <div className="flex-grow">
          <Link href="/">
            <Image src="/img/icons/leoline.png" alt="Leo" width={48} height={48} className="rounded-full" />
          </Link>
        </div>
        <div className="flex-none">
          <Heading>Account</Heading>
        </div>
        <div className="flex-grow w-[48px]"></div>
      </div>

      <Section title="Information">
        <div className="flex flex-col gap-1 md:flex-row md:justify-between md:items-center">
          <div>
            Email: <b>{userPublic?.email}</b>
          </div>

          <div className="flex justify-center">
            <Button size="sm" onClick={async () => await signOut()}>
              Sign Out
            </Button>
          </div>
        </div>
      </Section>

      <Section title="Subscription">
        <div className="space-y-4">
          <div>
            {subscriptionStatus === SubscriptionStatus.NONE &&
              `Please subscribe below to unlock ${MAX_SUBSCRIBED_STORIES_PER_MONTH} stories/month. You can save 16% by subscribing for an year.`}
            {subscriptionStatus === SubscriptionStatus.ACTIVE &&
              `You are subscribed for ${MAX_SUBSCRIBED_STORIES_PER_MONTH} stories/month! You can manage your subscription below.`}
            {subscriptionStatus === SubscriptionStatus.PROBLEM &&
              `There is a problem with your subscription. Please update your subscription details to unlock ${MAX_SUBSCRIBED_STORIES_PER_MONTH} stories per month.`}
          </div>

          <div className="flex flex-row gap-2 justify-around">
            {subscriptionStatus === SubscriptionStatus.NONE ? (
              <>
                <SubscribeButton priceId={monthlyPriceId} label="$9/month" />
                <SubscribeButton priceId={yearlyPriceId} label="$90/year" />
              </>
            ) : (
              <>
                <CustomerPortalButton label="Update or cancel" />
              </>
            )}
          </div>
        </div>
      </Section>

      <Section title="Statistics">
        <div>
          Stories created this month: <b>{userStats.storiesCountCurrentMonth}</b>
        </div>
        <div>
          Stories created in total: <b>{userStats.storiesCountTotal}</b>
        </div>
      </Section>

      <LinkButton href="/">&lsaquo; Back to Leoline</LinkButton>
    </div>
  );
};

export default Account;

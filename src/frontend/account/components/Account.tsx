import { auth, signOut } from "@/auth";
import Link from "./utils/Link";
import Button from "./utils/Button";
import Heading from "./utils/Heading";
import Section from "./Section";
import SubscribeButton from "@/frontend/stripe/components/SubscribeButton";
import { getStripeConfig } from "@/backend/stripe/config";

const Account = async () => {
  const session = await auth();

  const { monthlyPriceId } = getStripeConfig();

  const subscriptionActive = true;

  return (
    <div className="space-y-10 flex flex-col items-center">
      <Heading>Account</Heading>

      <Section title="Information">
        Email: <b>{session?.user?.email}</b>
      </Section>

      <Section title="Subscription">
        <div className="space-y-4">
          <div>
            {subscriptionActive
              ? "You are subscribed for 200 stories/month! You can manage your subscription below."
              : "Please subscribe below to unlock 200 stories/month. You can save 16% by subscribing for an year."}
          </div>

          <div className="flex flex-row gap-2 justify-around">
            {subscriptionActive ? (
              <>
                <Link href="#">Update or cancel subscription</Link>
              </>
            ) : (
              <>
                <SubscribeButton priceId={monthlyPriceId} email={session?.user?.email ?? ""} label="$10 per month" />
                <SubscribeButton priceId={monthlyPriceId} email={session?.user?.email ?? ""} label="$100 per year" />
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

      <form
        className="pt-8"
        action={async () => {
          "use server";
          await signOut();
        }}
      >
        <Button>Sign Out</Button>
      </form>
    </div>
  );
};

export default Account;

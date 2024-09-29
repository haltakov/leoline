import BackgroundBlur from "@/frontend/common/components/BackgroundBlur";
import Modal from "@/frontend/account/components/utils/Modal";
import Heading from "@/frontend/account/components/utils/Heading";
import { auth } from "@/auth";
import { getStripeConfig } from "@/backend/stripe/config";
import SubscribeButton from "@/frontend/stripe/components/SubscribeButton";

const StripePage = async () => {
  const session = await auth();

  const { monthlyPriceId } = getStripeConfig();

  return (
    <>
      <BackgroundBlur />

      <Modal>
        <div className="space-y-8 flex flex-col items-center">
          <Heading>Subscribe</Heading>
          <div>
            <SubscribeButton priceId={monthlyPriceId} email={session?.user?.email ?? ""} label="$10/month" />
          </div>
        </div>
      </Modal>
    </>
  );
};

export default StripePage;

import BackgroundBlur from "@/frontend/common/components/BackgroundBlur";
import Modal from "@/frontend/account/components/utils/Modal";
import Heading from "@/frontend/account/components/utils/Heading";

const StripeSuccessPage = () => {
  return (
    <>
      <BackgroundBlur />

      <Modal>
        <div className="space-y-8 flex flex-col items-center">
          <Heading>Subscription canceled</Heading>
          <div>You can subscribe later.</div>
        </div>
      </Modal>
    </>
  );
};

export default StripeSuccessPage;

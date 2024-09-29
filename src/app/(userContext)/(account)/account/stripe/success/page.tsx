import BackgroundBlur from "@/frontend/common/components/BackgroundBlur";
import Modal from "@/frontend/account/components/utils/Modal";
import Heading from "@/frontend/account/components/utils/Heading";

const StripeSuccessPage = () => {
  return (
    <>
      <BackgroundBlur />

      <Modal>
        <div className="space-y-8 flex flex-col items-center">
          <Heading>Subscription successful</Heading>
          <div>You can now listen to more stories.</div>
        </div>
      </Modal>
    </>
  );
};

export default StripeSuccessPage;

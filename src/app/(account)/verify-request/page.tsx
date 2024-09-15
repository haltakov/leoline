import BackgroundBlur from "@/frontend/common/components/BackgroundBlur";
import Modal from "@/frontend/account/components/utils/Modal";
import Heading from "@/frontend/account/components/utils/Heading";

const VerifyPage = async () => {
  return (
    <>
      <BackgroundBlur />

      <Modal>
        <div className="space-y-8 flex flex-col items-center">
          <Heading>Check your email</Heading>
          <div>We have sent you a link to login</div>
        </div>
      </Modal>
    </>
  );
};

export default VerifyPage;

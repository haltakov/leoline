import Account from "@/frontend/account/components/Account";
import Login from "@/frontend/account/components/Login";
import { auth } from "@/auth";
import BackgroundBlur from "@/frontend/common/components/BackgroundBlur";
import Modal from "@/frontend/account/components/utils/Modal";

const AccountPage = async () => {
  const session = await auth();

  return (
    <>
      <BackgroundBlur />

      <Modal>{!session?.user ? <Login /> : <Account />}</Modal>
    </>
  );
};

export default AccountPage;

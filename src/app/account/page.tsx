import Account from "@/frontend/account/components/Account";
import Login from "@/frontend/account/components/Login";
import { signIn, auth, signOut } from "@/auth";
import BackgroundBlur from "@/frontend/common/components/BackgroundBlur";

const AccountPage = async () => {
  const session = await auth();

  return (
    <>
      <BackgroundBlur />

      <div className="relative p-4 flex justify-center items-center min-h-screen">
        <div className="bg-slate-100 px-2 py-12 shadow-xl rounded-md max-w-lg flex-grow">
          {!session?.user ? <Login /> : <Account />}
        </div>
      </div>
    </>
  );
};

export default AccountPage;

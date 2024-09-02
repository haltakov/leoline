import Account from "@/frontend/account/components/Account";
import Login from "@/frontend/account/components/Login";
import { signIn, auth, signOut } from "@/frontend/auth";

const AccountPage = async () => {
  const session = await auth();

  return (
    <div className="p-4 flex justify-center items-center min-h-screen">
      <div className="z-10 blur-lg bg-[url('/img/leoline_background.jpg')] bg-cover top-[-103px] md:top-[-156px] xl:top-[-208px] w-[1000px] h-[1000px] md:w-[1500px] md:h-[1500px] xl:w-[2000px] xl:h-[2000px] absolute left-1/2 transform -translate-x-1/2 overflow-hidden"></div>

      <div className="z-20 bg-slate-100 px-2 py-12 shadow-xl rounded-md max-w-lg flex-grow">
        {!session?.user ? <Login /> : <Account />}
      </div>
    </div>
  );
};

export default AccountPage;

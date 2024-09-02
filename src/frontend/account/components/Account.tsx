import { auth, signOut } from "@/frontend/auth";
import Button from "./utils/Button";
import Heading from "./utils/Heading";

const Account = async () => {
  const session = await auth();

  return (
    <div className="space-y-8 flex flex-col items-center">
      <Heading>Leoline Account</Heading>
      <div>
        Hey <b>{session?.user?.email}</b>
      </div>
      <form
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

import { signIn } from "@/auth";
import Button from "./utils/Button";
import Heading from "./utils/Heading";
import Link from "next/link";
import Image from "next/image";
import LinkButton from "@/frontend/account/components/utils/Link";

const Login = () => {
  return (
    <div className="space-y-10 flex flex-col items-center w-full">
      <div className="flex flex-row justify-between items-center w-full">
        <div className="flex-grow">
          <Link href="/">
            <Image src="/img/icons/leoline.png" alt="Leo" width={48} height={48} className="rounded-full" />
          </Link>
        </div>
        <div className="flex-none">
          <Heading>Leoline Account</Heading>
        </div>
        <div className="flex-grow w-[48px]"></div>
      </div>

      <div className="flex flex-col items-center space-y-4 w-full max-w-96">
        <form
          className="flex flex-col space-y-2 w-full"
          action={async (formData) => {
            "use server";
            await signIn("resend", formData);
          }}
        >
          <input className="border-2 px-4 py-2 rounded-md" type="email" name="email" placeholder="Email" required />
          <Button>Sign in with email</Button>
        </form>

        <div>or</div>

        <form
          className="w-full flex flex-col"
          action={async () => {
            "use server";
            await signIn("google");
          }}
        >
          <Button>Sign in with Google</Button>
        </form>
      </div>

      <div className="pt-10">
        <LinkButton href="/">&lsaquo; Back to Leoline</LinkButton>
      </div>
    </div>
  );
};

export default Login;

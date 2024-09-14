import { signIn } from "@/auth";
import Button from "./utils/Button";
import Heading from "./utils/Heading";

const Login = () => {
  return (
    <div className="space-y-20">
      <Heading>Create an account or sign in</Heading>

      <div className="flex flex-col items-center space-y-16 px-16">
        <form
          className="w-full flex flex-col"
          action={async () => {
            "use server";
            await signIn("google");
          }}
        >
          <Button>Sign in with Google</Button>
        </form>

        <form
          className="flex flex-col space-y-2 w-full"
          action={async (formData) => {
            "use server";
            await signIn("resend", formData);
          }}
        >
          <input className="border-2 px-4 py-2 rounded-md" type="email" name="email" placeholder="Email" />
          <Button>Sign in with email</Button>
        </form>
      </div>
    </div>
  );
};

export default Login;

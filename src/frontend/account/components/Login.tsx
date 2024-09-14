import { signIn } from "@/frontend/auth";
import Button from "./utils/Button";
import Heading from "./utils/Heading";

const Login = () => {
  return (
    <div className="space-y-20">
      <Heading>Create an account or sign in</Heading>

      <div className="flex flex-col items-center">
        <form
          action={async () => {
            "use server";
            await signIn("google");
          }}
        >
          <Button>Sign in with Google</Button>
        </form>
      </div>
    </div>
  );
};

export default Login;

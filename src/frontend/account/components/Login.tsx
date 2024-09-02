import { signIn } from "@/frontend/auth";
import Button from "./utils/Button";
import Heading from "./utils/Heading";

const Login = () => {
  return (
    <div className="space-y-12">
      <Heading>Create an account or Sign in</Heading>

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

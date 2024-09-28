"use client";

import BackgroundBlur from "@/frontend/common/components/BackgroundBlur";
import Modal from "@/frontend/account/components/utils/Modal";
import Heading from "@/frontend/account/components/utils/Heading";
import { useSearchParams } from "next/navigation";

const getErrorDescription = (error: string) => {
  switch (error.toLowerCase()) {
    case "configuration":
      return "There was an error with the app configuration. Please try again later.";
    case "accessdenied":
      return "You denied access to your account. Please try again.";
    case "verification":
      return "The verification link has expired or it has already been used. Please try again.";
    case "default":
    default:
      return "There was an error logging in, please try again.";
  }
};

const ErrorPage = () => {
  const search = useSearchParams();
  const error = search.get("error");

  return (
    <>
      <BackgroundBlur />

      <Modal>
        <div className="space-y-8 flex flex-col items-center">
          <Heading>Oops... something went wrong</Heading>
          <div>{getErrorDescription(error || "")}</div>
        </div>
      </Modal>
    </>
  );
};

export default ErrorPage;

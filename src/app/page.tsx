"use server";

import BackgroundBlur from "@/frontend/common/components/BackgroundBlur";
import Loading from "@/frontend/common/components/Loading";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

const Home = () => {
  const headersList = headers();
  const countryFromHeader = process.env.NEXT_PUBLIC_COUNTRY_OVERRIDE || headersList.get("cf-ipcountry") || "en";

  redirect(`/${countryFromHeader.toLowerCase()}`);

  return (
    <>
      <BackgroundBlur />
      <Loading />
    </>
  );
};

export default Home;

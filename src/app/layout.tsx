import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import clsx from "clsx";
import PlausibleProvider from "next-plausible";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Leoline",
  description: "Create childern stories with Leoline",
  icons: {
    icon: [
      { rel: "icon", url: "/icons/favicon.ico", sizes: "any" },
      { rel: "apple-touch-icon", url: "/icons/apple-touch-icon.png" },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <PlausibleProvider domain="leoline.fun" trackOutboundLinks={true} />
      </head>
      <body className={clsx(" bg-[#e7a731] min-h-screen", inter.className)}>
        <div className="min-h-screen">
          <div
            className={clsx(
              "z-100 bg-[url('/img/leoline_background.jpg')] bg-no-repeat w-full h-screen absolute bg-[#d25e10]",
              "bg-[size:1000px_1000px] bg-[center_top_-103px]",
              "md:bg-[size:1500px_1500px] md:bg-[center_top_-156px]",
              "xl:bg-[size:2000px_2000px] xl:bg-[center_top_-208px]"
            )}
          ></div>
          <div className="z-10 relative">{children}</div>
        </div>
      </body>
    </html>
  );
}

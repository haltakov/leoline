import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import clsx from "clsx";

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
      <body className={clsx("overflow-hidden bg-[rgb(227,184,154)] min-h-screen", inter.className)}>
        <div className="min-h-screen overflow-hidden">
          <div className="z-100 bg-[url('/img/leoline_background.jpg')] bg-cover top-[-103px] md:top-[-156px] xl:top-[-208px] w-[1000px] h-[1000px] md:w-[1500px] md:h-[1500px] xl:w-[2000px] xl:h-[2000px] absolute left-1/2 transform -translate-x-1/2 overflow-hidden"></div>
          <div className="z-10 relative">{children}</div>
        </div>
      </body>
    </html>
  );
}

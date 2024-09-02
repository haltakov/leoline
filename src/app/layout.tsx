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
      <body className={clsx("overflow-hidden bg-[#d45f12] min-h-screen", inter.className)}>{children}</body>
    </html>
  );
}

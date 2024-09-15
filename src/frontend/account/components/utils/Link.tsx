import Link from "next/link";
import React from "react";

interface Props {
  href: string;
  children: React.ReactNode;
}

const Button = ({ href, children }: Props) => {
  return (
    <Link
      href={href}
      className="text-lg font-bold border-2 text-orange-600 border-orange-600 px-8 py-2 rounded-md hover:bg-orange-600 hover:text-white"
      type="submit"
    >
      {children}
    </Link>
  );
};

export default Button;

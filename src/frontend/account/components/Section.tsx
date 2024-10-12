import React from "react";

export interface Props {
  title: string;
  children: React.ReactNode;
}

const Section = ({ title, children }: Props) => {
  return (
    <div className="w-full text-center space-y-4">
      <h2 className="text-left text-lg font-bold p-1 border-b-2 border-orange-600">{title}</h2>

      <div className="space-y-2 text-left">{children}</div>
    </div>
  );
};

export default Section;

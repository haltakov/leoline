import React from "react";

interface Props {
  children: React.ReactNode;
}

const Modal = ({ children }: Props) => {
  return (
    <div className="relative p-4 flex justify-center items-center min-h-screen">
      <div className="bg-slate-100 py-8 px-4 lg:px-8 shadow-xl rounded-md max-w-lg flex-grow">{children}</div>
    </div>
  );
};

export default Modal;

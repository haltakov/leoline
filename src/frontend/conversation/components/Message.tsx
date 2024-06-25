import { MessageWithRole } from "../types";

export interface Props {
  message: MessageWithRole;
}

const Message = ({ message }: Props) => {
  return <div className=" bg-slate-100 border border-slate-300 p-4 rounded shadow-lg">{message.text}</div>;
};

export default Message;

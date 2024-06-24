export interface Props {
  text: string;
}

const Message = ({ text }: Props) => {
  return <div className=" bg-slate-100 border border-slate-300 p-4 rounded shadow-lg">{text}</div>;
};

export default Message;

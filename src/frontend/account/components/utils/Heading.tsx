interface Props {
  children: React.ReactNode;
}

const Heading = ({ children }: Props) => {
  return <h1 className="text-xl font-bold text-center text-slate-800">{children}</h1>;
};

export default Heading;

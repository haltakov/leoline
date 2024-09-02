interface Props {
  children: React.ReactNode;
}

const Button = ({ children }: Props) => {
  return (
    <button
      className="text-lg font-bold border-2 text-orange-600 border-orange-600 px-8 py-2 rounded-md hover:bg-orange-600 hover:text-white"
      type="submit"
    >
      {children}
    </button>
  );
};

export default Button;

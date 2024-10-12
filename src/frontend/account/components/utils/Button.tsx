interface Props {
  children: React.ReactNode;
  disabled?: boolean;
  onClick?: () => void;
}

const Button = ({ children, disabled, onClick }: Props) => {
  return (
    <button
      className="text-lg font-bold border-2 text-orange-600 border-orange-600 px-8 py-2 rounded-md hover:bg-orange-600 hover:text-white"
      type={onClick ? undefined : "submit"}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default Button;

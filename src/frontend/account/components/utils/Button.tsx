import clsx from "clsx";

interface Props {
  children: React.ReactNode;
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  onClick?: () => void;
}

const Button = ({ children, size = "md", disabled, onClick }: Props) => {
  return (
    <button
      className={clsx(
        "font-bold border-2 text-orange-600 border-orange-600 rounded-md hover:bg-orange-600 hover:text-white",
        size === "sm" && "text-sm px-4 py-1",
        size === "md" && "text-base px-8 py-2",
        size === "lg" && "text-lg px-10 py-4"
      )}
      type={onClick ? undefined : "submit"}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default Button;

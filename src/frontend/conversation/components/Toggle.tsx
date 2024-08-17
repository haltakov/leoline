import clsx from "clsx";

export interface Props {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}

const Toggle = ({ active, onClick, children }: Props) => {
  return (
    <div>
      <button className={clsx("text-6xl", !active && "grayscale opacity-25")} onClick={onClick}>
        {children}
      </button>
    </div>
  );
};

export default Toggle;

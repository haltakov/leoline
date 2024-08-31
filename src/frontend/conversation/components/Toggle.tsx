import { useState } from "react";
import Image from "next/image";
import clsx from "clsx";

export interface Props {
  states: { value: string; image: string }[];
  initialState: string;
  onStateChange: (state: string) => void;
}

const Toggle = ({ states, initialState, onStateChange }: Props) => {
  const [stateIndex, setStateIndex] = useState(states.findIndex((state) => state.value === initialState));

  const handleClick = () => {
    const newIndex = (stateIndex + 1) % states.length;
    onStateChange(states[newIndex].value);
    setStateIndex(newIndex);
  };

  return (
    <button
      className={clsx(
        "z-40 w-20 h-20 rounded-full shadow-xl",
        "flex justify-center items-center",
        "bg-gradient-to-b from-orange-200 to-orange-300",
        "active:from-orange-300 active:to-orange-500 active:scale-110"
      )}
      onClick={handleClick}
    >
      <Image src={states[stateIndex].image} width={48} height={48} alt={states[stateIndex].value} />
    </button>
  );
};

export default Toggle;

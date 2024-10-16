import { useState } from "react";
import Image from "next/image";
import clsx from "clsx";

const ICON_SIZE = {
  sm: 36,
  md: 48,
};

export interface Props {
  size?: "sm" | "md";
  states: { value: string; image: string }[];
  initialState: string;
  onStateChange: (state: string) => void;
}

const Toggle = ({ size = "md", states, initialState, onStateChange }: Props) => {
  const [stateIndex, setStateIndex] = useState(states.findIndex((state) => state.value === initialState));

  const handleClick = () => {
    const newIndex = (stateIndex + 1) % states.length;
    onStateChange(states[newIndex].value);
    setStateIndex(newIndex);
  };

  return (
    <>
      <button
        className={clsx(
          `z-40 rounded-full shadow-xl p-3`,
          "flex justify-center items-center",
          "bg-gradient-to-b from-orange-200 to-orange-300",
          "active:from-orange-300 active:to-orange-500 active:scale-110"
        )}
        onClick={handleClick}
      >
        <Image
          src={states[stateIndex].image}
          width={ICON_SIZE[size]}
          height={ICON_SIZE[size]}
          alt={states[stateIndex].value}
          priority
        />
      </button>

      {/* Preload all images */}
      {states.map((state) => (
        <Image
          className="hidden"
          key={state.value}
          src={state.image}
          width={ICON_SIZE[size]}
          height={ICON_SIZE[size]}
          alt={state.value}
          priority
        />
      ))}
    </>
  );
};

export default Toggle;

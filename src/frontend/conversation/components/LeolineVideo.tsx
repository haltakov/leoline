import clsx from "clsx";

export interface Props {
  active: boolean;
  src: string;
  onClick?: () => void;
}

const LeolineVideo = ({ active, src, onClick }: Props) => {
  const classes = clsx(
    active ? "block" : "hidden",
    "z-20 absolute left-1/2 top-0 transform -translate-x-1/2 overflow-hidden max-w-none",
    "w-[640px] h-[384px] md:w-[960px] md:h-[576px] xl:w-[1280px] xl:h-[768px]"
  );

  return (
    <>
      {src.toLowerCase().endsWith(".mp4") ? (
        <video className={classes} src={src} autoPlay playsInline loop muted onClick={onClick}></video>
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img className={classes} src={src} alt="" />
      )}
    </>
  );
};

export default LeolineVideo;

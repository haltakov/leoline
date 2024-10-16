import clsx from "clsx";

export interface Props {
  active: boolean;
  src: string;
  onClick?: () => void;
}

const LeolineVideo = ({ active, src, onClick }: Props) => {
  const classes = clsx(
    active ? "block" : "hidden",
    "z-20 relative left-1/2 transform -translate-x-1/2",
    "min-w-[640px] min-h-[384px] w-[640px] h-[384px] md:w-[960px] md:h-[576px] md:min-w-[960px] md:min-h-[576px] xl:w-[1280px] xl:h-[768px]  xl:min-w-[1280px] xl:min-h-[768px]"
  );

  return (
    <>
      <div className="relative w-full overflow-hidden">
        {src.toLowerCase().endsWith(".mp4") ? (
          <video className={classes} src={src} autoPlay playsInline loop muted onClick={onClick}></video>
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img className={classes} src={src} alt="" />
        )}
      </div>
    </>
  );
};

export default LeolineVideo;

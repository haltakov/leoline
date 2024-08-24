interface Props {
  params: {
    lang: string;
  };
}

const Home = ({ params: { lang } }: Props) => {
  return (
    <div className="min-h-screen overflow-hidden">
      <video
        src="/video/leoline_waiting.mp4"
        autoPlay
        playsInline
        loop
        muted
        width={640}
        height={360}
        className="z-20 absolute top-[77px] md:top-[10px] xl:top-[-38px] left-1/2 transform -translate-x-1/2 w-[640px] h-[360px] md:w-[960px] md:h-[540px] xl:w-[1280px] xl:h-[720px] overflow-hidden max-w-none"
      ></video>
      <div className="z-10 bg-[url('/img/leoline_background.jpg')] bg-cover top-[-50px] md:top-[-180px] xl:top-[-290px] w-[1000px] h-[1000px] md:w-[1500px] md:h-[1500px] xl:w-[2000px] xl:h-[2000px] absolute left-1/2 transform -translate-x-1/2 overflow-hidden"></div>
    </div>
  );
};

export default Home;

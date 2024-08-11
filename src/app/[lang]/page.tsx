import Conversation from "@/frontend/conversation/components/Coversation";

interface Props {
  params: {
    lang: string;
  };
}

const Home = ({ params: { lang } }: Props) => {
  return (
    <main className="min-h-screen bg-gray-200">
      <div className="flex justify-center">
        <Conversation language={lang} />
      </div>
    </main>
  );
};

export default Home;

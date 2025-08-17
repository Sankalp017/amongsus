import { Button } from "@/components/ui/button";
import { MadeWithDyad } from "@/components/made-with-dyad";
import { useNavigate } from "react-router-dom";
import InstallPWAButton from "@/components/InstallPWAButton";
import { Play, BookOpen } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  const handleStartGame = () => {
    navigate("/setup");
  };

  const handleHowToPlay = () => {
    navigate("/how-to-play");
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 text-white p-4 overflow-hidden">
      <div className="absolute inset-0 -z-10 h-full w-full bg-white bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]">
        <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-fuchsia-400 opacity-20 blur-[100px]"></div>
      </div>

      <div className="flex flex-col items-center justify-center flex-grow text-center">
        <div className="bg-black/20 backdrop-blur-lg p-8 rounded-3xl shadow-2xl border border-white/10">
          <h1 className="text-6xl md:text-8xl font-extrabold mb-4 drop-shadow-lg bg-gradient-to-r from-yellow-300 via-pink-400 to-purple-400 text-transparent bg-clip-text">
            Among Sus
          </h1>
          <p className="text-lg md:text-xl mb-10 max-w-md text-gray-200">
            Uncover the Imposter in this thrilling word-based social deduction game, and let the accusations fly!
          </p>
          <div className="flex flex-col space-y-4 w-full max-w-sm mx-auto">
            <Button
              onClick={handleStartGame}
              className="bg-white text-purple-700 hover:bg-purple-100 hover:text-purple-800 text-xl md:text-2xl px-8 py-8 rounded-xl transition-all duration-300 ease-in-out transform hover:scale-105 shadow-lg flex items-center justify-center gap-3"
            >
              <Play className="h-7 w-7" />
              Start Game
            </Button>
            <Button
              onClick={handleHowToPlay}
              className="bg-white/20 backdrop-blur-lg text-white hover:bg-white/30 text-lg md:text-xl px-8 py-8 rounded-xl transition-all duration-300 ease-in-out transform hover:scale-105 flex items-center justify-center gap-3"
            >
              <BookOpen className="h-6 w-6" />
              How to Play
            </Button>
            <InstallPWAButton />
          </div>
        </div>
      </div>
      <MadeWithDyad />
    </div>
  );
};

export default Index;
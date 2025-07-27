import { Button } from "@/components/ui/button";
import { MadeWithDyad } from "@/components/made-with-dyad";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  const handleStartGame = () => {
    navigate("/setup"); // Navigate to the setup page
  };

  const handleHowToPlay = () => {
    navigate("/how-to-play"); // Navigate to the how-to-play page
  };

  const handleCustomPacks = () => {
    navigate("/custom-packs");
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-500 via-purple-500 to-yellow-500 text-white p-4"
    >
      <div className="flex flex-col items-center justify-center flex-grow text-center">
        <h1 className="text-5xl md:text-7xl font-extrabold mb-4 drop-shadow-lg">
          Among Sus
        </h1>
        <p className="text-lg md:text-xl mb-8 max-w-md">
          Uncover the Imposter in this thrilling word-based social deduction game, and let the accusations fly!
        </p>
        <div className="flex flex-col space-y-4 w-full max-w-xs">
          <Button
            onClick={handleStartGame}
            className="bg-white text-purple-700 hover:bg-purple-100 hover:text-purple-800 text-xl md:text-2xl px-8 py-6 rounded-xl transition-all duration-300 ease-in-out transform hover:scale-105" // Changed to rounded-xl
          >
            Start Game
          </Button>
          <Button
            onClick={handleCustomPacks}
            className="bg-white/20 backdrop-blur-lg text-white hover:bg-white/30 hover:text-white text-lg md:text-xl px-8 py-6 rounded-xl transition-all duration-300 ease-in-out transform hover:scale-105"
          >
            Custom Word Packs
          </Button>
          <Button
            onClick={handleHowToPlay}
            className="bg-white/20 backdrop-blur-lg text-white hover:bg-white/30 hover:text-white text-lg md:text-xl px-8 py-6 rounded-xl transition-all duration-300 ease-in-out transform hover:scale-105" // Changed to rounded-xl
          >
            How to Play
          </Button>
        </div>
      </div>
      <MadeWithDyad />
    </div>
  );
};

export default Index;
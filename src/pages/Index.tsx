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

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-500 via-purple-500 to-yellow-500 text-white p-4">
      <div className="flex flex-col items-center justify-center flex-grow text-center">
        <h1 className="text-5xl md:text-7xl font-extrabold mb-4 drop-shadow-lg">
          Among Sus
        </h1>
        <p className="text-lg md:text-xl mb-8 max-w-md">
          Uncover the Imposter in this thrilling word-based social deduction game, played on a single device!
        </p>
        <div className="flex flex-col space-y-4 w-full max-w-xs">
          <Button
            onClick={handleStartGame}
            className="bg-white text-purple-700 hover:bg-gray-100 text-xl md:text-2xl px-8 py-6 rounded-full shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105"
          >
            Start Game
          </Button>
          <Button
            onClick={handleHowToPlay}
            variant="outline"
            className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-purple-700 text-lg md:text-xl px-8 py-4 rounded-full shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105"
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
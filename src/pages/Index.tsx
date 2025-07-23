import { Button } from "@/components/ui/button";
import { MadeWithDyad } from "@/components/made-with-dyad";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  const handleStartGame = () => {
    navigate("/setup"); // Navigate to the setup page
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-500 via-purple-500 to-yellow-500 text-white p-4">
      <div className="flex flex-col items-center justify-center flex-grow text-center">
        <h1 className="text-5xl md:text-7xl font-extrabold mb-4 drop-shadow-lg">
          Among Sus
        </h1>
        <p className="text-lg md:text-xl mb-8 max-w-md">
          A word-based social deduction game to play with friends on one device.
        </p>
        <Button
          onClick={handleStartGame}
          className="bg-white text-purple-700 hover:bg-gray-100 text-xl md:text-2xl px-8 py-6 rounded-full shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105"
        >
          Start Game
        </Button>
      </div>
      <MadeWithDyad />
    </div>
  );
};

export default Index;
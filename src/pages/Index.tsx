import { Button } from "@/components/ui/button";
import { MadeWithDyad } from "@/components/made-with-dyad";
import { useNavigate } from "react-router-dom";
import InstallPWAButton from "@/components/InstallPWAButton";
import { Play, BookOpen } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";

const Index = () => {
  const navigate = useNavigate();

  const handleStartGame = () => {
    navigate("/setup");
  };

  const handleHowToPlay = () => {
    navigate("/how-to-play");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-500 via-purple-500 to-yellow-500 dark:bg-gradient-to-br dark:from-slate-900 dark:via-indigo-950 dark:to-slate-900 text-white p-4 relative">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <div className="flex flex-col items-center justify-center flex-grow text-center">
        <h1 className="text-6xl md:text-8xl font-extrabold mb-4 drop-shadow-lg">
          Among Sus
        </h1>
        <p className="text-lg md:text-xl mb-10 max-w-md">
          Uncover the Imposter in this thrilling word-based social deduction game, and let the accusations fly!
        </p>
        <div className="flex flex-col space-y-4 w-full max-w-xs mx-auto">
          <Button
            onClick={handleStartGame}
            className="bg-white text-purple-700 hover:bg-purple-100 dark:bg-white/15 dark:backdrop-blur-xl dark:border dark:border-white/25 dark:text-white dark:hover:bg-white/20 text-xl md:text-2xl px-8 py-8 rounded-2xl transition-all duration-300 ease-in-out transform hover:scale-105 flex items-center justify-center gap-3"
          >
            <Play className="h-7 w-7" />
            Start Game
          </Button>
          <Button
            onClick={handleHowToPlay}
            variant="outline"
            className="bg-white/20 backdrop-blur-xl border border-white/30 text-white hover:bg-white/40 hover:text-white text-lg md:text-xl px-8 py-8 rounded-2xl transition-all duration-300 ease-in-out transform hover:scale-105 flex items-center justify-center gap-3"
          >
            <BookOpen className="h-6 w-6" />
            How to Play
          </Button>
          <InstallPWAButton />
        </div>
      </div>
      <MadeWithDyad />
    </div>
  );
};

export default Index;
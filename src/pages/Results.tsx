import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { BookOpen, UserX, Users } from "lucide-react"; // Removed Volume2 icon
import { loadGameState, clearGameState } from "@/utils/localStorage";

interface GameStateData {
  numPlayers: number;
  playerNames: string[];
  numSusPlayers: number;
  topic?: string;
  mainWord: string;
  susWord: string;
  susPlayerIndices: number[];
}

const Results = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const initialGameState = location.state?.gameState as GameStateData;
  const [gameState, setGameState] = useState<GameStateData | null>(null);

  useEffect(() => {
    let loadedState: GameStateData | undefined = initialGameState;

    if (!loadedState || !loadedState.playerNames || loadedState.playerNames.length === 0) {
      // If no state from navigation, try to load from local storage
      loadedState = loadGameState();
      if (!loadedState || !loadedState.playerNames || loadedState.playerNames.length === 0) {
        toast.error("Game data not found. Please set up the game again.");
        navigate("/setup");
        return;
      }
    }
    setGameState(loadedState);

    // Removed audio initialization and playback logic
    return () => {
      // No audio cleanup needed
    };
  }, [initialGameState, navigate]);

  const handlePlayAgain = () => {
    clearGameState(); // Clear game state from local storage when playing again
    navigate("/");
  };

  if (!gameState) {
    return null; // Or a loading spinner
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-500 via-purple-500 to-yellow-500 text-white p-4">
      <Card className="w-full max-w-md bg-white p-8 rounded-2xl shadow-2xl text-gray-800 text-center border border-gray-200">
        <CardHeader>
          <CardTitle className="text-3xl font-bold mb-4">Game Over!</CardTitle>
        </CardHeader>
        <CardContent>
          <h3 className="text-2xl font-semibold mb-4">The Truth Revealed!</h3>
          <p className="text-lg mb-6">
            The discussion has concluded. Here's how the game was set up:
          </p>

          {/* Removed "Hear Drum Roll" button */}

          <div className="mb-6">
            <h4 className="text-xl font-bold mb-2 flex items-center justify-center gap-2">
              <BookOpen className="h-6 w-6 text-purple-700" /> The Words Were:
            </h4>
            <p className="text-lg">Main Word: <span className="font-semibold text-purple-700">{gameState.mainWord}</span></p>
            <p className="text-lg">Sus Word: <span className="font-semibold text-purple-700">{gameState.susWord}</span></p>
          </div>

          <Separator className="my-6 bg-gray-300" />

          <div className="mb-8">
            <h4 className="text-xl font-bold mb-2 flex items-center justify-center gap-2">
              <UserX className="h-6 w-6 text-red-600" /> Imposters Were:
            </h4>
            <div className="flex flex-wrap justify-center gap-2">
              {gameState.susPlayerIndices.length > 0 ? (
                gameState.susPlayerIndices.map((index) => (
                  <Badge key={index} variant="destructive" className="text-lg px-4 py-2">
                    {gameState.playerNames[index]}
                  </Badge>
                ))
              ) : (
                <p className="text-lg">No imposters assigned.</p>
              )}
            </div>
          </div>

          <Separator className="my-6 bg-gray-300" />

          <div className="mb-8">
            <h4 className="text-xl font-bold mb-2 flex items-center justify-center gap-2">
              <Users className="h-6 w-6 text-green-600" /> Innocents Were:
            </h4>
            <div className="flex flex-wrap justify-center gap-2">
              {gameState.playerNames
                .filter((_, index) => !gameState.susPlayerIndices.includes(index))
                .map((name, index) => (
                  <Badge key={index} variant="secondary" className="text-lg px-4 py-2 bg-green-100 text-green-800 hover:bg-green-200">
                    {name}
                  </Badge>
                ))}
            </div>
          </div>

          <Button
            onClick={handlePlayAgain}
            className="w-full bg-purple-700 text-white hover:bg-purple-800 text-lg py-4 rounded-md shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105"
          >
            Play Again
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Results;
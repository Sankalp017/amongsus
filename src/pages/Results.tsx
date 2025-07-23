import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, UserX, Users } from "lucide-react"; // Import new icons

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
  const { gameState } = location.state as { gameState: GameStateData };

  useEffect(() => {
    if (!gameState || !gameState.playerNames || gameState.playerNames.length === 0) {
      toast.error("Game data not found. Please set up the game again.");
      navigate("/setup");
    }
  }, [gameState, navigate]);

  if (!gameState) {
    return null; // Or a loading spinner/error message
  }

  const handlePlayAgain = () => {
    navigate("/"); // Go back to the home page to start a new game
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-500 via-purple-500 to-yellow-500 text-white p-4">
      <Card className="w-full max-w-md bg-white p-6 rounded-lg shadow-xl text-gray-800 text-center">
        <CardHeader>
          <CardTitle className="text-3xl font-bold mb-4">Game Over!</CardTitle>
        </CardHeader>
        <CardContent>
          <h3 className="text-2xl font-semibold mb-4">The Truth Revealed!</h3>
          <p className="text-lg mb-6">
            The discussion has concluded. Here's how the game was set up:
          </p>

          <div className="mb-6">
            <h4 className="text-xl font-bold mb-2 flex items-center justify-center gap-2">
              <BookOpen className="h-6 w-6 text-purple-700" /> The Words Were:
            </h4>
            <p className="text-lg">Main Word: <span className="font-semibold text-purple-700">{gameState.mainWord}</span></p>
            <p className="text-lg">Sus Word: <span className="font-semibold text-purple-700">{gameState.susWord}</span></p>
          </div>

          <div className="mb-8">
            <h4 className="text-xl font-bold mb-2 flex items-center justify-center gap-2">
              <UserX className="h-6 w-6 text-red-600" /> Sus Players Were:
            </h4>
            {gameState.susPlayerIndices.length > 0 ? (
              gameState.susPlayerIndices.map((index) => (
                <p key={index} className="text-lg font-semibold text-red-600">
                  {gameState.playerNames[index]}
                </p>
              ))
            ) : (
              <p className="text-lg">No sus players assigned (this shouldn't happen in a normal game).</p>
            )}
          </div>

          <div className="mb-8">
            <h4 className="text-xl font-bold mb-2 flex items-center justify-center gap-2">
              <Users className="h-6 w-6 text-green-600" /> Crewmates Were:
            </h4>
            {gameState.playerNames
              .filter((_, index) => !gameState.susPlayerIndices.includes(index))
              .map((name, index) => (
                <p key={index} className="text-lg font-semibold text-green-600">
                  {name}
                </p>
              ))}
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
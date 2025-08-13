import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { BookOpen, UserX, Users } from "lucide-react";
import { loadGameState, clearGameState, saveGameState } from "@/utils/localStorage";

interface GameStateData {
  numPlayers: number;
  playerNames: string[];
  numSusPlayers: number;
  topic: string;
  topics: string[];
  mainWord: string;
  susWord: string;
  susPlayerIndices: number[];
  consecutiveImposterRounds: number[];
  currentRound: number; // Added currentRound
}

const Results = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const initialGameState = location.state?.gameState as GameStateData;
  const [gameState, setGameState] = useState<GameStateData | null>(null);

  useEffect(() => {
    let loadedState: GameStateData | undefined = initialGameState;

    if (!loadedState || !loadedState.playerNames || loadedState.playerNames.length === 0) {
      loadedState = loadGameState();
      if (!loadedState || !loadedState.playerNames || loadedState.playerNames.length === 0) {
        toast.error("Game data not found. Please set up the game again.");
        navigate("/setup");
        return;
      }
    }
    // Ensure consecutiveImposterRounds and currentRound are initialized if missing from loaded state (for backward compatibility)
    if (loadedState && !loadedState.consecutiveImposterRounds) {
      loadedState.consecutiveImposterRounds = new Array(loadedState.numPlayers).fill(0);
    }
    if (loadedState && !loadedState.currentRound) {
      loadedState.currentRound = 1;
    }
    setGameState(loadedState);
    if (loadedState) {
      saveGameState(loadedState); // Save updated state with consecutiveImposterRounds and currentRound if they were just initialized
    }
  }, [initialGameState, navigate]);

  if (!gameState) {
    return null; // Or a loading spinner
  }

  const handleNewGame = () => {
    clearGameState();
    navigate("/");
  };

  const handlePlayNextRound = () => {
    if (!gameState) return;

    // Increment currentRound for the next round
    const nextRoundNumber = (gameState.currentRound || 0) + 1;

    const nextRoundSetup = {
      numPlayers: gameState.numPlayers,
      playerNames: gameState.playerNames,
      numSusPlayers: gameState.numSusPlayers,
      topics: gameState.topics,
      previousTopic: gameState.topic,
      previousSusPlayerIndices: gameState.susPlayerIndices,
      consecutiveImposterRounds: gameState.consecutiveImposterRounds,
      currentRound: nextRoundNumber, // Pass the incremented currentRound
    };
    clearGameState();
    navigate("/name-reveal", { state: nextRoundSetup });
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-500 via-purple-500 to-yellow-500 text-white p-4"
    >
      <Card className="w-full max-w-md bg-white p-6 sm:p-8 rounded-2xl shadow-lg text-gray-800 text-center border border-gray-200">
        <>
          <CardContent>
            <h3 className="text-2xl md:text-3xl font-semibold mb-4">The truth has been revealed!</h3>
            <p className="text-base md:text-lg mb-6">
              The discussion has concluded. Here's how the game was set up:
            </p>

            <div className="space-y-4 mb-8">
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <h4 className="text-lg md:text-xl font-bold mb-2 flex items-center justify-center gap-2 text-purple-800">
                  <BookOpen className="h-5 w-5 md:h-6 md:w-6 text-purple-700" /> The Words Were:
                </h4>
                <p className="text-base md:text-lg">Main Word: <span className="font-semibold text-purple-700">{gameState.mainWord}</span></p>
                <p className="text-base md:text-lg">Sus Word: <span className="font-semibold text-purple-700">{gameState.susWord}</span></p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <h4 className="text-lg md:text-xl font-bold mb-2 flex items-center justify-center gap-2 text-red-800">
                  <UserX className="h-5 w-5 md:h-6 md:w-6 text-red-600" /> Imposters Were:
                </h4>
                <div className="flex flex-wrap justify-center gap-3">
                  {gameState.susPlayerIndices.length > 0 ? (
                    gameState.susPlayerIndices.map((index) => (
                      <Badge key={index} variant="destructive" className="text-sm md:text-base px-4 py-2 bg-red-600 text-white rounded-xl">
                        {gameState.playerNames[index]}
                      </Badge>
                    ))
                  ) : (
                    <p className="text-base md:text-lg text-gray-600">No imposters assigned.</p>
                  )}
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <h4 className="text-lg md:text-xl font-bold mb-2 flex items-center justify-center gap-2 text-green-800">
                  <Users className="h-5 w-5 md:h-6 w-6 text-green-600" /> Innocents Were:
                </h4>
                <div className="flex flex-wrap justify-center gap-3">
                  {gameState.playerNames
                    .filter((_, index) => !gameState.susPlayerIndices.includes(index))
                    .map((name, index) => (
                      <Badge key={index} variant="secondary" className="text-sm md:text-base px-4 py-2 bg-green-100 text-green-800 hover:bg-green-200 rounded-xl">
                        {name}
                      </Badge>
                    ))}
                </div>
              </div>
            </div>

            <div className="flex flex-col space-y-4 mt-6">
              <Button
                onClick={handlePlayNextRound}
                className="w-full bg-purple-700 text-white hover:bg-purple-800 text-base md:text-lg py-6 rounded-xl transition-all duration-300 ease-in-out transform hover:scale-105 border-2 border-transparent"
              >
                Play Next Round
              </Button>
              <Button
                onClick={handleNewGame}
                variant="outline"
                className="w-full bg-transparent border-2 border-purple-700 text-purple-700 hover:bg-purple-700 hover:text-white text-base md:text-lg py-6 rounded-xl transition-all duration-300 ease-in-out transform hover:scale-105"
              >
                New Game
              </Button>
            </div>
          </CardContent>
        </>
      </Card>
    </div>
  );
};

export default Results;
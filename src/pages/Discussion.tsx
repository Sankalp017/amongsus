import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageCircle } from "lucide-react";
import { loadGameState, saveGameState } from "@/utils/localStorage";

interface GameStateData {
  numPlayers: number;
  playerNames: string[];
  numSusPlayers: number;
  topic?: string;
  mainWord: string;
  susWord: string;
  susPlayerIndices: number[];
}

const Discussion = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const initialGameState = location.state as GameStateData;
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
    setGameState(loadedState);
  }, [initialGameState, navigate]);

  const handleEndDiscussion = () => {
    if (!gameState) {
      toast.error("Game state is missing. Cannot end discussion.");
      navigate("/setup");
      return;
    }
    console.log("End Discussion button clicked!");
    saveGameState(gameState); // Save current game state before navigating to results
    toast.info("Discussion ended! Revealing results...");
    navigate("/results", { state: { gameState } });
  };

  if (!gameState) {
    return null; // Or a loading spinner
  }

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-500 via-purple-500 to-yellow-500 text-white p-4"
    >
      <Card className="w-full max-w-md bg-white p-6 sm:p-8 rounded-2xl shadow-2xl text-gray-800 text-center border border-gray-200">
        <>
          <CardHeader>
            <CardTitle className="text-2xl md:text-3xl font-bold mb-4 flex items-center justify-center gap-2">
              <MessageCircle className="h-7 w-7 md:h-8 md:w-8 text-purple-700" /> Discussion Time!
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-base md:text-lg mb-6">
              Players, discuss among yourselves. Try to figure out who the sus players are!
            </p>

            <Button
              onClick={handleEndDiscussion}
              className="w-full bg-purple-700 text-white hover:bg-purple-800 text-base md:text-lg py-4 rounded-md transition-all duration-300 ease-in-out transform hover:scale-105 text-wrap"
            >
              Reveal Results
            </Button>
          </CardContent>
        </>
      </Card>
    </div>
  );
};

export default Discussion;
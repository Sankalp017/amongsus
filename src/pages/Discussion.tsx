import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageCircle, Eye } from "lucide-react";
import { loadGameState, saveGameState } from "@/utils/localStorage";

interface GameStateData {
  numPlayers: number;
  playerNames: string[];
  numSusPlayers: number;
  topic: string;
  topics: string[];
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
      className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-500 via-purple-500 to-yellow-500 dark:bg-gradient-to-br dark:from-slate-900 dark:via-black dark:to-slate-900 text-white p-4"
    >
      <Card className="w-full max-w-md p-6 sm:p-8 rounded-3xl shadow-2xl text-card-foreground text-center border-border dark:bg-card dark:backdrop-blur-lg dark:border">
        <>
          <CardHeader>
            <CardTitle className="text-3xl md:text-4xl font-bold mb-2 flex items-center justify-center gap-2">
              <MessageCircle className="h-8 w-8 md:h-9 md:w-9 text-primary animate-pulse" /> Discussion Time!
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-base md:text-lg mb-6 text-muted-foreground">
              The accusations are flying! Innocents, grill the suspects. Imposters, blend in and deceive. The truth is on the line.
            </p>

            <Button
              onClick={handleEndDiscussion}
              className="w-full text-base md:text-lg py-6 rounded-2xl transition-all duration-300 ease-in-out transform hover:scale-105 text-wrap flex items-center justify-center gap-3"
            >
              <Eye className="h-6 w-6" />
              Reveal Results
            </Button>
          </CardContent>
        </>
      </Card>
    </div>
  );
};

export default Discussion;
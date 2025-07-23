import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

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
  const gameState = location.state as GameStateData;

  useEffect(() => {
    if (!gameState || !gameState.playerNames || gameState.playerNames.length === 0) {
      toast.error("Game data not found. Please set up the game again.");
      navigate("/setup");
    }
  }, [gameState, navigate]);

  const handleStartVoting = () => {
    toast.info("Time to vote!");
    navigate("/voting", { state: gameState }); // Navigate to the Voting Phase, passing gameState
  };

  if (!gameState) {
    return null; // Or a loading spinner/error message
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-500 via-purple-500 to-yellow-500 text-white p-4">
      <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-xl text-gray-800 text-center">
        <h2 className="text-3xl font-bold mb-4">Discussion Time!</h2>
        <p className="text-lg mb-6">
          Players, discuss among yourselves. Try to figure out who the sus players are!
        </p>
        <p className="text-md text-gray-600 mb-8">
          Remember the main word is: <span className="font-semibold">{gameState.mainWord}</span>
        </p>
        <Button
          onClick={handleStartVoting}
          className="w-full bg-purple-700 text-white hover:bg-purple-800 text-lg py-4 rounded-md shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105"
        >
          Start Voting
        </Button>
      </div>
    </div>
  );
};

export default Discussion;
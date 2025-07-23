import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import Timer from "@/components/Timer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface GameStateData {
  numPlayers: number;
  playerNames: string[];
  numSusPlayers: number;
  topic?: string;
  mainWord: string;
  susWord: string;
  susPlayerIndices: number[];
  revealDuration: number;
  discussionDuration: number;
}

const Discussion = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const gameState = location.state as GameStateData;

  const [isDiscussionTimerRunning, setIsDiscussionTimerRunning] = useState(false); // New state for timer control

  useEffect(() => {
    if (!gameState || !gameState.playerNames || gameState.playerNames.length === 0 || gameState.discussionDuration === undefined) {
      toast.error("Game data not found or discussion duration missing. Please set up the game again.");
      navigate("/setup");
    }
  }, [gameState, navigate]);

  const handleStartDiscussionTimer = () => {
    setIsDiscussionTimerRunning(true);
  };

  const handleEndDiscussion = () => {
    toast.info("Discussion ended! Revealing results...");
    navigate("/results", { state: { gameState } }); // Navigate directly to Results, passing gameState
  };

  if (!gameState) {
    return null; // Or a loading spinner/error message
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-500 via-purple-500 to-yellow-500 text-white p-4">
      <Card className="w-full max-w-md bg-white p-6 rounded-lg shadow-xl text-gray-800 text-center">
        <CardHeader>
          <CardTitle className="text-3xl font-bold mb-4">Discussion Time!</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-lg mb-6">
            Players, discuss among yourselves. Try to figure out who the sus players are!
          </p>
          <p className="text-md text-gray-600 mb-8">
            Remember the main word is: <span className="font-semibold">{gameState.mainWord}</span>
          </p>

          <div className="mb-8 flex flex-col gap-4">
            {!isDiscussionTimerRunning && (
              <Button
                onClick={handleStartDiscussionTimer}
                className="bg-green-600 text-white hover:bg-green-700 text-lg py-4 rounded-md shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105"
              >
                Start Discussion Timer
              </Button>
            )}
            {isDiscussionTimerRunning && (
              <Timer initialTime={gameState.discussionDuration} onTimeUp={handleEndDiscussion} />
            )}
          </div>

          <Button
            onClick={handleEndDiscussion}
            className="w-full bg-purple-700 text-white hover:bg-purple-800 text-lg py-4 rounded-md shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105"
          >
            End Discussion & Reveal Results
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Discussion;
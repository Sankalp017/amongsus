import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import Timer from "@/components/Timer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageCircle } from "lucide-react"; // Import MessageCircle icon

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

  // The timer will now start automatically when the component mounts
  // No need for isDiscussionTimerRunning state or a "Start Timer" button

  useEffect(() => {
    if (!gameState || !gameState.playerNames || gameState.playerNames.length === 0 || gameState.discussionDuration === undefined) {
      toast.error("Game data not found or discussion duration missing. Please set up the game again.");
      navigate("/setup");
    }
  }, [gameState, navigate]);

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
          <CardTitle className="text-3xl font-bold mb-4 flex items-center justify-center gap-2">
            <MessageCircle className="h-8 w-8 text-purple-700" /> Discussion Time!
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-lg mb-6">
            Players, discuss among yourselves. Try to figure out who the sus players are!
          </p>
          {/* Removed the line mentioning the main word */}

          <div className="mb-8 flex flex-col gap-4">
            <Timer initialTime={gameState.discussionDuration} onTimeUp={handleEndDiscussion} />
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
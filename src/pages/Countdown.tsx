import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import CountdownTimer from "@/components/CountdownTimer";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface GameStateData {
  numPlayers: number;
  playerNames: string[];
  numSusPlayers: number;
  topic?: string;
}

const Countdown = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const gameState = location.state as GameStateData;

  useEffect(() => {
    if (!gameState || !gameState.playerNames || gameState.playerNames.length === 0) {
      toast.error("Game data not found. Please set up the game again.");
      navigate("/setup");
    }
  }, [gameState, navigate]);

  const handleCountdownEnd = () => {
    if (gameState) {
      toast.info("Starting word reveal!");
      navigate("/name-reveal", { state: gameState });
    }
  };

  if (!gameState) {
    return null; // Or a loading spinner
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-500 via-purple-500 to-yellow-500 text-white p-4">
      <Card className="w-full max-w-md bg-white p-8 rounded-2xl shadow-2xl text-gray-800 text-center border border-gray-200">
        <CardHeader>
          <CardTitle className="text-3xl font-bold mb-4 text-purple-700">
            Round Starting In...
          </CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center items-center h-48">
          <CountdownTimer initialCount={3} onCountdownEnd={handleCountdownEnd} />
        </CardContent>
      </Card>
    </div>
  );
};

export default Countdown;
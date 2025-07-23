import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

interface GameSetupData {
  numPlayers: number;
  playerNames: string[];
  numSusPlayers: number;
  topic?: string;
}

const Countdown = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const gameData = location.state as GameSetupData;

  const [countdown, setCountdown] = useState<number | string>(3);
  const [showGo, setShowGo] = useState(false);
  const [countdownStarted, setCountdownStarted] = useState(false);

  useEffect(() => {
    if (!gameData || !gameData.playerNames || gameData.playerNames.length === 0) {
      toast.error("Game data not found. Please set up the game again.");
      navigate("/setup");
      return;
    }

    if (countdownStarted) {
      if (countdown === 0) {
        setShowGo(true);
        const timer = setTimeout(() => {
          navigate("/name-reveal", { state: gameData });
        }, 1000); // Show "Go!" for 1 second before navigating
        return () => clearTimeout(timer);
      }

      const timer = setTimeout(() => {
        setCountdown((prev) => (typeof prev === 'number' ? prev - 1 : prev));
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [countdown, countdownStarted, gameData, navigate]);

  const handleStartCountdown = () => {
    setCountdownStarted(true);
  };

  if (!gameData) {
    return null; // Or a loading spinner
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-500 via-purple-500 to-yellow-500 text-white p-4">
      <Card className="w-full max-w-md bg-white p-8 rounded-2xl shadow-2xl text-gray-800 text-center border border-gray-200">
        <CardHeader>
          <CardTitle className="text-3xl font-bold mb-4">Get Ready!</CardTitle>
        </CardHeader>
        <CardContent>
          {!countdownStarted ? (
            <>
              <p className="text-lg mb-6">
                Click "Start Round" to begin the game.
              </p>
              <Button
                onClick={handleStartCountdown}
                className="w-full bg-purple-700 text-white hover:bg-purple-800 text-lg py-4 rounded-md shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105"
              >
                Start Round
              </Button>
            </>
          ) : (
            <div className="text-8xl font-extrabold text-purple-700 animate-pulse">
              {showGo ? "Go!" : countdown}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Countdown;
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageCircle } from "lucide-react";
import { loadGameState, saveGameState } from "@/utils/localStorage";
import Timer from "@/components/Timer";
import CircularProgress from "@/components/CircularProgress"; // Import CircularProgress

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
  const [showIntroTimer, setShowIntroTimer] = useState(true); // State to control initial countdown
  const [introTimerDone, setIntroTimerDone] = useState(false); // State to control content visibility after intro timer
  const [discussionTimeLeft, setDiscussionTimeLeft] = useState(90); // 90 seconds for discussion
  const [discussionActive, setDiscussionActive] = useState(false); // State to control discussion timer

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

  const handleIntroTimerComplete = () => {
    setShowIntroTimer(false);
    setIntroTimerDone(true);
    setDiscussionActive(true); // Start discussion timer after intro
  };

  const handleDiscussionTimerTick = (timeLeft: number) => {
    setDiscussionTimeLeft(timeLeft);
  };

  const handleDiscussionTimerComplete = () => {
    setDiscussionActive(false);
    handleEndDiscussion(); // Automatically end discussion and navigate
  };

  if (!gameState) {
    return null; // Or a loading spinner
  }

  // Calculate progress for CircularProgress (value from 0 to 100)
  const progressValue = (discussionTimeLeft / 90) * 100;

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-500 via-purple-500 to-yellow-500 text-white p-4"
    >
      <Card className="w-full max-w-md bg-white p-6 sm:p-8 rounded-2xl shadow-2xl text-gray-800 text-center border border-gray-200">
        {showIntroTimer ? (
          <div className="flex flex-col items-center justify-center h-64">
            <h2 className="text-2xl md:text-3xl font-bold mb-4 text-purple-800">Discussion Starts In...</h2>
            <Timer initialTime={3} onTimeUp={handleIntroTimerComplete} />
            <p className="mt-4 text-base md:text-lg text-gray-600">Get ready to accuse!</p>
          </div>
        ) : (
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

              {discussionActive && (
                <div className="relative flex items-center justify-center w-40 h-40 mx-auto mb-8">
                  <CircularProgress value={progressValue} size={160} strokeWidth={10} />
                  <div className="absolute text-5xl font-extrabold text-purple-700">
                    {discussionTimeLeft}
                  </div>
                  {/* This Timer component is hidden and only used to drive the countdown logic */}
                  <Timer
                    key={discussionTimeLeft} // Key to force re-render and animation
                    initialTime={discussionTimeLeft}
                    onTimeUp={handleDiscussionTimerComplete}
                    onTick={handleDiscussionTimerTick}
                    // Hide the Timer's own display as CircularProgress shows the time
                    className="hidden"
                  />
                </div>
              )}

              <Button
                onClick={handleEndDiscussion}
                className="w-full bg-purple-700 text-white hover:bg-purple-800 text-base md:text-lg py-4 rounded-md transition-all duration-300 ease-in-out transform hover:scale-105 text-wrap"
              >
                Reveal Results
              </Button>
            </CardContent>
          </>
        )}
      </Card>
    </div>
  );
};

export default Discussion;
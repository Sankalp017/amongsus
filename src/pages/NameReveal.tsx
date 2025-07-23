import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { speakText } from "@/utils/tts";
import { PlayerRole } from "@/lib/words";
import { toast } from "sonner";

interface GameState {
  players: PlayerRole[];
  mainWord: string;
  susWord: string;
}

const NameReveal = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const gameState = location.state as GameState;

  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [showWord, setShowWord] = useState(false);
  const [timer, setTimer] = useState(5);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!gameState || !gameState.players || gameState.players.length === 0) {
      toast.error("Game state not found. Please set up the game again.");
      navigate("/setup");
      return;
    }
    // Initial call for the first player
    handlePlayerTurn();
  }, [gameState, navigate]);

  useEffect(() => {
    if (showWord && timer > 0) {
      timerRef.current = setTimeout(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (showWord && timer === 0) {
      // Timer finished, hide word
      setShowWord(false);
      if (timerRef.current) clearTimeout(timerRef.current);
      setTimer(5); // Reset timer for next player
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [showWord, timer]);

  const handlePlayerTurn = () => {
    if (currentPlayerIndex < gameState.players.length) {
      const player = gameState.players[currentPlayerIndex];
      speakText(`It's ${player.name}'s turn`);
      setShowWord(false); // Ensure word is hidden for new player
      setTimer(5); // Reset timer
    } else {
      // All players have seen their words
      toast.info("All players have seen their words. Starting discussion!");
      // TODO: Navigate to Discussion Phase
      navigate("/"); // For now, navigate back to home
    }
  };

  const handleTapToReveal = () => {
    setShowWord(true);
    setTimer(5); // Start timer
  };

  const handleNextPlayer = () => {
    setCurrentPlayerIndex((prevIndex) => prevIndex + 1);
    // This will trigger the useEffect to call handlePlayerTurn for the next player
  };

  if (!gameState || !gameState.players || gameState.players.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 via-purple-500 to-yellow-500 text-white p-4">
        <p className="text-xl">Loading game data or redirecting...</p>
      </div>
    );
  }

  const currentPlayer = gameState.players[currentPlayerIndex];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-500 via-purple-500 to-yellow-500 text-white p-4">
      <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-xl text-gray-800 text-center">
        {currentPlayer ? (
          <>
            {!showWord ? (
              <>
                <h2 className="text-4xl font-bold mb-4">
                  It's <span className="text-purple-700">{currentPlayer.name}</span>'s turn!
                </h2>
                <p className="text-lg mb-8">Tap the button to reveal your word.</p>
                <Button
                  onClick={handleTapToReveal}
                  className="bg-purple-700 text-white hover:bg-purple-800 text-xl px-8 py-6 rounded-md shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105"
                >
                  Tap to Reveal Word
                </Button>
              </>
            ) : (
              <>
                <h2 className="text-4xl font-bold mb-4">Your Word Is:</h2>
                <div className="bg-gray-100 p-8 rounded-lg mb-6 shadow-inner">
                  <p className="text-5xl font-extrabold text-purple-700 uppercase tracking-wider">
                    {currentPlayer.word}
                  </p>
                </div>
                <p className="text-lg mb-4">Time remaining: {timer}s</p>
                {timer === 0 && (
                  <Button
                    onClick={handleNextPlayer}
                    className="bg-blue-600 text-white hover:bg-blue-700 text-xl px-8 py-6 rounded-md shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105"
                  >
                    Next Player
                  </Button>
                )}
              </>
            )}
          </>
        ) : (
          <p className="text-xl">Preparing for the next phase...</p>
        )}
      </div>
    </div>
  );
};

export default NameReveal;
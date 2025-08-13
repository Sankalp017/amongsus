import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, UserX, Users, Play, RotateCw } from "lucide-react";
import { loadGameState, clearGameState, saveGameState } from "@/utils/localStorage";
import ReactConfetti from "react-confetti";

interface GameStateData {
  numPlayers: number;
  playerNames: string[];
  numSusPlayers: number;
  topic: string;
  topics: string[];
  mainWord: string;
  susWord: string;
  susPlayerIndices: number[];
  roundsSinceImposter: number[];
  currentRound: number;
}

const Results = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const initialGameState = location.state?.gameState as GameStateData;
  const [gameState, setGameState] = useState<GameStateData | null>(null);
  const [showConfetti, setShowConfetti] = useState(true);
  const [windowSize, setWindowSize] = useState({ width: window.innerWidth, height: window.innerHeight });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowConfetti(false);
    }, 12000);
    return () => clearTimeout(timer);
  }, []);

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
    if (loadedState && !loadedState.roundsSinceImposter) {
      loadedState.roundsSinceImposter = new Array(loadedState.numPlayers).fill(0);
    }
    if (loadedState && !loadedState.currentRound) {
      loadedState.currentRound = 1;
    }
    setGameState(loadedState);
    if (loadedState) {
      saveGameState(loadedState);
    }
  }, [initialGameState, navigate]);

  if (!gameState) {
    return null;
  }

  const handleNewGame = () => {
    clearGameState();
    navigate("/");
  };

  const handlePlayNextRound = () => {
    if (!gameState) return;

    const nextRoundNumber = (gameState.currentRound || 0) + 1;

    const nextRoundSetup = {
      numPlayers: gameState.numPlayers,
      playerNames: gameState.playerNames,
      numSusPlayers: gameState.numSusPlayers,
      topics: gameState.topics,
      previousTopic: gameState.topic,
      roundsSinceImposter: gameState.roundsSinceImposter,
      currentRound: nextRoundNumber,
    };
    clearGameState();
    navigate("/name-reveal", { state: nextRoundSetup });
  };

  const imposters = gameState.susPlayerIndices.map(index => gameState.playerNames[index]);
  const innocents = gameState.playerNames.filter((_, index) => !gameState.susPlayerIndices.includes(index));

  return (
    <div
      className="min-h-screen w-full flex flex-col items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 text-white p-4 overflow-hidden"
    >
      <ReactConfetti
        width={windowSize.width}
        height={windowSize.height}
        recycle={showConfetti}
        numberOfPieces={showConfetti ? 200 : 0}
        gravity={0.1}
      />
      <Card className="w-full max-w-lg bg-white/90 backdrop-blur-sm p-6 sm:p-8 rounded-3xl shadow-2xl text-gray-800 text-center border border-white/20">
        <CardContent className="p-0">
          <h1 className="text-4xl md:text-5xl font-bold mb-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-transparent bg-clip-text">
            The Truth is Out!
          </h1>
          <p className="text-base md:text-lg mb-8 text-gray-600">
            Here's the final reveal for this round.
          </p>

          <div className="space-y-5 mb-8 text-left">
            <div className="bg-purple-50 p-4 rounded-xl border border-purple-200">
              <h4 className="text-lg md:text-xl font-bold mb-2 flex items-center gap-2 text-purple-800">
                <BookOpen className="h-5 w-5 md:h-6 md:w-6 text-purple-700" /> The Words
              </h4>
              <p className="text-base md:text-lg ml-1">Main Word: <span className="font-semibold text-purple-700">{gameState.mainWord}</span></p>
              <p className="text-base md:text-lg ml-1">Sus Word: <span className="font-semibold text-purple-700">{gameState.susWord}</span></p>
            </div>

            <div className="bg-red-50 p-4 rounded-xl border border-red-200">
              <h4 className="text-lg md:text-xl font-bold mb-3 flex items-center gap-2 text-red-800">
                <UserX className="h-5 w-5 md:h-6 md:w-6 text-red-600" /> Imposter{imposters.length !== 1 && 's'}
              </h4>
              <div className="flex flex-wrap justify-start gap-3 ml-1">
                {imposters.length > 0 ? (
                  imposters.map((name, index) => (
                    <Badge key={index} variant="destructive" className="text-sm md:text-base px-4 py-2 bg-red-600 text-white rounded-full shadow-md">
                      {name}
                    </Badge>
                  ))
                ) : (
                  <p className="text-base md:text-lg text-gray-600">No imposters were assigned.</p>
                )}
              </div>
            </div>

            <div className="bg-green-50 p-4 rounded-xl border border-green-200">
              <h4 className="text-lg md:text-xl font-bold mb-3 flex items-center gap-2 text-green-800">
                <Users className="h-5 w-5 md:h-6 w-6 text-green-600" /> Innocent{innocents.length !== 1 && 's'}
              </h4>
              <div className="flex flex-wrap justify-start gap-3 ml-1">
                {innocents.map((name, index) => (
                  <Badge key={index} variant="secondary" className="text-sm md:text-base px-4 py-2 bg-green-100 text-green-800 hover:bg-green-200 rounded-full shadow-md">
                    {name}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-col space-y-4 mt-8">
            <Button
              onClick={handlePlayNextRound}
              className="w-full bg-purple-700 text-white hover:bg-purple-800 text-base md:text-lg py-6 rounded-xl transition-all duration-300 ease-in-out transform hover:scale-105 shadow-lg flex items-center justify-center gap-2"
            >
              <Play className="h-5 w-5" />
              Play Next Round
            </Button>
            <Button
              onClick={handleNewGame}
              variant="outline"
              className="w-full bg-transparent border-2 border-purple-700 text-purple-700 hover:bg-purple-700 hover:text-white text-base md:text-lg py-6 rounded-xl transition-all duration-300 ease-in-out transform hover:scale-105 flex items-center justify-center gap-2"
            >
              <RotateCw className="h-5 w-5" />
              Start a New Game
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Results;
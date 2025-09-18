import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, UserX, Users, Play, RotateCw, Settings } from "lucide-react";
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

  const handleModifyGame = () => {
    if (!gameState) return;
    toast.info("Loading game settings to modify...");
    navigate("/setup", { state: { ...gameState, isModification: true } });
  };

  const imposters = gameState.susPlayerIndices.map(index => gameState.playerNames[index]);
  const innocents = gameState.playerNames.filter((_, index) => !gameState.susPlayerIndices.includes(index));

  return (
    <div
      className="min-h-screen w-full flex flex-col items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 dark:bg-gradient-to-br dark:from-slate-900 dark:via-indigo-950 dark:to-slate-900 text-white p-4 overflow-hidden"
    >
      <ReactConfetti
        width={windowSize.width}
        height={windowSize.height}
        recycle={showConfetti}
        numberOfPieces={showConfetti ? 200 : 0}
        gravity={0.1}
      />
      <Card className="w-full max-w-lg bg-card p-6 sm:p-8 rounded-3xl shadow-2xl text-card-foreground text-center">
        <CardContent className="p-0">
          <h1 className="text-4xl md:text-5xl font-bold mb-2 bg-gradient-to-r from-purple-600 to-indigo-600 dark:from-purple-400 dark:to-indigo-400 text-transparent bg-clip-text">
            The Truth is Out!
          </h1>
          <p className="text-base md:text-lg mb-8 text-muted-foreground">
            Here's the final reveal for this round.
          </p>

          <div className="space-y-6 mb-8 text-left">
            <section aria-labelledby="words-heading" className="p-4 rounded-xl border border-border bg-muted/50">
              <h2 id="words-heading" className="text-lg md:text-xl font-bold mb-2 flex items-center gap-2 text-foreground">
                <BookOpen className="h-5 w-5 md:h-6 md:w-6 text-purple-700 dark:text-purple-400" aria-hidden="true" /> The Words
              </h2>
              <p className="text-base md:text-lg ml-1">Main Word: <span className="font-semibold text-purple-700 dark:text-purple-400">{gameState.mainWord}</span></p>
              <p className="text-base md:text-lg ml-1">Sus Word: <span className="font-semibold text-purple-700 dark:text-purple-400">{gameState.susWord}</span></p>
            </section>

            <section aria-labelledby="imposters-heading" className="p-4 rounded-xl border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-900/20">
              <h2 id="imposters-heading" className="text-lg md:text-xl font-bold mb-3 flex items-center gap-2 text-red-800 dark:text-red-300">
                <UserX className="h-5 w-5 md:h-6 md:w-6 text-red-600 dark:text-red-400" aria-hidden="true" /> Imposter{imposters.length !== 1 && 's'}
              </h2>
              <p className="sr-only">There {imposters.length === 1 ? 'is' : 'are'} {imposters.length} imposter{imposters.length !== 1 && 's'}.</p>
              <div className="flex flex-wrap justify-start gap-3 ml-1">
                {imposters.length > 0 ? (
                  imposters.map((name, index) => (
                    <Badge key={index} variant="destructive" className="text-sm md:text-base px-4 py-2 bg-red-600 text-white rounded-full shadow-md">
                      {name}
                    </Badge>
                  ))
                ) : (
                  <p className="text-base md:text-lg text-muted-foreground">No imposters were assigned.</p>
                )}
              </div>
            </section>

            <section aria-labelledby="innocents-heading" className="p-4 rounded-xl border border-green-200 dark:border-green-900/50 bg-green-50 dark:bg-green-900/20">
              <h2 id="innocents-heading" className="text-lg md:text-xl font-bold mb-3 flex items-center gap-2 text-green-800 dark:text-green-300">
                <Users className="h-5 w-5 md:h-6 w-6 text-green-600 dark:text-green-400" aria-hidden="true" /> Innocent{innocents.length !== 1 && 's'}
              </h2>
              <p className="sr-only">There are {innocents.length} innocents.</p>
              <div className="flex flex-wrap justify-start gap-3 ml-1">
                {innocents.map((name, index) => (
                  <Badge key={index} variant="secondary" className="text-sm md:text-base px-4 py-2 bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900/80 dark:text-green-200 dark:hover:bg-green-800 rounded-full shadow-md">
                    {name}
                  </Badge>
                ))}
              </div>
            </section>
          </div>

          <div className="flex flex-col space-y-3 mt-8">
            <Button
              onClick={handlePlayNextRound}
              className="w-full bg-purple-700 text-white hover:bg-purple-800 dark:bg-purple-600 dark:hover:bg-purple-700 text-base md:text-lg py-6 rounded-xl transition-all duration-300 ease-in-out transform hover:scale-105 shadow-lg flex items-center justify-center gap-2"
            >
              <Play className="h-5 w-5" aria-hidden="true" />
              Play Next Round
            </Button>
            <Button
              onClick={handleModifyGame}
              variant="outline"
              className="w-full bg-transparent border-2 border-gray-500 text-gray-700 hover:bg-gray-700 hover:text-white dark:border-gray-400 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white text-base md:text-lg py-6 rounded-xl transition-all duration-300 ease-in-out transform hover:scale-105 flex items-center justify-center gap-2"
            >
              <Settings className="h-5 w-5" aria-hidden="true" />
              Modify Game
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Results;
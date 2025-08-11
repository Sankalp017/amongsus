import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { getWordsForTopic } from "@/utils/words";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { saveGameState, loadGameState } from "@/utils/localStorage";
import Timer from "@/components/Timer";
import { shuffleArray } from "@/utils/arrayUtils"; // Import the new shuffle utility

interface GameSetupData {
  numPlayers: number;
  playerNames: string[];
  numSusPlayers: number;
  topics: string[];
  previousTopic?: string;
  previousSusPlayerIndices?: number[];
  playerDroughts?: number[]; // Added this
}

interface GameStateData extends GameSetupData {
  mainWord: string;
  susWord: string;
  susPlayerIndices: number[];
  topic: string; // The single topic chosen for this round
  playerDroughts: number[]; // Make non-optional for full game state
}

const NameReveal = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const initialGameData = location.state as GameSetupData;

  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [currentWord, setCurrentWord] = useState("");
  const [isSusPlayer, setIsSusPlayer] = useState(false);
  const [susPlayerIndices, setSusPlayerIndices] = useState<number[]>([]);
  const [mainWord, setMainWord] = useState("");
  const [susWord, setSusWord] = useState("");
  const [gameData, setGameData] = useState<GameSetupData | null>(null);
  const [voicesLoaded, setVoicesLoaded] = useState(false);
  const [showTimer, setShowTimer] = useState(true);
  const [timerDone, setTimerDone] = useState(false);
  const [showWord, setShowWord] = useState(false);
  const [ttsWarningShown, setTtsWarningShown] = useState(false);

  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  const speak = (text: string) => {
    if (!voicesLoaded) {
      console.warn("Speech voices not yet loaded. Skipping announcement.");
      return;
    }
    if ("speechSynthesis" in window) {
      speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "en-US";
      const voices = speechSynthesis.getVoices();
      
      const preferredVoices = [
        "Google US English",
        "Samantha",
        "Alex",
        "Tessa",
        "Microsoft Zira - English (United States)",
      ];

      let selectedVoice = null;

      for (const name of preferredVoices) {
        const found = voices.find(v => v.name === name && v.lang.startsWith("en-"));
        if (found) {
          selectedVoice = found;
          break;
        }
      }

      if (!selectedVoice) {
        selectedVoice = voices.find(v => v.lang === "en-US" && v.name.includes("Female"));
      }

      if (!selectedVoice) {
        selectedVoice = voices.find(v => v.lang === "en-US");
      }
      
      if (selectedVoice) {
        utterance.voice = selectedVoice;
      }

      speechSynthesis.speak(utterance);
      utteranceRef.current = utterance;
    }
  };

  useEffect(() => {
    if (!("speechSynthesis" in window)) {
      return;
    }

    const handleVoicesChanged = () => {
      if (speechSynthesis.getVoices().length > 0) {
        setVoicesLoaded(true);
      }
    };

    handleVoicesChanged();
    speechSynthesis.addEventListener("voiceschanged", handleVoicesChanged);

    const warningTimeout = setTimeout(() => {
      if (speechSynthesis.getVoices().length === 0 && !ttsWarningShown) {
        toast.info("Voice announcements may not work in this browser.", {
          duration: 10000,
          description: "For the best experience, use Chrome, Safari, or Brave. The game is still fully playable without sound.",
        });
        setTtsWarningShown(true);
      }
    }, 2500);

    return () => {
      speechSynthesis.removeEventListener("voiceschanged", handleVoicesChanged);
      clearTimeout(warningTimeout);
      if (utteranceRef.current) {
        speechSynthesis.cancel();
      }
    };
  }, [ttsWarningShown]);

  useEffect(() => {
    let loadedGameState: GameStateData | GameSetupData | undefined = initialGameData;

    if (!loadedGameState || !loadedGameState.playerNames || loadedGameState.playerNames.length === 0) {
      loadedGameState = loadGameState();
      if (!loadedGameState || !loadedGameState.playerNames || loadedGameState.playerNames.length === 0) {
        toast.error("Game data not found. Please set up the game again.");
        return;
      }
    }

    setGameData(loadedGameState as GameSetupData);

    const isNewGame = !(loadedGameState as GameStateData).mainWord || !(loadedGameState as GameStateData).susPlayerIndices;

    if (isNewGame) {
      const setupData = loadedGameState as GameSetupData;
      const previousSusPlayerIndices = setupData.previousSusPlayerIndices || [];
      const playerDroughts = setupData.playerDroughts || new Array(setupData.numPlayers).fill(0); // Use received droughts or initialize

      let availableTopics = setupData.topics;
      if (!availableTopics || availableTopics.length === 0) {
          availableTopics = ["🎲 Random words"];
      }

      if (setupData.previousTopic && availableTopics.length > 1) {
          const filteredTopics = availableTopics.filter(t => t !== setupData.previousTopic);
          if (filteredTopics.length > 0) {
              availableTopics = filteredTopics;
          }
      }

      const selectedTopicForRound = availableTopics[Math.floor(Math.random() * availableTopics.length)];

      const { mainWord: generatedMainWord, susWord: generatedSusWord } = getWordsForTopic(
        selectedTopicForRound,
        setupData.numSusPlayers
      );
      setMainWord(generatedMainWord);
      setSusWord(generatedSusWord);

      // Imposter selection logic with pity timer and max 1 repeat
      let finalSusPlayerIndices: number[] = [];
      const allPlayerIndices = Array.from({ length: setupData.numPlayers }, (_, i) => i);

      const PITY_THRESHOLD = 3; // After 3 rounds of being innocent, player gets a higher chance

      const duePlayers = allPlayerIndices.filter(i => playerDroughts[i] >= PITY_THRESHOLD);
      const nonDuePlayers = allPlayerIndices.filter(i => playerDroughts[i] < PITY_THRESHOLD);

      let attempts = 0;
      const MAX_ATTEMPTS = 100; // Max attempts to find an ideal set

      while (attempts < MAX_ATTEMPTS) {
          let currentCandidateSusIndices: number[] = [];
          let tempAvailablePlayers = [...allPlayerIndices]; // Pool to draw from

          // Prioritize picking "due" players first, then fill with others
          const shuffledDuePlayers = shuffleArray(duePlayers);
          const shuffledNonDuePlayers = shuffleArray(nonDuePlayers);

          // Try to pick due players first
          for (const playerIdx of shuffledDuePlayers) {
              if (currentCandidateSusIndices.length < setupData.numSusPlayers) {
                  currentCandidateSusIndices.push(playerIdx);
                  tempAvailablePlayers = tempAvailablePlayers.filter(p => p !== playerIdx);
              } else {
                  break;
              }
          }

          // Fill remaining slots with non-due players
          for (const playerIdx of shuffledNonDuePlayers) {
              if (currentCandidateSusIndices.length < setupData.numSusPlayers && !currentCandidateSusIndices.includes(playerIdx)) {
                  currentCandidateSusIndices.push(playerIdx);
                  tempAvailablePlayers = tempAvailablePlayers.filter(p => p !== playerIdx);
              } else if (currentCandidateSusIndices.length >= setupData.numSusPlayers) {
                  break;
              }
          }

          // Ensure we have exactly numSusPlayers (should be guaranteed if numPlayers >= numSusPlayers)
          while (currentCandidateSusIndices.length < setupData.numSusPlayers) {
              const randomIndex = Math.floor(Math.random() * tempAvailablePlayers.length);
              currentCandidateSusIndices.push(tempAvailablePlayers[randomIndex]);
              tempAvailablePlayers.splice(randomIndex, 1); // Remove to avoid duplicates
          }

          // Check overlap with previous imposters
          const overlapCount = currentCandidateSusIndices.filter(index =>
              previousSusPlayerIndices.includes(index)
          ).length;

          // Check if at least one "due" player was picked, if there are any "due" players
          const atLeastOneDuePicked = duePlayers.length === 0 || currentCandidateSusIndices.some(idx => duePlayers.includes(idx));

          // Acceptance criteria:
          // 1. Overlap is 0 or 1.
          // 2. If there are "due" players, at least one was picked.
          if (overlapCount < 2 && atLeastOneDuePicked) {
              finalSusPlayerIndices = currentCandidateSusIndices;
              break;
          }

          // If we couldn't meet the ideal criteria, check if it's even possible to get overlap < 2
          const numNonPreviousImposters = allPlayerIndices.filter(index => !previousSusPlayerIndices.includes(index)).length;
          const canAchieveLowOverlap = numNonPreviousImposters >= (setupData.numSusPlayers - 1);

          if (overlapCount >= 2 && !canAchieveLowOverlap) {
              // If overlap is 2+ AND it's impossible to get less overlap, accept this set
              finalSusPlayerIndices = currentCandidateSusIndices;
              break;
          }

          attempts++;
      }

      // Final fallback if MAX_ATTEMPTS reached without finding an ideal set
      if (finalSusPlayerIndices.length === 0) {
          finalSusPlayerIndices = shuffleArray(allPlayerIndices).slice(0, setupData.numSusPlayers);
      }

      setSusPlayerIndices(finalSusPlayerIndices);

      // Save the full game state for the current round (including the selected topic and words)
      // playerDroughts are updated in Results.tsx for the *next* round, but we save the current state for page refreshes.
      saveGameState({
        ...setupData,
        topic: selectedTopicForRound,
        mainWord: generatedMainWord,
        susWord: generatedSusWord,
        susPlayerIndices: finalSusPlayerIndices,
        playerDroughts: playerDroughts, // Save the droughts that were used for this round's selection
      });
    } else { // This branch is for loading an existing game state (e.g., page refresh)
      const fullGameState = loadedGameState as GameStateData;
      setMainWord(fullGameState.mainWord);
      setSusWord(fullGameState.susWord);
      setSusPlayerIndices(fullGameState.susPlayerIndices);
      setGameData(fullGameState); // Ensure gameData is set for existing state
    }

    return () => {
      if (utteranceRef.current) {
        speechSynthesis.cancel();
      }
    };
  }, [initialGameData, navigate]);

  useEffect(() => {
    if (gameData && currentPlayerIndex < gameData.numPlayers && timerDone) {
      const playerIsSus = susPlayerIndices.includes(currentPlayerIndex);
      setIsSusPlayer(playerIsSus);
      setCurrentWord(playerIsSus ? susWord : mainWord);
      setShowWord(false);
    }
  }, [currentPlayerIndex, susPlayerIndices, mainWord, susWord, gameData, timerDone]);

  useEffect(() => {
    if (gameData && currentPlayerIndex < gameData.numPlayers && voicesLoaded && timerDone) {
      speak(`It's ${gameData.playerNames[currentPlayerIndex]}'s turn`);
    }
  }, [currentPlayerIndex, gameData, voicesLoaded, timerDone]);

  const handleRevealWord = () => {
    setShowWord(true);
    speak("Your word is");
  };

  const handleNextPlayer = () => {
    if (!gameData) return;

    const nextIndex = currentPlayerIndex + 1;
    if (nextIndex < gameData.numPlayers) {
      setCurrentPlayerIndex(nextIndex);
    } else {
      toast.success("All players have seen their words. Time to discuss!");
      const fullGameState: GameStateData = {
        ...gameData,
        mainWord,
        susWord,
        susPlayerIndices,
        topic: loadGameState().topic, // Ensure topic is correctly passed
        playerDroughts: gameData.playerDroughts || new Array(gameData.numPlayers).fill(0), // Ensure droughts are passed
      };
      saveGameState(fullGameState);
      navigate("/discussion", { state: fullGameState });
    }
  };

  const handleTimerComplete = () => {
    setShowTimer(false);
    setTimerDone(true);
  };

  if (!gameData || !gameData.playerNames || gameData.playerNames.length === 0) {
    return null;
  }

  const currentPlayerName = gameData.playerNames[currentPlayerIndex];

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-500 via-purple-500 to-yellow-500 text-white p-4"
    >
      <Card className="w-full max-w-md bg-white p-6 sm:p-8 rounded-2xl shadow-2xl text-gray-800 text-center border border-gray-200 relative">
        {showTimer ? (
          <div className="flex flex-col items-center justify-center h-64">
            <h2 className="text-2xl md:text-3xl font-bold mb-4 text-black animate-pulse-fast">Get Ready!</h2>
            <Timer initialTime={3} onTimeUp={handleTimerComplete} />
            <p className="mt-4 text-base md:text-lg text-gray-600">Word reveal starting soon...</p>
          </div>
        ) : (
          <>
            <h2 className="text-3xl md:text-4xl font-extrabold mb-4 text-purple-800">It's {currentPlayerName}'s Turn</h2>
            <p className="text-base md:text-lg mb-6 text-gray-600">Click the card to reveal your word.</p>

            <div
              onClick={handleRevealWord}
              className={`relative w-full h-64 rounded-3xl overflow-hidden flex flex-col items-center justify-center p-4 cursor-pointer transition-colors duration-300 ease-in-out mb-6
                ${showWord ? "bg-white text-gray-800 shadow-lg" : "bg-[#f5f5f7] hover:bg-[#e0e0e2]"}
              `}
            >
              {!showWord && (
                <span className="text-xl md:text-2xl font-bold text-gray-800 z-10">
                  Click to Reveal
                </span>
              )}
              {showWord && (
                <>
                  <Badge
                    variant={isSusPlayer ? "destructive" : "secondary"}
                    className={`text-lg md:text-xl px-4 py-2 mb-6 ${isSusPlayer ? "bg-red-600 text-white" : "bg-green-100 text-green-800"} animate-fade-in-pop`}
                  >
                    {isSusPlayer ? "Imposter" : "Innocent"}
                  </Badge>
                  <p className="text-4xl md:text-5xl font-medium text-black tracking-tighter leading-none animate-fade-in-pop">
                    {currentWord}
                  </p>
                </>
              )}
            </div>

            <Button
              onClick={handleNextPlayer}
              disabled={!showWord}
              className="w-full bg-purple-700 text-white hover:bg-purple-800 text-base md:text-lg py-4 rounded-xl transition-all duration-300 ease-in-out transform hover:scale-105"
            >
              {currentPlayerIndex === gameData.numPlayers - 1 ? "Start Discussion" : "Next Player"}
            </Button>
          </>
        )}
      </Card>
    </div>
  );
};

export default NameReveal;
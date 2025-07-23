import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { getWordsForTopic, wordCategories } from "@/utils/words"; // Import wordCategories
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { saveGameState, loadGameState } from "@/utils/localStorage";
import Timer from "@/components/Timer"; // Import the Timer component

interface GameSetupData {
  numPlayers: number;
  playerNames: string[];
  numSusPlayers: number;
  topic?: string;
  previousTopic?: string; // Added for new round logic
}

interface GameStateData extends GameSetupData {
  mainWord: string;
  susWord: string;
  susPlayerIndices: number[];
}

const NameReveal = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const initialGameData = location.state as GameSetupData;

  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [showWord, setShowWord] = useState(false);
  const [currentWord, setCurrentWord] = useState("");
  const [isSusPlayer, setIsSusPlayer] = useState(false);
  const [susPlayerIndices, setSusPlayerIndices] = useState<number[]>([]);
  const [mainWord, setMainWord] = useState("");
  const [susWord, setSusWord] = useState("");
  const [gameData, setGameData] = useState<GameSetupData | null>(null);
  const [voicesLoaded, setVoicesLoaded] = useState(false);
  const [showTimer, setShowTimer] = useState(true); // State to control timer visibility
  const [timerDone, setTimerDone] = useState(false); // State to control content visibility after timer

  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Generic speech function
  const speak = (text: string) => {
    if (!voicesLoaded) {
      console.warn("Speech voices not yet loaded. Skipping announcement.");
      return;
    }
    if ("speechSynthesis" in window) {
      speechSynthesis.cancel(); // Cancel any ongoing speech
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "en-US";
      const voices = speechSynthesis.getVoices();
      const femaleVoice = voices.find(
        (voice) => voice.lang === "en-US" && voice.name.includes("Female")
      );
      if (femaleVoice) {
        utterance.voice = femaleVoice;
      } else {
        const englishVoice = voices.find((voice) => voice.lang === "en-US");
        if (englishVoice) {
          utterance.voice = englishVoice;
        }
      }
      speechSynthesis.speak(utterance);
      utteranceRef.current = utterance;
    } else {
      toast.warning("Text-to-speech not supported in this browser. Please ensure your browser supports it and audio is enabled.");
    }
  };

  // Effect to load voices
  useEffect(() => {
    const checkAndSetVoices = () => {
      const voices = speechSynthesis.getVoices();
      if (voices.length > 0) {
        setVoicesLoaded(true);
        console.log("Speech voices loaded.");
      } else {
        setTimeout(checkAndSetVoices, 100);
      }
    };

    if ("speechSynthesis" in window) {
      checkAndSetVoices();
      speechSynthesis.addEventListener("voiceschanged", checkAndSetVoices);
    }

    return () => {
      if ("speechSynthesis" in window) {
        speechSynthesis.removeEventListener("voiceschanged", checkAndSetVoices);
      }
    };
  }, []);

  useEffect(() => {
    let loadedGameState: GameStateData | GameSetupData | undefined = initialGameData;

    if (!loadedGameState || !loadedGameState.playerNames || loadedGameState.playerNames.length === 0) {
      loadedGameState = loadGameState();
      if (!loadedGameState || !loadedGameState.playerNames || loadedGameState.playerNames.length === 0) {
        toast.error("Game data not found. Please set up the game again.");
        navigate("/setup");
        return;
      }
    }

    setGameData(loadedGameState);

    // Determine if it's a new game or a "next round"
    const isNewGame = !(loadedGameState as GameStateData).mainWord || !(loadedGameState as GameStateData).susPlayerIndices;

    if (isNewGame) {
      let selectedTopic = loadedGameState.topic || "Random words";
      if (loadedGameState.previousTopic) {
        // If it's a next round, try to pick a different topic
        const availableTopics = wordCategories.filter(cat => cat !== loadedGameState.previousTopic);
        if (availableTopics.length > 0) {
          selectedTopic = availableTopics[Math.floor(Math.random() * availableTopics.length)];
        } else {
          // Fallback if only one topic exists or all have been used
          selectedTopic = wordCategories[Math.floor(Math.random() * wordCategories.length)];
        }
      }

      const { mainWord: generatedMainWord, susWord: generatedSusWord } = getWordsForTopic(
        selectedTopic,
        loadedGameState.numSusPlayers
      );
      setMainWord(generatedMainWord);
      setSusWord(generatedSusWord);

      const allPlayerIndices = Array.from({ length: loadedGameState.numPlayers }, (_, i) => i);
      const shuffledIndices = allPlayerIndices.sort(() => 0.5 - Math.random());
      const selectedSusIndices = shuffledIndices.slice(0, loadedGameState.numSusPlayers);
      setSusPlayerIndices(selectedSusIndices);

      saveGameState({
        ...loadedGameState,
        topic: selectedTopic, // Save the chosen topic for this round
        mainWord: generatedMainWord,
        susWord: generatedSusWord,
        susPlayerIndices: selectedSusIndices,
      });
    } else {
      const fullGameState = loadedGameState as GameStateData;
      setMainWord(fullGameState.mainWord);
      setSusWord(fullGameState.susWord);
      setSusPlayerIndices(fullGameState.susPlayerIndices);
    }

    return () => {
      if (utteranceRef.current) {
        speechSynthesis.cancel();
      }
    };
  }, [initialGameData, navigate]);

  useEffect(() => {
    if (gameData && currentPlayerIndex < gameData.numPlayers && voicesLoaded && timerDone) {
      const playerIsSus = susPlayerIndices.includes(currentPlayerIndex);
      setIsSusPlayer(playerIsSus);
      setCurrentWord(playerIsSus ? susWord : mainWord);
      setShowWord(false); // Reset showWord for the new player
      speak(`It's ${gameData.playerNames[currentPlayerIndex]}'s turn`);
    }
  }, [currentPlayerIndex, susPlayerIndices, mainWord, susWord, gameData, voicesLoaded, timerDone]);

  const handleTapToReveal = () => {
    setShowWord(true);
    speak("Word revealed");
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
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-500 via-purple-500 to-yellow-500 text-white p-4">
      <Card className="w-full max-w-md bg-white p-6 sm:p-8 rounded-2xl shadow-2xl text-gray-800 text-center border border-gray-200">
        {showTimer ? (
          <div className="flex flex-col items-center justify-center h-64">
            <h2 className="text-2xl md:text-3xl font-bold mb-4 text-purple-800 animate-pulse-fast">Get Ready!</h2>
            <Timer initialTime={3} onTimeUp={handleTimerComplete} />
            <p className="mt-4 text-base md:text-lg text-gray-600">Word reveal starting soon...</p>
          </div>
        ) : (
          <>
            <h2 className="text-3xl md:text-4xl font-extrabold mb-4 text-purple-800">It's {currentPlayerName}'s Turn</h2>
            <p className="text-base md:text-lg mb-6 text-gray-600">Tap the card to reveal your word.</p>

            <CardContent
              onClick={!showWord ? handleTapToReveal : undefined}
              className={`relative w-full h-64 bg-white rounded-3xl flex items-center justify-center overflow-hidden p-4 mb-6 border border-gray-300 transform transition-all duration-300 ${!showWord ? 'cursor-pointer hover:scale-[1.01]' : ''}`}
            >
              {/* Overlay that animates away to reveal the word */}
              {!showWord && (
                <div className="absolute inset-0 bg-purple-100 rounded-3xl flex items-center justify-center">
                  <span className="text-xl md:text-2xl font-bold text-purple-700">
                    Tap to Reveal
                  </span>
                </div>
              )}

              {showWord && (
                <div className="flex flex-col items-center justify-center animate-fade-in-pop"> {/* Apply new animation here */}
                  <Badge
                    variant={isSusPlayer ? "destructive" : "secondary"}
                    className={`text-lg md:text-xl px-4 py-2 mb-6 ${isSusPlayer ? "bg-red-600 text-white" : "bg-green-100 text-green-800"}`}
                  >
                    {isSusPlayer ? "Imposter" : "Innocent"}
                  </Badge>
                  <p className="text-4xl md:text-5xl font-medium text-purple-700 tracking-tighter leading-none">
                    {currentWord}
                  </p>
                </div>
              )}
            </CardContent>

            <Button
              onClick={handleNextPlayer}
              disabled={!showWord}
              className="w-full bg-purple-700 text-white hover:bg-purple-800 text-base md:text-lg py-4 rounded-md transition-all duration-300 ease-in-out transform hover:scale-105"
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
import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { getWordsForTopic, wordCategories } from "@/utils/words";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { saveGameState, loadGameState } from "@/utils/localStorage";
import Timer from "@/components/Timer";

interface GameSetupData {
  numPlayers: number;
  playerNames: string[];
  numSusPlayers: number;
  topic?: string;
  previousTopic?: string;
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
  const [currentWord, setCurrentWord] = useState("");
  const [isSusPlayer, setIsSusPlayer] = useState(false);
  const [susPlayerIndices, setSusPlayerIndices] = useState<number[]>([]);
  const [mainWord, setMainWord] = useState("");
  const [susWord, setSusWord] = useState("");
  const [gameData, setGameData] = useState<GameSetupData | null>(null);
  const [voicesLoaded, setVoicesLoaded] = useState(false);
  const [showTimer, setShowTimer] = useState(true);
  const [timerDone, setTimerDone] = useState(false);
  const [showWord, setShowWord] = useState(false); // Re-introducing state for word visibility

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
      if (utteranceRef.current) {
        speechSynthesis.cancel();
      }
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

    const isNewGame = !(loadedGameState as GameStateData).mainWord || !(loadedGameState as GameStateData).susPlayerIndices;

    if (isNewGame) {
      let selectedTopic = loadedGameState.topic || "🎲 Random words"; // Updated default topic
      if (loadedGameState.previousTopic) {
        const availableTopics = wordCategories.filter(cat => cat !== loadedGameState.previousTopic);
        if (availableTopics.length > 0) {
          selectedTopic = availableTopics[Math.floor(Math.random() * availableTopics.length)];
        } else {
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
        topic: selectedTopic,
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
      setShowWord(false); // Reset word visibility for the new player
      speak(`It's ${gameData.playerNames[currentPlayerIndex]}'s turn`);
    }
  }, [currentPlayerIndex, susPlayerIndices, mainWord, susWord, gameData, voicesLoaded, timerDone]);

  const handleRevealWord = () => {
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
    <div
      className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-500 via-purple-500 to-yellow-500 text-white p-4"
    >
      <Card className="w-full max-w-md bg-white p-6 sm:p-8 rounded-2xl shadow-2xl text-gray-800 text-center border border-gray-200 relative">
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

            <div
              onClick={handleRevealWord}
              className={`relative w-full h-64 rounded-3xl overflow-hidden flex flex-col items-center justify-center p-4 cursor-pointer transition-colors duration-300 ease-in-out mb-6
                ${showWord ? "bg-white text-gray-800 shadow-lg" : "bg-[#f5f5f7] hover:bg-[#e0e0e2]"}
              `}
            >
              {!showWord && (
                <span className="text-xl md:text-2xl font-bold text-gray-800 z-10">
                  Tap to Reveal
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
                  <p className="text-4xl md:text-5xl font-medium text-purple-700 tracking-tighter leading-none animate-fade-in-pop">
                    {currentWord}
                  </p>
                </>
              )}
            </div>

            <Button
              onClick={handleNextPlayer}
              disabled={!showWord}
              className="w-full bg-purple-700 text-white hover:bg-purple-800 text-base md:text-lg py-4 rounded-xl transition-all duration-300 ease-in-out transform hover:scale-105" // Changed to rounded-xl
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
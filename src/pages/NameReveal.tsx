import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { getWordsForTopic } from "@/utils/words";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { saveGameState, loadGameState } from "@/utils/localStorage"; // Import localStorage utilities

interface GameSetupData {
  numPlayers: number;
  playerNames: string[];
  numSusPlayers: number;
  topic?: string;
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
  const [hasAnnouncedPlayerTurn, setHasAnnouncedPlayerTurn] = useState(false); // New state

  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Generic speech function
  const speak = (text: string, onEndCallback?: () => void) => {
    if (!voicesLoaded) {
      toast.warning("Speech voices are not ready. Please wait a moment or refresh.");
      if (onEndCallback) {
        onEndCallback(); // Call callback even if speech isn't supported
      }
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
      utterance.onend = () => {
        if (onEndCallback) {
          onEndCallback();
        }
      };
      speechSynthesis.speak(utterance);
      utteranceRef.current = utterance;
    } else {
      toast.warning("Text-to-speech not supported in this browser. Please ensure your browser supports it and audio is enabled.");
      if (onEndCallback) {
        onEndCallback(); // Call callback even if speech isn't supported
      }
    }
  };

  // Effect to load voices
  useEffect(() => {
    const handleVoicesChanged = () => {
      setVoicesLoaded(true);
      console.log("Speech voices loaded.");
    };

    if ("speechSynthesis" in window) {
      if (speechSynthesis.getVoices().length > 0) {
        setVoicesLoaded(true);
      } else {
        speechSynthesis.addEventListener("voiceschanged", handleVoicesChanged);
      }
    }

    return () => {
      if ("speechSynthesis" in window) {
        speechSynthesis.removeEventListener("voiceschanged", handleVoicesChanged);
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

    if ((loadedGameState as GameStateData).mainWord && (loadedGameState as GameStateData).susPlayerIndices) {
      const fullGameState = loadedGameState as GameStateData;
      setMainWord(fullGameState.mainWord);
      setSusWord(fullGameState.susWord);
      setSusPlayerIndices(fullGameState.susPlayerIndices);
    } else {
      const { mainWord: generatedMainWord, susWord: generatedSusWord } = getWordsForTopic(
        loadedGameState.topic || "Random words",
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
        mainWord: generatedMainWord,
        susWord: generatedSusWord,
        susPlayerIndices: selectedSusIndices,
      });
    }

    return () => {
      if (utteranceRef.current) {
        speechSynthesis.cancel();
      }
    };
  }, [initialGameData, navigate]);

  useEffect(() => {
    if (gameData && currentPlayerIndex < gameData.numPlayers) {
      const playerIsSus = susPlayerIndices.includes(currentPlayerIndex);
      setIsSusPlayer(playerIsSus);
      setCurrentWord(playerIsSus ? susWord : mainWord);
      setShowWord(false); // Reset showWord for the new player
      setHasAnnouncedPlayerTurn(false); // Reset announcement state for new player
    }
  }, [currentPlayerIndex, susPlayerIndices, mainWord, susWord, gameData]);

  const handleListenToName = () => {
    if (!gameData) return;
    const playerTurnText = `It's ${gameData.playerNames[currentPlayerIndex]}'s turn`;
    speak(playerTurnText, () => {
      setHasAnnouncedPlayerTurn(true); // Mark as announced after speech
    });
  };

  const handleTapToRevealWord = () => {
    if (!voicesLoaded) {
      toast.warning("Speech voices are not ready. Please wait a moment or refresh.");
      return;
    }
    if (!showWord && gameData) {
      const wordRevealText = "Word revealed";
      speak(wordRevealText);
      setShowWord(true); // Show the word immediately upon tap
    }
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

  if (!gameData || !gameData.playerNames || gameData.playerNames.length === 0) {
    return null;
  }

  const currentPlayerName = gameData.playerNames[currentPlayerIndex];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-500 via-purple-500 to-yellow-500 text-white p-4">
      <Card className="w-full max-w-md bg-white p-8 rounded-2xl shadow-2xl text-gray-800 text-center border border-gray-200">
        <h2 className="text-4xl font-extrabold mb-4 text-purple-800">It's {currentPlayerName}'s Turn</h2>
        <p className="text-lg mb-6 text-gray-600">
          {!hasAnnouncedPlayerTurn ? "Click below to hear whose turn it is." : "Tap the card to reveal your word."}
        </p>

        {!hasAnnouncedPlayerTurn ? (
          <Button
            onClick={handleListenToName}
            className="w-full bg-purple-700 text-white hover:bg-purple-800 text-lg py-4 rounded-md shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105 mb-6"
          >
            Listen to Name
          </Button>
        ) : (
          <CardContent
            onClick={!showWord ? handleTapToRevealWord : undefined}
            className={`relative w-full h-64 bg-white rounded-3xl flex items-center justify-center overflow-hidden p-4 mb-6 border border-gray-300 shadow-lg transform transition-all duration-300 ${!showWord ? 'cursor-pointer hover:scale-[1.01] hover:shadow-xl' : ''}`}
          >
            {showWord ? (
              <div className="flex flex-col items-center justify-center animate-fade-in">
                <Badge
                  variant={isSusPlayer ? "destructive" : "secondary"}
                  className={`text-xl px-4 py-2 mb-6 ${isSusPlayer ? "bg-red-600 text-white" : "bg-green-100 text-green-800"}`}
                >
                  {isSusPlayer ? "Imposter" : "Innocent"}
                </Badge>
                <p className="text-5xl font-medium text-purple-700 tracking-tighter leading-none">
                  {currentWord}
                </p>
              </div>
            ) : (
              <span className="text-2xl font-bold text-purple-700">
                Tap to Reveal
              </span>
            )}
          </CardContent>
        )}

        <Button
          onClick={handleNextPlayer}
          disabled={!showWord}
          className="w-full bg-blue-600 text-white hover:bg-blue-700 text-lg py-4 rounded-md shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105"
        >
          {currentPlayerIndex === gameData.numPlayers - 1 ? "Start Discussion" : "Next Player"}
        </Button>
      </Card>
    </div>
  );
};

export default NameReveal;
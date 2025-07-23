import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { getWordsForTopic } from "@/utils/words";

interface GameSetupData {
  numPlayers: number;
  playerNames: string[];
  numSusPlayers: number;
  topic?: string;
}

const NameReveal = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const gameData = location.state as GameSetupData;

  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [showWord, setShowWord] = useState(false);
  const [currentWord, setCurrentWord] = useState("");
  const [isSusPlayer, setIsSusPlayer] = useState(false);
  const [susPlayerIndices, setSusPlayerIndices] = useState<number[]>([]);
  const [mainWord, setMainWord] = useState("");
  const [susWord, setSusWord] = useState("");

  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    if (!gameData || !gameData.playerNames || gameData.playerNames.length === 0) {
      toast.error("Game data not found. Please set up the game again.");
      navigate("/setup");
      return;
    }

    // Generate words for the round
    const { mainWord: generatedMainWord, susWord: generatedSusWord } = getWordsForTopic(
      gameData.topic || "Random words",
      gameData.numSusPlayers
    );
    setMainWord(generatedMainWord);
    setSusWord(generatedSusWord);

    // Randomly assign sus players
    const allPlayerIndices = Array.from({ length: gameData.numPlayers }, (_, i) => i);
    const shuffledIndices = allPlayerIndices.sort(() => 0.5 - Math.random());
    const selectedSusIndices = shuffledIndices.slice(0, gameData.numSusPlayers);
    setSusPlayerIndices(selectedSusIndices);

    // Initial speak for the first player
    speakPlayerName(gameData.playerNames[0]);

    return () => {
      // Clean up speech synthesis if component unmounts
      if (utteranceRef.current) {
        speechSynthesis.cancel();
      }
    };
  }, [gameData, navigate]);

  useEffect(() => {
    if (currentPlayerIndex < gameData.numPlayers) {
      const playerIsSus = susPlayerIndices.includes(currentPlayerIndex);
      setIsSusPlayer(playerIsSus);
      setCurrentWord(playerIsSus ? susWord : mainWord);
    }
  }, [currentPlayerIndex, susPlayerIndices, mainWord, susWord, gameData.numPlayers]);

  const speakPlayerName = (name: string) => {
    if ("speechSynthesis" in window) {
      speechSynthesis.cancel(); // Stop any ongoing speech
      const utterance = new SpeechSynthesisUtterance(`It's ${name}'s turn`);
      utterance.lang = "en-US";
      // Try to find a female voice
      const voices = speechSynthesis.getVoices();
      const femaleVoice = voices.find(
        (voice) => voice.lang === "en-US" && voice.name.includes("Female")
      );
      if (femaleVoice) {
        utterance.voice = femaleVoice;
      } else {
        // Fallback to any available English voice
        const englishVoice = voices.find((voice) => voice.lang === "en-US");
        if (englishVoice) {
          utterance.voice = englishVoice;
        }
      }
      speechSynthesis.speak(utterance);
      utteranceRef.current = utterance;
    } else {
      toast.warning("Text-to-speech not supported in this browser.");
    }
  };

  const handleTapToReveal = () => {
    setShowWord(true);
    setTimeout(() => {
      setShowWord(false);
    }, 5000); // 5-second timer
  };

  const handleNextPlayer = () => {
    setShowWord(false); // Ensure word is hidden before moving to next player
    const nextIndex = currentPlayerIndex + 1;
    if (nextIndex < gameData.numPlayers) {
      setCurrentPlayerIndex(nextIndex);
      speakPlayerName(gameData.playerNames[nextIndex]);
    } else {
      // All players have seen their words, proceed to discussion phase
      toast.success("All players have seen their words. Time to discuss!");
      navigate("/discussion", { state: { ...gameData, mainWord, susWord, susPlayerIndices } });
    }
  };

  if (!gameData || !gameData.playerNames || gameData.playerNames.length === 0) {
    return null; // Or a loading spinner/error message
  }

  const currentPlayerName = gameData.playerNames[currentPlayerIndex];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-500 via-purple-500 to-yellow-500 text-white p-4">
      <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-xl text-gray-800 text-center">
        <h2 className="text-3xl font-bold mb-4">It's {currentPlayerName}'s Turn</h2>
        <p className="text-lg mb-6">Tap to reveal your word.</p>

        <div className="relative w-full h-48 bg-gray-200 rounded-lg flex items-center justify-center overflow-hidden mb-6">
          {showWord ? (
            <div className="flex flex-col items-center justify-center animate-fade-in">
              <p className="text-xl font-semibold mb-2">You are a:</p>
              <p className={`text-4xl font-extrabold ${isSusPlayer ? "text-red-600" : "text-green-600"} mb-4`}>
                {isSusPlayer ? "Sus Player" : "Crewmate"}
              </p>
              <p className="text-3xl font-bold text-purple-700">
                Your Word: {currentWord}
              </p>
            </div>
          ) : (
            <Button
              onClick={handleTapToReveal}
              className="bg-purple-700 text-white hover:bg-purple-800 text-xl px-8 py-4 rounded-full shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105"
            >
              Tap to Reveal
            </Button>
          )}
        </div>

        <Button
          onClick={handleNextPlayer}
          disabled={showWord} // Disable "Next Player" while word is visible
          className="w-full bg-blue-600 text-white hover:bg-blue-700 text-lg py-4 rounded-md shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105"
        >
          {currentPlayerIndex === gameData.numPlayers - 1 ? "Start Discussion" : "Next Player"}
        </Button>
      </div>
    </div>
  );
};

export default NameReveal;
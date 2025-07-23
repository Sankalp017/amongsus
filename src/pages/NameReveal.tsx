import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { getWordsForTopic } from "@/utils/words";
import { Card, CardContent } from "@/components/ui/card"; // Import Card components

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

    const { mainWord: generatedMainWord, susWord: generatedSusWord } = getWordsForTopic(
      gameData.topic || "Random words",
      gameData.numSusPlayers
    );
    setMainWord(generatedMainWord);
    setSusWord(generatedSusWord);

    const allPlayerIndices = Array.from({ length: gameData.numPlayers }, (_, i) => i);
    const shuffledIndices = allPlayerIndices.sort(() => 0.5 - Math.random());
    const selectedSusIndices = shuffledIndices.slice(0, gameData.numSusPlayers);
    setSusPlayerIndices(selectedSusIndices);

    return () => {
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
      setShowWord(false);
    }
  }, [currentPlayerIndex, susPlayerIndices, mainWord, susWord, gameData.numPlayers]);

  const speakPlayerName = (name: string) => {
    if ("speechSynthesis" in window) {
      speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(`It's ${name}'s turn`);
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

  const handleTapToReveal = () => {
    setShowWord(true);
    speakPlayerName(gameData.playerNames[currentPlayerIndex]);
  };

  const handleNextPlayer = () => {
    const nextIndex = currentPlayerIndex + 1;
    if (nextIndex < gameData.numPlayers) {
      setCurrentPlayerIndex(nextIndex);
      speakPlayerName(gameData.playerNames[nextIndex]);
    } else {
      toast.success("All players have seen their words. Time to discuss!");
      navigate("/discussion", { state: { ...gameData, mainWord, susWord, susPlayerIndices } });
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
        <p className="text-lg mb-6 text-gray-600">Tap the card to reveal your word.</p>

        <CardContent className="relative w-full h-64 bg-white rounded-3xl flex items-center justify-center overflow-hidden p-4 mb-6 border border-gray-300 shadow-lg transform transition-all duration-300 hover:scale-[1.01] cursor-pointer">
          {showWord ? (
            <div className="flex flex-col items-center justify-center animate-fade-in">
              <p className="text-xl font-semibold text-gray-700 mb-3">You are a:</p>
              <p className={`text-5xl font-extrabold ${isSusPlayer ? "text-red-600" : "text-green-600"} mb-6 tracking-tight`}>
                {isSusPlayer ? "Sus Player" : "Crewmate"}
              </p>
              <p className="text-6xl font-black text-purple-700 tracking-tighter leading-none">
                {currentWord}
              </p>
            </div>
          ) : (
            <Button
              onClick={handleTapToReveal}
              className="absolute inset-0 flex items-center justify-center bg-purple-700 text-white hover:bg-purple-800 text-2xl font-bold rounded-3xl shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105"
            >
              Tap to Reveal
            </Button>
          )}
        </CardContent>

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
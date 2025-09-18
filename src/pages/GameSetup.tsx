import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { toast } from "sonner";
import { wordTopics } from "@/utils/words";
import TopicSelector from "@/components/TopicSelector";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Users, UserX, BookOpen, Play } from "lucide-react";
import { saveGameState, loadGameState, clearGameState } from "@/utils/localStorage";

interface GameSetupState {
  numPlayers: number;
  playerNames: string[];
  numSusPlayers: number;
  topics: string[];
  isModification?: boolean;
}

const GameSetup = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const locationState = location.state as GameSetupState | undefined;

  const [numPlayers, setNumPlayers] = useState(3);
  const [playerNames, setPlayerNames] = useState<string[]>(Array(3).fill(""));
  const [numSusPlayers, setNumSusPlayers] = useState(1);
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [isModification, setIsModification] = useState(false);

  useEffect(() => {
    const loadedState = locationState || loadGameState();
    if (loadedState) {
      setNumPlayers(loadedState.numPlayers || 3);
      setPlayerNames(loadedState.playerNames || Array(loadedState.numPlayers || 3).fill(""));
      setNumSusPlayers(loadedState.numSusPlayers || 1);
      setSelectedTopics(loadedState.topics || []);
      setIsModification(loadedState.isModification || false);
    } else {
      clearGameState();
    }
  }, [locationState]);

  const handleNumPlayersChange = (value: number[]) => {
    const newNumPlayers = value[0];
    setNumPlayers(newNumPlayers);
    setPlayerNames((prev) => {
      const newPlayerNames = [...prev];
      if (newPlayerNames.length < newNumPlayers) {
        return [...newPlayerNames, ...Array(newNumPlayers - newPlayerNames.length).fill("")];
      }
      return newPlayerNames.slice(0, newNumPlayers);
    });
    if (numSusPlayers >= newNumPlayers) {
      setNumSusPlayers(Math.max(1, newNumPlayers - 1));
    }
  };

  const handlePlayerNameChange = (index: number, name: string) => {
    const newPlayerNames = [...playerNames];
    newPlayerNames[index] = name;
    setPlayerNames(newPlayerNames);
  };

  const handleNumSusPlayersChange = (value: number[]) => {
    setNumSusPlayers(value[0]);
  };

  const handleStartGame = () => {
    if (playerNames.some((name) => name.trim() === "")) {
      toast.error("Please enter all player names.");
      return;
    }
    if (selectedTopics.length === 0) {
      toast.error("Please select at least one topic.");
      return;
    }

    const gameState = {
      numPlayers,
      playerNames,
      numSusPlayers,
      topics: selectedTopics,
      currentRound: 1,
      roundsSinceImposter: new Array(numPlayers).fill(0),
    };
    saveGameState(gameState);
    navigate("/name-reveal", { state: gameState });
  };

  const handleGoBack = () => {
    navigate("/");
  };

  const topicOptions = Object.keys(wordTopics).map((key) => ({
    value: key,
    label: key,
    isNew: key === '📱 Apps',
  }));

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-50 to-gray-200 dark:bg-gradient-to-br dark:from-slate-900 dark:via-indigo-950 dark:to-slate-900 text-foreground p-4">
      <Card className="w-full max-w-2xl bg-card p-6 sm:p-8 rounded-2xl shadow-2xl border-border">
        <CardHeader className="relative flex items-center justify-center p-0 mb-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleGoBack}
            className="absolute left-0 text-muted-foreground hover:text-foreground rounded-xl"
          >
            <ArrowLeft className="h-6 w-6" />
          </Button>
          <CardTitle className="text-3xl md:text-4xl font-bold text-center">
            Game Setup
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-8">
          <div className="space-y-4">
            <Label htmlFor="numPlayers" className="text-lg font-semibold flex items-center gap-2">
              <Users className="h-5 w-5 text-purple-700 dark:text-purple-400" />
              Number of Players: {numPlayers}
            </Label>
            <Slider
              id="numPlayers"
              min={3}
              max={10}
              step={1}
              value={[numPlayers]}
              onValueChange={handleNumPlayersChange}
            />
          </div>

          <div className="space-y-4">
            <Label className="text-lg font-semibold">Player Names</Label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {playerNames.map((name, index) => (
                <Input
                  key={index}
                  type="text"
                  placeholder={`Player ${index + 1}`}
                  value={name}
                  onChange={(e) => handlePlayerNameChange(index, e.target.value)}
                  className="text-base"
                />
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <Label htmlFor="numSusPlayers" className="text-lg font-semibold flex items-center gap-2">
              <UserX className="h-5 w-5 text-red-600 dark:text-red-400" />
              Number of Imposters: {numSusPlayers}
            </Label>
            <Slider
              id="numSusPlayers"
              min={1}
              max={Math.max(1, numPlayers - 1)}
              step={1}
              value={[numSusPlayers]}
              onValueChange={handleNumSusPlayersChange}
            />
          </div>

          <div className="space-y-4">
            <Label className="text-lg font-semibold flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
              Topics
            </Label>
            <TopicSelector
              options={topicOptions}
              selected={selectedTopics}
              onChange={setSelectedTopics}
            />
          </div>

          <Button
            onClick={handleStartGame}
            className="w-full bg-purple-700 text-white hover:bg-purple-800 dark:bg-purple-600 dark:hover:bg-purple-700 text-lg py-6 rounded-xl transition-all duration-300 ease-in-out transform hover:scale-105 flex items-center justify-center gap-3"
          >
            <Play className="h-6 w-6" />
            {isModification ? "Update Game & Start" : "Start Game"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default GameSetup;
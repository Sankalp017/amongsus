import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft } from "lucide-react"; // Import ArrowLeft icon

const HowToPlay = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate("/");
  };

  const handleReadyToPlay = () => {
    navigate("/setup"); // Navigate to the setup page
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-500 via-purple-500 to-yellow-500 text-white p-4">
      <Card className="w-full max-w-2xl bg-white p-6 sm:p-8 rounded-2xl shadow-2xl text-gray-800 text-center border border-gray-200 relative">
        <Button
          variant="ghost"
          size="icon"
          onClick={handleGoBack}
          className="absolute top-4 left-4 text-gray-600 hover:text-purple-700"
        >
          <ArrowLeft className="h-6 w-6" />
        </Button>
        <CardHeader>
          <CardTitle className="text-2xl md:text-3xl font-bold mb-4">How to Play Among Sus</CardTitle>
        </CardHeader>
        <CardContent className="text-left space-y-4">
          <p className="text-base md:text-lg">
            Among Sus is a word-based social deduction game for <span className="font-bold">3+ players</span>, played on a single device.
            One or more players will be the "<span className="font-bold text-red-600">Imposters</span>" and will receive a slightly different word than the "<span className="font-bold text-green-600">Innocents</span>".
          </p>

          <Separator className="my-6 bg-gray-300" />

          <h3 className="text-xl md:text-2xl font-semibold mb-3 text-purple-700">Game Flow:</h3>
          <ol className="list-decimal list-inside space-y-3 text-base md:text-lg">
            <li>
              <span className="font-bold">Game Setup:</span> Enter player names and choose the number of imposters and a word topic.
            </li>
            <li>
              <span className="font-bold">Word Reveal (Offline Role Allocation):</span> This is a crucial phase! Each player will take turns. The game will announce whose turn it is using text-to-speech.
              <span className="font-bold text-purple-700"> Pass the device to the announced player.</span>
              Only the current player should look at the screen and tap to reveal their secret word.
              Innocents will see the main word, while Imposters will see a subtly different "sus word."
              The text-to-speech will also announce "Word revealed" to let everyone know the word has been seen.
              Players can then tap "Next Player" and pass the device to the next person.
            </li>
            <li>
              <span className="font-bold">Discussion Phase:</span> Once all players have seen their words, the discussion begins. All players discuss the word. Innocents try to identify the Imposter(s)
              by asking questions and listening for inconsistencies. Imposters must blend in and avoid revealing their different word.
              Be careful not to reveal the main word directly!
            </li>
            <li>
              <span className="font-bold">Results:</span> After the discussion, the game will reveal who the Imposters were and what the main and sus words were.
              This is your chance to see if your suspicions were correct!
            </li>
          </ol>
          <p className="text-base md:text-lg mt-6">
            Good luck, and try not to be too sus!
          </p>
          <Button
            onClick={handleReadyToPlay}
            className="w-full bg-purple-700 text-white hover:bg-purple-800 text-base md:text-lg py-4 rounded-md transition-all duration-300 ease-in-out transform hover:scale-105 mt-6"
          >
            Ready to Play?
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default HowToPlay;
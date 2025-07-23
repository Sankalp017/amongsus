import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator"; // Import Separator

const HowToPlay = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate("/");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-500 via-purple-500 to-yellow-500 text-white p-4">
      <Card className="w-full max-w-2xl bg-white p-6 rounded-lg shadow-xl text-gray-800 text-center">
        <CardHeader>
          <CardTitle className="text-3xl font-bold mb-4">How to Play Among Sus</CardTitle>
        </CardHeader>
        <CardContent className="text-left space-y-4">
          <p className="text-lg">
            Among Sus is a word-based social deduction game for 3-10 players, played on a single device.
            One or more players will be the "<span className="font-bold text-red-600">Sus Players</span>" and will receive a slightly different word than the "<span className="font-bold text-green-600">Crewmates</span>".
          </p>

          <Separator className="my-6 bg-gray-300" />

          <h3 className="text-2xl font-semibold mb-3 text-purple-700">Game Flow:</h3>
          <ol className="list-decimal list-inside space-y-3 text-lg">
            <li>
              <span className="font-bold">Game Setup:</span> Enter player names and choose the number of sus players and a word topic.
            </li>
            <li>
              <span className="font-bold">Word Reveal:</span> Each player will take turns tapping the screen to reveal their secret word.
              Pass the device around, ensuring only the current player sees their word.
              Crewmates will see the main word, while Sus Players will see a subtly different "sus word."
              Players can tap "Next Player" to proceed.
            </li>
            <li>
              <span className="font-bold">Discussion Phase:</span> All players discuss the word. Crewmates try to identify the Sus Player(s)
              by asking questions and listening for inconsistencies. Sus Players must blend in and avoid revealing their different word.
              Be careful not to reveal the main word directly!
            </li>
            <li>
              <span className="font-bold">Results:</span> After the discussion, the game will reveal who the Sus Players were and what the main and sus words were.
              This is your chance to see if your suspicions were correct!
            </li>
          </ol>
          <p className="text-lg mt-6">
            Good luck, and try not to be too sus!
          </p>
          <Button
            onClick={handleGoBack}
            className="w-full bg-purple-700 text-white hover:bg-purple-800 text-lg py-4 rounded-md shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105 mt-6"
          >
            Back to Home
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default HowToPlay;
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft } from "lucide-react";

const HowToPlay = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate("/");
  };

  const handleReadyToPlay = () => {
    navigate("/setup"); // Navigate to the setup page
  };

  const guidePoints = [
    {
      emoji: "⚙️",
      title: "Setup:",
      description: "Enter player names, choose how many Imposters, and pick a word topic.",
    },
    {
      emoji: "🤫",
      title: "Word Reveal:",
      description: "The game announces whose turn it is. Pass the device ONLY to that player.",
    },
    {
      emoji: "👆",
      title: "Your Word:",
      description: "Click the screen to see your secret word.",
    },
    {
      emoji: "😈",
      title: "Imposters:",
      description: "Get a 'sus word' (a tricky word from a similar topic).",
      color: "text-red-600",
    },
    {
      emoji: "😇",
      title: "Innocents:",
      description: "Get the 'main word' (the real one).",
      color: "text-green-600",
    },
    {
      emoji: "🤐",
      title: "Important:",
      description: "Do NOT say your word directly!",
    },
    {
      emoji: "➡️",
      title: "Next Player:",
      description: "Click 'Next Player' and pass the device.",
    },
    {
      emoji: "🗣️",
      title: "Discussion:",
      description: "Talk amongst yourselves. Innocents ask questions to find the Imposters.",
    },
    {
      emoji: "🤥",
      title: "Imposters:",
      description: "Lie, blend in, and try not to get caught!",
    },
    {
      emoji: "🏆",
      title: "Results:",
      description: "The game reveals the main word, sus word, and who the Imposters were.",
    },
  ];

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-500 via-purple-500 to-yellow-500 text-white p-4"
    >
      <Card className="w-full max-w-4xl bg-white p-6 sm:p-8 rounded-2xl shadow-2xl text-gray-800 text-center border border-gray-200 relative">
        <Button
          variant="ghost"
          size="icon"
          onClick={handleGoBack}
          className="absolute top-4 left-4 text-gray-600 hover:text-purple-700 rounded-xl"
        >
          <ArrowLeft className="h-6 w-6" />
        </Button>
        <CardHeader>
          <CardTitle className="text-2xl md:text-3xl font-bold mb-4">How to Play (and Lie)</CardTitle>
        </CardHeader>
        <CardContent className="text-left space-y-4">
          <p className="text-base md:text-lg mb-6">
            Welcome to Among Sus! It's a fun word game for <span className="font-bold">3+ players</span> on one device. Find the Imposters, or be one and lie your way to victory!
          </p>

          <Separator className="my-6 bg-gray-300" />

          <h3 className="text-xl md:text-2xl font-semibold mb-3 text-purple-700">Quick Guide:</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {guidePoints.map((point, index) => (
              <div key={index} className="bg-gray-50 p-4 rounded-lg shadow-sm border border-gray-200 flex items-start space-x-3">
                <span className="text-2xl mt-0.5">{point.emoji}</span>
                <div>
                  <h4 className={`font-bold text-lg ${point.color || 'text-gray-800'}`}>{point.title}</h4>
                  <p className="text-sm text-gray-700">{point.description}</p>
                </div>
              </div>
            ))}
          </div>
          <p className="text-base md:text-lg mt-6">
            Good luck, have fun, and try not to be too sus!
          </p>
          <Button
            onClick={handleReadyToPlay}
            className="w-full bg-purple-700 text-white hover:bg-purple-800 text-base md:text-lg py-6 rounded-xl transition-all duration-300 ease-in-out transform hover:scale-105 mt-6"
          >
            Ready to Play? (And Lie?)
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default HowToPlay;
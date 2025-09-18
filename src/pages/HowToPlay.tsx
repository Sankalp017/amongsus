import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Play } from "lucide-react";

const HowToPlay = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate("/");
  };

  const handleReadyToPlay = () => {
    navigate("/setup");
  };

  const guidePoints = [
    {
      emoji: "⚙️",
      title: "Setup:",
      description: "First, set the total number of players, then choose how many of them will be imposters. Next, enter each player's name, and finally, select a word topic.",
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
      color: "text-red-600 dark:text-red-400",
    },
    {
      emoji: "😇",
      title: "Innocents:",
      description: "Get the 'main word' (the real one).",
      color: "text-green-600 dark:text-green-400",
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
      className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-500 via-purple-500 to-yellow-500 dark:from-background dark:to-slate-900 text-white p-4"
    >
      <Card className="w-full max-w-4xl bg-card p-6 sm:p-8 rounded-2xl shadow-2xl text-card-foreground text-center border-border">
        <CardHeader className="relative flex items-center justify-center p-0 mb-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleGoBack}
            className="absolute left-0 text-muted-foreground hover:text-foreground rounded-xl"
          >
            <ArrowLeft className="h-6 w-6" />
          </Button>
          <CardTitle className="text-3xl md:text-4xl font-bold text-foreground">
            How to Play
          </CardTitle>
        </CardHeader>
        <CardContent className="text-left space-y-4">
          <p className="text-base md:text-lg mb-6 text-muted-foreground">
            Welcome to Among Sus! It's a fun word game for <span className="font-bold text-foreground">3+ players</span> on one device. Find the Imposters, or be one and lie your way to victory!
          </p>

          <Separator className="my-6" />

          <h3 className="text-xl md:text-2xl font-semibold mb-3 text-primary">Quick Guide:</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {guidePoints.map((point, index) => (
              <div key={index} className="bg-background p-4 rounded-lg shadow-sm border border-border flex items-start space-x-3">
                <span className="text-2xl mt-0.5">{point.emoji}</span>
                <div>
                  <h4 className={`font-bold text-lg ${point.color || 'text-foreground'}`}>{point.title}</h4>
                  <p className="text-base text-muted-foreground">{point.description}</p>
                </div>
              </div>
            ))}
          </div>
          <p className="text-base md:text-lg mt-6 text-muted-foreground">
            Good luck, have fun, and try not to be too sus!
          </p>
          <Button
            onClick={handleReadyToPlay}
            className="w-full text-base md:text-lg py-6 rounded-xl transition-all duration-300 ease-in-out transform hover:scale-105 mt-6 flex items-center justify-center gap-3"
          >
            <Play className="h-6 w-6" />
            Ready to Play? (And Lie?)
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default HowToPlay;
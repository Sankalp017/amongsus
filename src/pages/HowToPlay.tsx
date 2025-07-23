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

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-500 via-purple-500 to-yellow-500 text-white p-4"
    >
      <Card className="w-full max-w-2xl bg-white p-6 sm:p-8 rounded-2xl shadow-2xl text-gray-800 text-center border border-gray-200 relative">
        <Button
          variant="ghost"
          size="icon"
          onClick={handleGoBack}
          className="absolute top-4 left-4 text-gray-600 hover:text-purple-700 rounded-xl" // Changed to rounded-xl
        >
          <ArrowLeft className="h-6 w-6" />
        </Button>
        <CardHeader>
          <CardTitle className="text-2xl md:text-3xl font-bold mb-4">How to Play Among Sus (or, How to Master the Art of Blame)</CardTitle>
        </CardHeader>
        <CardContent className="text-left space-y-4">
          <p className="text-base md:text-lg">
            Welcome, brave truth-seekers and master manipulators! Among Sus is your new favorite word-based social deduction game for <span className="font-bold">3+ players</span>, all on one device. Think of it as a verbal tightrope walk where one wrong word (or a suspiciously *right* one) can expose you.
          </p>
          <p className="text-base md:text-lg">
            One or more of you will be the "<span className="font-bold text-red-600">Imposters</span>" – sneaky devils who get a word that's *just* different enough to make them sweat. The rest are the "<span className="font-bold text-green-600">Innocents</span>," armed with the true word and a burning desire to sniff out the fakers.
          </p>

          <Separator className="my-6 bg-gray-300" />

          <h3 className="text-xl md:text-2xl font-semibold mb-3 text-purple-700">The Grand Scheme (aka Game Flow):</h3>
          <ol className="list-decimal list-inside space-y-3 text-base md:text-lg">
            <li>
              <span className="font-bold">Game Setup:</span> Gather your crew, enter names (no duplicates, unless you *really* want to confuse everyone), pick your imposter count (the more, the merrier... or more chaotic), and choose a word topic.
            </li>
            <li>
              <span className="font-bold">Word Reveal (The "Don't Look!" Phase):</span> This is where the magic (and paranoia) happens! The game will dramatically announce whose turn it is using text-to-speech. <span className="font-bold text-purple-700">Pass the device ONLY to the announced player.</span> Everyone else, avert your eyes! The current player taps to reveal their secret word. Innocents get the real deal, while Imposters get a "sus word" – close enough to blend, but far enough to trip them up. The game will then loudly declare "Word revealed!" just to make sure everyone knows *someone* just saw *something*. Then, tap "Next Player" and pass the device like it's a hot potato.
            </li>
            <li>
              <span className="font-bold">Discussion Phase (The "Who's Lying?" Inquisition):</span> Once everyone's seen their word (or their "sus" word), the gloves come off! Discuss the word. Innocents, ask probing questions, listen for any verbal stumbles, and try to pinpoint the Imposter(s). Imposters, this is your time to shine! Blend in, deflect, and try not to reveal your slightly-off word. Remember, directly saying the main word is a big no-no – unless you *want* to be voted out!
            </li>
            <li>
              <span className="font-bold">Results (The Moment of Truth!):</span> After all the accusations and nervous laughter, the game reveals the true Imposters and both the main and sus words. See if your detective skills (or your bluffing prowess) paid off!
            </li>
          </ol>
          <p className="text-base md:text-lg mt-6">
            Good luck, have fun, and try not to be *too* sus. We're watching you...
          </p>
          <Button
            onClick={handleReadyToPlay}
            className="w-full bg-purple-700 text-white hover:bg-purple-800 text-base md:text-lg py-6 rounded-xl transition-all duration-300 ease-in-out transform hover:scale-105 mt-6" // Changed to rounded-xl
          >
            Ready to Play? (And Lie?)
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default HowToPlay;
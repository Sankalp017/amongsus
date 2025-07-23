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
          className="absolute top-4 left-4 text-gray-600 hover:text-purple-700 rounded-xl"
        >
          <ArrowLeft className="h-6 w-6" />
        </Button>
        <CardHeader>
          <CardTitle className="text-2xl md:text-3xl font-bold mb-4">How to Play Among Sus (or, How to Master the Art of Blame)</CardTitle>
        </CardHeader>
        <CardContent className="text-left space-y-4">
          <p className="text-base md:text-lg">
            Alright, gather 'round, you magnificent truth-seekers and cunning master manipulators! Welcome to Among Sus, the word-based social deduction game that's about to become your new obsession. Designed for <span className="font-bold">3+ players</span> on a single device, it's a verbal tightrope walk where one slip of the tongue (or a suspiciously *perfect* one) can expose everything.
          </p>
          <p className="text-base md:text-lg">
            Some of you will be the "<span className="font-bold text-red-600">Imposters</span>" – sly foxes who get a word that's *just* off-kilter enough to make them sweat. The rest? You're the "<span className="font-bold text-green-600">Innocents</span>," armed with the real deal and a burning, unshakeable urge to unmask the fakes.
          </p>

          <Separator className="my-6 bg-gray-300" />

          <h3 className="text-xl md:text-2xl font-semibold mb-3 text-purple-700">The Master Plan (aka How This Chaos Unfolds):</h3>
          <ol className="list-decimal list-inside space-y-3 text-base md:text-lg">
            <li>
              <span className="font-bold">Game Setup:</span> First things first, wrangle your unsuspecting friends (or frenemies). Punch in everyone's names – and seriously, try to keep them unique, unless you *enjoy* shouting 'Which "Bob" are we talking about?!' Pick how many Imposters you want to unleash (more Imposters = more delightful chaos, just sayin'). Finally, pick a word topic. Choose wisely, for your fate depends on it!
            </li>
            <li>
              <span className="font-bold">Word Reveal (The "Seriously, Don't Peek!" Phase):</span> This is where the tension builds and friendships are tested! Our digital overlord (the game, that is) will dramatically announce whose turn it is via text-to-speech. <span className="font-bold text-purple-700">Pass the device ONLY to the player whose name was just bellowed.</span> Everyone else, for the love of all that is innocent, avert your gaze! The chosen player then bravely clicks the screen to unveil their secret word. If you're an Innocent, you'll see the true word. If you're an Imposter, you'll get a "sus word" – it's like the main word's slightly awkward cousin, just similar enough to blend in, but different enough to make you sweat. The game will then triumphantly declare "Word revealed!" (just in case you weren't paying attention). Once you've absorbed your destiny, click "Next Player" and pass that device like it's a ticking time bomb.
            </li>
            <li>
              <span className="font-bold">Discussion Phase (The "Let the Accusations Fly!" Inquisition):</span> Everyone's seen their word (or their cleverly disguised "sus" word). Now, the real fun begins! This is your chance to discuss the word. Innocents, channel your inner detective: ask cunning questions, listen for any verbal stumbles, and try to pinpoint who's acting a little *too* innocent. Imposters, this is your moment to shine! Blend in, deflect, throw shade, and whatever you do, *do not* accidentally blurt out your slightly-off word. And a pro tip for everyone: directly saying the main word is a massive no-no – unless you're actively trying to get yourself voted into the digital abyss!
            </li>
            <li>
              <span className="font-bold">Results (The Grand Unmasking!):</span> The dust settles, the nervous laughter subsides, and it's time for the big reveal! The game will proudly display who the true Imposters were, along with both the main word and that tricky "sus word." Did your detective skills pay off? Or did the Imposters pull off the ultimate deception? Find out if you're a master of deduction or just really good at guessing!
            </li>
          </ol>
          <p className="text-base md:text-lg mt-6">
            So, there you have it! Good luck, have an absolute blast, and remember: try not to be *too* sus. We're always watching... (mostly just the game, but still!)
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
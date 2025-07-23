import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface GameStateData {
  numPlayers: number;
  playerNames: string[];
  numSusPlayers: number;
  topic?: string;
  mainWord: string;
  susWord: string;
  susPlayerIndices: number[];
}

interface Vote {
  voterIndex: number;
  votedForIndex: number;
}

const Results = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { gameState, votes } = location.state as { gameState: GameStateData; votes: Vote[] };

  useEffect(() => {
    if (!gameState || !gameState.playerNames || gameState.playerNames.length === 0 || !votes) {
      toast.error("Game data or votes not found. Please set up the game again.");
      navigate("/setup");
    }
  }, [gameState, votes, navigate]);

  if (!gameState || !votes) {
    return null; // Or a loading spinner/error message
  }

  // Calculate vote counts
  const voteCounts: { [playerIndex: number]: number } = {};
  gameState.playerNames.forEach((_, index) => {
    voteCounts[index] = 0;
  });
  votes.forEach((vote) => {
    voteCounts[vote.votedForIndex]++;
  });

  // Determine who was voted out
  let votedOutPlayerIndex: number | null = null;
  let maxVotes = -1;
  let tie = false;

  for (const playerIndex in voteCounts) {
    const count = voteCounts[playerIndex];
    if (count > maxVotes) {
      maxVotes = count;
      votedOutPlayerIndex = parseInt(playerIndex);
      tie = false;
    } else if (count === maxVotes) {
      tie = true; // There's a tie for the most votes
    }
  }

  const votedOutPlayerName = votedOutPlayerIndex !== null ? gameState.playerNames[votedOutPlayerIndex] : "No one";
  const isVotedOutPlayerSus = votedOutPlayerIndex !== null && gameState.susPlayerIndices.includes(votedOutPlayerIndex);

  // Determine game outcome
  let gameOutcome = "";
  let outcomeMessage = "";

  if (tie) {
    gameOutcome = "No one was voted out due to a tie!";
    outcomeMessage = "The game continues or ends in a draw.";
  } else if (isVotedOutPlayerSus) {
    gameOutcome = "Crewmates Win!";
    outcomeMessage = `${votedOutPlayerName} was the sus player!`;
  } else {
    gameOutcome = "Sus Players Win!";
    outcomeMessage = `${votedOutPlayerName} was an innocent crewmate. The sus player(s) remain!`;
  }

  const handlePlayAgain = () => {
    navigate("/"); // Go back to the home page to start a new game
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-500 via-purple-500 to-yellow-500 text-white p-4">
      <Card className="w-full max-w-md bg-white p-6 rounded-lg shadow-xl text-gray-800 text-center">
        <CardHeader>
          <CardTitle className="text-3xl font-bold mb-4">Game Results</CardTitle>
        </CardHeader>
        <CardContent>
          <h3 className="text-2xl font-semibold mb-4">{gameOutcome}</h3>
          <p className="text-lg mb-6">{outcomeMessage}</p>

          <div className="mb-6">
            <h4 className="text-xl font-bold mb-2">Vote Summary:</h4>
            {gameState.playerNames.map((name, index) => (
              <p key={index} className="text-md">
                {name}: {voteCounts[index]} votes
              </p>
            ))}
          </div>

          <div className="mb-6">
            <h4 className="text-xl font-bold mb-2">The Words Were:</h4>
            <p className="text-lg">Main Word: <span className="font-semibold text-purple-700">{gameState.mainWord}</span></p>
            <p className="text-lg">Sus Word: <span className="font-semibold text-purple-700">{gameState.susWord}</span></p>
          </div>

          <div className="mb-8">
            <h4 className="text-xl font-bold mb-2">Sus Players Were:</h4>
            {gameState.susPlayerIndices.length > 0 ? (
              gameState.susPlayerIndices.map((index) => (
                <p key={index} className="text-lg font-semibold text-red-600">
                  {gameState.playerNames[index]}
                </p>
              ))
            ) : (
              <p className="text-lg">No sus players assigned (this shouldn't happen in a normal game).</p>
            )}
          </div>

          <Button
            onClick={handlePlayAgain}
            className="w-full bg-purple-700 text-white hover:bg-purple-800 text-lg py-4 rounded-md shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105"
          >
            Play Again
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Results;
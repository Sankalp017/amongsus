import React, { useState, useEffect } from "react";
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

const Voting = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const gameState = location.state as GameStateData;

  const [currentVoterIndex, setCurrentVoterIndex] = useState(0);
  const [votes, setVotes] = useState<Vote[]>([]);
  const [showVoteConfirmation, setShowVoteConfirmation] = useState(false);
  const [votedForName, setVotedForName] = useState("");

  useEffect(() => {
    if (!gameState || !gameState.playerNames || gameState.playerNames.length === 0) {
      toast.error("Game data not found. Please set up the game again.");
      navigate("/setup");
    }
  }, [gameState, navigate]);

  if (!gameState) {
    return null; // Or a loading spinner/error message
  }

  const currentVoterName = gameState.playerNames[currentVoterIndex];
  const playersToVoteFor = gameState.playerNames.filter(
    (_, index) => index !== currentVoterIndex
  );

  const handleVote = (votedForPlayerName: string) => {
    const votedForIndex = gameState.playerNames.indexOf(votedForPlayerName);
    setVotes((prevVotes) => {
      const updatedVotes = [
        ...prevVotes,
        { voterIndex: currentVoterIndex, votedForIndex },
      ];
      setVotedForName(votedForPlayerName);
      setShowVoteConfirmation(true);

      setTimeout(() => {
        setShowVoteConfirmation(false);
        const nextVoterIndex = currentVoterIndex + 1;
        if (nextVoterIndex < gameState.numPlayers) {
          setCurrentVoterIndex(nextVoterIndex);
        } else {
          // All players have voted, proceed to results
          toast.success("All votes cast! Revealing results...");
          navigate("/results", { state: { gameState, votes: updatedVotes } });
        }
      }, 2000); // Show confirmation for 2 seconds
      return updatedVotes;
    });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-500 via-purple-500 to-yellow-500 text-white p-4">
      <Card className="w-full max-w-md bg-white p-6 rounded-lg shadow-xl text-gray-800 text-center">
        <CardHeader>
          <CardTitle className="text-3xl font-bold mb-4">Voting Time!</CardTitle>
        </CardHeader>
        <CardContent>
          {showVoteConfirmation ? (
            <div className="text-2xl font-semibold text-purple-700 animate-fade-in">
              {currentVoterName} voted for {votedForName}!
            </div>
          ) : (
            <>
              <p className="text-lg mb-6">
                <span className="font-semibold text-purple-700">{currentVoterName}</span>, who do you think is sus?
              </p>
              <div className="grid grid-cols-2 gap-4">
                {playersToVoteFor.map((playerName, index) => (
                  <Button
                    key={index}
                    onClick={() => handleVote(playerName)}
                    className="bg-blue-600 text-white hover:bg-blue-700 text-lg py-4 rounded-md shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105"
                  >
                    Vote for {playerName}
                  </Button>
                ))}
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Voting;
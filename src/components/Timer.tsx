import React, { useState, useEffect } from "react";
import { Progress } from "@/components/ui/progress";

interface TimerProps {
  initialTime: number; // Time in seconds
  onTimeUp: () => void;
}

const Timer: React.FC<TimerProps> = ({ initialTime, onTimeUp }) => {
  const [timeLeft, setTimeLeft] = useState(initialTime);
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    if (timeLeft <= 0) {
      onTimeUp();
      return;
    }

    const timerId = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1);
    }, 1000);

    return () => clearInterval(timerId);
  }, [timeLeft, onTimeUp]);

  useEffect(() => {
    setProgress((timeLeft / initialTime) * 100);
  }, [timeLeft, initialTime]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  return (
    <div className="w-full flex flex-col items-center gap-4">
      <div className="text-4xl font-bold text-purple-700">
        {formatTime(timeLeft)}
      </div>
      <Progress value={progress} className="w-full h-3 bg-gray-300" />
    </div>
  );
};

export default Timer;
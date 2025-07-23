import React, { useState, useEffect } from "react";
import CircularProgress from "@/components/CircularProgress"; // Import the new CircularProgress component

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
    // If initial time is 10 seconds or less, display only seconds
    if (initialTime <= 10) {
      return seconds.toString();
    }
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  return (
    <div className="w-full flex flex-col items-center gap-4">
      <div className="relative flex items-center justify-center">
        <CircularProgress value={progress} size={150} strokeWidth={8} />
        <div key={timeLeft} className="absolute text-4xl font-semibold text-gray-700 animate-fade-in-out-subtle"> {/* Added key and animation */}
          {formatTime(timeLeft)}
        </div>
      </div>
    </div>
  );
};

export default Timer;
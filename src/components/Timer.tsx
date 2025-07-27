import React, { useState, useEffect } from "react";

interface TimerProps {
  initialTime: number; // Time in seconds
  onTimeUp: () => void;
}

const Timer: React.FC<TimerProps> = ({ initialTime, onTimeUp }) => {
  const [timeLeft, setTimeLeft] = useState(initialTime);

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

  // This component will now only display the raw seconds for short initial times
  // and rely on the key prop to re-trigger the animation for each number.
  return (
    <div className="w-full flex flex-col items-center justify-center h-full">
      <div key={timeLeft} className="text-8xl font-extrabold text-purple-700 animate-fade-in-out-subtle">
        {timeLeft > 0 ? timeLeft : ""} {/* Only display number if > 0 */}
      </div>
    </div>
  );
};

export default Timer;
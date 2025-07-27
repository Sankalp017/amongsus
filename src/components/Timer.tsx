import React, { useState, useEffect } from "react";
import { cn } from '@/lib/utils'; // Import cn utility

interface TimerProps {
  initialTime: number; // Time in seconds
  onTimeUp: () => void;
  onTick?: (timeLeft: number) => void; // New prop to report time left
  className?: string; // Added className prop
}

const Timer: React.FC<TimerProps> = ({ initialTime, onTimeUp, onTick, className }) => {
  const [timeLeft, setTimeLeft] = useState(initialTime);

  useEffect(() => {
    setTimeLeft(initialTime); // Reset timeLeft when initialTime changes
  }, [initialTime]);

  useEffect(() => {
    if (timeLeft <= 0) {
      onTimeUp();
      return;
    }

    const timerId = setInterval(() => {
      setTimeLeft((prevTime) => {
        const newTime = prevTime - 1;
        if (onTick) {
          onTick(newTime); // Call onTick with the new time
        }
        return newTime;
      });
    }, 1000);

    return () => clearInterval(timerId);
  }, [timeLeft, onTimeUp, onTick]);

  // This component will now only display the raw seconds for short initial times
  // and rely on the key prop to re-trigger the animation for each number.
  return (
    <div className={cn("w-full flex flex-col items-center justify-center h-full", className)}>
      <div key={timeLeft} className="text-8xl font-extrabold text-purple-700 animate-fade-in-out-subtle">
        {timeLeft > 0 ? timeLeft : ""} {/* Only display number if > 0 */}
      </div>
    </div>
  );
};

export default Timer;
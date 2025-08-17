import React, { useState, useEffect } from "react";

interface TimerProps {
  initialTime: number;
  onTimeUp: () => void;
}

const Timer: React.FC<TimerProps> = ({ initialTime, onTimeUp }) => {
  const [time, setTime] = useState(initialTime);

  useEffect(() => {
    if (time < 0) {
      onTimeUp();
      return;
    }

    const timerId = setTimeout(() => {
      setTime(time - 1);
    }, 1000);

    return () => clearTimeout(timerId);
  }, [time, onTimeUp]);

  return (
    <div className="relative w-32 h-32 flex items-center justify-center">
      {time > 0 && (
        <p
          key={time}
          className="text-8xl font-bold text-foreground animate-fade-in-out-subtle"
        >
          {time}
        </p>
      )}
    </div>
  );
};

export default Timer;
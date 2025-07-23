import React, { useState, useEffect } from "react";

interface CountdownTimerProps {
  initialCount: number;
  onCountdownEnd: () => void;
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({ initialCount, onCountdownEnd }) => {
  const [count, setCount] = useState(initialCount);

  useEffect(() => {
    if (count <= 0) {
      onCountdownEnd();
      return;
    }

    const timer = setTimeout(() => {
      setCount(count - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [count, onCountdownEnd]);

  return (
    <div className="text-white text-9xl font-extrabold animate-bounce-in">
      {count}
    </div>
  );
};

export default CountdownTimer;
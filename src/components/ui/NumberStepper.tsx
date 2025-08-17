import React from "react";
import { Button } from "@/components/ui/button";
import { Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface NumberStepperProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  className?: string;
}

const NumberStepper: React.FC<NumberStepperProps> = ({
  value,
  onChange,
  min = -Infinity,
  max = Infinity,
  className,
}) => {
  const handleDecrement = () => {
    if (value > min) {
      onChange(value - 1);
    }
  };

  const handleIncrement = () => {
    if (value < max) {
      onChange(value + 1);
    }
  };

  return (
    <div
      className={cn(
        "flex items-center justify-between w-full p-1 rounded-lg border",
        className
      )}
    >
      <Button
        type="button"
        variant="secondary"
        size="icon"
        onClick={handleDecrement}
        disabled={value <= min}
        className="rounded-full w-10 h-10 shadow-sm"
      >
        <Minus className="h-5 w-5" />
      </Button>
      <span className="text-xl font-bold tabular-nums">{value}</span>
      <Button
        type="button"
        variant="secondary"
        size="icon"
        onClick={handleIncrement}
        disabled={value >= max}
        className="rounded-full w-10 h-10 shadow-sm"
      >
        <Plus className="h-5 w-5" />
      </Button>
    </div>
  );
};

export default NumberStepper;
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface NumberInputStepperProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  className?: string;
}

const NumberInputStepper: React.FC<NumberInputStepperProps> = ({
  value,
  onChange,
  min = 1,
  max = Infinity,
  className,
}) => {
  const handleDecrement = () => {
    onChange(Math.max(min, value - 1));
  };

  const handleIncrement = () => {
    onChange(Math.min(max, value + 1));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const numValue = parseInt(e.target.value, 10);
    if (!isNaN(numValue)) {
      onChange(Math.max(min, Math.min(max, numValue)));
    } else if (e.target.value === "") {
      onChange(min); // Allow empty input temporarily, but revert to min if not a number
    }
  };

  return (
    <div className={cn("flex items-center space-x-2", className)}>
      <Button
        type="button"
        variant="outline"
        size="icon"
        onClick={handleDecrement}
        disabled={value <= min}
        className="rounded-full h-10 w-10 text-purple-700 border-purple-700 hover:bg-purple-100 hover:text-purple-800"
      >
        <Minus className="h-4 w-4" />
      </Button>
      <Input
        type="number"
        value={value}
        onChange={handleChange}
        min={min}
        max={max}
        className="w-24 text-center text-base md:text-lg py-2 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
      />
      <Button
        type="button"
        variant="outline"
        size="icon"
        onClick={handleIncrement}
        disabled={value >= max}
        className="rounded-full h-10 w-10 text-purple-700 border-purple-700 hover:bg-purple-100 hover:text-purple-800"
      >
        <Plus className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default NumberInputStepper;
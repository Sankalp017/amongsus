import React from 'react';
import { Button } from '@/components/ui/button';
import { Minus, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

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
  min = 0,
  max = Infinity,
  className,
}) => {
  const handleIncrement = () => {
    if (value < max) {
      onChange(value + 1);
    }
  };

  const handleDecrement = () => {
    if (value > min) {
      onChange(value - 1);
    }
  };

  return (
    <div className={cn("flex items-center justify-between w-full rounded-lg p-2", className)}>
      <Button
        type="button"
        variant="outline"
        size="icon"
        className="h-12 w-12 rounded-full bg-white/50 hover:bg-white"
        onClick={handleDecrement}
        disabled={value <= min}
      >
        <Minus className="h-6 w-6" />
      </Button>
      <span className="text-3xl font-bold text-center w-16">{value}</span>
      <Button
        type="button"
        variant="outline"
        size="icon"
        className="h-12 w-12 rounded-full bg-white/50 hover:bg-white"
        onClick={handleIncrement}
        disabled={value >= max}
      >
        <Plus className="h-6 w-6" />
      </Button>
    </div>
  );
};

export default NumberStepper;
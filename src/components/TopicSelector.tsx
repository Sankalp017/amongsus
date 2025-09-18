import React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

interface TopicSelectorProps {
  options: { value: string; label: string; isNew?: boolean }[];
  selected: string[];
  onChange: (selected: string[]) => void;
  className?: string;
}

const TopicSelector: React.FC<TopicSelectorProps> = ({ options, selected, onChange, className }) => {
  const handleToggle = (value: string) => {
    const newSelected = selected.includes(value)
      ? selected.filter((item) => item !== value)
      : [...selected, value];
    onChange(newSelected);
  };

  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {options.map((option) => (
        <Button
          key={option.value}
          type="button" // Prevent form submission
          variant={selected.includes(option.value) ? 'default' : 'outline'}
          onClick={() => handleToggle(option.value)}
          className={cn(
            "transition-all duration-200 ease-in-out rounded-full px-4 py-2 h-auto text-sm flex items-center gap-2",
            {
              "dark:bg-primary/80 dark:hover:bg-primary/90": selected.includes(option.value),
            }
          )}
        >
          {option.label}
          {option.isNew && (
            <Badge variant="destructive" className="animate-pulse">
              New
            </Badge>
          )}
        </Button>
      ))}
    </div>
  );
};

export default TopicSelector;
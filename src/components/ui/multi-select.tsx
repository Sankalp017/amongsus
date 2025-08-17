import * as React from "react";
import { Check } from "lucide-react";
import {
  Command,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useMediaQuery } from "@/hooks/use-media-query";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "./button";

export interface Option {
  value: string;
  label: string;
}

interface MultiSelectProps {
  options: Option[];
  selected: string[];
  onChange: (selected: string[]) => void;
  placeholder?: string;
  className?: string;
}

export function MultiSelect({
  options,
  selected,
  onChange,
  placeholder = "Select...",
  className,
}: MultiSelectProps) {
  const [open, setOpen] = React.useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const handleSelect = (value: string) => {
    const newSelected = selected.includes(value)
      ? selected.filter((item) => item !== value)
      : [...selected, value];
    onChange(newSelected);
  };

  const selectedOptions = options.filter((option) =>
    selected.includes(option.value)
  );

  const triggerContent = (
    <div className="flex flex-wrap gap-1">
      {selectedOptions.length > 0 ? (
        selectedOptions.map((option) => (
          <Badge
            key={option.value}
            variant="secondary"
            className="rounded-sm px-2 py-1"
          >
            {option.label}
          </Badge>
        ))
      ) : (
        <span className="text-muted-foreground">{placeholder}</span>
      )}
    </div>
  );

  const commandContent = (
    <Command className="bg-transparent">
      <CommandList>
        <div className="grid grid-cols-1 gap-2 p-1">
          {options.map((option) => {
            const isSelected = selected.includes(option.value);
            const parts = option.label.split(" ");
            const icon = parts[0];
            const labelText = parts.slice(1).join(" ");

            return (
              <CommandItem
                key={option.value}
                onSelect={() => handleSelect(option.value)}
                className={cn(
                  "cursor-pointer p-4 rounded-lg flex items-center justify-between text-left transition-all duration-200 focus:bg-accent focus:text-accent-foreground w-full",
                  isSelected
                    ? "bg-primary/20 text-primary font-semibold"
                    : "bg-muted/50 hover:bg-muted"
                )}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{icon}</span>
                  <span className="text-base font-medium">{labelText}</span>
                </div>
                <Check
                  className={cn(
                    "h-6 w-6 transition-opacity",
                    isSelected ? "opacity-100" : "opacity-0"
                  )}
                />
              </CommandItem>
            );
          })}
        </div>
      </CommandList>
    </Command>
  );

  if (isDesktop) {
    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className={cn("w-full justify-between min-h-10 h-auto py-2", className)}
          >
            {triggerContent}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
          {commandContent}
        </PopoverContent>
      </Popover>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-full justify-between min-h-10 h-auto py-2", className)}
        >
          {triggerContent}
        </Button>
      </DrawerTrigger>
      <DrawerContent className="bg-card text-card-foreground">
        <div className="mx-auto w-full max-w-md">
          <DrawerHeader className="text-center">
            <DrawerTitle className="text-2xl font-bold">Select Topics</DrawerTitle>
            <DrawerDescription>
              Select one or more topics. You can scroll for more options.
            </DrawerDescription>
          </DrawerHeader>
          <div className="p-4 max-h-[60vh] overflow-y-auto">{commandContent}</div>
          <DrawerFooter>
            <Button onClick={() => setOpen(false)} className="bg-purple-700 text-white hover:bg-purple-800 dark:bg-purple-600 dark:hover:bg-purple-700">Confirm</Button>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
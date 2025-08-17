import * as React from "react";
import { Check } from "lucide-react";
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
  CommandInput,
} from "@/components/ui/command";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useMediaQuery } from "@/hooks/use-media-query";
import {
  Drawer,
  DrawerContent,
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
    <Command className="w-full">
      <CommandInput placeholder="Search..." />
      <CommandList>
        <CommandGroup>
          {options.map((option) => (
            <CommandItem
              key={option.value}
              onSelect={() => handleSelect(option.value)}
              className="cursor-pointer"
            >
              <Check
                className={cn(
                  "mr-2 h-4 w-4",
                  selected.includes(option.value) ? "opacity-100" : "opacity-0"
                )}
              />
              {option.label}
            </CommandItem>
          ))}
        </CommandGroup>
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
            className={cn("w-full justify-between", className)}
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
          className={cn("w-full justify-between", className)}
        >
          {triggerContent}
        </Button>
      </DrawerTrigger>
      <DrawerContent className="bg-card text-card-foreground">
        <div className="mx-auto w-full max-w-md">
          <DrawerHeader className="text-center">
            <DrawerTitle className="text-2xl font-bold">Select Topics</DrawerTitle>
          </DrawerHeader>
          <div className="p-4">{commandContent}</div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { useMediaQuery } from "@/hooks/use-media-query";

export interface MultiSelectOption {
  value: string;
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
}

interface MultiSelectProps {
  options: MultiSelectOption[];
  selected: string[];
  onChange: React.Dispatch<React.SetStateAction<string[]>>;
  className?: string;
  placeholder?: string;
}

export function MultiSelect({
  options,
  selected,
  onChange,
  className,
  placeholder = "Select options...",
}: MultiSelectProps) {
  const [open, setOpen] = React.useState(false);
  const isMobile = useMediaQuery("(max-width: 768px)");

  const handleSelect = (option: MultiSelectOption) => {
    const newSelected = selected.includes(option.value)
      ? selected.filter((item) => item !== option.value)
      : [...selected, option.value];
    onChange(newSelected);
  };

  const selectedValues = selected;

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
            onClick={() => setOpen(true)}
          >
            <span className="truncate">
              {selectedValues.length > 0
                ? `${selectedValues.length} selected`
                : placeholder}
            </span>
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </DrawerTrigger>
        <DrawerContent className="bg-card text-card-foreground">
          <div className="mx-auto w-full max-w-md">
            <DrawerHeader className="text-center">
              <DrawerTitle className="text-2xl font-bold">Select Topics</DrawerTitle>
              <DrawerDescription>
                Choose one or more topics for your game.
              </DrawerDescription>
            </DrawerHeader>
            <div className="p-4 pb-0">
              <Command>
                <CommandInput placeholder="Search topics..." />
                <CommandList className="max-h-[200px] overflow-y-auto">
                  <CommandEmpty>No topic found.</CommandEmpty>
                  {options.map((option) => (
                    <CommandItem
                      key={option.value}
                      onSelect={() => handleSelect(option)}
                      className="cursor-pointer flex items-center justify-between aria-selected:bg-transparent aria-selected:text-card-foreground"
                    >
                      <div className="flex items-center">
                        <div
                          className={`mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary ${
                            selectedValues.includes(option.value)
                              ? "bg-primary text-primary-foreground"
                              : "opacity-50 [&_svg]:invisible"
                          }`}
                        >
                          <Check className="h-4 w-4" />
                        </div>
                        <span>{option.label}</span>
                      </div>
                      {option.icon && <option.icon className="h-5 w-5 text-muted-foreground" />}
                    </CommandItem>
                  ))}
                </CommandList>
              </Command>
            </div>
            <DrawerFooter>
              <Button onClick={() => setOpen(false)}>Done</Button>
            </DrawerFooter>
          </div>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-full justify-between", className)}
          onClick={() => setOpen((prev) => !prev)}
        >
          <span className="truncate">
            {selectedValues.length > 0
              ? `${selectedValues.length} selected`
              : placeholder}
          </span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[--radix-popover-trigger-width] max-h-[--radix-popover-content-available-height] p-0">
        <Command>
          <CommandInput placeholder="Search topics..." />
          <CommandList>
            <CommandEmpty>No topic found.</CommandEmpty>
            {options.map((option) => (
              <CommandItem
                key={option.value}
                onSelect={() => handleSelect(option)}
                className="cursor-pointer flex items-center justify-between aria-selected:bg-transparent aria-selected:text-card-foreground"
              >
                <div className="flex items-center">
                  <div
                    className={`mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary ${
                      selectedValues.includes(option.value)
                        ? "bg-primary text-primary-foreground"
                        : "opacity-50 [&_svg]:invisible"
                    }`}
                  >
                    <Check className="h-4 w-4" />
                  </div>
                  <span>{option.label}</span>
                </div>
                {option.icon && <option.icon className="h-5 w-5 text-muted-foreground" />}
              </CommandItem>
            ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
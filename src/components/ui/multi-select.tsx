import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
  DrawerFooter,
  DrawerClose,
} from "@/components/ui/drawer";
import { ScrollArea } from "@/components/ui/scroll-area";

export type OptionType = {
  value: string;
  label: string;
};

interface MultiSelectProps {
  options: OptionType[];
  selected: string[];
  onChange: (selected: string[]) => void;
  className?: string;
  placeholder?: string;
}

function MultiSelect({
  options,
  selected,
  onChange,
  className,
  placeholder = "Select topics...",
}: MultiSelectProps) {
  const handleSelect = (value: string) => {
    if (selected.includes(value)) {
      onChange(selected.filter((item) => item !== value));
    } else {
      onChange([...selected, value]);
    }
  };

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          className={cn(
            "w-full justify-between text-gray-800",
            selected.length > 0 ? "h-auto py-2" : "h-10",
            className
          )}
        >
          <div className="flex flex-wrap items-center gap-1">
            {selected.length > 0 ? (
              options
                .filter((option) => selected.includes(option.value))
                .map((option) => (
                  <Badge
                    variant="secondary"
                    key={option.value}
                    className="bg-purple-100 text-purple-800 px-2 py-1"
                  >
                    {option.label}
                  </Badge>
                ))
            ) : (
              <span className="text-muted-foreground">{placeholder}</span>
            )}
          </div>
          <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50 ml-2" />
        </Button>
      </DrawerTrigger>
      <DrawerContent className="bg-white text-gray-800">
        <div className="mx-auto w-full max-w-md">
          <DrawerHeader>
            <DrawerTitle className="text-2xl font-bold text-center">Select Topics</DrawerTitle>
          </DrawerHeader>
          <div className="p-4 pb-0">
            <ScrollArea className="h-[40vh]">
              <div className="space-y-2">
                {options.map((option) => {
                  const isSelected = selected.includes(option.value);
                  return (
                    <div
                      key={option.value}
                      onClick={() => handleSelect(option.value)}
                      className={cn(
                        "flex items-center justify-between w-full p-4 rounded-lg cursor-pointer transition-all duration-200",
                        isSelected
                          ? "bg-purple-600 text-white shadow-lg"
                          : "bg-gray-100 hover:bg-gray-200"
                      )}
                    >
                      <span className="text-base font-medium">{option.label}</span>
                      {isSelected && <Check className="h-6 w-6" />}
                    </div>
                  );
                })}
              </div>
            </ScrollArea>
          </div>
          <DrawerFooter>
            <DrawerClose asChild>
              <Button className="w-full bg-purple-700 text-white hover:bg-purple-800 text-lg py-6 rounded-xl">Done</Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}

export { MultiSelect };
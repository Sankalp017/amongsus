import React, { useState, useEffect } from "react";
import { useNavigate }
from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
  SelectLabel,
} from "@/components/ui/select";
import { toast } from "sonner";
import { wordCategories } from "@/utils/words";
import { ArrowLeft } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { saveGameState, clearGameState } from "@/utils/localStorage";
import { loadCustomPacks } from "@/utils/wordPackStorage";
import type { WordPack } from "@/pages/CustomWordPacks";

// Zod schema for form validation
const formSchema = z.object({
  numPlayers: z.coerce
    .number()
    .min(3, { message: "Minimum 3 players required." })
    .max(20, { message: "Maximum 20 players allowed." }),
  playerNames: z
    .array(z.string().min(1, { message: "Player name cannot be empty." }))
    .min(3, { message: "Please enter names for all players." }),
  numSusPlayers: z.coerce
    .number()
    .min(1, { message: "Minimum 1 imposter required." }),
  topic: z.string().optional(),
  // We'll add custom words here if a custom pack is selected
  customWords: z.array(z.string()).optional(),
}).refine(data => data.numSusPlayers < data.numPlayers, {
  message: "Number of imposters must be less than total players.",
  path: ["numSusPlayers"],
});

const GameSetup = () => {
  const navigate = useNavigate();
  const [playerInputs, setPlayerInputs] = useState<string[]>([]);
  const [customPacks, setCustomPacks] = useState<WordPack[]>([]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      numPlayers: 3,
      playerNames: ["", "", ""],
      numSusPlayers: 1,
      topic: "🎲 Random words",
    },
  });

  useEffect(() => {
    setCustomPacks(loadCustomPacks());
  }, []);

  const numPlayers = form.watch("numPlayers");

  useEffect(() => {
    clearGameState();

    const currentNames = form.getValues("playerNames");
    const newPlayerInputs = Array.from({ length: numPlayers }, (_, i) => {
      return currentNames[i] || "";
    });
    setPlayerInputs(newPlayerInputs);
    form.setValue("playerNames", newPlayerInputs);
  }, [numPlayers, form]);

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    const seenNames = new Set<string>();
    let hasDuplicateError = false;

    values.playerNames.forEach((_, index) => {
      form.clearErrors(`playerNames.${index}`);
    });

    values.playerNames.forEach((name, index) => {
      const lowerName = name.toLowerCase().trim();
      if (lowerName === "") {
        form.setError(`playerNames.${index}`, {
          type: "manual",
          message: "Player name cannot be empty.",
        });
        hasDuplicateError = true;
        return;
      }
      if (seenNames.has(lowerName)) {
        form.setError(`playerNames.${index}`, {
          type: "manual",
          message: "Player name must be unique.",
        });
        hasDuplicateError = true;
      }
      seenNames.add(lowerName);
    });

    if (hasDuplicateError) {
      toast.error("Please correct the errors in player names.");
      return;
    }

    // Check if a custom pack was selected and add its words to the form data
    const selectedTopic = values.topic;
    const customPack = customPacks.find(p => p.name === selectedTopic);
    if (customPack) {
      values.customWords = customPack.words;
    }

    console.log("Game Setup Values:", values);
    saveGameState(values);
    toast.success("Game setup complete! Starting round...");
    navigate("/name-reveal", { state: values });
  };

  const handleGoBack = () => {
    navigate("/");
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-500 via-purple-500 to-yellow-500 text-white p-4"
    >
      <Card className="w-full max-w-md bg-white p-6 sm:p-8 rounded-2xl shadow-2xl text-gray-800 border border-gray-200">
        <div className="relative flex items-center justify-center mb-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleGoBack}
            className="absolute left-0 text-gray-600 hover:text-purple-700 rounded-xl"
          >
            <ArrowLeft className="h-6 w-6" />
          </Button>
          <h2 className="text-2xl md:text-3xl font-bold">
            Game Setup
          </h2>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="numPlayers"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base md:text-lg mb-2">Number of Players</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="e.g., 3"
                      className="text-center text-base md:text-lg py-2 w-full bg-green-100"
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                        const val = parseInt(e.target.value);
                        if (!isNaN(val)) {
                          form.setValue("numPlayers", val);
                        }
                      }}
                      min={3}
                      max={20}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="numSusPlayers"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base md:text-lg">Number of Imposters</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="e.g., 1"
                      className="text-center text-base md:text-lg py-2 w-full bg-red-100"
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                        const val = parseInt(e.target.value);
                        if (!isNaN(val)) {
                          form.setValue("numSusPlayers", val);
                        }
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Card className="bg-gray-50 p-4 rounded-xl shadow-inner border border-gray-200">
              <CardHeader className="p-0 pb-4">
                <CardTitle className="text-lg md:text-xl font-semibold text-purple-700 text-left">Player Names</CardTitle>
              </CardHeader>
              <CardContent className="p-0 space-y-4">
                {playerInputs.map((_, index) => (
                  <FormField
                    key={index}
                    control={form.control}
                    name={`playerNames.${index}`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Player {index + 1} Name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder={`Enter name for Player ${index + 1}`}
                            {...field}
                            className="w-full"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ))}
              </CardContent>
            </Card>

            <FormField
              control={form.control}
              name="topic"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base md:text-lg">Select Topic</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a topic" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Default Topics</SelectLabel>
                        {wordCategories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                      {customPacks.length > 0 && (
                        <SelectGroup>
                          <SelectLabel>Custom Packs</SelectLabel>
                          {customPacks.map((pack) => (
                            <SelectItem key={pack.id} value={pack.name}>
                              ✏️ {pack.name}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full bg-purple-700 text-white hover:bg-purple-800 text-base md:text-lg py-6 rounded-xl transition-all duration-300 ease-in-out transform hover:scale-105"
            >
              Start Round
            </Button>
          </form>
        </Form>
      </Card>
    </div>
  );
};

export default GameSetup;
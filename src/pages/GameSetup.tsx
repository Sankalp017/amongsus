import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";
import { wordCategories } from "@/utils/words";
import { ArrowLeft } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { saveGameState, clearGameState } from "@/utils/localStorage";
import { MultiSelect } from "@/components/ui/multi-select";
import NumberStepper from "@/components/ui/NumberStepper";

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
  topics: z.array(z.string()).min(1, { message: "Please select at least one topic." }),
  roundsSinceImposter: z.array(z.number()).optional(),
  currentRound: z.number().optional(),
}).refine(data => data.numSusPlayers < data.numPlayers, {
  message: "Number of imposters must be less than total players.",
  path: ["numSusPlayers"],
});

const GameSetup = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [playerInputs, setPlayerInputs] = useState<string[]>([]);

  const isModification = location.state?.isModification;
  const initialValues = isModification ? location.state : {
    numPlayers: 3,
    playerNames: ["", "", ""],
    numSusPlayers: 1,
    topics: ["🎲 Random words"],
    roundsSinceImposter: [],
    currentRound: 1,
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialValues,
  });

  const numPlayers = form.watch("numPlayers");

  useEffect(() => {
    if (!isModification) {
      clearGameState();
    }

    const currentNames = form.getValues("playerNames");
    const newPlayerInputs = Array.from({ length: numPlayers }, (_, i) => {
      return currentNames[i] || "";
    });
    setPlayerInputs(newPlayerInputs);
    form.setValue("playerNames", newPlayerInputs);

    const currentSusPlayers = form.getValues("numSusPlayers");
    if (currentSusPlayers >= numPlayers) {
      form.setValue("numSusPlayers", Math.max(1, numPlayers - 1));
    }
  }, [numPlayers, form, isModification]);

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

    const initialRoundsSinceImposter = new Array(values.numPlayers).fill(0);

    saveGameState({
      ...values,
      roundsSinceImposter: initialRoundsSinceImposter,
      currentRound: 1,
    });
    toast.success("Game setup complete! Starting round...");
    navigate("/name-reveal", { state: { ...values, roundsSinceImposter: initialRoundsSinceImposter, currentRound: 1 } });
  };

  const handleGoBack = () => {
    navigate("/");
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-500 via-purple-500 to-yellow-500 dark:from-gray-900 dark:via-purple-900 dark:to-gray-800 text-white p-4"
    >
      <Card className="w-full max-w-md bg-card p-6 sm:p-8 rounded-2xl shadow-2xl text-card-foreground border-border">
        <div className="relative flex items-center justify-center mb-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleGoBack}
            className="absolute left-0 text-muted-foreground hover:text-foreground rounded-xl"
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
                    <NumberStepper
                      value={field.value}
                      onChange={field.onChange}
                      min={3}
                      max={20}
                      className="bg-green-100 dark:bg-green-500/20"
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
                    <NumberStepper
                      value={field.value}
                      onChange={field.onChange}
                      min={1}
                      max={numPlayers - 1}
                      className="bg-red-100 dark:bg-red-500/20"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Card className="bg-muted/50 p-4 rounded-xl shadow-inner border-border">
              <CardHeader className="p-0 pb-4">
                <CardTitle className="text-lg md:text-xl font-semibold text-purple-700 dark:text-purple-400 text-left">Player Names</CardTitle>
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
              name="topics"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base md:text-lg">Word Topics</FormLabel>
                  <FormControl>
                    <MultiSelect
                      options={wordCategories.map(cat => ({ value: cat, label: cat }))}
                      selected={field.value}
                      onChange={field.onChange}
                      placeholder="Select topics..."
                      className="w-full"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full bg-purple-700 text-white hover:bg-purple-800 dark:bg-purple-600 dark:hover:bg-purple-700 text-base md:text-lg py-6 rounded-xl transition-all duration-300 ease-in-out transform hover:scale-105"
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
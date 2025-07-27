import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getWordPacks, saveWordPacks, getWordPackById, WordPack, WordPair } from "@/utils/wordPackStorage";
import { toast } from "sonner";
import { ArrowLeft, Plus, Trash2 } from "lucide-react";

const wordPairSchema = z.object({
  mainWord: z.string().min(1, "Main word cannot be empty."),
  susWord: z.string().min(1, "Sus word cannot be empty."),
});

const formSchema = z.object({
  name: z.string().min(1, "Pack name cannot be empty."),
  words: z.array(wordPairSchema).min(1, "You must add at least one word pair."),
});

const WordPackForm = () => {
  const navigate = useNavigate();
  const { packId } = useParams<{ packId: string }>();
  const isEditing = !!packId;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      words: [{ mainWord: "", susWord: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "words",
  });

  useEffect(() => {
    if (isEditing && packId) {
      const existingPack = getWordPackById(packId);
      if (existingPack) {
        form.reset(existingPack);
      } else {
        toast.error("Word pack not found.");
        navigate("/word-packs");
      }
    }
  }, [isEditing, packId, form, navigate]);

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    const packs = getWordPacks();
    
    // Reconstruct the words array to satisfy TypeScript's strictness
    const newWords: WordPair[] = values.words.map(word => ({
        mainWord: word.mainWord,
        susWord: word.susWord,
    }));

    if (isEditing && packId) {
      const updatedPacks = packs.map((pack) =>
        pack.id === packId
          ? { id: pack.id, name: values.name, words: newWords }
          : pack
      );
      saveWordPacks(updatedPacks);
      toast.success("Word pack updated!");
    } else {
      const newPack: WordPack = {
        id: new Date().toISOString(),
        name: values.name,
        words: newWords,
      };
      saveWordPacks([...packs, newPack]);
      toast.success("Word pack created!");
    }
    navigate("/word-packs");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-500 via-purple-500 to-yellow-500 text-white p-4">
      <Card className="w-full max-w-2xl bg-white p-6 sm:p-8 rounded-2xl shadow-2xl text-gray-800 border border-gray-200">
        <div className="relative flex items-center justify-center mb-6">
            <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate("/word-packs")}
                className="absolute left-0 text-gray-600 hover:text-purple-700 rounded-xl"
            >
                <ArrowLeft className="h-6 w-6" />
            </Button>
            <h2 className="text-2xl md:text-3xl font-bold">
                {isEditing ? "Edit Word Pack" : "Create Word Pack"}
            </h2>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Pack Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Family Inside Jokes" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Card>
              <CardHeader>
                <CardTitle>Word Pairs</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {fields.map((field, index) => (
                  <div key={field.id} className="flex items-end gap-2">
                    <FormField
                      control={form.control}
                      name={`words.${index}.mainWord`}
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormLabel>Main Word</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., Apple" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`words.${index}.susWord`}
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormLabel>Sus Word</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., Orange" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      onClick={() => remove(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => append({ mainWord: "", susWord: "" })}
                  className="flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" /> Add Word Pair
                </Button>
              </CardContent>
            </Card>

            <Button type="submit" className="w-full bg-purple-700 text-white hover:bg-purple-800 py-4">
              Save Pack
            </Button>
          </form>
        </Form>
      </Card>
    </div>
  );
};

export default WordPackForm;
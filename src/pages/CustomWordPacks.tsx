import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { ArrowLeft, PlusCircle, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { loadCustomPacks, saveCustomPacks } from "@/utils/wordPackStorage";

export interface WordPack {
  id: string;
  name: string;
  words: string[];
}

const CustomWordPacks = () => {
  const navigate = useNavigate();
  const [packs, setPacks] = useState<WordPack[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newPackName, setNewPackName] = useState("");
  const [newPackWords, setNewPackWords] = useState("");

  useEffect(() => {
    setPacks(loadCustomPacks());
  }, []);

  const handleGoBack = () => {
    navigate("/");
  };

  const handleSavePack = () => {
    if (!newPackName.trim()) {
      toast.error("Pack name cannot be empty.");
      return;
    }
    const words = newPackWords.split('\n').map(w => w.trim()).filter(w => w);
    if (words.length < 2) {
      toast.error("You need at least 2 words in a pack.");
      return;
    }

    const newPack: WordPack = {
      id: Date.now().toString(),
      name: newPackName.trim(),
      words: words,
    };

    const updatedPacks = [...packs, newPack];
    setPacks(updatedPacks);
    saveCustomPacks(updatedPacks);
    toast.success(`Pack "${newPack.name}" created!`);

    // Reset form and close dialog
    setNewPackName("");
    setNewPackWords("");
    setIsDialogOpen(false);
  };

  const handleDeletePack = (packId: string) => {
    const packToDelete = packs.find(p => p.id === packId);
    if (window.confirm(`Are you sure you want to delete the "${packToDelete?.name}" pack?`)) {
      const updatedPacks = packs.filter((pack) => pack.id !== packId);
      setPacks(updatedPacks);
      saveCustomPacks(updatedPacks);
      toast.info(`Pack "${packToDelete?.name}" deleted.`);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-500 via-purple-500 to-yellow-500 text-white p-4">
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
          <h2 className="text-2xl md:text-3xl font-bold">Custom Packs</h2>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="w-full mb-6 bg-purple-700 text-white hover:bg-purple-800">
              <PlusCircle className="mr-2 h-4 w-4" /> Create New Pack
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create a New Word Pack</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <Input
                placeholder="Pack Name (e.g., Inside Jokes)"
                value={newPackName}
                onChange={(e) => setNewPackName(e.target.value)}
              />
              <Textarea
                placeholder="Enter words, one per line..."
                value={newPackWords}
                onChange={(e) => setNewPackWords(e.target.value)}
                rows={8}
              />
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button onClick={handleSavePack}>Save Pack</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <div className="space-y-4">
          {packs.length > 0 ? (
            packs.map((pack) => (
              <Card key={pack.id} className="flex items-center justify-between p-4 bg-gray-50">
                <div>
                  <p className="font-semibold">{pack.name}</p>
                  <p className="text-sm text-gray-500">{pack.words.length} words</p>
                </div>
                <Button variant="ghost" size="icon" onClick={() => handleDeletePack(pack.id)}>
                  <Trash2 className="h-5 w-5 text-red-500" />
                </Button>
              </Card>
            ))
          ) : (
            <p className="text-center text-gray-500 py-8">
              You haven't created any custom packs yet.
            </p>
          )}
        </div>
      </Card>
    </div>
  );
};

export default CustomWordPacks;
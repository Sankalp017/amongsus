import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getWordPacks, saveWordPacks, WordPack } from "@/utils/wordPackStorage";
import { PlusCircle, Trash2, Edit, ArrowLeft } from "lucide-react";
import { toast } from "sonner";

const WordPacks = () => {
  const navigate = useNavigate();
  const [packs, setPacks] = useState<WordPack[]>([]);

  useEffect(() => {
    setPacks(getWordPacks());
  }, []);

  const handleDelete = (packId: string) => {
    const updatedPacks = packs.filter((pack) => pack.id !== packId);
    saveWordPacks(updatedPacks);
    setPacks(updatedPacks);
    toast.success("Word pack deleted!");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-500 via-purple-500 to-yellow-500 text-white p-4">
      <Card className="w-full max-w-2xl bg-white p-6 sm:p-8 rounded-2xl shadow-2xl text-gray-800 border border-gray-200">
        <div className="relative flex items-center justify-center mb-6">
            <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate("/")}
                className="absolute left-0 text-gray-600 hover:text-purple-700 rounded-xl"
            >
                <ArrowLeft className="h-6 w-6" />
            </Button>
            <h2 className="text-2xl md:text-3xl font-bold">
                Custom Word Packs
            </h2>
        </div>
        <Button
          onClick={() => navigate("/word-packs/new")}
          className="w-full bg-purple-700 text-white hover:bg-purple-800 text-base md:text-lg py-4 rounded-md transition-all duration-300 ease-in-out transform hover:scale-105 mb-6 flex items-center gap-2"
        >
          <PlusCircle className="h-5 w-5" /> Create New Pack
        </Button>
        <div className="space-y-4">
          {packs.length > 0 ? (
            packs.map((pack) => (
              <Card key={pack.id} className="flex items-center justify-between p-4 bg-gray-50">
                <p className="font-semibold text-lg">{pack.name}</p>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => navigate(`/word-packs/edit/${pack.id}`)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => handleDelete(pack.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </Card>
            ))
          ) : (
            <p className="text-center text-gray-500 py-8">
              You haven't created any word packs yet.
            </p>
          )}
        </div>
      </Card>
    </div>
  );
};

export default WordPacks;
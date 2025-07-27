export interface WordPair {
  mainWord: string;
  susWord: string;
}

export interface WordPack {
  id: string;
  name: string;
  words: WordPair[];
}

const STORAGE_KEY = "amongSusWordPacks";

export const getWordPacks = (): WordPack[] => {
  try {
    const serializedPacks = localStorage.getItem(STORAGE_KEY);
    if (serializedPacks === null) {
      return [];
    }
    return JSON.parse(serializedPacks);
  } catch (error) {
    console.error("Error loading word packs from localStorage:", error);
    return [];
  }
};

export const saveWordPacks = (packs: WordPack[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(packs));
  } catch (error) {
    console.error("Error saving word packs to localStorage:", error);
  }
};

export const getWordPackById = (id: string): WordPack | undefined => {
  const packs = getWordPacks();
  return packs.find(pack => pack.id === id);
};
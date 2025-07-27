import { WordPack } from "@/pages/CustomWordPacks";

const CUSTOM_PACKS_STORAGE_KEY = "amongSusCustomWordPacks";

export const loadCustomPacks = (): WordPack[] => {
  try {
    const serializedPacks = localStorage.getItem(CUSTOM_PACKS_STORAGE_KEY);
    if (serializedPacks === null) {
      return [];
    }
    return JSON.parse(serializedPacks);
  } catch (error) {
    console.error("Error loading custom word packs from localStorage:", error);
    return [];
  }
};

export const saveCustomPacks = (packs: WordPack[]) => {
  try {
    localStorage.setItem(CUSTOM_PACKS_STORAGE_KEY, JSON.stringify(packs));
  } catch (error) {
    console.error("Error saving custom word packs to localStorage:", error);
  }
};
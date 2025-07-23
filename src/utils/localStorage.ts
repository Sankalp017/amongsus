export const saveGameState = (gameState: any) => {
  try {
    localStorage.setItem("amongSusGameState", JSON.stringify(gameState));
  } catch (error) {
    console.error("Error saving game state to localStorage:", error);
  }
};

export const loadGameState = () => {
  try {
    const serializedState = localStorage.getItem("amongSusGameState");
    if (serializedState === null) {
      return undefined;
    }
    return JSON.parse(serializedState);
  } catch (error) {
    console.error("Error loading game state from localStorage:", error);
    return undefined;
  }
};

export const clearGameState = () => {
  try {
    localStorage.removeItem("amongSusGameState");
  } catch (error) {
    console.error("Error clearing game state from localStorage:", error);
  }
};
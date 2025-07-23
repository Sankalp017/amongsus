export const wordCategories = [
  "Movies 🎬",
  "Food 🍔",
  "Cities 🏙️",
  "Animals 🐾",
  "Random words 🎲",
  "Sports ⚽",
  "Games 🎮",
  "Slang 😎",
];

interface WordBank {
  [category: string]: string[];
}

const wordBank: WordBank = {
  "Movies 🎬": [
    "Titanic", "Avatar", "Inception", "Matrix", "Star Wars", "Pulp Fiction",
    "Forrest Gump", "Lion King", "Jurassic Park", "Interstellar", "Parasite",
    "Dune", "Oppenheimer", "Barbie", "Godfather", "Shawshank Redemption",
    "Lord of the Rings", "Harry Potter", "Avengers", "Casablanca", "Psycho",
    "Blade Runner", "Spirited Away", "Whiplash", "La La Land", "Jaws"
  ],
  "Food 🍔": [
    "Pizza", "Burger", "Sushi", "Pasta", "Taco", "Salad", "Curry", "Soup",
    "Sandwich", "Ice Cream", "Chocolate", "Cake", "Donut", "Fries", "Steak",
    "Pancakes", "Waffles", "Burrito", "Ramen", "Dumplings", "Croissant",
    "Smoothie", "Lasagna", "Muffin", "Brownie"
  ],
  "Cities 🏙️": [
    "Paris", "London", "Tokyo", "New York", "Rome", "Dubai", "Sydney", "Cairo",
    "Rio de Janeiro", "Berlin", "Moscow", "Beijing", "Mumbai", "Toronto",
    "Amsterdam", "Barcelona", "Seoul", "Mexico City", "Istanbul", "Bangkok",
    "Prague", "Vienna", "Kyoto", "Venice", "Florence"
  ],
  "Animals 🐾": [ // New category with words
    "Lion", "Tiger", "Elephant", "Giraffe", "Zebra", "Kangaroo", "Panda",
    "Dolphin", "Whale", "Shark", "Penguin", "Owl", "Eagle", "Wolf", "Bear",
    "Fox", "Rabbit", "Squirrel", "Hedgehog", "Koala", "Chimpanzee", "Gorilla",
    "Crocodile", "Snake", "Spider", "Butterfly", "Bee", "Ant", "Fish", "Octopus"
  ],
  "Random words 🎲": [
    "Cloud", "Ocean", "Mountain", "Forest", "River", "Desert", "Island", "Star",
    "Moon", "Sun", "Rainbow", "Whisper", "Echo", "Shadow", "Dream", "Journey",
    "Mystery", "Silence", "Freedom", "Harmony", "Adventure", "Discovery",
    "Courage", "Wisdom", "Serenity", "Tranquility", "Imagination", "Curiosity",
    "Innovation", "Creativity", "Happiness", "Laughter", "Friendship", "Love",
    "Kindness", "Empathy", "Gratitude", "Patience", "Resilience", "Optimism",
    "Starlight", "Waterfall", "Blossom", "Enigma", "Labyrinth", "Mirage",
    "Solstice", "Aurora", "Cascade", "Ephemeral", "Glimmer", "Nostalgia"
  ],
  "Sports ⚽": [
    "Football", "Basketball", "Tennis", "Soccer", "Baseball", "Volleyball",
    "Swimming", "Cycling", "Running", "Golf", "Boxing", "Cricket", "Rugby",
    "Hockey", "Badminton", "Skiing", "Snowboarding", "Surfing", "Skateboarding",
    "Gymnastics", "Athletics", "Wrestling", "Judo", "Karate", "Fencing"
  ],
  "Games 🎮": [
    "Chess", "Monopoly", "Poker", "Scrabble", "Dominoes", "Jenga", "Uno",
    "Checkers", "Backgammon", "Bingo", "Charades", "Pictionary", "Twister",
    "Connect Four", "Battleship", "Risk", "Clue", "Catan", "Ticket to Ride",
    "Mahjong", "Sudoku", "Crossword", "Solitaire", "Minesweeper"
  ],
  "Slang 😎": [
    "Lit", "Dope", "Slay", "Cap", "No Cap", "Bet", "Ghosting", "Simp", "Flex",
    "Vibe", "Chill", "Bae", "GOAT", "Salty", "Cringe", "Boujee", "Gucci",
    "Finna", "Yeet", "Sus", "Bussin", "Rizz", "Glow Up", "FOMO", "IMO", "IRL"
  ],
};

export const getWordsForTopic = (topic: string, numSusPlayers: number): { mainWord: string; susWord: string } => {
  const categoryWords = wordBank[topic] || wordBank["Random words 🎲"];

  if (categoryWords.length < 2) {
    // Fallback if a category has too few words
    const randomWordsFallback = wordBank["Random words 🎲"];
    const word1 = randomWordsFallback[Math.floor(Math.random() * randomWordsFallback.length)];
    let word2 = randomWordsFallback[Math.floor(Math.random() * randomWordsFallback.length)];
    while (word1 === word2 && randomWordsFallback.length > 1) {
      word2 = randomWordsFallback[Math.floor(Math.random() * randomWordsFallback.length)];
    }
    return { mainWord: word1, susWord: word2 };
  }

  // Select two distinct words from the category
  const shuffledWords = [...categoryWords].sort(() => 0.5 - Math.random());
  const mainWord = shuffledWords[0];
  let susWord = shuffledWords[1];

  // Ensure susWord is different from mainWord
  if (mainWord === susWord && shuffledWords.length > 2) {
    susWord = shuffledWords[2]; // Pick a third word if the first two are identical
  } else if (mainWord === susWord && shuffledWords.length === 2) {
    // If only two words and they are the same (shouldn't happen with distinct words),
    // or if we need a different word and only two exist, pick a random word from another category.
    const otherCategories = Object.keys(wordBank).filter(cat => cat !== topic);
    if (otherCategories.length > 0) {
      const fallbackCategory = wordBank[otherCategories[0]];
      if (fallbackCategory && fallbackCategory.length > 0) {
        susWord = fallbackCategory[Math.floor(Math.random() * fallbackCategory.length)];
      }
    }
  }

  return { mainWord, susWord };
};
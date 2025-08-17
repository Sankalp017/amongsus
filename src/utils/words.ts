export const wordCategories = [
  "🐘 Animals",
  "🏙️ Cities",
  "🏎️ Formula 1 Teams",
  "🍔 Food",
  "🎬 Movies",
  "🎲 Random words",
  "📚 School Subjects",
  "🏆 Sports", // Changed icon from ⚽ to 🏆
  "⚽ Premier League Teams",
  "📺 TV Series",
];

interface WordBank {
  [category: string]: string[];
}

const wordBank: WordBank = {
  "🎬 Movies": [
    "Titanic", "Avatar", "Inception", "Matrix", "Star Wars", "Pulp Fiction",
    "Forrest Gump", "Lion King", "Jurassic Park", "Interstellar", "Parasite",
    "Dune", "Oppenheimer", "Barbie", "Godfather", "Shawshank Redemption",
    "Lord of the Rings", "Harry Potter", "Avengers", "Casablanca", "Psycho",
    "Blade Runner", "Spirited Away", "Whiplash", "La La Land", "Jaws"
  ],
  "🍔 Food": [
    "Pizza", "Burger", "Sushi", "Pasta", "Taco", "Salad", "Curry", "Soup",
    "Sandwich", "Ice Cream", "Chocolate", "Cake", "Donut", "Fries", "Steak",
    "Pancakes", "Waffles", "Burrito", "Ramen", "Dumplings", "Croissant",
    "Smoothie", "Lasagna", "Muffin", "Brownie"
  ],
  "🏙️ Cities": [
    "Paris", "London", "Tokyo", "New York", "Rome", "Dubai", "Sydney", "Cairo",
    "Rio de Janeiro", "Berlin", "Moscow", "Beijing", "Mumbai", "Toronto",
    "Amsterdam", "Barcelona", "Seoul", "Mexico City", "Istanbul", "Bangkok",
    "Prague", "Vienna", "Kyoto", "Venice", "Florence"
  ],
  "🐘 Animals": [
    "Lion", "Tiger", "Elephant", "Giraffe", "Zebra", "Kangaroo", "Panda",
    "Dolphin", "Whale", "Shark", "Penguin", "Owl", "Eagle", "Wolf", "Bear",
    "Fox", "Rabbit", "Squirrel", "Hedgehog", "Koala", "Chimpanzee", "Gorilla",
    "Crocodile", "Snake", "Spider", "Butterfly", "Bee", "Ant", "Fish", "Octopus"
  ],
  "🎲 Random words": [
    "Cloud", "Ocean", "Mountain", "Forest", "River", "Desert", "Island", "Star",
    "Moon", "Sun", "Rainbow", "Whisper", "Echo", "Shadow", "Dream", "Journey",
    "Mystery", "Silence", "Freedom", "Harmony", "Adventure", "Discovery",
    "Courage", "Wisdom", "Serenity", "Tranquility", "Imagination", "Curiosity",
    "Innovation", "Creativity", "Happiness", "Laughter", "Friendship", "Love",
    "Kindness", "Empathy", "Gratitude", "Patience", "Resilience", "Optimism",
    "Starlight", "Waterfall", "Blossom", "Enigma", "Labyrinth", "Mirage",
    "Solstice", "Aurora", "Cascade", "Ephemeral", "Glimmer", "Nostalgia"
  ],
  "📚 School Subjects": [
    "Algebra", "Geometry", "Calculus", "Physics", "Chemistry", "Biology",
    "History", "Social Studies", "Geography", "Literature", "Grammar",
    "Writing", "Art", "Music", "Drama", "Physical Education",
    "Computer Science", "Economics", "Sociology", "Psychology",
    "Philosophy", "Ethics", "Civics", "Government", "Statistics", "Trigonometry"
  ],
  "🏆 Sports": [ // Key updated to match the new category name
    "Football", "Basketball", "Tennis", "Soccer", "Baseball", "Volleyball",
    "Swimming", "Cycling", "Running", "Golf", "Boxing", "Cricket", "Rugby",
    "Hockey", "Badminton", "Skiing", "Snowboarding", "Surfing", "Skateboarding",
    "Gymnastics", "Athletics", "Wrestling", "Judo", "Karate", "Fencing"
  ],
  "🏎️ Formula 1 Teams": [
    "Red Bull Racing", "Mercedes", "Ferrari", "McLaren", "Aston Martin",
    "Alpine", "Williams", "Sauber", "Haas"
  ],
  "⚽ Premier League Teams": [
    "Arsenal", "Aston Villa", "Bournemouth", "Brentford", "Brighton",
    "Chelsea", "Crystal Palace", "Everton", "Fulham", "Ipswich Town",
    "Leicester City", "Liverpool", "Manchester City", "Manchester United",
    "Newcastle United", "Nottingham Forest",
    "Southampton", "Tottenham Hotspur", "West Ham United",
    "Wolverhampton Wanderers"
  ],
  "📺 TV Series": [
    "Game of Thrones", "Breaking Bad", "Stranger Things", "The Office", "Friends",
    "The Crown", "Squid Game", "The Mandalorian", "Chernobyl", "Queen's Gambit",
    "Succession", "Ted Lasso", "Wednesday", "House of the Dragon", "The Last of Us",
    "Severance", "Yellowstone", "Peaky Blinders", "Money Heist", "The Boys",
    "Arcane", "Dahmer", "Only Murders in the Building", "Euphoria", "The Witcher"
  ],
};

export const getWordsForTopic = (topic: string, numSusPlayers: number): { mainWord: string; susWord: string } => {
  // The topic string now directly matches the keys in wordBank
  const categoryWords = wordBank[topic] || wordBank["🎲 Random words"]; // Updated default topic

  if (categoryWords.length < 2) {
    const randomWordsFallback = wordBank["🎲 Random words"]; // Updated fallback topic
    const word1 = randomWordsFallback[Math.floor(Math.random() * randomWordsFallback.length)];
    let word2 = randomWordsFallback[Math.floor(Math.random() * randomWordsFallback.length)];
    while (word1 === word2 && randomWordsFallback.length > 1) {
      word2 = randomWordsFallback[Math.floor(Math.random() * randomWordsFallback.length)];
    }
    return { mainWord: word1, susWord: word2 };
  }

  const shuffledWords = [...categoryWords].sort(() => 0.5 - Math.random());
  const mainWord = shuffledWords[0];
  let susWord = shuffledWords[1];

  if (mainWord === susWord && shuffledWords.length > 2) {
    susWord = shuffledWords[2];
  } else if (mainWord === susWord && shuffledWords.length === 2) {
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
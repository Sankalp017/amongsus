export const wordCategories = {
  "Movies": [
    { main: "Superhero", sus: "Villain" },
    { main: "Comedy", sus: "Tragedy" },
    { main: "Action", sus: "Drama" },
    { main: "Sci-Fi", sus: "Fantasy" },
    { main: "Horror", sus: "Thriller" },
    { main: "Musical", sus: "Concert" },
    { main: "Documentary", sus: "Biography" },
    { main: "Animation", sus: "Cartoon" },
    { main: "Western", sus: "Cowboy" },
    { main: "Romance", sus: "Love Story" },
  ],
  "Food": [
    { main: "Pizza", sus: "Calzone" },
    { main: "Burger", sus: "Sandwich" },
    { main: "Pasta", sus: "Noodles" },
    { main: "Sushi", sus: "Sashimi" },
    { main: "Taco", sus: "Burrito" },
    { main: "Curry", sus: "Stew" },
    { main: "Soup", sus: "Broth" },
    { main: "Salad", sus: "Greens" },
    { main: "Cake", sus: "Muffin" },
    { main: "Ice Cream", sus: "Gelato" },
  ],
  "Cities": [
    { main: "Paris", sus: "Rome" },
    { main: "London", sus: "Dublin" },
    { main: "New York", sus: "Chicago" },
    { main: "Tokyo", sus: "Kyoto" },
    { main: "Sydney", sus: "Melbourne" },
    { main: "Cairo", sus: "Luxor" },
    { main: "Rio", sus: "Sao Paulo" },
    { main: "Berlin", sus: "Munich" },
    { main: "Dubai", sus: "Abu Dhabi" },
    { main: "Amsterdam", sus: "Brussels" },
  ],
  "Random words": [
    { main: "Chair", sus: "Stool" },
    { main: "Cloud", sus: "Fog" },
    { main: "Ocean", sus: "Lake" },
    { main: "Book", sus: "Magazine" },
    { main: "Tree", sus: "Bush" },
    { main: "Mountain", sus: "Hill" },
    { main: "River", sus: "Stream" },
    { main: "Flower", sus: "Plant" },
    { main: "Window", sus: "Door" },
    { main: "Key", sus: "Lock" },
  ],
  "Sports": [
    { main: "Football", sus: "Rugby" },
    { main: "Basketball", sus: "Volleyball" },
    { main: "Tennis", sus: "Badminton" },
    { main: "Swimming", sus: "Diving" },
    { main: "Cycling", sus: "Running" },
    { main: "Baseball", sus: "Softball" },
    { main: "Golf", sus: "Putt" },
    { main: "Boxing", sus: "Wrestling" },
    { main: "Skiing", sus: "Snowboarding" },
    { main: "Hockey", sus: "Lacrosse" },
  ],
  "Games": [
    { main: "Chess", sus: "Checkers" },
    { main: "Monopoly", sus: "Risk" },
    { main: "Poker", sus: "Blackjack" },
    { main: "Scrabble", sus: "Boggle" },
    { main: "Jenga", sus: "Blocks" },
    { main: "Dominoes", sus: "Tiles" },
    { main: "Charades", sus: "Pictionary" },
    { main: "Bingo", sus: "Lotto" },
    { main: "Sudoku", sus: "Crossword" },
    { main: "Tic-Tac-Toe", sus: "Connect Four" },
  ],
  "Slang": [
    { main: "Lit", sus: "Fire" },
    { main: "Cap", sus: "Lie" },
    { main: "Bet", sus: "Okay" },
    { main: "Drip", sus: "Style" },
    { main: "Ghosting", sus: "Ignoring" },
    { main: "Slay", sus: "Win" },
    { main: "Simp", sus: "Fan" },
    { main: "Vibe", sus: "Mood" },
    { main: "No Cap", sus: "Seriously" },
    { main: "Bussin'", sus: "Delicious" },
  ],
};

export type WordPair = {
  main: string;
  sus: string;
};

export type PlayerRole = {
  name: string;
  word: string;
  isSus: boolean;
};

export const getRandomWordPair = (topic: string): WordPair => {
  const category = wordCategories[topic as keyof typeof wordCategories];
  if (!category || category.length === 0) {
    // Fallback to Random words if topic is not found or empty
    const randomWords = wordCategories["Random words"];
    const randomIndex = Math.floor(Math.random() * randomWords.length);
    return randomWords[randomIndex];
  }
  const randomIndex = Math.floor(Math.random() * category.length);
  return category[randomIndex];
};

export const assignRolesAndWords = (
  playerNames: string[],
  numSusPlayers: number,
  topic: string,
): PlayerRole[] => {
  const { main, sus } = getRandomWordPair(topic);

  let roles: PlayerRole[] = playerNames.map((name) => ({
    name,
    word: main,
    isSus: false,
  }));

  // Randomly assign sus roles
  const shuffledIndices = Array.from({ length: playerNames.length }, (_, i) => i).sort(() => Math.random() - 0.5);
  for (let i = 0; i < numSusPlayers; i++) {
    roles[shuffledIndices[i]].word = sus;
    roles[shuffledIndices[i]].isSus = true;
  }

  // Shuffle the roles again to randomize the reveal order
  return roles.sort(() => Math.random() - 0.5);
};
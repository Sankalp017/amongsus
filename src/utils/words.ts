export const wordTopics = {
    "🍎 Fruits": {
        main: ["Apple", "Banana", "Orange", "Grape", "Strawberry", "Blueberry", "Watermelon", "Pineapple", "Mango", "Peach"],
        sus: ["Tomato", "Cucumber", "Zucchini", "Bell Pepper", "Avocado", "Eggplant", "Pumpkin", "Olive", "Corn", "Pea"]
    },
    "🐶 Animals": {
        main: ["Dog", "Cat", "Lion", "Tiger", "Elephant", "Giraffe", "Zebra", "Monkey", "Bear", "Hippo"],
        sus: ["Human", "Dinosaur", "Dragon", "Unicorn", "Griffin", "Phoenix", "Centaur", "Minotaur", "Gorgon", "Hydra"]
    },
    "🚗 Vehicles": {
        main: ["Car", "Bus", "Motorcycle", "Bicycle", "Train", "Airplane", "Boat", "Helicopter", "Scooter", "Truck"],
        sus: ["Skateboard", "Roller Skates", "Wheelchair", "Submarine", "Spaceship", "Hot Air Balloon", "Jet Ski", "Tricycle", "Unicycle", "Segway"]
    },
    "💻 Technology": {
        main: ["Computer", "Smartphone", "Laptop", "Tablet", "Television", "Camera", "Headphones", "Keyboard", "Mouse", "Printer"],
        sus: ["Book", "Pen", "Paper", "Calculator", "Typewriter", "Abacus", "Compass", "Telescope", "Microscope", "Clock"]
    },
    "📱 Apps": {
        main: ["WhatsApp", "Telegram", "Instagram", "Facebook", "TikTok", "Twitter", "Snapchat", "YouTube", "Spotify", "Netflix", "Uber", "LinkedIn", "Pinterest", "Reddit", "Discord", "Zoom", "Google Maps", "Amazon", "Tinder", "Shazam"],
        sus: ["Google", "Apple", "Microsoft", "Meta", "IBM", "Oracle", "Adobe", "Salesforce", "SAP", "Intel"]
    },
    "🎲 Random words": {
        main: ["Spoon", "Chair", "Cloud", "Guitar", "Mountain", "River", "Bridge", "Key", "Bottle", "Lamp", "Shoe", "Hat", "Sun", "Moon", "Star"],
        sus: ["Fork", "Table", "Rain", "Piano", "Hill", "Lake", "Tunnel", "Lock", "Cup", "Lightbulb", "Sock", "Cap", "Planet", "Comet", "Galaxy"]
    }
};

const getRandomElement = <T,>(arr: T[]): T => {
    return arr[Math.floor(Math.random() * arr.length)];
};

export const getWordsForTopic = (topic: string, numSusPlayers: number) => {
    let effectiveTopic = topic;
    if (topic === "🎲 Random words") {
        const allTopics = Object.keys(wordTopics).filter(t => t !== "🎲 Random words");
        effectiveTopic = getRandomElement(allTopics);
    }

    const words = wordTopics[effectiveTopic as keyof typeof wordTopics];

    if (!words) {
        // Fallback if topic is somehow invalid
        const fallbackWords = wordTopics["🎲 Random words"];
        const mainWord = getRandomElement(fallbackWords.main);
        let susWord = getRandomElement(fallbackWords.sus);
        while (mainWord === susWord) {
            susWord = getRandomElement(fallbackWords.sus);
        }
        return { mainWord, susWord };
    }

    const mainWord = getRandomElement(words.main);
    let susWord = getRandomElement(words.sus);

    while (mainWord === susWord) {
        susWord = getRandomElement(words.sus);
    }

    return { mainWord, susWord };
};
export const speakText = (text: string) => {
  if ("speechSynthesis" in window) {
    const utterance = new SpeechSynthesisUtterance(text);
    // Try to find a female voice
    const voices = window.speechSynthesis.getVoices();
    const femaleVoice = voices.find(
      (voice) => voice.lang.startsWith("en") && (voice.name.includes("Female") || voice.name.includes("Google US English"))
    );
    if (femaleVoice) {
      utterance.voice = femaleVoice;
    }
    utterance.rate = 0.9; // Slightly slower for clarity
    window.speechSynthesis.speak(utterance);
  } else {
    console.warn("Speech Synthesis API not supported in this browser.");
  }
};
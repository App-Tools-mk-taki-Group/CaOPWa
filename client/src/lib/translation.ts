// Offline translation library
// This is a simple translation dictionary for demonstration
// In a real application, you might use a more sophisticated offline translation library

interface TranslationDict {
  [key: string]: {
    [key: string]: string;
  };
}

const translations: TranslationDict = {
  en: {
    hello: "Hello",
    "thank you": "Thank you",
    "good morning": "Good morning",
    "how are you": "How are you?",
    yes: "Yes",
    no: "No",
    please: "Please",
    goodbye: "Goodbye",
  },
  ja: {
    hello: "こんにちは",
    "thank you": "ありがとう",
    "good morning": "おはよう",
    "how are you": "元気ですか？",
    yes: "はい",
    no: "いいえ",
    please: "お願いします",
    goodbye: "さようなら",
  },
  ko: {
    hello: "안녕하세요",
    "thank you": "감사합니다",
    "good morning": "좋은 아침",
    "how are you": "어떻게 지내세요?",
    yes: "네",
    no: "아니요",
    please: "제발",
    goodbye: "안녕히 가세요",
  },
  zh: {
    hello: "你好",
    "thank you": "谢谢",
    "good morning": "早上好",
    "how are you": "你好吗？",
    yes: "是",
    no: "不",
    please: "请",
    goodbye: "再见",
  },
  es: {
    hello: "Hola",
    "thank you": "Gracias",
    "good morning": "Buenos días",
    "how are you": "¿Cómo estás?",
    yes: "Sí",
    no: "No",
    please: "Por favor",
    goodbye: "Adiós",
  },
  fr: {
    hello: "Bonjour",
    "thank you": "Merci",
    "good morning": "Bonjour",
    "how are you": "Comment allez-vous?",
    yes: "Oui",
    no: "Non",
    please: "S'il vous plaît",
    goodbye: "Au revoir",
  },
  de: {
    hello: "Hallo",
    "thank you": "Danke",
    "good morning": "Guten Morgen",
    "how are you": "Wie geht es dir?",
    yes: "Ja",
    no: "Nein",
    please: "Bitte",
    goodbye: "Auf Wiedersehen",
  },
};

export function translateText(text: string, fromLang: string, toLang: string): string {
  if (fromLang === toLang) {
    return text;
  }

  const lowerText = text.toLowerCase().trim();
  
  // Check for exact matches in our translation dictionary
  if (translations[toLang] && translations[toLang][lowerText]) {
    return translations[toLang][lowerText];
  }

  // For simple demonstration, we'll do basic word substitution
  // In a real application, you would use a more sophisticated translation engine
  const words = lowerText.split(' ');
  const translatedWords = words.map(word => {
    if (translations[toLang] && translations[toLang][word]) {
      return translations[toLang][word];
    }
    return word; // Return original word if no translation found
  });

  // Basic pattern matching for simple sentences
  if (lowerText.includes('hello') && toLang === 'ja') {
    return 'こんにちは';
  }
  if (lowerText.includes('thank you') && toLang === 'ja') {
    return 'ありがとうございます';
  }

  return translatedWords.join(' ') || `[${toLang.toUpperCase()}] ${text}`;
}

export const supportedLanguages = [
  { code: 'en', name: 'English' },
  { code: 'ja', name: 'Japanese' },
  { code: 'ko', name: 'Korean' },
  { code: 'zh', name: 'Chinese' },
  { code: 'es', name: 'Spanish' },
  { code: 'fr', name: 'French' },
  { code: 'de', name: 'German' },
];

export const quickPhrases = [
  "Hello",
  "Thank you",
  "Good morning",
  "How are you?",
  "Yes",
  "No",
  "Please",
  "Goodbye",
];

// Utility functions for various tools

export interface CalculatorState {
  display: string;
  previousValue: number | null;
  operation: string | null;
  waitingForNewNumber: boolean;
}

export const calculateResult = (prev: number, current: number, operation: string): number => {
  switch (operation) {
    case '+':
      return prev + current;
    case '-':
      return prev - current;
    case '*':
      return prev * current;
    case '/':
      return current !== 0 ? prev / current : 0;
    default:
      return current;
  }
};

// Unit conversion functions
export const lengthConversions = {
  m: {
    m: 1,
    km: 0.001,
    ft: 3.28084,
    in: 39.3701,
    cm: 100,
    mm: 1000,
  },
  km: {
    m: 1000,
    km: 1,
    ft: 3280.84,
    in: 39370.1,
    cm: 100000,
    mm: 1000000,
  },
  ft: {
    m: 0.3048,
    km: 0.0003048,
    ft: 1,
    in: 12,
    cm: 30.48,
    mm: 304.8,
  },
  in: {
    m: 0.0254,
    km: 0.0000254,
    ft: 0.0833333,
    in: 1,
    cm: 2.54,
    mm: 25.4,
  },
  cm: {
    m: 0.01,
    km: 0.00001,
    ft: 0.0328084,
    in: 0.393701,
    cm: 1,
    mm: 10,
  },
  mm: {
    m: 0.001,
    km: 0.000001,
    ft: 0.00328084,
    in: 0.0393701,
    cm: 0.1,
    mm: 1,
  },
};

export const weightConversions = {
  kg: {
    kg: 1,
    g: 1000,
    lb: 2.20462,
    oz: 35.274,
  },
  g: {
    kg: 0.001,
    g: 1,
    lb: 0.00220462,
    oz: 0.035274,
  },
  lb: {
    kg: 0.453592,
    g: 453.592,
    lb: 1,
    oz: 16,
  },
  oz: {
    kg: 0.0283495,
    g: 28.3495,
    lb: 0.0625,
    oz: 1,
  },
};

export const temperatureConversions = {
  celsius: {
    celsius: (c: number) => c,
    fahrenheit: (c: number) => (c * 9/5) + 32,
    kelvin: (c: number) => c + 273.15,
  },
  fahrenheit: {
    celsius: (f: number) => (f - 32) * 5/9,
    fahrenheit: (f: number) => f,
    kelvin: (f: number) => (f - 32) * 5/9 + 273.15,
  },
  kelvin: {
    celsius: (k: number) => k - 273.15,
    fahrenheit: (k: number) => (k - 273.15) * 9/5 + 32,
    kelvin: (k: number) => k,
  },
};

export const convertUnit = (value: number, fromUnit: string, toUnit: string, type: 'length' | 'weight' | 'temperature'): number => {
  if (type === 'temperature') {
    const converter = temperatureConversions[fromUnit as keyof typeof temperatureConversions];
    if (converter) {
      return converter[toUnit as keyof typeof converter](value);
    }
    return value;
  }
  
  const conversions = type === 'length' ? lengthConversions : weightConversions;
  const fromConversion = conversions[fromUnit as keyof typeof conversions];
  
  if (fromConversion) {
    return value * fromConversion[toUnit as keyof typeof fromConversion];
  }
  
  return value;
};

// Color utility functions
export const hexToRgb = (hex: string): { r: number; g: number; b: number } | null => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
};

export const rgbToHex = (r: number, g: number, b: number): string => {
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
};

export const rgbToHsl = (r: number, g: number, b: number): { h: number; s: number; l: number } => {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s, l = (max + min) / 2;

  if (max === min) {
    h = s = 0; // achromatic
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }

  return { h: h * 360, s: s * 100, l: l * 100 };
};

// Text analysis functions
export const analyzeText = (text: string) => {
  const words = text.trim().split(/\s+/).filter(word => word.length > 0);
  const characters = text.length;
  const charactersNoSpaces = text.replace(/\s/g, '').length;
  const sentences = text.split(/[.!?]+/).filter(sentence => sentence.trim().length > 0).length;
  const paragraphs = text.split(/\n\s*\n/).filter(paragraph => paragraph.trim().length > 0).length;

  return {
    words: words.length,
    characters,
    charactersNoSpaces,
    sentences,
    paragraphs,
    avgWordsPerSentence: sentences > 0 ? Math.round((words.length / sentences) * 100) / 100 : 0,
  };
};

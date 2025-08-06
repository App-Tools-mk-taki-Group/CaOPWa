import { useState } from "react";
import { Languages, RotateCcw, Keyboard } from "lucide-react";
import { VirtualKeyboard } from "./virtual-keyboard";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { translateText, supportedLanguages, quickPhrases } from "@/lib/translation";

export default function Translator() {
  const [fromLanguage, setFromLanguage] = useState("en");
  const [toLanguage, setToLanguage] = useState("ja");
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [showKeyboard, setShowKeyboard] = useState(false);

  const handleTranslate = () => {
    if (inputText.trim()) {
      const translated = translateText(inputText.trim(), fromLanguage, toLanguage);
      setOutputText(translated);
    }
  };

  const handleQuickPhrase = (phrase: string) => {
    setInputText(phrase);
  };

  const swapLanguages = () => {
    setFromLanguage(toLanguage);
    setToLanguage(fromLanguage);
    setInputText(outputText);
    setOutputText(inputText);
  };

  const handleKeyboardInput = (key: string) => {
    setInputText(inputText + key);
  };

  const handleKeyboardBackspace = () => {
    setInputText(inputText.slice(0, -1));
  };

  const handleKeyboardSpace = () => {
    setInputText(inputText + ' ');
  };

  return (
    <div className="glass-morphism rounded-xl p-6" data-testid="translator-component">
      <h2 className="text-xl font-semibold mb-4 flex items-center">
        <Languages className="cosmic-accent mr-3" size={20} />
        Universal Translator
      </h2>
      
      {/* Language Selection */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium mb-2 cosmic-accent">From</label>
          <Select value={fromLanguage} onValueChange={setFromLanguage}>
            <SelectTrigger className="w-full cosmic-blue border border-[hsl(174,100%,70%)] border-opacity-30 rounded-lg cosmic-text focus:border-[hsl(174,100%,70%)]" data-testid="select-from-language">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="cosmic-blue border border-[hsl(174,100%,70%)] border-opacity-30">
              {supportedLanguages.map((lang) => (
                <SelectItem key={lang.code} value={lang.code} className="cosmic-text hover:bg-[hsl(174,100%,70%)] hover:text-[hsl(217,41%,11%)]">
                  {lang.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2 cosmic-accent">To</label>
          <div className="flex space-x-2">
            <Select value={toLanguage} onValueChange={setToLanguage}>
              <SelectTrigger className="flex-1 cosmic-blue border border-[hsl(174,100%,70%)] border-opacity-30 rounded-lg cosmic-text focus:border-[hsl(174,100%,70%)]" data-testid="select-to-language">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="cosmic-blue border border-[hsl(174,100%,70%)] border-opacity-30">
                {supportedLanguages.map((lang) => (
                  <SelectItem key={lang.code} value={lang.code} className="cosmic-text hover:bg-[hsl(174,100%,70%)] hover:text-[hsl(217,41%,11%)]">
                    {lang.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              size="sm"
              onClick={swapLanguages}
              className="p-2 cosmic-blue border-[hsl(174,100%,70%)] border-opacity-30 hover:bg-[hsl(174,100%,70%)] hover:text-[hsl(217,41%,11%)]"
              data-testid="button-swap-languages"
            >
              <RotateCcw size={16} />
            </Button>
          </div>
        </div>
      </div>
      
      {/* Input Text */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium cosmic-accent">Input Text</label>
          <Button
            onClick={() => setShowKeyboard(!showKeyboard)}
            variant="outline"
            size="sm"
            className="border-cosmic-accent/30 text-cosmic-accent hover:bg-cosmic-accent/20"
            data-testid="button-toggle-keyboard-translator"
          >
            <Keyboard size={14} />
          </Button>
        </div>
        <Textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          rows={4}
          placeholder="Enter text to translate..."
          className="w-full cosmic-blue border border-[hsl(174,100%,70%)] border-opacity-30 rounded-lg px-3 py-2 cosmic-text placeholder:text-[hsl(217,32%,91%)] placeholder:opacity-50 focus:outline-none focus:border-[hsl(174,100%,70%)] resize-none"
          data-testid="textarea-input-text"
        />
      </div>
      
      {/* Translate Button */}
      <Button
        onClick={handleTranslate}
        disabled={!inputText.trim()}
        className="w-full bg-[hsl(174,100%,70%)] text-[hsl(217,41%,11%)] py-2 rounded-lg font-medium hover:bg-opacity-80 transition-all mb-4 disabled:opacity-50"
        data-testid="button-translate"
      >
        <RotateCcw className="mr-2" size={16} />
        Translate
      </Button>
      
      {/* Output Text */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2 cosmic-accent">Translation</label>
        <div
          className="w-full cosmic-surface border border-[hsl(174,100%,70%)] border-opacity-30 rounded-lg px-3 py-2 cosmic-text min-h-[100px] whitespace-pre-wrap"
          data-testid="text-translation-output"
        >
          {outputText || "Translation result will appear here"}
        </div>
      </div>
      
      {/* Quick Phrases */}
      <div>
        <label className="block text-sm font-medium mb-2 cosmic-accent">Quick Phrases</label>
        <div className="flex flex-wrap gap-2">
          {quickPhrases.map((phrase) => (
            <Button
              key={phrase}
              variant="outline"
              size="sm"
              onClick={() => handleQuickPhrase(phrase)}
              className="px-3 py-1 text-xs cosmic-blue rounded-full hover:bg-[hsl(174,100%,70%)] hover:text-[hsl(217,41%,11%)] transition-all border-[hsl(174,100%,70%)] border-opacity-30"
              data-testid={`button-phrase-${phrase.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase()}`}
            >
              {phrase}
            </Button>
          ))}
        </div>
      </div>

      {/* Virtual Keyboard */}
      <VirtualKeyboard
        visible={showKeyboard}
        onKeyPress={handleKeyboardInput}
        onBackspace={handleKeyboardBackspace}
        onSpace={handleKeyboardSpace}
        onClose={() => setShowKeyboard(false)}
      />
    </div>
  );
}

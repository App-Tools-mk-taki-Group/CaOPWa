import { useState } from "react";
import { Settings, Calculator, ArrowRightLeft, Palette, FileText, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { 
  calculateResult, 
  convertUnit, 
  hexToRgb, 
  rgbToHex, 
  rgbToHsl, 
  analyzeText,
  type CalculatorState 
} from "@/lib/utils-tools";

export default function UtilityTools() {
  const [activeModal, setActiveModal] = useState<string | null>(null);

  const closeModal = () => setActiveModal(null);

  const tools = [
    {
      id: "calculator",
      name: "Calculator",
      icon: Calculator,
      component: <CalculatorTool onClose={closeModal} />,
    },
    {
      id: "converter",
      name: "Converter",
      icon: ArrowRightLeft,
      component: <ConverterTool onClose={closeModal} />,
    },
    {
      id: "colorPicker",
      name: "Color Picker",
      icon: Palette,
      component: <ColorPickerTool onClose={closeModal} />,
    },
    {
      id: "textCounter",
      name: "Text Counter",
      icon: FileText,
      component: <TextCounterTool onClose={closeModal} />,
    },
  ];

  return (
    <div className="glass-morphism rounded-xl p-6" data-testid="utility-tools-component">
      <h2 className="text-xl font-semibold mb-4 flex items-center">
        <Settings className="cosmic-accent mr-3" size={20} />
        Cosmic Tools
      </h2>
      
      <div className="grid grid-cols-2 gap-4">
        {tools.map((tool) => {
          const IconComponent = tool.icon;
          return (
            <div
              key={tool.id}
              className="glass-morphism rounded-lg p-4 hover:border-[hsl(174,100%,70%)] transition-all cursor-pointer"
              onClick={() => setActiveModal(tool.id)}
              data-testid={`tool-${tool.id}`}
            >
              <div className="text-center">
                <IconComponent className="cosmic-accent mb-2 mx-auto" size={24} />
                <div className="text-sm font-medium">{tool.name}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Tool Modals */}
      {tools.map((tool) => (
        <Dialog key={tool.id} open={activeModal === tool.id} onOpenChange={closeModal}>
          <DialogContent className="glass-morphism cosmic-text border-[hsl(174,100%,70%)] border-opacity-30">
            <DialogHeader>
              <DialogTitle className="cosmic-accent">{tool.name}</DialogTitle>
            </DialogHeader>
            {activeModal === tool.id && tool.component}
          </DialogContent>
        </Dialog>
      ))}
    </div>
  );
}

function CalculatorTool({ onClose }: { onClose: () => void }) {
  const [calc, setCalc] = useState<CalculatorState>({
    display: "0",
    previousValue: null,
    operation: null,
    waitingForNewNumber: false,
  });

  const inputNumber = (num: string) => {
    if (calc.waitingForNewNumber) {
      setCalc({
        ...calc,
        display: num,
        waitingForNewNumber: false,
      });
    } else {
      setCalc({
        ...calc,
        display: calc.display === "0" ? num : calc.display + num,
      });
    }
  };

  const inputOperation = (nextOperation: string) => {
    const inputValue = parseFloat(calc.display);

    if (calc.previousValue === null) {
      setCalc({
        ...calc,
        previousValue: inputValue,
        operation: nextOperation,
        waitingForNewNumber: true,
      });
    } else if (calc.operation) {
      const currentValue = calc.previousValue || 0;
      const newValue = calculateResult(currentValue, inputValue, calc.operation);

      setCalc({
        display: String(newValue),
        previousValue: newValue,
        operation: nextOperation,
        waitingForNewNumber: true,
      });
    }
  };

  const calculate = () => {
    const inputValue = parseFloat(calc.display);

    if (calc.previousValue !== null && calc.operation) {
      const newValue = calculateResult(calc.previousValue, inputValue, calc.operation);

      setCalc({
        display: String(newValue),
        previousValue: null,
        operation: null,
        waitingForNewNumber: true,
      });
    }
  };

  const clear = () => {
    setCalc({
      display: "0",
      previousValue: null,
      operation: null,
      waitingForNewNumber: false,
    });
  };

  return (
    <div className="space-y-4" data-testid="calculator-tool">
      <Input
        value={calc.display}
        readOnly
        className="text-right text-xl font-mono cosmic-blue border-[hsl(174,100%,70%)] border-opacity-30"
        data-testid="calculator-display"
      />
      
      <div className="grid grid-cols-4 gap-2">
        <Button onClick={clear} className="cosmic-blue hover:bg-[hsl(174,100%,70%)] hover:text-[hsl(217,41%,11%)]" data-testid="button-calc-clear">C</Button>
        <Button onClick={() => inputOperation("/")} className="cosmic-blue hover:bg-[hsl(174,100%,70%)] hover:text-[hsl(217,41%,11%)]" data-testid="button-calc-divide">÷</Button>
        <Button onClick={() => inputOperation("*")} className="cosmic-blue hover:bg-[hsl(174,100%,70%)] hover:text-[hsl(217,41%,11%)]" data-testid="button-calc-multiply">×</Button>
        <Button onClick={() => inputOperation("-")} className="cosmic-blue hover:bg-[hsl(174,100%,70%)] hover:text-[hsl(217,41%,11%)]" data-testid="button-calc-subtract">-</Button>
        
        <Button onClick={() => inputNumber("7")} className="cosmic-blue hover:bg-[hsl(174,100%,70%)] hover:text-[hsl(217,41%,11%)]" data-testid="button-calc-7">7</Button>
        <Button onClick={() => inputNumber("8")} className="cosmic-blue hover:bg-[hsl(174,100%,70%)] hover:text-[hsl(217,41%,11%)]" data-testid="button-calc-8">8</Button>
        <Button onClick={() => inputNumber("9")} className="cosmic-blue hover:bg-[hsl(174,100%,70%)] hover:text-[hsl(217,41%,11%)]" data-testid="button-calc-9">9</Button>
        <Button onClick={() => inputOperation("+")} className="cosmic-blue hover:bg-[hsl(174,100%,70%)] hover:text-[hsl(217,41%,11%)] row-span-2" data-testid="button-calc-add">+</Button>
        
        <Button onClick={() => inputNumber("4")} className="cosmic-blue hover:bg-[hsl(174,100%,70%)] hover:text-[hsl(217,41%,11%)]" data-testid="button-calc-4">4</Button>
        <Button onClick={() => inputNumber("5")} className="cosmic-blue hover:bg-[hsl(174,100%,70%)] hover:text-[hsl(217,41%,11%)]" data-testid="button-calc-5">5</Button>
        <Button onClick={() => inputNumber("6")} className="cosmic-blue hover:bg-[hsl(174,100%,70%)] hover:text-[hsl(217,41%,11%)]" data-testid="button-calc-6">6</Button>
        
        <Button onClick={() => inputNumber("1")} className="cosmic-blue hover:bg-[hsl(174,100%,70%)] hover:text-[hsl(217,41%,11%)]" data-testid="button-calc-1">1</Button>
        <Button onClick={() => inputNumber("2")} className="cosmic-blue hover:bg-[hsl(174,100%,70%)] hover:text-[hsl(217,41%,11%)]" data-testid="button-calc-2">2</Button>
        <Button onClick={() => inputNumber("3")} className="cosmic-blue hover:bg-[hsl(174,100%,70%)] hover:text-[hsl(217,41%,11%)]" data-testid="button-calc-3">3</Button>
        <Button onClick={calculate} className="cosmic-blue hover:bg-[hsl(174,100%,70%)] hover:text-[hsl(217,41%,11%)] row-span-2" data-testid="button-calc-equals">=</Button>
        
        <Button onClick={() => inputNumber("0")} className="cosmic-blue hover:bg-[hsl(174,100%,70%)] hover:text-[hsl(217,41%,11%)] col-span-2" data-testid="button-calc-0">0</Button>
        <Button onClick={() => inputNumber(".")} className="cosmic-blue hover:bg-[hsl(174,100%,70%)] hover:text-[hsl(217,41%,11%)]" data-testid="button-calc-decimal">.</Button>
      </div>
    </div>
  );
}

function ConverterTool({ onClose }: { onClose: () => void }) {
  const [conversionType, setConversionType] = useState("length");
  const [fromValue, setFromValue] = useState("");
  const [fromUnit, setFromUnit] = useState("m");
  const [toUnit, setToUnit] = useState("ft");
  const [result, setResult] = useState("");

  const unitOptions = {
    length: [
      { value: "m", label: "Meters" },
      { value: "km", label: "Kilometers" },
      { value: "ft", label: "Feet" },
      { value: "in", label: "Inches" },
      { value: "cm", label: "Centimeters" },
      { value: "mm", label: "Millimeters" },
    ],
    weight: [
      { value: "kg", label: "Kilograms" },
      { value: "g", label: "Grams" },
      { value: "lb", label: "Pounds" },
      { value: "oz", label: "Ounces" },
    ],
    temperature: [
      { value: "celsius", label: "Celsius" },
      { value: "fahrenheit", label: "Fahrenheit" },
      { value: "kelvin", label: "Kelvin" },
    ],
  };

  const handleConvert = () => {
    const value = parseFloat(fromValue);
    if (!isNaN(value)) {
      const converted = convertUnit(value, fromUnit, toUnit, conversionType as 'length' | 'weight' | 'temperature');
      setResult(converted.toString());
    }
  };

  return (
    <div className="space-y-4" data-testid="converter-tool">
      <Select value={conversionType} onValueChange={setConversionType}>
        <SelectTrigger className="cosmic-blue border-[hsl(174,100%,70%)] border-opacity-30" data-testid="select-conversion-type">
          <SelectValue />
        </SelectTrigger>
        <SelectContent className="cosmic-blue border-[hsl(174,100%,70%)] border-opacity-30">
          <SelectItem value="length">Length</SelectItem>
          <SelectItem value="weight">Weight</SelectItem>
          <SelectItem value="temperature">Temperature</SelectItem>
        </SelectContent>
      </Select>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Input
            type="number"
            value={fromValue}
            onChange={(e) => setFromValue(e.target.value)}
            placeholder="From"
            className="cosmic-blue border-[hsl(174,100%,70%)] border-opacity-30 mb-2"
            data-testid="input-from-value"
          />
          <Select value={fromUnit} onValueChange={setFromUnit}>
            <SelectTrigger className="cosmic-blue border-[hsl(174,100%,70%)] border-opacity-30" data-testid="select-from-unit">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="cosmic-blue border-[hsl(174,100%,70%)] border-opacity-30">
              {unitOptions[conversionType as keyof typeof unitOptions].map((unit) => (
                <SelectItem key={unit.value} value={unit.value}>
                  {unit.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Input
            value={result}
            readOnly
            placeholder="To"
            className="cosmic-surface border-[hsl(174,100%,70%)] border-opacity-30 mb-2"
            data-testid="input-to-value"
          />
          <Select value={toUnit} onValueChange={setToUnit}>
            <SelectTrigger className="cosmic-blue border-[hsl(174,100%,70%)] border-opacity-30" data-testid="select-to-unit">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="cosmic-blue border-[hsl(174,100%,70%)] border-opacity-30">
              {unitOptions[conversionType as keyof typeof unitOptions].map((unit) => (
                <SelectItem key={unit.value} value={unit.value}>
                  {unit.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Button
        onClick={handleConvert}
        className="w-full bg-[hsl(174,100%,70%)] text-[hsl(217,41%,11%)] hover:bg-opacity-80"
        data-testid="button-convert"
      >
        Convert
      </Button>
    </div>
  );
}

function ColorPickerTool({ onClose }: { onClose: () => void }) {
  const [color, setColor] = useState("#64FFDA");
  const [rgb, setRgb] = useState({ r: 100, g: 255, b: 218 });
  const [hsl, setHsl] = useState({ h: 174, s: 100, l: 70 });

  const updateFromHex = (hex: string) => {
    setColor(hex);
    const rgbResult = hexToRgb(hex);
    if (rgbResult) {
      setRgb(rgbResult);
      setHsl(rgbToHsl(rgbResult.r, rgbResult.g, rgbResult.b));
    }
  };

  const updateFromRgb = (r: number, g: number, b: number) => {
    setRgb({ r, g, b });
    setColor(rgbToHex(r, g, b));
    setHsl(rgbToHsl(r, g, b));
  };

  return (
    <div className="space-y-4" data-testid="color-picker-tool">
      <div className="flex items-center space-x-4">
        <input
          type="color"
          value={color}
          onChange={(e) => updateFromHex(e.target.value)}
          className="w-20 h-20 rounded-lg border border-[hsl(174,100%,70%)] border-opacity-30"
          data-testid="input-color-picker"
        />
        <div className="flex-1">
          <div className="mb-2">
            <label className="block text-sm cosmic-accent">HEX</label>
            <Input
              value={color}
              onChange={(e) => updateFromHex(e.target.value)}
              className="cosmic-blue border-[hsl(174,100%,70%)] border-opacity-30"
              data-testid="input-hex-value"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2">
        <div>
          <label className="block text-sm cosmic-accent">R</label>
          <Input
            type="number"
            min="0"
            max="255"
            value={rgb.r}
            onChange={(e) => updateFromRgb(parseInt(e.target.value) || 0, rgb.g, rgb.b)}
            className="cosmic-blue border-[hsl(174,100%,70%)] border-opacity-30"
            data-testid="input-rgb-r"
          />
        </div>
        <div>
          <label className="block text-sm cosmic-accent">G</label>
          <Input
            type="number"
            min="0"
            max="255"
            value={rgb.g}
            onChange={(e) => updateFromRgb(rgb.r, parseInt(e.target.value) || 0, rgb.b)}
            className="cosmic-blue border-[hsl(174,100%,70%)] border-opacity-30"
            data-testid="input-rgb-g"
          />
        </div>
        <div>
          <label className="block text-sm cosmic-accent">B</label>
          <Input
            type="number"
            min="0"
            max="255"
            value={rgb.b}
            onChange={(e) => updateFromRgb(rgb.r, rgb.g, parseInt(e.target.value) || 0)}
            className="cosmic-blue border-[hsl(174,100%,70%)] border-opacity-30"
            data-testid="input-rgb-b"
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2">
        <div>
          <label className="block text-sm cosmic-accent">H</label>
          <Input
            value={Math.round(hsl.h)}
            readOnly
            className="cosmic-surface border-[hsl(174,100%,70%)] border-opacity-30"
            data-testid="input-hsl-h"
          />
        </div>
        <div>
          <label className="block text-sm cosmic-accent">S%</label>
          <Input
            value={Math.round(hsl.s)}
            readOnly
            className="cosmic-surface border-[hsl(174,100%,70%)] border-opacity-30"
            data-testid="input-hsl-s"
          />
        </div>
        <div>
          <label className="block text-sm cosmic-accent">L%</label>
          <Input
            value={Math.round(hsl.l)}
            readOnly
            className="cosmic-surface border-[hsl(174,100%,70%)] border-opacity-30"
            data-testid="input-hsl-l"
          />
        </div>
      </div>

      <div
        className="w-full h-16 rounded-lg border border-[hsl(174,100%,70%)] border-opacity-30"
        style={{ backgroundColor: color }}
        data-testid="color-preview"
      ></div>
    </div>
  );
}

function TextCounterTool({ onClose }: { onClose: () => void }) {
  const [text, setText] = useState("");
  const stats = analyzeText(text);

  return (
    <div className="space-y-4" data-testid="text-counter-tool">
      <Textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Enter your text here..."
        rows={6}
        className="cosmic-blue border-[hsl(174,100%,70%)] border-opacity-30"
        data-testid="textarea-text-input"
      />

      <div className="grid grid-cols-2 gap-4">
        <div className="glass-morphism p-3 rounded-lg">
          <div className="text-sm cosmic-accent">Words</div>
          <div className="text-xl font-bold" data-testid="text-word-count">{stats.words}</div>
        </div>
        <div className="glass-morphism p-3 rounded-lg">
          <div className="text-sm cosmic-accent">Characters</div>
          <div className="text-xl font-bold" data-testid="text-character-count">{stats.characters}</div>
        </div>
        <div className="glass-morphism p-3 rounded-lg">
          <div className="text-sm cosmic-accent">Characters (no spaces)</div>
          <div className="text-xl font-bold" data-testid="text-character-no-spaces-count">{stats.charactersNoSpaces}</div>
        </div>
        <div className="glass-morphism p-3 rounded-lg">
          <div className="text-sm cosmic-accent">Sentences</div>
          <div className="text-xl font-bold" data-testid="text-sentence-count">{stats.sentences}</div>
        </div>
        <div className="glass-morphism p-3 rounded-lg">
          <div className="text-sm cosmic-accent">Paragraphs</div>
          <div className="text-xl font-bold" data-testid="text-paragraph-count">{stats.paragraphs}</div>
        </div>
        <div className="glass-morphism p-3 rounded-lg">
          <div className="text-sm cosmic-accent">Avg Words/Sentence</div>
          <div className="text-xl font-bold" data-testid="text-avg-words-per-sentence">{stats.avgWordsPerSentence}</div>
        </div>
      </div>
    </div>
  );
}

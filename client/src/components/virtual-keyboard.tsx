import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Delete, Space, ArrowLeft, ArrowRight } from "lucide-react";

interface VirtualKeyboardProps {
  onKeyPress: (key: string) => void;
  onBackspace: () => void;
  onSpace: () => void;
  className?: string;
  visible?: boolean;
  onClose?: () => void;
}

const KEYBOARD_LAYOUTS = {
  qwerty: [
    ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'],
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
    ['Z', 'X', 'C', 'V', 'B', 'N', 'M']
  ],
  symbols: [
    ['!', '@', '#', '$', '%', '^', '&', '*', '(', ')'],
    ['-', '=', '[', ']', '\\', ';', "'", ',', '.', '/'],
    ['<', '>', '?', ':', '"', '{', '}', '|'],
    ['~', '`', '+', '_']
  ],
  japanese: [
    ['あ', 'か', 'さ', 'た', 'な', 'は', 'ま', 'や', 'ら', 'わ'],
    ['い', 'き', 'し', 'ち', 'に', 'ひ', 'み', 'り'],
    ['う', 'く', 'す', 'つ', 'ぬ', 'ふ', 'む', 'ゆ', 'る'],
    ['え', 'け', 'せ', 'て', 'ね', 'へ', 'め', 'れ'],
    ['お', 'こ', 'そ', 'と', 'の', 'ほ', 'も', 'よ', 'ろ', 'ん']
  ]
};

export function VirtualKeyboard({
  onKeyPress,
  onBackspace,
  onSpace,
  className,
  visible = true,
  onClose
}: VirtualKeyboardProps) {
  const [layout, setLayout] = useState<'qwerty' | 'symbols' | 'japanese'>('qwerty');
  const [isShift, setIsShift] = useState(false);

  if (!visible) return null;

  const handleKeyPress = (key: string) => {
    let processedKey = key;
    if (layout === 'qwerty' && !isShift) {
      processedKey = key.toLowerCase();
    }
    onKeyPress(processedKey);
    if (isShift) setIsShift(false);
  };

  const currentLayout = KEYBOARD_LAYOUTS[layout];

  return (
    <Card className={cn(
      "fixed bottom-4 left-4 right-4 z-50 p-4 bg-black/90 backdrop-blur-md border border-blue-500/30",
      "shadow-2xl shadow-blue-500/20 animate-in slide-in-from-bottom-2",
      className
    )}>
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex gap-2">
          <Button
            size="sm"
            variant={layout === 'qwerty' ? 'default' : 'ghost'}
            onClick={() => setLayout('qwerty')}
            className="text-xs"
            data-testid="keyboard-layout-qwerty"
          >
            EN
          </Button>
          <Button
            size="sm"
            variant={layout === 'symbols' ? 'default' : 'ghost'}
            onClick={() => setLayout('symbols')}
            className="text-xs"
            data-testid="keyboard-layout-symbols"
          >
            SYM
          </Button>
          <Button
            size="sm"
            variant={layout === 'japanese' ? 'default' : 'ghost'}
            onClick={() => setLayout('japanese')}
            className="text-xs"
            data-testid="keyboard-layout-japanese"
          >
            JP
          </Button>
        </div>
        {onClose && (
          <Button
            size="sm"
            variant="ghost"
            onClick={onClose}
            className="text-xs"
            data-testid="keyboard-close"
          >
            ✕
          </Button>
        )}
      </div>

      {/* Keyboard Layout */}
      <div className="space-y-2">
        {currentLayout.map((row, rowIndex) => (
          <div key={rowIndex} className="flex justify-center gap-1">
            {row.map((key) => (
              <Button
                key={key}
                size="sm"
                variant="outline"
                onClick={() => handleKeyPress(key)}
                className={cn(
                  "min-w-[40px] h-10 text-sm font-medium transition-all",
                  "bg-slate-800/50 border-slate-600 hover:bg-slate-700/70",
                  "text-blue-100 hover:text-white",
                  "active:scale-95 active:bg-blue-500/20"
                )}
                data-testid={`keyboard-key-${key}`}
              >
                {key}
              </Button>
            ))}
          </div>
        ))}

        {/* Bottom Row - Special Keys */}
        <div className="flex justify-center gap-1 mt-3">
          {layout === 'qwerty' && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => setIsShift(!isShift)}
              className={cn(
                "min-w-[60px] h-10 text-sm font-medium transition-all",
                "bg-slate-800/50 border-slate-600 hover:bg-slate-700/70",
                "text-blue-100 hover:text-white",
                isShift && "bg-blue-500/30 border-blue-400"
              )}
              data-testid="keyboard-shift"
            >
              ⇧ {isShift ? 'ON' : 'OFF'}
            </Button>
          )}
          
          <Button
            size="sm"
            variant="outline"
            onClick={onSpace}
            className={cn(
              "flex-1 min-w-[120px] h-10 text-sm font-medium transition-all",
              "bg-slate-800/50 border-slate-600 hover:bg-slate-700/70",
              "text-blue-100 hover:text-white",
              "active:scale-95 active:bg-blue-500/20"
            )}
            data-testid="keyboard-space"
          >
            <Space className="w-4 h-4" />
            Space
          </Button>

          <Button
            size="sm"
            variant="outline"
            onClick={onBackspace}
            className={cn(
              "min-w-[60px] h-10 text-sm font-medium transition-all",
              "bg-slate-800/50 border-slate-600 hover:bg-slate-700/70",
              "text-blue-100 hover:text-white",
              "active:scale-95 active:bg-red-500/20"
            )}
            data-testid="keyboard-backspace"
          >
            <Delete className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
}
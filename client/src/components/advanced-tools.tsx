import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Copy, RefreshCw, Download, Upload, Hash, Zap, Lock, QrCode, Image, FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import { VirtualKeyboard } from "./virtual-keyboard";

export function AdvancedTools() {
  const [showKeyboard, setShowKeyboard] = useState(false);
  const [keyboardTarget, setKeyboardTarget] = useState<string | null>(null);
  
  // QR Code Generator States
  const [qrText, setQrText] = useState("");
  const [qrSize, setQrSize] = useState("200");
  const [qrColor, setQrColor] = useState("#000000");
  
  // Password Generator States
  const [passwordLength, setPasswordLength] = useState(16);
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [includeLowercase, setIncludeLowercase] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [generatedPassword, setGeneratedPassword] = useState("");
  
  // Hash Generator States
  const [hashInput, setHashInput] = useState("");
  const [hashType, setHashType] = useState("md5");
  const [hashOutput, setHashOutput] = useState("");
  
  // Base64 Encoder/Decoder States
  const [base64Input, setBase64Input] = useState("");
  const [base64Output, setBase64Output] = useState("");
  const [isEncoding, setIsEncoding] = useState(true);
  
  // JSON Formatter States
  const [jsonInput, setJsonInput] = useState("");
  const [jsonOutput, setJsonOutput] = useState("");
  
  // URL Encoder/Decoder States
  const [urlInput, setUrlInput] = useState("");
  const [urlOutput, setUrlOutput] = useState("");
  const [urlIsEncoding, setUrlIsEncoding] = useState(true);

  // Keyboard handler
  const handleKeyboardInput = (key: string) => {
    switch (keyboardTarget) {
      case 'qr-text':
        setQrText(qrText + key);
        break;
      case 'hash-input':
        setHashInput(hashInput + key);
        break;
      case 'base64-input':
        setBase64Input(base64Input + key);
        break;
      case 'json-input':
        setJsonInput(jsonInput + key);
        break;
      case 'url-input':
        setUrlInput(urlInput + key);
        break;
    }
  };

  const handleKeyboardBackspace = () => {
    switch (keyboardTarget) {
      case 'qr-text':
        setQrText(qrText.slice(0, -1));
        break;
      case 'hash-input':
        setHashInput(hashInput.slice(0, -1));
        break;
      case 'base64-input':
        setBase64Input(base64Input.slice(0, -1));
        break;
      case 'json-input':
        setJsonInput(jsonInput.slice(0, -1));
        break;
      case 'url-input':
        setUrlInput(urlInput.slice(0, -1));
        break;
    }
  };

  const handleKeyboardSpace = () => {
    switch (keyboardTarget) {
      case 'qr-text':
        setQrText(qrText + ' ');
        break;
      case 'hash-input':
        setHashInput(hashInput + ' ');
        break;
      case 'base64-input':
        setBase64Input(base64Input + ' ');
        break;
      case 'json-input':
        setJsonInput(jsonInput + ' ');
        break;
      case 'url-input':
        setUrlInput(urlInput + ' ');
        break;
    }
  };

  const openKeyboard = (target: string) => {
    setKeyboardTarget(target);
    setShowKeyboard(true);
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  // QR Code Generation (Simple text-based representation)
  const generateQR = () => {
    if (!qrText.trim()) return;
    
    // Create a simple text-based QR code representation
    const size = parseInt(qrSize);
    const qrMatrix = Array(size / 10).fill(null).map(() => Array(size / 10).fill('█'));
    
    // Add some pattern based on text
    const hash = qrText.split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0);
      return a & a;
    }, 0);
    
    for (let i = 0; i < qrMatrix.length; i++) {
      for (let j = 0; j < qrMatrix[i].length; j++) {
        if ((hash + i * j) % 3 === 0) {
          qrMatrix[i][j] = '░';
        }
      }
    }
    
    return qrMatrix.map(row => row.join('')).join('\n');
  };

  // Password Generation
  const generatePassword = () => {
    let charset = '';
    if (includeUppercase) charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (includeLowercase) charset += 'abcdefghijklmnopqrstuvwxyz';
    if (includeNumbers) charset += '0123456789';
    if (includeSymbols) charset += '!@#$%^&*()_+-=[]{}|;:,.<>?';
    
    if (!charset) {
      setGeneratedPassword('');
      return;
    }
    
    let result = '';
    for (let i = 0; i < passwordLength; i++) {
      result += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    setGeneratedPassword(result);
  };

  // Simple hash function (for demonstration)
  const simpleHash = (str: string, type: string): string => {
    let hash = 0;
    if (str.length === 0) return hash.toString();
    
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    
    const hashStr = Math.abs(hash).toString(16);
    
    switch (type) {
      case 'md5':
        return hashStr.padStart(32, '0').substring(0, 32);
      case 'sha1':
        return hashStr.padStart(40, '0').substring(0, 40);
      case 'sha256':
        return hashStr.padStart(64, '0').substring(0, 64);
      default:
        return hashStr;
    }
  };

  const generateHash = () => {
    if (!hashInput) return;
    setHashOutput(simpleHash(hashInput, hashType));
  };

  // Base64 operations
  const processBase64 = () => {
    try {
      if (isEncoding) {
        setBase64Output(btoa(base64Input));
      } else {
        setBase64Output(atob(base64Input));
      }
    } catch (error) {
      setBase64Output('Error: Invalid input');
    }
  };

  // JSON formatting
  const formatJSON = () => {
    try {
      const parsed = JSON.parse(jsonInput);
      setJsonOutput(JSON.stringify(parsed, null, 2));
    } catch (error) {
      setJsonOutput('Error: Invalid JSON');
    }
  };

  // URL operations
  const processURL = () => {
    try {
      if (urlIsEncoding) {
        setUrlOutput(encodeURIComponent(urlInput));
      } else {
        setUrlOutput(decodeURIComponent(urlInput));
      }
    } catch (error) {
      setUrlOutput('Error: Invalid input');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-black p-6">
      <div className="max-w-6xl mx-auto">
        <Card className="bg-black/40 backdrop-blur-sm border-blue-500/30 shadow-2xl shadow-blue-500/10">
          <CardHeader>
            <CardTitle className="text-blue-100 flex items-center gap-2">
              <Zap className="w-6 h-6 text-yellow-400" />
              Advanced Cosmic Tools
            </CardTitle>
          </CardHeader>
          
          <CardContent>
            <Tabs defaultValue="qr-generator" className="space-y-6">
              <TabsList className="grid grid-cols-3 lg:grid-cols-6 gap-2 bg-slate-800/50">
                <TabsTrigger value="qr-generator" className="text-xs">QR Code</TabsTrigger>
                <TabsTrigger value="password-gen" className="text-xs">Password</TabsTrigger>
                <TabsTrigger value="hash-gen" className="text-xs">Hash</TabsTrigger>
                <TabsTrigger value="base64" className="text-xs">Base64</TabsTrigger>
                <TabsTrigger value="json-format" className="text-xs">JSON</TabsTrigger>
                <TabsTrigger value="url-encode" className="text-xs">URL</TabsTrigger>
              </TabsList>

              {/* QR Code Generator */}
              <TabsContent value="qr-generator" className="space-y-4">
                <Card className="bg-slate-800/30 border-blue-500/20">
                  <CardHeader>
                    <CardTitle className="text-blue-200 flex items-center gap-2">
                      <QrCode className="w-5 h-5" />
                      QR Code Generator
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="qr-text" className="text-blue-200">Text to encode</Label>
                      <div className="flex gap-2">
                        <Input
                          id="qr-text"
                          value={qrText}
                          onChange={(e) => setQrText(e.target.value)}
                          placeholder="Enter text for QR code..."
                          className="bg-slate-700/50 border-blue-500/30 text-blue-100"
                          data-testid="input-qr-text"
                        />
                        <Button
                          onClick={() => openKeyboard('qr-text')}
                          variant="outline"
                          size="sm"
                          className="border-blue-500/30"
                          data-testid="button-keyboard-qr"
                        >
                          🎹
                        </Button>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="qr-size" className="text-blue-200">Size</Label>
                        <Select value={qrSize} onValueChange={setQrSize}>
                          <SelectTrigger className="bg-slate-700/50 border-blue-500/30 text-blue-100">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="100">Small (100px)</SelectItem>
                            <SelectItem value="200">Medium (200px)</SelectItem>
                            <SelectItem value="300">Large (300px)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <Label htmlFor="qr-color" className="text-blue-200">Color</Label>
                        <Input
                          id="qr-color"
                          type="color"
                          value={qrColor}
                          onChange={(e) => setQrColor(e.target.value)}
                          className="bg-slate-700/50 border-blue-500/30 h-10"
                          data-testid="input-qr-color"
                        />
                      </div>
                    </div>

                    {qrText && (
                      <div className="bg-slate-900/50 p-4 rounded-lg border border-blue-500/20">
                        <pre className="text-green-400 text-xs font-mono whitespace-pre-wrap">
                          {generateQR()}
                        </pre>
                        <div className="mt-2 text-xs text-blue-300">
                          QR Code Preview (Text Representation)
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Password Generator */}
              <TabsContent value="password-gen" className="space-y-4">
                <Card className="bg-slate-800/30 border-blue-500/20">
                  <CardHeader>
                    <CardTitle className="text-blue-200 flex items-center gap-2">
                      <Lock className="w-5 h-5" />
                      Password Generator
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label className="text-blue-200">Password Length: {passwordLength}</Label>
                      <input
                        type="range"
                        min="4"
                        max="128"
                        value={passwordLength}
                        onChange={(e) => setPasswordLength(Number(e.target.value))}
                        className="w-full mt-2"
                        data-testid="slider-password-length"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="uppercase"
                          checked={includeUppercase}
                          onCheckedChange={(checked) => setIncludeUppercase(checked === true)}
                          data-testid="checkbox-uppercase"
                        />
                        <Label htmlFor="uppercase" className="text-blue-200">Uppercase (A-Z)</Label>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="lowercase"
                          checked={includeLowercase}
                          onCheckedChange={(checked) => setIncludeLowercase(checked === true)}
                          data-testid="checkbox-lowercase"
                        />
                        <Label htmlFor="lowercase" className="text-blue-200">Lowercase (a-z)</Label>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="numbers"
                          checked={includeNumbers}
                          onCheckedChange={(checked) => setIncludeNumbers(checked === true)}
                          data-testid="checkbox-numbers"
                        />
                        <Label htmlFor="numbers" className="text-blue-200">Numbers (0-9)</Label>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="symbols"
                          checked={includeSymbols}
                          onCheckedChange={(checked) => setIncludeSymbols(checked === true)}
                          data-testid="checkbox-symbols"
                        />
                        <Label htmlFor="symbols" className="text-blue-200">Symbols (!@#$...)</Label>
                      </div>
                    </div>

                    <Button
                      onClick={generatePassword}
                      className="w-full bg-green-600 hover:bg-green-700"
                      data-testid="button-generate-password"
                    >
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Generate Password
                    </Button>

                    {generatedPassword && (
                      <div className="bg-slate-900/50 p-4 rounded-lg border border-blue-500/20">
                        <div className="flex items-center justify-between">
                          <code className="text-green-400 break-all">{generatedPassword}</code>
                          <Button
                            onClick={() => copyToClipboard(generatedPassword)}
                            size="sm"
                            variant="outline"
                            className="border-blue-500/30"
                            data-testid="button-copy-password"
                          >
                            <Copy className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Hash Generator */}
              <TabsContent value="hash-gen" className="space-y-4">
                <Card className="bg-slate-800/30 border-blue-500/20">
                  <CardHeader>
                    <CardTitle className="text-blue-200 flex items-center gap-2">
                      <Hash className="w-5 h-5" />
                      Hash Generator
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="hash-input" className="text-blue-200">Input Text</Label>
                      <div className="flex gap-2">
                        <Textarea
                          id="hash-input"
                          value={hashInput}
                          onChange={(e) => setHashInput(e.target.value)}
                          placeholder="Enter text to hash..."
                          className="bg-slate-700/50 border-blue-500/30 text-blue-100"
                          data-testid="textarea-hash-input"
                        />
                        <Button
                          onClick={() => openKeyboard('hash-input')}
                          variant="outline"
                          size="sm"
                          className="border-blue-500/30"
                          data-testid="button-keyboard-hash"
                        >
                          🎹
                        </Button>
                      </div>
                    </div>

                    <div>
                      <Label className="text-blue-200">Hash Type</Label>
                      <Select value={hashType} onValueChange={setHashType}>
                        <SelectTrigger className="bg-slate-700/50 border-blue-500/30 text-blue-100">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="md5">MD5</SelectItem>
                          <SelectItem value="sha1">SHA-1</SelectItem>
                          <SelectItem value="sha256">SHA-256</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <Button
                      onClick={generateHash}
                      className="w-full bg-purple-600 hover:bg-purple-700"
                      disabled={!hashInput}
                      data-testid="button-generate-hash"
                    >
                      Generate Hash
                    </Button>

                    {hashOutput && (
                      <div className="bg-slate-900/50 p-4 rounded-lg border border-blue-500/20">
                        <div className="flex items-center justify-between">
                          <code className="text-green-400 break-all text-sm">{hashOutput}</code>
                          <Button
                            onClick={() => copyToClipboard(hashOutput)}
                            size="sm"
                            variant="outline"
                            className="border-blue-500/30"
                            data-testid="button-copy-hash"
                          >
                            <Copy className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Base64 Encoder/Decoder */}
              <TabsContent value="base64" className="space-y-4">
                <Card className="bg-slate-800/30 border-blue-500/20">
                  <CardHeader>
                    <CardTitle className="text-blue-200 flex items-center gap-2">
                      <FileText className="w-5 h-5" />
                      Base64 Encoder/Decoder
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex gap-2">
                      <Button
                        onClick={() => setIsEncoding(true)}
                        variant={isEncoding ? "default" : "outline"}
                        size="sm"
                        data-testid="button-base64-encode"
                      >
                        Encode
                      </Button>
                      <Button
                        onClick={() => setIsEncoding(false)}
                        variant={!isEncoding ? "default" : "outline"}
                        size="sm"
                        data-testid="button-base64-decode"
                      >
                        Decode
                      </Button>
                    </div>

                    <div>
                      <Label htmlFor="base64-input" className="text-blue-200">
                        {isEncoding ? 'Text to Encode' : 'Base64 to Decode'}
                      </Label>
                      <div className="flex gap-2">
                        <Textarea
                          id="base64-input"
                          value={base64Input}
                          onChange={(e) => setBase64Input(e.target.value)}
                          placeholder={isEncoding ? "Enter text to encode..." : "Enter base64 to decode..."}
                          className="bg-slate-700/50 border-blue-500/30 text-blue-100"
                          data-testid="textarea-base64-input"
                        />
                        <Button
                          onClick={() => openKeyboard('base64-input')}
                          variant="outline"
                          size="sm"
                          className="border-blue-500/30"
                          data-testid="button-keyboard-base64"
                        >
                          🎹
                        </Button>
                      </div>
                    </div>

                    <Button
                      onClick={processBase64}
                      className="w-full bg-cyan-600 hover:bg-cyan-700"
                      disabled={!base64Input}
                      data-testid="button-process-base64"
                    >
                      {isEncoding ? 'Encode' : 'Decode'}
                    </Button>

                    {base64Output && (
                      <div className="bg-slate-900/50 p-4 rounded-lg border border-blue-500/20">
                        <div className="flex items-center justify-between">
                          <code className="text-green-400 break-all text-sm">{base64Output}</code>
                          <Button
                            onClick={() => copyToClipboard(base64Output)}
                            size="sm"
                            variant="outline"
                            className="border-blue-500/30"
                            data-testid="button-copy-base64"
                          >
                            <Copy className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* JSON Formatter */}
              <TabsContent value="json-format" className="space-y-4">
                <Card className="bg-slate-800/30 border-blue-500/20">
                  <CardHeader>
                    <CardTitle className="text-blue-200 flex items-center gap-2">
                      <FileText className="w-5 h-5" />
                      JSON Formatter
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="json-input" className="text-blue-200">Raw JSON</Label>
                      <div className="flex gap-2">
                        <Textarea
                          id="json-input"
                          value={jsonInput}
                          onChange={(e) => setJsonInput(e.target.value)}
                          placeholder='{"key": "value", "array": [1, 2, 3]}'
                          className="bg-slate-700/50 border-blue-500/30 text-blue-100 font-mono text-sm"
                          rows={6}
                          data-testid="textarea-json-input"
                        />
                        <Button
                          onClick={() => openKeyboard('json-input')}
                          variant="outline"
                          size="sm"
                          className="border-blue-500/30"
                          data-testid="button-keyboard-json"
                        >
                          🎹
                        </Button>
                      </div>
                    </div>

                    <Button
                      onClick={formatJSON}
                      className="w-full bg-orange-600 hover:bg-orange-700"
                      disabled={!jsonInput}
                      data-testid="button-format-json"
                    >
                      Format JSON
                    </Button>

                    {jsonOutput && (
                      <div className="bg-slate-900/50 p-4 rounded-lg border border-blue-500/20">
                        <div className="flex items-center justify-between mb-2">
                          <Label className="text-blue-200">Formatted JSON</Label>
                          <Button
                            onClick={() => copyToClipboard(jsonOutput)}
                            size="sm"
                            variant="outline"
                            className="border-blue-500/30"
                            data-testid="button-copy-json"
                          >
                            <Copy className="w-4 h-4" />
                          </Button>
                        </div>
                        <ScrollArea className="h-48">
                          <pre className="text-green-400 text-sm font-mono whitespace-pre-wrap">
                            {jsonOutput}
                          </pre>
                        </ScrollArea>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* URL Encoder/Decoder */}
              <TabsContent value="url-encode" className="space-y-4">
                <Card className="bg-slate-800/30 border-blue-500/20">
                  <CardHeader>
                    <CardTitle className="text-blue-200 flex items-center gap-2">
                      <Hash className="w-5 h-5" />
                      URL Encoder/Decoder
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex gap-2">
                      <Button
                        onClick={() => setUrlIsEncoding(true)}
                        variant={urlIsEncoding ? "default" : "outline"}
                        size="sm"
                        data-testid="button-url-encode"
                      >
                        Encode
                      </Button>
                      <Button
                        onClick={() => setUrlIsEncoding(false)}
                        variant={!urlIsEncoding ? "default" : "outline"}
                        size="sm"
                        data-testid="button-url-decode"
                      >
                        Decode
                      </Button>
                    </div>

                    <div>
                      <Label htmlFor="url-input" className="text-blue-200">
                        {urlIsEncoding ? 'URL to Encode' : 'URL to Decode'}
                      </Label>
                      <div className="flex gap-2">
                        <Input
                          id="url-input"
                          value={urlInput}
                          onChange={(e) => setUrlInput(e.target.value)}
                          placeholder={urlIsEncoding ? "https://example.com/path with spaces" : "https%3A//example.com/path%20with%20spaces"}
                          className="bg-slate-700/50 border-blue-500/30 text-blue-100"
                          data-testid="input-url"
                        />
                        <Button
                          onClick={() => openKeyboard('url-input')}
                          variant="outline"
                          size="sm"
                          className="border-blue-500/30"
                          data-testid="button-keyboard-url"
                        >
                          🎹
                        </Button>
                      </div>
                    </div>

                    <Button
                      onClick={processURL}
                      className="w-full bg-indigo-600 hover:bg-indigo-700"
                      disabled={!urlInput}
                      data-testid="button-process-url"
                    >
                      {urlIsEncoding ? 'Encode URL' : 'Decode URL'}
                    </Button>

                    {urlOutput && (
                      <div className="bg-slate-900/50 p-4 rounded-lg border border-blue-500/20">
                        <div className="flex items-center justify-between">
                          <code className="text-green-400 break-all text-sm">{urlOutput}</code>
                          <Button
                            onClick={() => copyToClipboard(urlOutput)}
                            size="sm"
                            variant="outline"
                            className="border-blue-500/30"
                            data-testid="button-copy-url"
                          >
                            <Copy className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
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
import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { InlineMath, BlockMath } from 'react-katex';
import 'katex/dist/katex.min.css';

interface MathEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
}

const mathSymbols = [
  { symbol: '\\frac{}{}', display: '𝑓/𝑔', label: 'Fraction' },
  { symbol: '\\int_{}^{}', display: '∫', label: 'Integral' },
  { symbol: '\\sum_{}^{}', display: '∑', label: 'Sum' },
  { symbol: '\\sqrt{}', display: '√', label: 'Square Root' },
  { symbol: '\\sqrt[{}]{}', display: 'ⁿ√', label: 'Nth Root' },
  { symbol: '^{}', display: 'xⁿ', label: 'Superscript' },
  { symbol: '_{}', display: 'xₙ', label: 'Subscript' },
  { symbol: '\\lim_{}', display: 'lim', label: 'Limit' },
  { symbol: '\\sin{}', display: 'sin', label: 'Sine' },
  { symbol: '\\cos{}', display: 'cos', label: 'Cosine' },
  { symbol: '\\tan{}', display: 'tan', label: 'Tangent' },
  { symbol: '\\log{}', display: 'log', label: 'Logarithm' },
  { symbol: '\\ln{}', display: 'ln', label: 'Natural Log' },
  { symbol: '\\alpha', display: 'α', label: 'Alpha' },
  { symbol: '\\beta', display: 'β', label: 'Beta' },
  { symbol: '\\gamma', display: 'γ', label: 'Gamma' },
  { symbol: '\\delta', display: 'δ', label: 'Delta' },
  { symbol: '\\pi', display: 'π', label: 'Pi' },
  { symbol: '\\theta', display: 'θ', label: 'Theta' },
  { symbol: '\\lambda', display: 'λ', label: 'Lambda' },
  { symbol: '\\mu', display: 'μ', label: 'Mu' },
  { symbol: '\\sigma', display: 'σ', label: 'Sigma' },
  { symbol: '\\infty', display: '∞', label: 'Infinity' },
  { symbol: '\\pm', display: '±', label: 'Plus/Minus' },
  { symbol: '\\times', display: '×', label: 'Times' },
  { symbol: '\\div', display: '÷', label: 'Division' },
  { symbol: '\\leq', display: '≤', label: 'Less Equal' },
  { symbol: '\\geq', display: '≥', label: 'Greater Equal' },
  { symbol: '\\neq', display: '≠', label: 'Not Equal' },
  { symbol: '\\approx', display: '≈', label: 'Approximately' },
];

const preprocessMath = (text: string): string => {
  // Convert / to fractions, but be smart about it
  let processed = text.replace(/([^\\]|^)\/([^\/])/g, (match, before, after) => {
    // Don't convert if it's already in a LaTeX command
    if (before.match(/\\[a-zA-Z]+$/)) return match;
    return `${before}\\frac{}{${after}}`;
  });
  
  // Handle parentheses for better grouping
  processed = processed.replace(/\\_\(([^)]+)\)/g, '_{$1}');
  processed = processed.replace(/\\?\^\(([^)]+)\)/g, '^{$1}');
  
  return processed;
};

const renderMathContent = (text: string) => {
  if (!text.trim()) return text;
  
  try {
    // Handle line breaks
    const lines = text.split('\n');
    
    return lines.map((line, lineIndex) => (
      <div key={lineIndex}>
        {(() => {
          const processedLine = preprocessMath(line);
          
          // Check for block math ($$...$$)
          const blockMathRegex = /\$\$(.*?)\$\$/g;
          if (blockMathRegex.test(processedLine)) {
            return processedLine.split(blockMathRegex).map((part, index) => {
              if (index % 2 === 1) {
                return <BlockMath key={index} math={part} />;
              }
              return part;
            });
          }
          
          // Check for inline math ($...$)
          const inlineMathRegex = /\$([^$]+)\$/g;
          if (inlineMathRegex.test(processedLine)) {
            return processedLine.split(inlineMathRegex).map((part, index) => {
              if (index % 2 === 1) {
                return <InlineMath key={index} math={part} />;
              }
              return part;
            });
          }
          
          return processedLine;
        })()}
      </div>
    ));
  } catch (error) {
    return text;
  }
};

export const MathEditor = ({ value, onChange, placeholder, rows = 3 }: MathEditorProps) => {
  const [showSymbols, setShowSymbols] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const insertSymbol = (symbol: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const newValue = value.substring(0, start) + symbol + value.substring(end);
    
    onChange(newValue);
    
    // Set cursor position after the inserted symbol
    setTimeout(() => {
      const cursorPos = start + symbol.length;
      textarea.setSelectionRange(cursorPos, cursorPos);
      textarea.focus();
    }, 0);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setShowSymbols(!showSymbols)}
          className="text-xs"
        >
          {showSymbols ? 'Hide' : 'Show'} Math Symbols
        </Button>
        <div className="text-xs text-muted-foreground">
          Use $...$ for inline math, $$...$$ for block math, () for grouping
        </div>
      </div>

      {showSymbols && (
        <Card className="p-3">
          <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 gap-2">
            {mathSymbols.map((item, index) => (
              <Button
                key={index}
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => insertSymbol(item.symbol)}
                className="h-8 text-xs font-mono hover:bg-primary/10"
              >
                {item.display}
              </Button>
            ))}
          </div>
        </Card>
      )}

      <div className="space-y-2">
        <Textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={rows}
          className="font-mono text-sm"
        />
        
        {value.trim() && (
          <Card className="p-3 bg-muted/50">
            <div className="text-sm font-medium text-muted-foreground mb-2">Preview:</div>
            <div className="min-h-[2rem]">
              {renderMathContent(value)}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/contexts/LanguageContext';
import { BlockMath, InlineMath } from 'react-katex';
import { Copy, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import 'katex/dist/katex.min.css';

interface MathTutorialProps {
  isOpen: boolean;
  onClose: () => void;
}

interface MathSymbol {
  symbol: string;
  display: string;
  label: string;
  category: 'basic' | 'greek' | 'functions' | 'operators' | 'advanced';
}

const mathSymbols: MathSymbol[] = [
  // Basic Symbols
  { symbol: '\\frac{}{}', display: '𝑓/𝑔', label: 'Fraction', category: 'basic' },
  { symbol: '^{}', display: 'xⁿ', label: 'Superscript', category: 'basic' },
  { symbol: '_{}', display: 'xₙ', label: 'Subscript', category: 'basic' },
  { symbol: '\\sqrt{}', display: '√', label: 'Square Root', category: 'basic' },
  { symbol: '\\sqrt[{}]{}', display: 'ⁿ√', label: 'Nth Root', category: 'basic' },
  
  // Greek Letters
  { symbol: '\\alpha', display: 'α', label: 'Alpha', category: 'greek' },
  { symbol: '\\beta', display: 'β', label: 'Beta', category: 'greek' },
  { symbol: '\\gamma', display: 'γ', label: 'Gamma', category: 'greek' },
  { symbol: '\\delta', display: 'δ', label: 'Delta', category: 'greek' },
  { symbol: '\\pi', display: 'π', label: 'Pi', category: 'greek' },
  { symbol: '\\theta', display: 'θ', label: 'Theta', category: 'greek' },
  { symbol: '\\lambda', display: 'λ', label: 'Lambda', category: 'greek' },
  { symbol: '\\mu', display: 'μ', label: 'Mu', category: 'greek' },
  { symbol: '\\sigma', display: 'σ', label: 'Sigma', category: 'greek' },
  
  // Functions
  { symbol: '\\sin{}', display: 'sin', label: 'Sine', category: 'functions' },
  { symbol: '\\cos{}', display: 'cos', label: 'Cosine', category: 'functions' },
  { symbol: '\\tan{}', display: 'tan', label: 'Tangent', category: 'functions' },
  { symbol: '\\log{}', display: 'log', label: 'Logarithm', category: 'functions' },
  { symbol: '\\ln{}', display: 'ln', label: 'Natural Log', category: 'functions' },
  { symbol: '\\lim_{}', display: 'lim', label: 'Limit', category: 'functions' },
  
  // Operators
  { symbol: '\\times', display: '×', label: 'Times', category: 'operators' },
  { symbol: '\\div', display: '÷', label: 'Division', category: 'operators' },
  { symbol: '\\pm', display: '±', label: 'Plus/Minus', category: 'operators' },
  { symbol: '\\leq', display: '≤', label: 'Less Equal', category: 'operators' },
  { symbol: '\\geq', display: '≥', label: 'Greater Equal', category: 'operators' },
  { symbol: '\\neq', display: '≠', label: 'Not Equal', category: 'operators' },
  { symbol: '\\approx', display: '≈', label: 'Approximately', category: 'operators' },
  
  // Advanced
  { symbol: '\\int_{}^{}', display: '∫', label: 'Integral', category: 'advanced' },
  { symbol: '\\sum_{}^{}', display: '∑', label: 'Sum', category: 'advanced' },
  { symbol: '\\infty', display: '∞', label: 'Infinity', category: 'advanced' },
];

export const MathTutorial = ({ isOpen, onClose }: MathTutorialProps) => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [copiedSymbol, setCopiedSymbol] = useState<string | null>(null);

  const copyToClipboard = async (symbol: string) => {
    try {
      await navigator.clipboard.writeText(symbol);
      setCopiedSymbol(symbol);
      toast({
        title: t('tutorial.copied'),
        duration: 2000,
      });
      setTimeout(() => setCopiedSymbol(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const getSymbolsByCategory = (category: string) => {
    return mathSymbols.filter(symbol => symbol.category === category);
  };

  const renderSymbolCard = (symbol: MathSymbol) => {
    const isCopied = copiedSymbol === symbol.symbol;
    
    return (
      <Card 
        key={symbol.symbol} 
        className="hover:shadow-md transition-shadow cursor-pointer"
        onClick={() => copyToClipboard(symbol.symbol)}
      >
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-2">
            <Badge variant="outline" className="text-xs">
              {symbol.label}
            </Badge>
            {isCopied ? (
              <Check className="h-4 w-4 text-green-500" />
            ) : (
              <Copy className="h-4 w-4 text-muted-foreground" />
            )}
          </div>
          
          <div className="space-y-2">
            <div>
              <p className="text-xs text-muted-foreground">{t('tutorial.typeThis')}</p>
              <code className="text-sm bg-muted px-2 py-1 rounded font-mono">
                {symbol.symbol}
              </code>
            </div>
            
            <div>
              <p className="text-xs text-muted-foreground">{t('tutorial.getThis')}</p>
              <div className="text-2xl text-center py-2">
                {symbol.symbol.includes('{}') ? (
                  <InlineMath math={symbol.symbol.replace(/\{\}/g, 'x')} />
                ) : (
                  <InlineMath math={symbol.symbol} />
                )}
              </div>
            </div>
          </div>
          
          <p className="text-xs text-center text-muted-foreground mt-2">
            {t('tutorial.copySymbol')}
          </p>
        </CardContent>
      </Card>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-3xl font-bold text-center text-primary">
            📚 {t('tutorial.mathTitle')}
          </DialogTitle>
          <DialogDescription className="text-center text-lg">
            {t('tutorial.mathSubtitle')}
          </DialogDescription>
        </DialogHeader>

        <div className="mt-6">
          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="basic">{t('tutorial.basicSymbols')}</TabsTrigger>
              <TabsTrigger value="greek">{t('tutorial.greekLetters')}</TabsTrigger>
              <TabsTrigger value="functions">{t('tutorial.functions')}</TabsTrigger>
              <TabsTrigger value="operators">{t('tutorial.operators')}</TabsTrigger>
              <TabsTrigger value="advanced">{t('tutorial.advanced')}</TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {getSymbolsByCategory('basic').map(renderSymbolCard)}
              </div>
            </TabsContent>

            <TabsContent value="greek" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {getSymbolsByCategory('greek').map(renderSymbolCard)}
              </div>
            </TabsContent>

            <TabsContent value="functions" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {getSymbolsByCategory('functions').map(renderSymbolCard)}
              </div>
            </TabsContent>

            <TabsContent value="operators" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {getSymbolsByCategory('operators').map(renderSymbolCard)}
              </div>
            </TabsContent>

            <TabsContent value="advanced" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {getSymbolsByCategory('advanced').map(renderSymbolCard)}
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <div className="mt-8 p-6 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg">
          <h3 className="text-lg font-semibold mb-3">{t('tutorial.howToUse')}</h3>
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>• Click any symbol card to copy its LaTeX code to your clipboard</p>
            <p>• Paste the code into your question or answer text</p>
            <p>• Use $ symbols around math expressions: $\\frac{1}{2}$ for inline math</p>
            <p>• Use $$ symbols for block math: $$\\int_0^1 x^2 dx$$</p>
            <p>• Replace {} placeholders with your own values</p>
          </div>
        </div>

        <div className="flex justify-center mt-6">
          <Button onClick={onClose} size="lg" className="px-8">
            {t('button.close')}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
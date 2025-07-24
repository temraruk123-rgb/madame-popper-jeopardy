import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { JeopardyQuestion } from '@/types/jeopardy';
import { useState } from 'react';
import { BlockMath, InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';

interface QuestionModalProps {
  question: JeopardyQuestion | null;
  isOpen: boolean;
  onClose: () => void;
  onAnswered: () => void;
}

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

export const QuestionModal = ({ question, isOpen, onClose, onAnswered }: QuestionModalProps) => {
  const [showAnswer, setShowAnswer] = useState(false);

  const handleClose = () => {
    setShowAnswer(false);
    onClose();
  };

  const handleAnswered = () => {
    onAnswered();
    setShowAnswer(false);
    onClose();
  };

  if (!question) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center text-primary">
            ${question.value}
          </DialogTitle>
          <DialogDescription className="sr-only">
            Jeopardy question for ${question.value}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Question */}
          <div className="bg-gradient-jeopardy rounded-lg p-8 text-center shadow-jeopardy">
            <div className="text-2xl md:text-3xl font-bold text-primary-foreground leading-relaxed">
              {renderMathContent(question.question)}
            </div>
            {(question as any).questionImage && (
              <div className="mt-4">
                <img 
                  src={(question as any).questionImage} 
                  alt="Question" 
                  className="max-w-full h-auto max-h-64 mx-auto rounded border"
                />
              </div>
            )}
          </div>

          {/* Answer (if shown) */}
          {showAnswer && (
            <div className="bg-gradient-gold rounded-lg p-8 text-center shadow-gold animate-slide-up">
              <h3 className="text-xl font-semibold mb-4 text-secondary-foreground">Answer:</h3>
              <div className="text-2xl md:text-3xl font-bold text-secondary-foreground leading-relaxed">
                {renderMathContent(question.answer)}
              </div>
              {(question as any).answerImage && (
                <div className="mt-4">
                  <img 
                    src={(question as any).answerImage} 
                    alt="Answer" 
                    className="max-w-full h-auto max-h-64 mx-auto rounded border"
                  />
                </div>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-center gap-4">
            {!showAnswer ? (
              <Button
                onClick={() => setShowAnswer(true)}
                size="lg"
                className="px-8 py-3 text-lg bg-secondary hover:bg-secondary/90"
              >
                Show Answer
              </Button>
            ) : (
              <div className="space-x-4">
                <Button
                  onClick={handleAnswered}
                  size="lg"
                  className="px-8 py-3 text-lg bg-primary hover:bg-primary/90"
                >
                  Mark as Answered
                </Button>
                <Button
                  onClick={handleClose}
                  variant="outline"
                  size="lg"
                  className="px-8 py-3 text-lg"
                >
                  Close
                </Button>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
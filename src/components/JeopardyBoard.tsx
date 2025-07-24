import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { JeopardyGame, JeopardyQuestion } from '@/types/jeopardy';
import { cn } from '@/lib/utils';
import { useFullscreen } from '@/hooks/useFullscreen';
import { Maximize, Minimize } from 'lucide-react';
import { useRef } from 'react';

interface JeopardyBoardProps {
  game: JeopardyGame;
  onQuestionSelect: (question: JeopardyQuestion) => void;
  answeredQuestions: string[];
}

export const JeopardyBoard = ({ game, onQuestionSelect, answeredQuestions }: JeopardyBoardProps) => {
  const boardRef = useRef<HTMLDivElement>(null);
  const { isFullscreen, toggleFullscreen, isSupported } = useFullscreen(boardRef.current);

  return (
    <div ref={boardRef} className={cn(
      "w-full max-w-7xl mx-auto p-6",
      isFullscreen && "fixed inset-0 z-50 bg-background max-w-none"
    )}>
      <div className="bg-gradient-jeopardy rounded-xl p-8 shadow-jeopardy h-full flex flex-col">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-center flex-1 text-primary-foreground">
            {game.title}
          </h2>
          {isSupported && (
            <Button
              onClick={toggleFullscreen}
              variant="ghost"
              size="sm"
              className="text-primary-foreground hover:bg-primary-foreground/20"
            >
              {isFullscreen ? (
                <Minimize className="h-5 w-5" />
              ) : (
                <Maximize className="h-5 w-5" />
              )}
            </Button>
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 flex-1">
          {game.categories.map((category) => (
            <div key={category.id} className="space-y-2 flex flex-col">
              {/* Category Header */}
              <Card className="bg-jeopardy-gold/90 border-0 shadow-gold">
                <div className="p-4 text-center">
                  <h3 className={cn(
                    "font-bold text-secondary-foreground uppercase tracking-wide",
                    isFullscreen ? "text-xl" : "text-lg"
                  )}>
                    {category.name}
                  </h3>
                </div>
              </Card>

              {/* Questions */}
              <div className="space-y-2 flex-1 flex flex-col">
                {category.questions
                  .sort((a, b) => a.value - b.value)
                  .map((question) => (
                    <Button
                      key={question.id}
                      onClick={() => onQuestionSelect(question)}
                      disabled={answeredQuestions.includes(question.id)}
                      className={cn(
                        "w-full font-bold transition-all duration-300 flex-1",
                        isFullscreen ? "h-24 text-3xl" : "h-20 text-2xl",
                        answeredQuestions.includes(question.id)
                          ? "bg-muted text-muted-foreground cursor-not-allowed opacity-50"
                          : "bg-primary hover:bg-primary/90 text-primary-foreground hover:scale-105 shadow-jeopardy"
                      )}
                    >
                      {answeredQuestions.includes(question.id) ? (
                        <span className="line-through">${question.value}</span>
                      ) : (
                        `$${question.value}`
                      )}
                    </Button>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
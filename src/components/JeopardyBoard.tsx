import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { JeopardyGame, JeopardyQuestion } from '@/types/jeopardy';
import { cn } from '@/lib/utils';

interface JeopardyBoardProps {
  game: JeopardyGame;
  onQuestionSelect: (question: JeopardyQuestion) => void;
  answeredQuestions: string[];
}

export const JeopardyBoard = ({ game, onQuestionSelect, answeredQuestions }: JeopardyBoardProps) => {
  return (
    <div className="w-full max-w-7xl mx-auto p-6">
      <div className="bg-gradient-jeopardy rounded-xl p-8 shadow-jeopardy">
        <h2 className="text-3xl font-bold text-center mb-8 text-primary-foreground">
          {game.title}
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {game.categories.map((category) => (
            <div key={category.id} className="space-y-2">
              {/* Category Header */}
              <Card className="bg-jeopardy-gold/90 border-0 shadow-gold">
                <div className="p-4 text-center">
                  <h3 className="font-bold text-lg text-secondary-foreground uppercase tracking-wide">
                    {category.name}
                  </h3>
                </div>
              </Card>

              {/* Questions */}
              {category.questions
                .sort((a, b) => a.value - b.value)
                .map((question) => (
                  <Button
                    key={question.id}
                    onClick={() => onQuestionSelect(question)}
                    disabled={answeredQuestions.includes(question.id)}
                    className={cn(
                      "w-full h-20 text-2xl font-bold transition-all duration-300",
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
          ))}
        </div>
      </div>
    </div>
  );
};
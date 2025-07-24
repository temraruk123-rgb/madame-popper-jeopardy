import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { JeopardyGame, JeopardyCategory, JeopardyQuestion } from '@/types/jeopardy';
import { Plus, Trash2, Save, ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { MathEditor } from '@/components/MathEditor';
import { ImageUpload } from '@/components/ImageUpload';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface GameEditorProps {
  game: JeopardyGame | null;
  onSave: (game: JeopardyGame) => void;
  onBack: () => void;
}

export const GameEditor = ({ game, onSave, onBack }: GameEditorProps) => {
  const { toast } = useToast();
  const [gameTitle, setGameTitle] = useState(game?.title || 'New Jeopardy Game');
  const [categories, setCategories] = useState<JeopardyCategory[]>(
    game?.categories || [
      {
        id: crypto.randomUUID(),
        name: '',
        questions: Array.from({ length: 5 }, (_, i) => ({
          id: crypto.randomUUID(),
          question: '',
          answer: '',
          value: (i + 1) * 100,
          questionImage: '',
          answerImage: '',
        })),
      },
    ]
  );

  const addCategory = () => {
    const newCategory: JeopardyCategory = {
      id: crypto.randomUUID(),
      name: '',
      questions: Array.from({ length: 5 }, (_, i) => ({
        id: crypto.randomUUID(),
        question: '',
        answer: '',
        value: (i + 1) * 100,
        questionImage: '',
        answerImage: '',
      })),
    };
    setCategories([...categories, newCategory]);
  };

  const removeCategory = (categoryId: string) => {
    setCategories(categories.filter(c => c.id !== categoryId));
  };

  const updateCategory = (categoryId: string, name: string) => {
    setCategories(categories.map(c => 
      c.id === categoryId ? { ...c, name } : c
    ));
  };

  const updateQuestion = (categoryId: string, questionId: string, field: keyof JeopardyQuestion, value: string | number) => {
    setCategories(categories.map(c => 
      c.id === categoryId 
        ? {
            ...c, 
            questions: c.questions.map(q => 
              q.id === questionId ? { ...q, [field]: value } : q
            )
          }
        : c
    ));
  };

  const handleSave = () => {
    // Validate
    if (!gameTitle.trim()) {
      toast({
        title: "Error",
        description: "Please enter a game title",
        variant: "destructive"
      });
      return;
    }

    const emptyCategories = categories.filter(c => !c.name.trim());
    if (emptyCategories.length > 0) {
      toast({
        title: "Error", 
        description: "Please fill in all category names",
        variant: "destructive"
      });
      return;
    }

    const savedGame: JeopardyGame = {
      id: game?.id || crypto.randomUUID(),
      title: gameTitle,
      categories,
      createdAt: game?.createdAt || new Date(),
      lastModified: new Date(),
    };

    onSave(savedGame);
    toast({
      title: "Success",
      description: "Game saved successfully!",
    });
  };


  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button onClick={onBack} variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <h1 className="text-4xl font-bold text-primary">Game Editor</h1>
          </div>
          <Button onClick={handleSave} className="bg-secondary hover:bg-secondary/90 text-secondary-foreground">
            <Save className="h-4 w-4 mr-2" />
            Save Game
          </Button>
        </div>

        {/* Game Title */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Game Settings</CardTitle>
          </CardHeader>
          <CardContent>
            <div>
              <Label htmlFor="gameTitle">Game Title</Label>
              <Input
                id="gameTitle"
                value={gameTitle}
                onChange={(e) => setGameTitle(e.target.value)}
                placeholder="Enter game title..."
                className="text-lg font-semibold"
              />
            </div>
          </CardContent>
        </Card>

        {/* Categories */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {categories.map((category, categoryIndex) => (
            <Card key={category.id} className="bg-card">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Category {categoryIndex + 1}</CardTitle>
                  {categories.length > 1 && (
                    <Button
                      onClick={() => removeCategory(category.id)}
                      variant="destructive"
                      size="sm"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Category Name */}
                <div>
                  <Label>Category Name</Label>
                  <Input
                    value={category.name}
                    onChange={(e) => updateCategory(category.id, e.target.value)}
                    placeholder="e.g., Science, History..."
                  />
                </div>

                {/* Questions */}
                <div className="space-y-3">
                  {category.questions.map((question) => (
                    <div key={question.id} className="space-y-2 p-3 bg-muted rounded-lg">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-primary">${question.value}</span>
                      </div>
                      
                       <Tabs defaultValue="question" className="w-full">
                         <TabsList className="grid w-full grid-cols-2">
                           <TabsTrigger value="question">Question</TabsTrigger>
                           <TabsTrigger value="answer">Answer</TabsTrigger>
                         </TabsList>
                         
                         <TabsContent value="question" className="space-y-3">
                           <div>
                             <Label className="text-sm">Question Text</Label>
                             <MathEditor
                               value={question.question}
                               onChange={(value) => updateQuestion(category.id, question.id, 'question', value)}
                               placeholder="Enter question..."
                               rows={2}
                             />
                           </div>
                           <div>
                             <Label className="text-sm">Question Image (Optional)</Label>
                             <ImageUpload
                               value={(question as any).questionImage}
                               onChange={(imageUrl) => updateQuestion(category.id, question.id, 'questionImage' as any, imageUrl || '')}
                             />
                           </div>
                         </TabsContent>
                         
                         <TabsContent value="answer" className="space-y-3">
                           <div>
                             <Label className="text-sm">Answer Text</Label>
                             <MathEditor
                               value={question.answer}
                               onChange={(value) => updateQuestion(category.id, question.id, 'answer', value)}
                               placeholder="Enter answer..."
                               rows={2}
                             />
                           </div>
                           <div>
                             <Label className="text-sm">Answer Image (Optional)</Label>
                             <ImageUpload
                               value={(question as any).answerImage}
                               onChange={(imageUrl) => updateQuestion(category.id, question.id, 'answerImage' as any, imageUrl || '')}
                             />
                           </div>
                         </TabsContent>
                       </Tabs>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}

          {/* Add Category Button */}
          <Card className="border-dashed border-2 flex items-center justify-center min-h-[300px]">
            <Button
              onClick={addCategory}
              variant="outline"
              className="h-auto p-8 flex-col gap-4"
            >
              <Plus className="h-8 w-8" />
              <span>Add Category</span>
            </Button>
          </Card>
        </div>

        <div className="mt-8 text-center text-sm text-muted-foreground">
          <p>💡 Enhanced Math Tips:</p>
          <p>• Use parentheses for grouping: \int_(3x)^(5x^2+3) </p>
          <p>• Division auto-converts to fractions: a/b becomes a fraction</p>
          <p>• Use Enter for line breaks • Upload images for visual questions</p>
        </div>
      </div>
    </div>
  );
};
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { JeopardyGame, GameState, Team } from '@/types/jeopardy';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { JeopardyBoard } from '@/components/JeopardyBoard';
import { QuestionModal } from '@/components/QuestionModal';
import { GameEditor } from '@/components/GameEditor';
import { LanguageToggle } from '@/components/LanguageToggle';
import { MathTutorial } from '@/components/MathTutorial';
import { TeamSetup } from '@/components/TeamSetup';
import { useLanguage } from '@/contexts/LanguageContext';
import { Plus, Play, Edit, Trash2, Trophy, Calculator, Users } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const JeopardyMaker = () => {
  const { toast } = useToast();
  const { t } = useLanguage();
  const [games, setGames] = useLocalStorage<JeopardyGame[]>('jeopardy-games', []);
  const [currentView, setCurrentView] = useState<'home' | 'editor' | 'play' | 'teamSetup'>('home');
  const [showMathTutorial, setShowMathTutorial] = useState(false);
  const [showTeamSetup, setShowTeamSetup] = useState(false);
  const [currentGame, setCurrentGame] = useState<JeopardyGame | null>(null);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [gameState, setGameState] = useLocalStorage<GameState>('current-game-state', {
    currentScore: 0,
    answeredQuestions: [],
    teams: []
  });

  const createNewGame = () => {
    setCurrentGame(null);
    setCurrentView('editor');
  };

  const editGame = (game: JeopardyGame) => {
    setCurrentGame(game);
    setCurrentView('editor');
  };

  const playGame = (game: JeopardyGame) => {
    setCurrentGame(game);
    setShowTeamSetup(true);
  };

  const startGameWithTeams = (teams: Team[]) => {
    setGameState({ 
      currentScore: 0, 
      answeredQuestions: [], 
      teams: teams
    });
    setCurrentView('play');
  };

  const deleteGame = (gameId: string) => {
    setGames(games.filter(g => g.id !== gameId));
    toast({
      title: t('games.deleteSuccess'),
      description: t('games.deleteDesc'),
    });
  };

  const saveGame = (game: JeopardyGame) => {
    const existingIndex = games.findIndex(g => g.id === game.id);
    if (existingIndex >= 0) {
      const updatedGames = [...games];
      updatedGames[existingIndex] = game;
      setGames(updatedGames);
    } else {
      setGames([...games, game]);
    }
    setCurrentView('home');
  };

  const handleQuestionAnswered = (teamId?: string) => {
    if (selectedQuestion && currentGame) {
      let updatedTeams = [...gameState.teams];
      
      if (teamId && updatedTeams.length > 0) {
        updatedTeams = updatedTeams.map(team => 
          team.id === teamId 
            ? { ...team, score: team.score + selectedQuestion.value }
            : team
        );
      }
      
      setGameState({
        currentScore: gameState.teams.length > 0 ? gameState.currentScore : gameState.currentScore + selectedQuestion.value,
        answeredQuestions: [...gameState.answeredQuestions, selectedQuestion.id],
        teams: updatedTeams
      });
    }
    setSelectedQuestion(null);
  };

  if (currentView === 'editor') {
    return (
      <GameEditor
        game={currentGame}
        onSave={saveGame}
        onBack={() => setCurrentView('home')}
      />
    );
  }

  if (currentView === 'play' && currentGame) {
    return (
      <div className="min-h-screen bg-background">
        {/* Game Header */}
        <div className="bg-gradient-jeopardy p-6 shadow-jeopardy">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <Button
              onClick={() => setCurrentView('home')}
              variant="outline"
              className="bg-background/90 hover:bg-background"
            >
              ← {t('button.back')}
            </Button>
            <div className="text-center">
              <h1 className="text-3xl font-bold text-primary-foreground">
                {currentGame.title}
              </h1>
              {gameState.teams.length > 0 ? (
                <div className="flex items-center gap-4 mt-2 justify-center flex-wrap">
                  {gameState.teams.map((team) => (
                    <div key={team.id} className="flex items-center gap-2">
                      <div 
                        className="w-4 h-4 rounded-full border border-white/30"
                        style={{ backgroundColor: team.color }}
                      />
                      <span className="text-lg font-semibold text-secondary">
                        {team.name}: ${team.score}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex items-center gap-2 mt-2 justify-center">
                  <Trophy className="h-5 w-5 text-secondary" />
                  <span className="text-xl font-semibold text-secondary">
                    {t('play.score')}: ${gameState.currentScore}
                  </span>
                </div>
              )}
            </div>
            <LanguageToggle />
          </div>
        </div>

        {/* Game Board */}
        <JeopardyBoard
          game={currentGame}
          onQuestionSelect={setSelectedQuestion}
          answeredQuestions={gameState.answeredQuestions}
        />

        {/* Question Modal */}
        <QuestionModal
          question={selectedQuestion}
          isOpen={!!selectedQuestion}
          onClose={() => setSelectedQuestion(null)}
          onAnswered={handleQuestionAnswered}
          teams={gameState.teams}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-jeopardy p-8 shadow-jeopardy">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-start mb-4">
            <div></div>
            <LanguageToggle />
          </div>
          <div className="text-center">
            <h1 className="text-5xl font-bold text-primary-foreground mb-4">
              {t('app.title')}
            </h1>
            <p className="text-xl text-primary-foreground/90">
              {t('app.subtitle')}
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto p-8">
        {/* Create New Game Button */}
        <div className="text-center mb-12">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              onClick={createNewGame}
              size="lg"
              className="bg-secondary hover:bg-secondary/90 text-secondary-foreground px-8 py-4 text-lg shadow-gold"
            >
              <Plus className="h-6 w-6 mr-3" />
              {t('button.createNew')}
            </Button>
            
            <Button
              onClick={() => setShowMathTutorial(true)}
              variant="outline"
              size="lg"
              className="px-8 py-4 text-lg border-primary text-primary hover:bg-primary hover:text-primary-foreground"
            >
              <Calculator className="h-6 w-6 mr-3" />
              {t('tutorial.openTutorial')}
            </Button>
          </div>
        </div>

        {/* Games List */}
        <div>
          <h2 className="text-3xl font-bold mb-8 text-center text-foreground">{t('games.title')}</h2>
          
          {games.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <div className="space-y-4">
                  <div className="text-6xl">🎯</div>
                  <h3 className="text-2xl font-semibold">{t('games.noGames')}</h3>
                  <p className="text-muted-foreground">
                    {t('games.noGamesDesc')}
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {games.map((game) => (
                <Card key={game.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-xl">{game.title}</CardTitle>
                    <CardDescription>
                      {game.categories.length} {t('games.categories')} • {t('games.created')} {new Date(game.createdAt).toLocaleDateString()}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => playGame(game)}
                        className="flex-1 bg-primary hover:bg-primary/90"
                      >
                        <Play className="h-4 w-4 mr-2" />
                        {t('button.play')}
                      </Button>
                      <Button
                        onClick={() => editGame(game)}
                        variant="outline"
                        size="sm"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        onClick={() => deleteGame(game.id)}
                        variant="destructive"
                        size="sm"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
        </div>
        
        {/* Math Tutorial Modal */}
        <MathTutorial
          isOpen={showMathTutorial}
          onClose={() => setShowMathTutorial(false)}
        />
        
        {/* Team Setup Modal */}
        <TeamSetup
          isOpen={showTeamSetup}
          onClose={() => setShowTeamSetup(false)}
          onStart={startGameWithTeams}
        />
      </div>
    );
  };
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Team } from '@/types/jeopardy';
import { useLanguage } from '@/contexts/LanguageContext';
import { Trophy } from 'lucide-react';

interface TeamSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTeam: (teamId: string) => void;
  teams: Team[];
  points: number;
}

export const TeamSelector = ({ isOpen, onClose, onSelectTeam, teams, points }: TeamSelectorProps) => {
  const { t } = useLanguage();

  const handleTeamSelect = (teamId: string) => {
    onSelectTeam(teamId);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-xl">
            {t('teams.whoGetsPoints')}
          </DialogTitle>
          <div className="text-center text-3xl font-bold text-primary">
            ${points}
          </div>
        </DialogHeader>

        <div className="space-y-3">
          {teams.map((team) => (
            <Card 
              key={team.id} 
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => handleTeamSelect(team.id)}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-8 h-8 rounded-full border-2 border-gray-300"
                      style={{ backgroundColor: team.color }}
                    />
                    <span className="font-semibold text-lg">{team.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Trophy className="h-4 w-4 text-muted-foreground" />
                    <span className="text-lg font-bold">${team.score}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Button variant="outline" onClick={onClose}>
            {t('button.cancel')}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
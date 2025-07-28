import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Team } from '@/types/jeopardy';
import { useLanguage } from '@/contexts/LanguageContext';
import { Trophy, Check } from 'lucide-react';

interface TeamSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTeams: (teamIds: string[]) => void;
  teams: Team[];
  points: number;
}

export const TeamSelector = ({ isOpen, onClose, onSelectTeams, teams, points }: TeamSelectorProps) => {
  const { t } = useLanguage();
  const [selectedTeams, setSelectedTeams] = useState<string[]>([]);

  const handleTeamToggle = (teamId: string) => {
    setSelectedTeams(prev => 
      prev.includes(teamId) 
        ? prev.filter(id => id !== teamId)
        : [...prev, teamId]
    );
  };

  const handleAwardPoints = () => {
    if (selectedTeams.length > 0) {
      onSelectTeams(selectedTeams);
      setSelectedTeams([]);
    }
  };

  const handleClose = () => {
    setSelectedTeams([]);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-xl">
            {t('teams.whoGetsPoints')}
          </DialogTitle>
          <div className="text-center text-3xl font-bold text-primary">
            ${points}
          </div>
          <p className="text-center text-sm text-muted-foreground">
            {t('teams.selectMultiple')}
          </p>
        </DialogHeader>

        <div className="space-y-3">
          {teams.map((team) => {
            const isSelected = selectedTeams.includes(team.id);
            
            return (
              <Card 
                key={team.id} 
                className={`cursor-pointer transition-all ${
                  isSelected 
                    ? 'ring-2 ring-primary bg-primary/5' 
                    : 'hover:shadow-md'
                }`}
                onClick={() => handleTeamToggle(team.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Checkbox 
                        checked={isSelected}
                        onChange={() => handleTeamToggle(team.id)}
                      />
                      <div 
                        className="w-8 h-8 rounded-full border-2 border-gray-300"
                        style={{ backgroundColor: team.color }}
                      />
                      <span className="font-semibold text-lg">{team.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Trophy className="h-4 w-4 text-muted-foreground" />
                      <span className="text-lg font-bold">${team.score}</span>
                      {isSelected && <Check className="h-5 w-5 text-primary" />}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="flex justify-center gap-3">
          <Button variant="outline" onClick={handleClose}>
            {t('button.cancel')}
          </Button>
          <Button 
            onClick={handleAwardPoints}
            disabled={selectedTeams.length === 0}
            className="min-w-[120px]"
          >
            {t('teams.awardPoints')} ({selectedTeams.length})
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
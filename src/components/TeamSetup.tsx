import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Team } from '@/types/jeopardy';
import { useLanguage } from '@/contexts/LanguageContext';
import { Users, Palette } from 'lucide-react';

interface TeamSetupProps {
  isOpen: boolean;
  onClose: () => void;
  onStart: (teams: Team[]) => void;
}

const teamColors = [
  '#ef4444', // red
  '#3b82f6', // blue
  '#10b981', // green
  '#f59e0b', // amber
  '#8b5cf6', // violet
  '#ec4899', // pink
  '#06b6d4', // cyan
  '#84cc16', // lime
];

export const TeamSetup = ({ isOpen, onClose, onStart }: TeamSetupProps) => {
  const { t } = useLanguage();
  const [numTeams, setNumTeams] = useState(2);
  const [teams, setTeams] = useState<Team[]>([]);
  const [step, setStep] = useState<'select' | 'customize'>('select');

  const initializeTeams = (count: number) => {
    const newTeams: Team[] = [];
    for (let i = 0; i < count; i++) {
      newTeams.push({
        id: `team-${i + 1}`,
        name: `${t('teams.teamName')} ${i + 1}`,
        color: teamColors[i % teamColors.length],
        score: 0,
      });
    }
    setTeams(newTeams);
    setStep('customize');
  };

  const updateTeam = (index: number, field: 'name' | 'color', value: string) => {
    const updated = [...teams];
    updated[index] = { ...updated[index], [field]: value };
    setTeams(updated);
  };

  const handleStart = () => {
    onStart(teams);
    onClose();
  };

  const handleClose = () => {
    setStep('select');
    setTeams([]);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <Users className="h-6 w-6" />
            {step === 'select' ? t('teams.selectTeams') : t('teams.customizeTeams')}
          </DialogTitle>
        </DialogHeader>

        {step === 'select' ? (
          <div className="space-y-6">
            <div className="text-center">
              <Label className="text-lg font-semibold">
                {t('teams.selectTeams')}
              </Label>
              <div className="grid grid-cols-4 gap-3 mt-4">
                {[2, 3, 4, 5].map((count) => (
                  <Button
                    key={count}
                    variant={numTeams === count ? 'default' : 'outline'}
                    onClick={() => setNumTeams(count)}
                    className="h-16 text-2xl font-bold"
                  >
                    {count}
                  </Button>
                ))}
              </div>
            </div>
            
            <div className="flex justify-center gap-4">
              <Button variant="outline" onClick={handleClose}>
                {t('button.cancel')}
              </Button>
              <Button onClick={() => initializeTeams(numTeams)}>
                {t('button.next')} →
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="grid gap-4">
              {teams.map((team, index) => (
                <Card key={team.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      <div 
                        className="w-12 h-12 rounded-full border-2 border-gray-300"
                        style={{ backgroundColor: team.color }}
                      />
                      <div className="flex-1">
                        <Input
                          value={team.name}
                          onChange={(e) => updateTeam(index, 'name', e.target.value)}
                          placeholder={`${t('teams.teamName')} ${index + 1}`}
                          className="mb-2"
                        />
                        <div className="flex items-center gap-2">
                          <Palette className="h-4 w-4" />
                          <div className="flex gap-2">
                            {teamColors.map((color) => (
                              <button
                                key={color}
                                onClick={() => updateTeam(index, 'color', color)}
                                className={`w-6 h-6 rounded-full border-2 ${
                                  team.color === color ? 'border-gray-900' : 'border-gray-300'
                                }`}
                                style={{ backgroundColor: color }}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <div className="flex justify-center gap-4">
              <Button variant="outline" onClick={() => setStep('select')}>
                ← {t('button.back')}
              </Button>
              <Button onClick={handleStart} size="lg">
                {t('teams.startGame')}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
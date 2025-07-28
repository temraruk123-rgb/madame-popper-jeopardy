export interface JeopardyQuestion {
  id: string;
  question: string;
  answer: string;
  value: number;
  isAnswered?: boolean;
  questionImage?: string;
  answerImage?: string;
}

export interface JeopardyCategory {
  id: string;
  name: string;
  questions: JeopardyQuestion[];
}

export interface JeopardyGame {
  id: string;
  title: string;
  categories: JeopardyCategory[];
  createdAt: Date;
  lastModified: Date;
}

export interface Team {
  id: string;
  name: string;
  color: string;
  score: number;
}

export interface GameState {
  currentScore: number;
  answeredQuestions: string[];
  teams: Team[];
  selectedTeamId?: string;
}
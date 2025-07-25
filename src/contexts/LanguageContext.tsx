import React, { createContext, useContext, useState, ReactNode } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';

export type Language = 'en' | 'fr';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations = {
  en: {
    // Header
    'app.title': 'Mme Popper Jeopardy Maker',
    'app.subtitle': 'Create and play custom Jeopardy games with math formula support!',
    
    // Navigation & Buttons
    'button.play': 'Play',
    'button.edit': 'Edit',
    'button.delete': 'Delete',
    'button.close': 'Close',
    'button.back': 'Back to Home',
    'button.createNew': 'Create New Game',
    'button.showAnswer': 'Show Answer',
    'button.markAnswered': 'Mark as Answered',
    'button.celebrating': 'Celebrating!',
    'button.save': 'Save Game',
    'button.cancel': 'Cancel',
    'button.addCategory': 'Add Category',
    'button.addQuestion': 'Add Question',
    
    // Game Management
    'games.title': 'Your Games',
    'games.noGames': 'No games yet!',
    'games.noGamesDesc': 'Create your first Jeopardy game to get started.',
    'games.categories': 'categories',
    'games.created': 'Created',
    'games.deleteSuccess': 'Game Deleted',
    'games.deleteDesc': 'The game has been removed successfully.',
    
    // Game Editor
    'editor.title': 'Game Editor',
    'editor.gameTitle': 'Game Title',
    'editor.gameTitlePlaceholder': 'Enter game title...',
    'editor.categories': 'Categories',
    'editor.categoryName': 'Category Name',
    'editor.categoryPlaceholder': 'Enter category name...',
    'editor.questions': 'Questions',
    'editor.questionText': 'Question',
    'editor.questionPlaceholder': 'Enter your question...',
    'editor.answerText': 'Answer',
    'editor.answerPlaceholder': 'Enter the answer...',
    'editor.value': 'Value',
    'editor.questionImage': 'Question Image',
    'editor.answerImage': 'Answer Image',
    'editor.uploadImage': 'Upload Image',
    'editor.removeCategory': 'Remove Category',
    'editor.removeQuestion': 'Remove Question',
    
    // Game Play
    'play.score': 'Score',
    'play.fullscreen': 'Fullscreen',
    'play.exitFullscreen': 'Exit Fullscreen',
    
    // Math Editor
    'math.symbols': 'Math Symbols',
    'math.fraction': 'Fraction',
    'math.superscript': 'Superscript',
    'math.subscript': 'Subscript',
    'math.squareRoot': 'Square Root',
    'math.pi': 'Pi',
    'math.infinity': 'Infinity',
    'math.plusMinus': 'Plus/Minus',
    'math.degrees': 'Degrees',
    'math.times': 'Multiplication',
    'math.divide': 'Division',
    'math.integral': 'Integral',
    'math.sum': 'Sum',
    'math.alpha': 'Alpha',
    'math.beta': 'Beta',
    'math.gamma': 'Gamma',
    'math.delta': 'Delta',
    'math.theta': 'Theta',
    'math.lambda': 'Lambda',
    'math.mu': 'Mu',
    'math.sigma': 'Sigma',
    'math.phi': 'Phi',
    'math.omega': 'Omega',
    
    // Math Tutorial
    'tutorial.mathTitle': 'Math Symbols Tutorial',
    'tutorial.mathSubtitle': 'Learn how to create mathematical expressions using LaTeX syntax',
    'tutorial.openTutorial': 'Math Tutorial',
    'tutorial.howToUse': 'How to use',
    'tutorial.typeThis': 'Type this:',
    'tutorial.getThis': 'To get this:',
    'tutorial.basicSymbols': 'Basic Symbols',
    'tutorial.greekLetters': 'Greek Letters', 
    'tutorial.functions': 'Functions',
    'tutorial.operators': 'Operators',
    'tutorial.advanced': 'Advanced',
    'tutorial.copySymbol': 'Click to copy',
    'tutorial.copied': 'Copied to clipboard!',
    
    // Celebration Messages
    'celebration.fantastic': '🎉 Fantastic! You\'re a Jeopardy champion!',
    'celebration.brilliant': '🌟 Brilliant work! Keep it up!',
    'celebration.amazing': '🎊 Amazing! You\'re on fire!',
    'celebration.excellent': '✨ Excellent! Your brain is working overtime!',
    'celebration.superb': '🚀 Superb! You\'re reaching for the stars!',
    'celebration.outstanding': '🏆 Outstanding! Victory is yours!',
    'celebration.spectacular': '💫 Spectacular! You\'re absolutely crushing it!',
    'celebration.perfect': '🎯 Perfect! Right on target!',
    'celebration.wonderful': '⭐ Wonderful! You\'re a star student!',
    'celebration.marvelous': '🎈 Marvelous! Learning is so much fun!',
    'celebration.keepItUp': 'Keep up the great work! 🎓',
  },
  fr: {
    // Header
    'app.title': 'Créateur de Jeopardy de Mme Popper',
    'app.subtitle': 'Créez et jouez à des jeux Jeopardy personnalisés avec support des formules mathématiques !',
    
    // Navigation & Buttons
    'button.play': 'Jouer',
    'button.edit': 'Modifier',
    'button.delete': 'Supprimer',
    'button.close': 'Fermer',
    'button.back': 'Retour à l\'accueil',
    'button.createNew': 'Créer un nouveau jeu',
    'button.showAnswer': 'Montrer la réponse',
    'button.markAnswered': 'Marquer comme répondu',
    'button.celebrating': 'Célébration !',
    'button.save': 'Sauvegarder le jeu',
    'button.cancel': 'Annuler',
    'button.addCategory': 'Ajouter une catégorie',
    'button.addQuestion': 'Ajouter une question',
    
    // Game Management
    'games.title': 'Vos jeux',
    'games.noGames': 'Aucun jeu pour le moment !',
    'games.noGamesDesc': 'Créez votre premier jeu Jeopardy pour commencer.',
    'games.categories': 'catégories',
    'games.created': 'Créé le',
    'games.deleteSuccess': 'Jeu supprimé',
    'games.deleteDesc': 'Le jeu a été supprimé avec succès.',
    
    // Game Editor
    'editor.title': 'Éditeur de jeu',
    'editor.gameTitle': 'Titre du jeu',
    'editor.gameTitlePlaceholder': 'Entrez le titre du jeu...',
    'editor.categories': 'Catégories',
    'editor.categoryName': 'Nom de la catégorie',
    'editor.categoryPlaceholder': 'Entrez le nom de la catégorie...',
    'editor.questions': 'Questions',
    'editor.questionText': 'Question',
    'editor.questionPlaceholder': 'Entrez votre question...',
    'editor.answerText': 'Réponse',
    'editor.answerPlaceholder': 'Entrez la réponse...',
    'editor.value': 'Valeur',
    'editor.questionImage': 'Image de la question',
    'editor.answerImage': 'Image de la réponse',
    'editor.uploadImage': 'Télécharger une image',
    'editor.removeCategory': 'Supprimer la catégorie',
    'editor.removeQuestion': 'Supprimer la question',
    
    // Game Play
    'play.score': 'Score',
    'play.fullscreen': 'Plein écran',
    'play.exitFullscreen': 'Quitter le plein écran',
    
    // Math Editor
    'math.symbols': 'Symboles mathématiques',
    'math.fraction': 'Fraction',
    'math.superscript': 'Exposant',
    'math.subscript': 'Indice',
    'math.squareRoot': 'Racine carrée',
    'math.pi': 'Pi',
    'math.infinity': 'Infini',
    'math.plusMinus': 'Plus/Moins',
    'math.degrees': 'Degrés',
    'math.times': 'Multiplication',
    'math.divide': 'Division',
    'math.integral': 'Intégrale',
    'math.sum': 'Somme',
    'math.alpha': 'Alpha',
    'math.beta': 'Bêta',
    'math.gamma': 'Gamma',
    'math.delta': 'Delta',
    'math.theta': 'Thêta',
    'math.lambda': 'Lambda',
    'math.mu': 'Mu',
    'math.sigma': 'Sigma',
    'math.phi': 'Phi',
    'math.omega': 'Oméga',
    
    // Math Tutorial
    'tutorial.mathTitle': 'Tutoriel des symboles mathématiques',
    'tutorial.mathSubtitle': 'Apprenez à créer des expressions mathématiques avec la syntaxe LaTeX',
    'tutorial.openTutorial': 'Tutoriel math',
    'tutorial.howToUse': 'Comment utiliser',
    'tutorial.typeThis': 'Tapez ceci :',
    'tutorial.getThis': 'Pour obtenir ceci :',
    'tutorial.basicSymbols': 'Symboles de base',
    'tutorial.greekLetters': 'Lettres grecques',
    'tutorial.functions': 'Fonctions',
    'tutorial.operators': 'Opérateurs',
    'tutorial.advanced': 'Avancé',
    'tutorial.copySymbol': 'Cliquez pour copier',
    'tutorial.copied': 'Copié dans le presse-papiers !',
    
    // Celebration Messages
    'celebration.fantastic': '🎉 Fantastique ! Vous êtes un champion de Jeopardy !',
    'celebration.brilliant': '🌟 Brillant travail ! Continuez comme ça !',
    'celebration.amazing': '🎊 Incroyable ! Vous êtes en feu !',
    'celebration.excellent': '✨ Excellent ! Votre cerveau travaille à plein régime !',
    'celebration.superb': '🚀 Superbe ! Vous visez les étoiles !',
    'celebration.outstanding': '🏆 Exceptionnel ! La victoire est vôtre !',
    'celebration.spectacular': '💫 Spectaculaire ! Vous écrasez tout !',
    'celebration.perfect': '🎯 Parfait ! En plein dans le mille !',
    'celebration.wonderful': '⭐ Merveilleux ! Vous êtes un étudiant étoile !',
    'celebration.marvelous': '🎈 Merveilleux ! Apprendre, c\'est si amusant !',
    'celebration.keepItUp': 'Continuez ce bon travail ! 🎓',
  }
};

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguage] = useLocalStorage<Language>('language', 'en');

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
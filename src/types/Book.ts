export interface QuizQuestion {
  multipleChoice: {
    question: string;
    options: string[];
    correctAnswer: number;
  };
  spelling: {
    word: string;
    hint: string;
  };
}

export interface BookPage {
  id: number;
  title: string;
  content: string;
  imageUrl?: string;
  audioUrl?: string;
  quiz: QuizQuestion;
  backgroundColor?: string;
  textColor?: string;
  interactions?: Array<{
    x: number;
    y: number;
    width: number;
    height: number;
    soundUrl?: string;
    animation?: string;
  }>;
}

export interface Book {
  id: string;
  title: string;
  description: string;
  coverImageUrl: string;
  author: string;
  ageRange: string;
  pages: BookPage[];
  theme: 'magic' | 'ocean' | 'forest' | 'sunset';
}

export interface QuizAnswer {
  pageTitle: string;
  multipleChoiceQuestion: string;
  multipleChoiceAnswer: string;
  spellingWord: string;
  spellingAnswer: string;
  isCorrect: boolean;
}

export interface TTSSettings {
  voice: string;
  speed: number;
  pitch: number;
  volume: number;
  autoPlay: boolean;
}
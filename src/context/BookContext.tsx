import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { Book, BookPage, TTSSettings, QuizAnswer } from '../types/Book';

interface BookState {
  currentBook: Book | null;
  currentPageIndex: number;
  completedPages: Set<number>;
  quizAnswers: QuizAnswer[];
  ttsSettings: TTSSettings;
  isReading: boolean;
  currentWordIndex: number;
  unlockedPages: Set<number>;
}

type BookAction =
  | { type: 'SET_BOOK'; payload: Book }
  | { type: 'SET_PAGE'; payload: number }
  | { type: 'COMPLETE_PAGE'; payload: number }
  | { type: 'ADD_QUIZ_ANSWER'; payload: QuizAnswer }
  | { type: 'UPDATE_TTS_SETTINGS'; payload: Partial<TTSSettings> }
  | { type: 'SET_READING_STATE'; payload: { isReading: boolean; wordIndex: number } }
  | { type: 'UNLOCK_PAGE'; payload: number }
  | { type: 'RESET_BOOK' };

const initialState: BookState = {
  currentBook: null,
  currentPageIndex: 0,
  completedPages: new Set([0]), // First page is always unlocked
  quizAnswers: [],
  ttsSettings: {
    voice: 'default',
    speed: 1,
    pitch: 1,
    volume: 0.8,
    autoPlay: false,
  },
  isReading: false,
  currentWordIndex: -1,
  unlockedPages: new Set([0]),
};

function bookReducer(state: BookState, action: BookAction): BookState {
  switch (action.type) {
    case 'SET_BOOK':
      return {
        ...state,
        currentBook: action.payload,
        currentPageIndex: 0,
        completedPages: new Set([0]),
        quizAnswers: [],
        unlockedPages: new Set([0]),
      };

    case 'SET_PAGE':
      return {
        ...state,
        currentPageIndex: action.payload,
        isReading: false,
        currentWordIndex: -1,
      };

    case 'COMPLETE_PAGE':
      const newCompletedPages = new Set(state.completedPages);
      newCompletedPages.add(action.payload);
      
      const newUnlockedPages = new Set(state.unlockedPages);
      // Unlock next page when current is completed
      if (state.currentBook && action.payload < state.currentBook.pages.length - 1) {
        newUnlockedPages.add(action.payload + 1);
      }

      return {
        ...state,
        completedPages: newCompletedPages,
        unlockedPages: newUnlockedPages,
      };

    case 'ADD_QUIZ_ANSWER':
      return {
        ...state,
        quizAnswers: [...state.quizAnswers, action.payload],
      };

    case 'UPDATE_TTS_SETTINGS':
      return {
        ...state,
        ttsSettings: { ...state.ttsSettings, ...action.payload },
      };

    case 'SET_READING_STATE':
      return {
        ...state,
        isReading: action.payload.isReading,
        currentWordIndex: action.payload.wordIndex,
      };

    case 'UNLOCK_PAGE':
      const unlockedPages = new Set(state.unlockedPages);
      unlockedPages.add(action.payload);
      return {
        ...state,
        unlockedPages,
      };

    case 'RESET_BOOK':
      return {
        ...initialState,
        ttsSettings: state.ttsSettings, // Keep TTS settings
      };

    default:
      return state;
  }
}

interface BookContextType {
  state: BookState;
  dispatch: React.Dispatch<BookAction>;
  canNavigateToPage: (pageIndex: number) => boolean;
  isPageCompleted: (pageIndex: number) => boolean;
  getTotalScore: () => number;
}

const BookContext = createContext<BookContextType | undefined>(undefined);

export const BookProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(bookReducer, initialState);

  const canNavigateToPage = (pageIndex: number): boolean => {
    return state.unlockedPages.has(pageIndex);
  };

  const isPageCompleted = (pageIndex: number): boolean => {
    return state.completedPages.has(pageIndex);
  };

  const getTotalScore = (): number => {
    return state.quizAnswers.filter(answer => answer.isCorrect).length;
  };

  const contextValue: BookContextType = {
    state,
    dispatch,
    canNavigateToPage,
    isPageCompleted,
    getTotalScore,
  };

  return (
    <BookContext.Provider value={contextValue}>
      {children}
    </BookContext.Provider>
  );
};

export const useBook = (): BookContextType => {
  const context = useContext(BookContext);
  if (context === undefined) {
    throw new Error('useBook must be used within a BookProvider');
  }
  return context;
};

export { BookContext };
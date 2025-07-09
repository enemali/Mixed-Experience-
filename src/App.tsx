import React, { useState } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BookProvider } from './context/BookContext';
import { Book, QuizAnswer } from './types/Book';

import LibraryPage from './components/LibraryPage';
import BookContent from './components/BookContent';
import EndPage from './components/EndPage';

const queryClient = new QueryClient();

type AppState = 'library' | 'story' | 'end';

const App = () => {
  const [appState, setAppState] = useState<AppState>('library');
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [quizAnswers, setQuizAnswers] = useState<QuizAnswer[]>([]);
  const [totalScore, setTotalScore] = useState(0);

  const handleSelectBook = (book: Book) => {
    setSelectedBook(book);
    setAppState('story');
    setQuizAnswers([]);
    setTotalScore(0);
  };

  const handleStoryComplete = (answers: QuizAnswer[], score: number) => {
    setQuizAnswers(answers);
    setTotalScore(score);
    setAppState('end');
  };

  const handleReturnToLibrary = () => {
    setAppState('library');
    setSelectedBook(null);
    setQuizAnswers([]);
    setTotalScore(0);
  };

  const handleRestartBook = () => {
    setAppState('story');
    setQuizAnswers([]);
    setTotalScore(0);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <BookProvider>
          <div className="min-h-screen">
            {/* Library Page */}
            {appState === 'library' && (
              <LibraryPage
                onSelectBook={handleSelectBook}
                onBack={() => {}} // No back action from library
              />
            )}

            {/* Story Reading */}
            {appState === 'story' && selectedBook && (
              <BookContent
                onComplete={handleStoryComplete}
                onBack={handleReturnToLibrary}
              />
            )}

            {/* End/Results Page */}
            {appState === 'end' && selectedBook && (
              <EndPage
                bookTitle={selectedBook.title}
                quizAnswers={quizAnswers}
                totalScore={totalScore}
                totalPossible={selectedBook.pages.length * 2} // 2 questions per page
                onReturnToLibrary={handleReturnToLibrary}
                onRestartBook={handleRestartBook}
              />
            )}
          </div>
        </BookProvider>
        
        <Toaster />
        <Sonner />
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
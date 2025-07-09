import React, { useState, useRef, useEffect } from 'react';
import { useBook } from '../context/BookContext';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { 
  ChevronLeft, 
  ChevronRight, 
  Play, 
  Pause, 
  Settings,
  Volume2,
  Home,
  Award
} from 'lucide-react';
import QuizModal from './QuizModal';
import TTSControls from './TTSControls';
import { BookPage } from '../types/Book';

interface BookContentProps {
  onComplete: (answers: any[], score: number) => void;
  onBack: () => void;
}

const BookContent: React.FC<BookContentProps> = ({ onComplete, onBack }) => {
  const { state, dispatch, canNavigateToPage, isPageCompleted } = useBook();
  const [showQuiz, setShowQuiz] = useState(false);
  const [isReading, setIsReading] = useState(false);
  const [showTTSControls, setShowTTSControls] = useState(false);
  const [currentWordIndex, setCurrentWordIndex] = useState(-1);
  const speechRef = useRef<SpeechSynthesisUtterance | null>(null);
  const wordsRef = useRef<string[]>([]);

  const currentPage = state.currentBook?.pages[state.currentPageIndex];
  const totalPages = state.currentBook?.pages.length || 0;
  const progress = ((state.currentPageIndex + 1) / totalPages) * 100;

  useEffect(() => {
    return () => {
      if (speechRef.current) {
        speechSynthesis.cancel();
      }
    };
  }, []);

  const handleTextToSpeech = () => {
    if (!currentPage) return;

    if (isReading) {
      speechSynthesis.cancel();
      setIsReading(false);
      setCurrentWordIndex(-1);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(currentPage.content);
    speechRef.current = utterance;
    
    // Split content into words for highlighting
    wordsRef.current = currentPage.content.split(/\s+/);
    
    utterance.rate = state.ttsSettings.speed;
    utterance.pitch = state.ttsSettings.pitch;
    utterance.volume = state.ttsSettings.volume;

    let wordIndex = 0;
    utterance.onboundary = (event) => {
      if (event.name === 'word') {
        setCurrentWordIndex(wordIndex);
        wordIndex++;
      }
    };

    utterance.onend = () => {
      setIsReading(false);
      setCurrentWordIndex(-1);
      
      // Auto-advance to quiz if TTS finishes and page isn't completed
      if (!isPageCompleted(state.currentPageIndex)) {
        setTimeout(() => setShowQuiz(true), 1000);
      }
    };

    utterance.onerror = () => {
      setIsReading(false);
      setCurrentWordIndex(-1);
    };

    setIsReading(true);
    speechSynthesis.speak(utterance);
  };

  const navigateToPage = (pageIndex: number) => {
    if (canNavigateToPage(pageIndex)) {
      dispatch({ type: 'SET_PAGE', payload: pageIndex });
      setCurrentWordIndex(-1);
      if (speechRef.current) {
        speechSynthesis.cancel();
        setIsReading(false);
      }
    }
  };

  const handleQuizComplete = (answers: any, isCorrect: boolean) => {
    dispatch({ type: 'ADD_QUIZ_ANSWER', payload: answers });
    
    if (isCorrect) {
      dispatch({ type: 'COMPLETE_PAGE', payload: state.currentPageIndex });
    }
    
    setShowQuiz(false);

    // Check if this was the last page
    if (state.currentPageIndex === totalPages - 1 && isCorrect) {
      // Story complete - calculate final score and call onComplete
      const allAnswers = [...state.quizAnswers, answers];
      const score = allAnswers.filter(answer => answer.isCorrect).length;
      onComplete(allAnswers, score);
    }
  };

  const renderHighlightedText = (text: string) => {
    if (currentWordIndex === -1 || !isReading) {
      return <p className="text-lg leading-relaxed">{text}</p>;
    }

    const words = text.split(/(\s+)/);
    let wordCount = 0;

    return (
      <p className="text-lg leading-relaxed">
        {words.map((word, index) => {
          if (word.trim()) {
            const isHighlighted = wordCount === currentWordIndex;
            wordCount++;
            return (
              <span
                key={index}
                className={isHighlighted ? 'word-highlight bg-accent/30 rounded px-1' : ''}
              >
                {word}
              </span>
            );
          }
          return <span key={index}>{word}</span>;
        })}
      </p>
    );
  };

  if (!currentPage) {
    return <div>Loading...</div>;
  }

  const themeGradients = {
    magic: 'from-purple-500/20 to-pink-500/20',
    ocean: 'from-blue-500/20 to-cyan-500/20',
    forest: 'from-green-500/20 to-emerald-500/20',
    sunset: 'from-orange-500/20 to-yellow-500/20',
  };

  const currentTheme = state.currentBook?.theme || 'magic';

  return (
    <div className={`min-h-screen bg-gradient-to-br ${themeGradients[currentTheme]} relative`}>
      {/* Header */}
      <header className="bg-card/80 backdrop-blur-sm border-b border-border/50 p-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Button
            variant="outline"
            size="sm"
            onClick={onBack}
            className="gap-2"
          >
            <Home className="w-4 h-4" />
            Library
          </Button>

          <div className="flex-1 mx-6">
            <div className="text-center mb-2">
              <h1 className="text-xl font-bold truncate">{state.currentBook?.title}</h1>
              <p className="text-sm text-muted-foreground">
                Page {state.currentPageIndex + 1} of {totalPages}
              </p>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowTTSControls(!showTTSControls)}
            >
              <Settings className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* TTS Controls */}
      {showTTSControls && (
        <TTSControls onClose={() => setShowTTSControls(false)} />
      )}

      {/* Main Content */}
      <main className="max-w-4xl mx-auto p-6">
        <div className="bg-card/90 backdrop-blur-sm rounded-2xl book-shadow p-8 mb-6">
          {/* Page Title */}
          <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center text-primary">
            {currentPage.title}
          </h2>

          {/* Page Content */}
          <div className="prose prose-lg max-w-none mb-8">
            {renderHighlightedText(currentPage.content)}
          </div>

          {/* Reading Controls */}
          <div className="flex items-center justify-center gap-4 mb-6">
            <Button
              onClick={handleTextToSpeech}
              size="lg"
              className="btn-magic text-white border-0 gap-2"
            >
              {isReading ? (
                <>
                  <Pause className="w-5 h-5" />
                  Stop Reading
                </>
              ) : (
                <>
                  <Play className="w-5 h-5" />
                  Read Aloud
                </>
              )}
            </Button>

            {!isPageCompleted(state.currentPageIndex) && (
              <Button
                onClick={() => setShowQuiz(true)}
                variant="outline"
                size="lg"
                className="gap-2"
              >
                <Award className="w-5 h-5" />
                Take Quiz
              </Button>
            )}
          </div>

          {/* Page Status */}
          {isPageCompleted(state.currentPageIndex) && (
            <div className="text-center">
              <div className="inline-flex items-center gap-2 bg-success/10 text-success px-4 py-2 rounded-full">
                <Award className="w-5 h-5" />
                <span className="font-medium">Page Completed!</span>
              </div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <Button
            onClick={() => navigateToPage(state.currentPageIndex - 1)}
            disabled={state.currentPageIndex === 0}
            variant="outline"
            size="lg"
            className="gap-2"
          >
            <ChevronLeft className="w-5 h-5" />
            Previous
          </Button>

          <div className="flex gap-2">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => navigateToPage(i)}
                disabled={!canNavigateToPage(i)}
                className={`w-3 h-3 rounded-full transition-all ${
                  i === state.currentPageIndex
                    ? 'bg-primary scale-125'
                    : canNavigateToPage(i)
                    ? 'bg-primary/40 hover:bg-primary/60'
                    : 'bg-border cursor-not-allowed'
                }`}
              />
            ))}
          </div>

          <Button
            onClick={() => navigateToPage(state.currentPageIndex + 1)}
            disabled={
              state.currentPageIndex === totalPages - 1 || 
              !canNavigateToPage(state.currentPageIndex + 1)
            }
            variant="outline"
            size="lg"
            className="gap-2"
          >
            Next
            <ChevronRight className="w-5 h-5" />
          </Button>
        </div>
      </main>

      {/* Quiz Modal */}
      {showQuiz && currentPage && (
        <QuizModal
          quiz={currentPage.quiz}
          pageTitle={currentPage.title}
          onComplete={handleQuizComplete}
          onClose={() => setShowQuiz(false)}
        />
      )}
    </div>
  );
};

export default BookContent;
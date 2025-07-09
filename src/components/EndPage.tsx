import React, { useEffect } from 'react';
import { Button } from './ui/button';
import { Trophy, Star, RefreshCw, Home, Award } from 'lucide-react';
import { QuizAnswer } from '../types/Book';
import confetti from 'canvas-confetti';
import Confetti from 'react-confetti';

interface EndPageProps {
  bookTitle: string;
  quizAnswers: QuizAnswer[];
  totalScore: number;
  totalPossible: number;
  onReturnToLibrary: () => void;
  onRestartBook: () => void;
}

const EndPage: React.FC<EndPageProps> = ({
  bookTitle,
  quizAnswers,
  totalScore,
  totalPossible,
  onReturnToLibrary,
  onRestartBook
}) => {
  const percentage = Math.round((totalScore / totalPossible) * 100);
  const isPerfectScore = totalScore === totalPossible;
  const isGoodScore = percentage >= 70;

  useEffect(() => {
    // Celebrate completion
    if (isPerfectScore) {
      // Big celebration for perfect score
      confetti({
        particleCount: 200,
        spread: 100,
        origin: { y: 0.6 }
      });
      
      setTimeout(() => {
        confetti({
          particleCount: 150,
          angle: 60,
          spread: 55,
          origin: { x: 0 }
        });
      }, 300);
      
      setTimeout(() => {
        confetti({
          particleCount: 150,
          angle: 120,
          spread: 55,
          origin: { x: 1 }
        });
      }, 600);
    } else if (isGoodScore) {
      // Moderate celebration for good score
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  }, [isPerfectScore, isGoodScore]);

  const getScoreMessage = () => {
    if (isPerfectScore) {
      return {
        title: "Perfect! Outstanding Work! 🌟",
        message: "You got every question right! You're an amazing reader and learner!",
        color: "text-success"
      };
    } else if (isGoodScore) {
      return {
        title: "Great Job! Well Done! 👏",
        message: "You did really well! Keep practicing and you'll get even better!",
        color: "text-primary"
      };
    } else {
      return {
        title: "Good Try! Keep Learning! 💪",
        message: "Every story makes you smarter! Let's try again and learn together!",
        color: "text-warning"
      };
    }
  };

  const scoreMessage = getScoreMessage();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-primary/10 relative overflow-hidden">
      {/* Confetti Animation */}
      {isPerfectScore && (
        <Confetti
          width={window.innerWidth}
          height={window.innerHeight}
          recycle={false}
          numberOfPieces={200}
          gravity={0.3}
        />
      )}

      <div className="max-w-4xl mx-auto p-6 pt-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-magic mb-6 shadow-magic">
            <Trophy className="w-10 h-10 text-white" />
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-magic bg-clip-text text-transparent">
            Story Complete!
          </h1>
          
          <p className="text-xl text-muted-foreground">
            You finished "<span className="font-semibold text-foreground">{bookTitle}</span>"
          </p>
        </div>

        {/* Score Card */}
        <div className="bg-card/90 backdrop-blur-sm rounded-2xl book-shadow p-8 mb-8">
          <div className="text-center mb-8">
            <div className={`text-2xl md:text-3xl font-bold mb-2 ${scoreMessage.color}`}>
              {scoreMessage.title}
            </div>
            <p className="text-lg text-muted-foreground mb-6">
              {scoreMessage.message}
            </p>

            {/* Score Display */}
            <div className="inline-flex items-center gap-4 bg-primary/10 rounded-2xl p-6">
              <div className="text-center">
                <div className="text-4xl font-bold text-primary mb-1">
                  {totalScore}
                </div>
                <div className="text-sm text-muted-foreground">Correct</div>
              </div>
              <div className="text-2xl text-muted-foreground">of</div>
              <div className="text-center">
                <div className="text-4xl font-bold text-primary mb-1">
                  {totalPossible}
                </div>
                <div className="text-sm text-muted-foreground">Total</div>
              </div>
              <div className="text-center ml-4">
                <div className="text-3xl font-bold text-primary mb-1">
                  {percentage}%
                </div>
                <div className="text-sm text-muted-foreground">Score</div>
              </div>
            </div>
          </div>

          {/* Achievement Badges */}
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            {isPerfectScore && (
              <div className="flex items-center gap-2 bg-success/10 text-success px-4 py-2 rounded-full">
                <Star className="w-5 h-5" />
                <span className="font-medium">Perfect Score!</span>
              </div>
            )}
            
            {isGoodScore && (
              <div className="flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full">
                <Award className="w-5 h-5" />
                <span className="font-medium">Great Reader!</span>
              </div>
            )}
            
            <div className="flex items-center gap-2 bg-accent/10 text-accent-foreground px-4 py-2 rounded-full">
              <Trophy className="w-5 h-5" />
              <span className="font-medium">Story Explorer</span>
            </div>
          </div>

          {/* Quiz Summary */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-center mb-4">Your Quiz Results:</h3>
            {quizAnswers.map((answer, index) => (
              <div 
                key={index}
                className={`p-4 rounded-xl border-2 ${
                  answer.isCorrect
                    ? 'border-success/30 bg-success/5'
                    : 'border-warning/30 bg-warning/5'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                    answer.isCorrect
                      ? 'bg-success text-white'
                      : 'bg-warning text-white'
                  }`}>
                    {answer.isCorrect ? '✓' : '✗'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm mb-1">{answer.pageTitle}</div>
                    <div className="text-sm text-muted-foreground">
                      Spelling: <span className="font-medium">{answer.spellingAnswer}</span>
                      {answer.isCorrect ? ' ✓' : ` (${answer.spellingWord})`}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={onReturnToLibrary}
            size="lg"
            className="btn-magic text-white border-0 gap-2"
          >
            <Home className="w-5 h-5" />
            Choose New Story
          </Button>
          
          <Button
            onClick={onRestartBook}
            variant="outline"
            size="lg"
            className="gap-2"
          >
            <RefreshCw className="w-5 h-5" />
            Read Again
          </Button>
        </div>

        {/* Encouragement Message */}
        <div className="text-center mt-12 p-6 bg-gradient-to-r from-primary/5 to-accent/5 rounded-2xl">
          <p className="text-lg font-medium text-primary mb-2">
            🎉 Keep Reading, Keep Growing! 🎉
          </p>
          <p className="text-muted-foreground">
            Every story you read makes you smarter and more curious about the world!
          </p>
        </div>
      </div>
    </div>
  );
};

export default EndPage;
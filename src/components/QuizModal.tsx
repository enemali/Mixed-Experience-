import React, { useState } from 'react';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { X, Camera, Mic, Check, AlertCircle, Star } from 'lucide-react';
import { QuizQuestion, QuizAnswer } from '../types/Book';
import confetti from 'canvas-confetti';
import Webcam from 'react-webcam';
import { createWorker } from 'tesseract.js';

interface QuizModalProps {
  quiz: QuizQuestion;
  pageTitle: string;
  onComplete: (answer: QuizAnswer, isCorrect: boolean) => void;
  onClose: () => void;
}

const QuizModal: React.FC<QuizModalProps> = ({ quiz, pageTitle, onComplete, onClose }) => {
  const [currentQuestion, setCurrentQuestion] = useState<'multiple' | 'spelling'>('multiple');
  const [multipleChoiceAnswer, setMultipleChoiceAnswer] = useState<number | null>(null);
  const [spellingAnswer, setSpellingAnswer] = useState('');
  const [showCamera, setShowCamera] = useState(false);
  const [isProcessingOCR, setIsProcessingOCR] = useState(false);
  const [currentScore, setCurrentScore] = useState(0);
  const [questionsCompleted, setQuestionsCompleted] = useState<Set<string>>(new Set());
  const [showResults, setShowResults] = useState(false);
  const webcamRef = React.useRef<Webcam>(null);

  const handleMultipleChoiceSubmit = () => {
    if (multipleChoiceAnswer === null) return;

    const isCorrect = multipleChoiceAnswer === quiz.multipleChoice.correctAnswer;
    const newScore = isCorrect ? currentScore + 1 : currentScore;
    setCurrentScore(newScore);
    
    const newCompleted = new Set(questionsCompleted);
    newCompleted.add('multiple');
    setQuestionsCompleted(newCompleted);

    if (isCorrect) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }

    // Move to spelling question
    setTimeout(() => {
      setCurrentQuestion('spelling');
    }, isCorrect ? 1500 : 1000);
  };

  const handleSpellingSubmit = () => {
    if (!spellingAnswer.trim()) return;

    const isCorrect = spellingAnswer.toLowerCase().trim() === quiz.spelling.word.toLowerCase();
    const newScore = isCorrect ? currentScore + 1 : currentScore;
    
    const newCompleted = new Set(questionsCompleted);
    newCompleted.add('spelling');
    setQuestionsCompleted(newCompleted);

    if (isCorrect) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }

    // Show final results
    setTimeout(() => {
      const finalAnswer: QuizAnswer = {
        pageTitle,
        multipleChoiceQuestion: quiz.multipleChoice.question,
        multipleChoiceAnswer: quiz.multipleChoice.options[multipleChoiceAnswer || 0],
        spellingWord: quiz.spelling.word,
        spellingAnswer: spellingAnswer,
        isCorrect: newScore >= 2 // Need both questions correct
      };

      onComplete(finalAnswer, newScore >= 2);
    }, isCorrect ? 1500 : 1000);
  };

  const capturePhoto = async () => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (!imageSrc) return;

    setIsProcessingOCR(true);
    setShowCamera(false);

    try {
      const worker = await createWorker('eng');
      const { data: { text } } = await worker.recognize(imageSrc);
      await worker.terminate();

      // Extract potential spelling answer from OCR text
      const words = text.split(/\s+/).map(word => word.replace(/[^\w]/g, ''));
      const potentialAnswer = words.find(word => 
        word.toLowerCase().includes(quiz.spelling.word.toLowerCase()) ||
        quiz.spelling.word.toLowerCase().includes(word.toLowerCase())
      ) || words[0] || '';

      setSpellingAnswer(potentialAnswer);
    } catch (error) {
      console.error('OCR Error:', error);
    } finally {
      setIsProcessingOCR(false);
    }
  };

  const speakWord = () => {
    const utterance = new SpeechSynthesisUtterance(quiz.spelling.word);
    utterance.rate = 0.8;
    speechSynthesis.speak(utterance);
  };

  const progress = (questionsCompleted.size / 2) * 100;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-2xl shadow-magic max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-border/50">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-primary">Quiz Time!</h2>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-5 h-5" />
            </Button>
          </div>
          <Progress value={progress} className="h-2" />
          <p className="text-sm text-muted-foreground mt-2">
            Score: {currentScore}/2 • {pageTitle}
          </p>
        </div>

        {/* Multiple Choice Question */}
        {currentQuestion === 'multiple' && (
          <div className="p-6">
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Star className="w-5 h-5 text-primary" />
                {quiz.multipleChoice.question}
              </h3>
              
              <div className="space-y-3">
                {quiz.multipleChoice.options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => setMultipleChoiceAnswer(index)}
                    className={`w-full p-4 text-left rounded-xl border-2 transition-all ${
                      multipleChoiceAnswer === index
                        ? 'border-primary bg-primary/10'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                        multipleChoiceAnswer === index
                          ? 'border-primary bg-primary'
                          : 'border-border'
                      }`}>
                        {multipleChoiceAnswer === index && (
                          <Check className="w-4 h-4 text-white" />
                        )}
                      </div>
                      <span className="font-medium">{option}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <Button
              onClick={handleMultipleChoiceSubmit}
              disabled={multipleChoiceAnswer === null}
              className="w-full btn-magic text-white border-0"
              size="lg"
            >
              Continue to Spelling
            </Button>
          </div>
        )}

        {/* Spelling Question */}
        {currentQuestion === 'spelling' && !showCamera && (
          <div className="p-6">
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                <Star className="w-5 h-5 text-primary" />
                Spelling Challenge
              </h3>
              <p className="text-muted-foreground mb-4">{quiz.spelling.hint}</p>
              
              <div className="flex items-center gap-3 mb-6">
                <Button
                  onClick={speakWord}
                  variant="outline"
                  size="sm"
                  className="gap-2"
                >
                  <Mic className="w-4 h-4" />
                  Hear Word
                </Button>
                <Button
                  onClick={() => setShowCamera(true)}
                  variant="outline"
                  size="sm"
                  className="gap-2"
                >
                  <Camera className="w-4 h-4" />
                  Take Photo
                </Button>
              </div>

              <input
                type="text"
                value={spellingAnswer}
                onChange={(e) => setSpellingAnswer(e.target.value)}
                placeholder="Type your answer here..."
                className="w-full p-4 text-lg border-2 border-border rounded-xl focus:border-primary focus:outline-none"
                autoFocus
              />
            </div>

            <Button
              onClick={handleSpellingSubmit}
              disabled={!spellingAnswer.trim() || isProcessingOCR}
              className="w-full btn-magic text-white border-0"
              size="lg"
            >
              {isProcessingOCR ? 'Processing...' : 'Submit Answer'}
            </Button>
          </div>
        )}

        {/* Camera View */}
        {showCamera && (
          <div className="p-6">
            <div className="mb-4">
              <h3 className="text-lg font-semibold mb-2">Write your answer and take a photo</h3>
              <p className="text-muted-foreground text-sm">
                Write "{quiz.spelling.word}" on paper and capture it with the camera
              </p>
            </div>
            
            <div className="relative rounded-xl overflow-hidden bg-black mb-4">
              <Webcam
                ref={webcamRef}
                audio={false}
                screenshotFormat="image/jpeg"
                className="w-full"
              />
            </div>

            <div className="flex gap-3">
              <Button
                onClick={capturePhoto}
                className="flex-1 btn-magic text-white border-0"
                disabled={isProcessingOCR}
              >
                <Camera className="w-4 h-4 mr-2" />
                {isProcessingOCR ? 'Processing...' : 'Capture'}
              </Button>
              <Button
                onClick={() => setShowCamera(false)}
                variant="outline"
              >
                Cancel
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizModal;
'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Clock, CheckCircle, XCircle, Loader2, ArrowLeft } from 'lucide-react';

interface Question {
  id: number;
  question: string;
  options: string[];
  correct: number;
  explanation: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
}

const Quiz = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const category = searchParams.get('category') || 'Dynamic Programming';
  
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [quizReady, setQuizReady] = useState(false); 

  useEffect(() => {
    const fetchQuestions = async () => {
      setIsLoading(true);
      setError(null);
      setQuizReady(false);
      try {
        const response = await fetch('/api/questions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ category }),
        });

        if (!response.ok) {
          throw new Error('Failed to fetch questions');
        }

        const data: Question[] = await response.json();
        if (Array.isArray(data) && data.length > 0) {
          setQuestions(data);
          setQuizReady(true);
        } else {
          setError('No questions found for this category.');
          setQuestions([]);
        }
      } catch (err) {
        setError('Could not load quiz. Please try again later.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    if (category) {
      fetchQuestions();
    }
  }, [category]);

  useEffect(() => {
    if (quizReady && timeLeft > 0 && !showResult && !quizCompleted) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (quizReady && timeLeft === 0 && !showResult) {
      handleNext();
    }
  }, [timeLeft, showResult, quizCompleted, quizReady]);

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
  };

  const handleNext = () => {
    const newAnswers = [...answers, selectedAnswer];
    setAnswers(newAnswers);
    
    if (selectedAnswer === questions[currentQuestion].correct) {
      setScore(score + 1);
    }
    
    setShowResult(true);
    
    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedAnswer(null);
        setTimeLeft(30);
        setShowResult(false);
      } else {
        setQuizCompleted(true);
        setQuizReady(false);
      }
    }, 2000);
  };

  const resetQuiz = () => {
    const fetchNewQuestions = async () => {
      setIsLoading(true);
      setError(null);
      setQuizReady(false);
      try {
        const response = await fetch('/api/questions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ category }),
        });
        if (!response.ok) throw new Error('Failed to fetch');
        const data: Question[] = await response.json();
        if (Array.isArray(data) && data.length > 0) {
          setQuestions(data);
          setCurrentQuestion(0);
          setSelectedAnswer(null);
          setScore(0);
          setTimeLeft(30);
          setQuizCompleted(false);
          setShowResult(false);
          setAnswers([]);
          setQuizReady(true);
        } else {
          setError('No questions found for this category.');
          setQuestions([]);
        }
      } catch (err) {
        setError('Could not restart quiz. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchNewQuestions();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white p-4">
        <Loader2 className="w-12 h-12 animate-spin text-primary mb-4" />
        <p className="text-lg text-neutral-400">Generating your {category} quiz...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white p-4">
        <XCircle className="w-12 h-12 text-red-500 mb-4" />
        <p className="text-lg text-neutral-400">{error}</p>
        <Button onClick={() => router.push('/')} variant="outline" className="mt-4">
          Back to Home
        </Button>
      </div>
    );
  }

  if (questions.length === 0 && !isLoading && !error) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white p-4">
        <XCircle className="w-12 h-12 text-yellow-500 mb-4" />
        <p className="text-lg text-neutral-400">No questions available for &quot;{category}&quot;.</p>
        <Button onClick={() => router.push('/')} variant="outline" className="mt-4">
          Back to Home
        </Button>
      </div>
    );
  }

  if (quizCompleted) {
    const percentage = Math.round((score / questions.length) * 100);
    return (
        <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl bg-neutral-900/95 backdrop-blur border-neutral-800 text-white">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold text-primary">Quiz Complete!</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center">
              <div className="text-6xl font-bold text-white mb-2">{score}/{questions.length}</div>
              <div className="text-xl text-primary">{percentage}% Score</div>
            </div>
            
            <div className="space-y-3 max-h-60 overflow-y-auto p-1">
              {questions.map((q, index) => (
                <div key={q.id} className="flex items-center gap-3 p-3 rounded-lg bg-neutral-800">
                  {answers[index] === q.correct ? (
                    <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                  )}
                  <span className="text-sm text-neutral-300 truncate">Question {index + 1}: {q.question.split('\n')[0]}</span>
                </div>
              ))}
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <Button onClick={resetQuiz} className="flex-1 bg-primary hover:bg-primary/90">
                Try Again
              </Button>
              <Button onClick={() => router.push('/')} variant="outline" className="flex-1">
                Home
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  const question = questions[currentQuestion];
  if (!question) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white p-4">
        <Loader2 className="w-12 h-12 animate-spin text-primary mb-4" />
        <p className="text-lg text-neutral-400">Loading next question...</p>
      </div>
    );
  }

  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl bg-neutral-900/95 backdrop-blur border-neutral-800 text-white">
        <CardHeader>
          <div className="flex items-center justify-between mb-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.push('/')}
              className="text-white hover:bg-neutral-700"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            
            <div className="flex items-center gap-4">
              <div className="text-sm text-primary font-semibold">{category}</div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span className={`font-mono text-lg ${timeLeft <= 10 ? 'text-red-400 animate-pulse' : ''}`}>
                  {timeLeft}s
                </span>
              </div>
            </div>
          </div>
          <Progress value={progress} className="h-2 bg-neutral-800" />
          <div className="text-sm text-neutral-400 mt-2">
            Question {currentQuestion + 1} of {questions.length}
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div>
            <div className="text-sm text-primary mb-2">{question.difficulty }</div>
            <h2 className="whitespace-pre-wrap text-lg font-semibold leading-relaxed">
              {question.question}
            </h2>
          </div>
          
          <div className="space-y-3">
            {question.options.map((option, index) => (
              <button
                key={index}
                onClick={() => !showResult && handleAnswerSelect(index)}
                disabled={showResult}
                className={`w-full p-4 text-left rounded-lg border transition-all duration-200 text-white ${
                  showResult
                    ? index === question.correct
                      ? 'bg-green-500/20 border-green-500'
                      : selectedAnswer === index
                      ? 'bg-red-500/20 border-red-500'
                      : 'bg-neutral-800 border-neutral-700 text-neutral-400'
                    : selectedAnswer === index
                    ? 'bg-primary/20 border-primary'
                    : 'bg-neutral-800 border-neutral-700 hover:bg-neutral-700 hover:border-primary/50'
                }`}
              >
                <span className="font-medium mr-3">{String.fromCharCode(65 + index)}.</span>
                {option}
              </button>
            ))}
          </div>
          
          {showResult && (
            <div className="p-4 rounded-lg bg-neutral-800 border border-neutral-700 animate-fadeIn">
              <div className="text-sm text-primary mb-2 font-semibold">Explanation:</div>
              <div className="text-neutral-300">{question.explanation}</div>
            </div>
          )}
          
          {!showResult && (
            <Button 
              onClick={handleNext}
              disabled={selectedAnswer === null}
              className="w-full bg-primary hover:bg-primary/90 disabled:opacity-50"
            >
              {currentQuestion === questions.length - 1 ? 'Finish Quiz' : 'Next Question'}
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Quiz;
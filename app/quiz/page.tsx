'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Clock, CheckCircle, XCircle } from 'lucide-react';

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
  
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [answers, setAnswers] = useState<number[]>([]);

  const questions: Question[] = [
  {
    id: 1,
    question: "What does the following function compute?\n\nint dfs(int u, int par) {\n    int sum = val[u];\n    for (int v : adj[u]) {\n        if (v == par) continue;\n        sum += dfs(v, u);\n    }\n    return sum;\n}",
    options: ["Depth of node u", "Number of children of u", "Subtree sum rooted at u", "Total number of nodes in tree"],
    correct: 2,
    explanation: "The function accumulates values of all nodes in the subtree rooted at u.",
    difficulty: "Medium"
  },
  {
    id: 2,
    question: "Fill in the blank to compute prefix sums of array A:\n\nfor (int i = 1; i < n; ++i) {\n    prefix[i] = prefix[i - 1] + ______;\n}",
    options: ["A[i]", "prefix[i]", "A[i-1]", "A[i] - A[i-1]"],
    correct: 0,
    explanation: "To compute prefix sums, we add the current element A[i] to the previous prefix sum.",
    difficulty: "Easy"
  },
  {
    id: 3,
    question: "What is the output of the following code?\n\nint fun(int n) {\n    if (n == 0) return 0;\n    return n + fun(n - 1);\n}\ncout << fun(5);",
    options: ["15", "10", "5", "Infinite recursion"],
    correct: 0,
    explanation: "This function returns the sum of numbers from 1 to n, which is 15 for n=5.",
    difficulty: "Easy"
  },
  {
    id: 4,
    question: "What condition does this binary search find?\n\nwhile (low < high) {\n    int mid = (low + high) / 2;\n    if (arr[mid] < target)\n        low = mid + 1;\n    else\n        high = mid;\n}",
    options: ["First element > target", "Last element == target", "First element ≥ target", "Middle element always"],
    correct: 2,
    explanation: "This is the standard lower_bound implementation to find the first element ≥ target.",
    difficulty: "Medium"
  },
  {
    id: 5,
    question: "Which problem is being solved by this memoization-based function?\n\nint solve(int n) {\n    if (n <= 1) return 1;\n    if (dp[n] != -1) return dp[n];\n    return dp[n] = solve(n-1) + solve(n-2);\n}",
    options: ["Factorial", "Fibonacci", "GCD", "Subset sum"],
    correct: 1,
    explanation: "This is a top-down approach to computing Fibonacci numbers with memoization.",
    difficulty: "Easy"
  },
  {
    id: 6,
    question: "Fill in the blank for a sum segment tree node update:\n\ntree[node] = ________;",
    options: ["tree[2*node] + tree[2*node+1]", "val", "mid", "tree[node] + val"],
    correct: 0,
    explanation: "After updating a child, we must recompute the sum of the current segment.",
    difficulty: "Medium"
  },
  {
    id: 7,
    question: "What kind of graph is built by the following code?\n\nfor (auto [u, v] : edges) {\n    adj[u].push_back(v);\n    adj[v].push_back(u);\n}",
    options: ["Directed", "Weighted", "Undirected", "DAG"],
    correct: 2,
    explanation: "The graph is undirected since both directions are added.",
    difficulty: "Easy"
  },
  {
    id: 8,
    question: "What does the following function compute?\n\nint depth(int u) {\n    int d = 0;\n    for (int v : tree[u]) {\n        d = max(d, depth(v));\n    }\n    return d + 1;\n}",
    options: ["Depth of u", "Height of tree rooted at u", "Number of leaf nodes", "Tree diameter"],
    correct: 1,
    explanation: "This is the recursive definition of the height of a tree.",
    difficulty: "Medium"
  },
  {
    id: 9,
    question: "What gets printed by this code?\n\npriority_queue<int> pq;\npq.push(3); pq.push(1); pq.push(5);\ncout << pq.top();",
    options: ["1", "3", "5", "Error"],
    correct: 2,
    explanation: "C++ priority_queue is a max-heap by default. Top returns the maximum value, which is 5.",
    difficulty: "Easy"
  },
  {
    id: 10,
    question: "What is the correct recurrence for counting the number of ways to climb n stairs, taking 1 or 2 steps at a time?",
    options: ["dp[n] = dp[n-1] * dp[n-2]", "dp[n] = dp[n-1] + dp[n-2]", "dp[n] = dp[n-1] - dp[n-2]", "dp[n] = dp[n-1] + 1"],
    correct: 1,
    explanation: "The number of ways to reach step n is the sum of ways to reach steps n-1 and n-2.",
    difficulty: "Easy"
  }
];

  useEffect(() => {
    if (timeLeft > 0 && !showResult && !quizCompleted) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !showResult) {
      handleNext();
    }
  }, [timeLeft, showResult, quizCompleted]);

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
  };

  const handleNext = () => {
    const newAnswers = [...answers, selectedAnswer !== null ? selectedAnswer : -1];
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
      }
    }, 2000);
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setScore(0);
    setTimeLeft(30);
    setQuizCompleted(false);
    setShowResult(false);
    setAnswers([]);
  };

  if (quizCompleted) {
    const percentage = Math.round((score / questions.length) * 100);
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl bg-card/95 backdrop-blur border-border">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold text-primary">Quiz Complete!</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center">
              <div className="text-6xl font-bold text-foreground mb-2">{score}/{questions.length}</div>
              <div className="text-xl text-primary">{percentage}% Score</div>
            </div>
            
            <div className="space-y-3">
              {questions.map((q, index) => (
                <div key={q.id} className="flex items-center gap-3 p-3 rounded-lg bg-accent">
                  {answers[index] === q.correct ? (
                    <CheckCircle className="w-5 h-5 text-green-400" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-400" />
                  )}
                  <span className="text-sm text-muted-foreground">Question {index + 1} - {q.difficulty}</span>
                </div>
              ))}
            </div>
            
            <div className="flex gap-3">
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
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl bg-card/95 backdrop-blur border-border">
        <CardHeader>
          <div className="flex items-center justify-between mb-4">
            <div className="text-sm text-primary">{category}</div>
            <div className="flex items-center gap-2 text-foreground">
              <Clock className="w-4 h-4" />
              <span className={`font-mono text-lg ${timeLeft <= 10 ? 'text-red-400' : ''}`}>
                {timeLeft}s
              </span>
            </div>
          </div>
          <Progress value={progress} className="h-2 bg-muted" />
          <div className="text-sm text-muted-foreground mt-2">
            Question {currentQuestion + 1} of {questions.length}
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div>
            <div className="text-sm text-primary mb-2">{question.difficulty}</div>
            <h2 className="whitespace-pre-wrap text-xl font-semibold text-foreground leading-relaxed">
              {question.question}
            </h2>
          </div>
          
          <div className="space-y-3">
            {question.options.map((option, index) => (
              <button
                key={index}
                onClick={() => !showResult && handleAnswerSelect(index)}
                disabled={showResult}
                className={`w-full p-4 text-left rounded-lg border transition-all duration-200 ${
                  showResult
                    ? index === question.correct
                      ? 'bg-green-500/20 border-green-500 text-green-300'
                      : selectedAnswer === index
                      ? 'bg-red-500/20 border-red-500 text-red-300'
                      : 'bg-accent border-border text-muted-foreground'
                    : selectedAnswer === index
                    ? 'bg-primary/20 border-primary text-primary'
                    : 'bg-accent border-border text-foreground hover:bg-muted hover:border-primary/50'
                }`}
              >
                <span className="font-medium mr-3">{String.fromCharCode(65 + index)}.</span>
                {option}
              </button>
            ))}
          </div>
          
          {showResult && (
            <div className="p-4 rounded-lg bg-accent border border-border">
              <div className="text-sm text-primary mb-2">Explanation:</div>
              <div className="text-muted-foreground">{question.explanation}</div>
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

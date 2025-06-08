'use client';

import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';

interface Question {
  id: number;
  question: string;
  options: string[];
  correct: number;
  explanation: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
}

interface QuizCache {
  [category: string]: Question[];
}

interface QuizCacheContextType {
  cachedQuestions: QuizCache;
  fetchAndCacheQuestions: (category: string, forceFetch?: boolean) => Promise<Question[]>; 
}

const QuizCacheContext = createContext<QuizCacheContextType | undefined>(undefined);

export const QuizCacheProvider = ({ children }: { children: ReactNode }) => {
  const [cachedQuestions, setCachedQuestions] = useState<QuizCache>({});

  const fetchAndCacheQuestions = useCallback(async (category: string, forceFetch = false): Promise<Question[]> => {
    if (!forceFetch && cachedQuestions[category]) {
      console.log(`Using cached questions for ${category}`);
      return cachedQuestions[category];
    }

    try {
      console.log(`Fetching new questions for ${category}`);
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
        setCachedQuestions(prev => ({ ...prev, [category]: data }));
        return data;
      } else {
        throw new Error('No questions found for this category.');
      }
    } catch (error) {
      console.error(`Error fetching or caching questions for ${category}:`, error);
      throw error;
    }
  }, [cachedQuestions]);

  return (
    <QuizCacheContext.Provider value={{ cachedQuestions, fetchAndCacheQuestions }}>
      {children}
    </QuizCacheContext.Provider>
  );
};

export const useQuizCache = () => {
  const context = useContext(QuizCacheContext);
  if (context === undefined) {
    throw new Error('useQuizCache must be used within a QuizCacheProvider');
  }
  return context;
};
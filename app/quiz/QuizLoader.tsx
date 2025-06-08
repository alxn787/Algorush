'use client';

import dynamic from 'next/dynamic';
import { Loader2 } from 'lucide-react';

const QuizClientComponent = dynamic(() => import('./QuizClientComponent'), {
  ssr: false, 
  loading: () => (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white p-4">
      <Loader2 className="w-12 h-12 animate-spin text-primary mb-4" />
      <p className="text-lg text-neutral-400">Fetching quiz questions...</p>
    </div>
  ),
});

const QuizLoader = () => {
  return <QuizClientComponent />;
};

export default QuizLoader;
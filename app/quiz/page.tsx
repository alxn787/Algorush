import { Suspense } from 'react';
import { Loader2 } from 'lucide-react';
import QuizLoader from './QuizLoader'; // This imports the dynamic wrapper

export default function QuizPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white p-4">
        <Loader2 className="w-12 h-12 animate-spin text-primary mb-4" />
        <p className="text-lg text-neutral-400">Loading quiz content...</p>
      </div>
    }>
      <QuizLoader />
    </Suspense>
  );
}
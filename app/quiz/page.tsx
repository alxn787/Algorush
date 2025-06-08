
import { Suspense } from 'react';
import { Loader2 } from 'lucide-react';
import QuizLoader from './QuizLoader'; // Import the new client loader component

export default function QuizPage() {
  return (
    // Wrap the client component in a Suspense boundary as useSearchParams requires it
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

import dynamic from 'next/dynamic';
import { Suspense } from 'react';
import { Loader2 } from 'lucide-react';

const DynamicQuizClientComponent = dynamic(() => import('./QuizClientComponent'), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white p-4">
      <Loader2 className="w-12 h-12 animate-spin text-primary mb-4" />
      <p className="text-lg text-neutral-400">Loading quiz...</p>
    </div>
  ),
});

export default function QuizPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white p-4">
        <Loader2 className="w-12 h-12 animate-spin text-primary mb-4" />
        <p className="text-lg text-neutral-400">Preparing quiz...</p>
      </div>
    }>
      <DynamicQuizClientComponent />
    </Suspense>
  );
}
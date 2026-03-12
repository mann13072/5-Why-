import React from 'react';
import { useAppStore } from './store/useAppStore';
import { ProblemInput } from './components/ProblemInput';
import { QuestionCard } from './components/QuestionCard';
import { AnalysisPanel } from './components/AnalysisPanel';
import { ConversationTimeline } from './components/ConversationTimeline';
import { BrainCircuit } from 'lucide-react';

export default function App() {
  const { appState } = useAppStore();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-indigo-100 selection:text-indigo-900">
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-indigo-600 text-white shadow-sm">
              <BrainCircuit className="w-6 h-6" />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900">
              5 Whys <span className="text-indigo-600 font-medium">Root Cause Analysis</span>
            </h1>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex gap-12">
        {appState !== 'PROBLEM_INPUT' && appState !== 'ANALYSIS_RESULTS' && (
          <ConversationTimeline />
        )}
        
        <div className="flex-1 w-full max-w-4xl mx-auto">
          {appState === 'PROBLEM_INPUT' && <ProblemInput />}
          {appState === 'QUESTIONING' && <QuestionCard />}
          {appState === 'ANALYSIS_RESULTS' && <AnalysisPanel />}
        </div>
      </main>
    </div>
  );
}

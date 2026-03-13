"use client";

import React from 'react';
import { useAppStore } from '../store/useAppStore';
import { ProblemInput } from '../components/ProblemInput';
import { QuestionCard } from '../components/QuestionCard';
import { AnalysisPanel } from '../components/AnalysisPanel';
import { ConversationTimeline } from '../components/ConversationTimeline';
import { BrainCircuit, Sun, Moon } from 'lucide-react';

export default function Page() {
  const { appState, theme, toggleTheme } = useAppStore();

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-black/80 backdrop-blur-md border-b border-slate-200 dark:border-white/5 no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-8 h-8 md:w-10 md:h-10 rounded-xl bg-indigo-600 text-white shadow-sm">
              <BrainCircuit className="w-5 h-5 md:w-6 md:h-6" />
            </div>
            <h1 className="text-lg md:text-xl font-bold tracking-tight text-slate-900 dark:text-white">
              5 Whys <span className="hidden sm:inline text-indigo-600 font-medium">Root Cause Analysis</span>
            </h1>
          </div>

          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all border border-transparent hover:border-indigo-100 dark:hover:border-indigo-900/50"
            aria-label="Toggle theme"
          >
            {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-12 flex flex-col lg:flex-row gap-8 lg:gap-12">
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

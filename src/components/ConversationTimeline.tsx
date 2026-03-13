"use client";

import React from 'react';
import { useAppStore } from '../store/useAppStore';
import { motion } from 'motion/react';
import { CheckCircle2 } from 'lucide-react';

export function ConversationTimeline() {
  const { conversation, appState } = useAppStore();
  const { steps } = conversation;

  if (appState === 'PROBLEM_INPUT') return null;

  return (
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="w-full lg:w-48 shrink-0"
    >
      <h3 className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mb-8 hidden lg:block">
        Progress
      </h3>
      
      <div className="flex lg:flex-col gap-4 lg:gap-8 relative lg:before:absolute lg:before:inset-0 lg:before:ml-[11px] lg:before:h-full lg:before:w-px lg:before:bg-slate-100 dark:before:bg-white/5 overflow-x-auto lg:overflow-x-visible pb-4 lg:pb-0 no-scrollbar">
        {[1, 2, 3, 4, 5].map((level) => {
          const step = steps.find(s => s.level === level);
          const isCurrent = steps.length + 1 === level && appState === 'QUESTIONING';
          const isCompleted = !!step;

          return (
            <div key={level} className="relative flex lg:items-center gap-3 lg:gap-4 flex-shrink-0 group">
              <div className={`flex items-center justify-center w-6 h-6 rounded-full border bg-white dark:bg-[#0a0a0a] z-10 shrink-0 transition-all duration-500 ${
                isCompleted ? 'border-indigo-500 text-indigo-500 bg-indigo-50/50 dark:bg-indigo-900/20' : 
                isCurrent ? 'border-indigo-400 text-indigo-400 ring-4 ring-indigo-50/50 dark:ring-indigo-900/10' : 
                'border-slate-200 dark:border-white/10 text-slate-300 dark:text-slate-700'
              }`}>
                {isCompleted ? (
                  <CheckCircle2 className="w-3.5 h-3.5" />
                ) : (
                  <span className="text-[10px] font-bold">{level}</span>
                )}
              </div>
              <div className="flex-1 min-w-0 hidden sm:block lg:block">
                <div className={`text-[10px] font-bold uppercase tracking-widest transition-colors duration-300 ${isCurrent ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400 dark:text-slate-600'}`}>
                  Why {level}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}

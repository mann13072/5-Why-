import React from 'react';
import { useAppStore } from '../store/useAppStore';
import { motion } from 'motion/react';
import { CheckCircle2, Circle } from 'lucide-react';

export function ConversationTimeline() {
  const { conversation, appState } = useAppStore();
  const { steps } = conversation;

  if (appState === 'PROBLEM_INPUT') return null;

  return (
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="hidden lg:block w-64 shrink-0 pr-8 border-r border-slate-200"
    >
      <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-6">
        Investigation Progress
      </h3>
      
      <div className="space-y-6 relative before:absolute before:inset-0 before:ml-[11px] before:h-full before:w-0.5 before:bg-slate-200">
        {[1, 2, 3, 4, 5].map((level) => {
          const step = steps.find(s => s.level === level);
          const isCurrent = steps.length + 1 === level && appState === 'QUESTIONING';
          const isCompleted = !!step;

          return (
            <div key={level} className="relative flex items-start gap-4">
              <div className={`flex items-center justify-center w-6 h-6 rounded-full border-2 bg-white z-10 shrink-0 mt-0.5 ${
                isCompleted ? 'border-indigo-600 text-indigo-600' : 
                isCurrent ? 'border-indigo-400 text-indigo-400' : 
                'border-slate-300 text-slate-300'
              }`}>
                {isCompleted ? (
                  <CheckCircle2 className="w-4 h-4" />
                ) : (
                  <Circle className="w-2 h-2 fill-current" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className={`text-sm font-bold ${isCurrent ? 'text-indigo-600' : 'text-slate-900'}`}>
                  Why {level}
                </div>
                {step && (
                  <div className="text-slate-500 text-sm line-clamp-2 mt-1 bg-slate-50 p-2 rounded-lg border border-slate-100">
                    {step.answer}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}

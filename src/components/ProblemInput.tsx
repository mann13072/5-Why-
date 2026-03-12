import React, { useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import { generateNextQuestion } from '../services/aiService';
import { ArrowRight, AlertCircle } from 'lucide-react';
import { motion } from 'motion/react';

export function ProblemInput() {
  const [input, setInput] = useState('');
  const { 
    setProblemStatement, 
    setAppState, 
    setCurrentQuestion, 
    setIsGenerating, 
    setError,
    error,
    isGenerating,
    conversation
  } = useAppStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isGenerating) return;

    setIsGenerating(true);
    setError(null);
    setProblemStatement(input);

    try {
      const tempConversation = { ...conversation, problemStatement: input };
      const firstQuestion = await generateNextQuestion(tempConversation);
      setCurrentQuestion(firstQuestion);
      setAppState('QUESTIONING');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-2xl mx-auto p-6 bg-white rounded-2xl shadow-sm border border-slate-200"
    >
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-slate-900 mb-2">What is the problem?</h2>
        <p className="text-slate-500">Describe the issue you're facing in clear, specific terms.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="e.g., Our customer support response times are very slow."
            className="w-full min-h-[120px] p-4 text-slate-900 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all resize-none"
            disabled={isGenerating}
          />
        </div>

        {error && (
          <div className="flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-lg">
            <AlertCircle className="w-5 h-5" />
            <span className="text-sm">{error}</span>
          </div>
        )}

        <button
          type="submit"
          disabled={!input.trim() || isGenerating}
          className="w-full flex items-center justify-center gap-2 py-3 px-6 bg-slate-900 hover:bg-slate-800 text-white font-medium rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isGenerating ? (
            <span className="flex items-center gap-2">
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Analyzing Problem...
            </span>
          ) : (
            <>
              Start 5 Whys Analysis
              <ArrowRight className="w-5 h-5" />
            </>
          )}
        </button>
      </form>
    </motion.div>
  );
}

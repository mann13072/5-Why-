import React, { useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import { generateNextQuestion, analyzeRootCause } from '../services/aiService';
import { ArrowRight, AlertCircle, CheckCircle2, ArrowLeft } from 'lucide-react';
import { motion } from 'motion/react';

export function QuestionCard() {
  const [answer, setAnswer] = useState('');
  const { 
    conversation, 
    currentQuestion, 
    addStep, 
    setCurrentQuestion, 
    setAnalysis,
    setAppState,
    setIsGenerating,
    setError,
    error,
    isGenerating,
    goBack
  } = useAppStore();

  const currentLevel = conversation.steps.length + 1;
  const isLastQuestion = currentLevel >= 5;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!answer.trim() || isGenerating) return;

    setIsGenerating(true);
    setError(null);

    const newStep = {
      level: currentLevel,
      question: currentQuestion,
      answer: answer.trim()
    };

    addStep(newStep);
    setAnswer('');

    const updatedConversation = {
      ...conversation,
      steps: [...conversation.steps, newStep]
    };

    try {
      if (isLastQuestion) {
        // We reached 5 whys, generate analysis
        const analysis = await analyzeRootCause(updatedConversation);
        setAnalysis(analysis);
        setAppState('ANALYSIS_RESULTS');
      } else {
        // Generate next question
        const nextQuestion = await generateNextQuestion(updatedConversation);
        setCurrentQuestion(nextQuestion);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleEarlyAnalysis = async () => {
    if (isGenerating) return;
    
    setIsGenerating(true);
    setError(null);

    try {
      const analysis = await analyzeRootCause(conversation);
      setAnalysis(analysis);
      setAppState('ANALYSIS_RESULTS');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setIsGenerating(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full max-w-2xl mx-auto p-6 bg-white rounded-2xl shadow-sm border border-slate-200"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={goBack}
            disabled={isGenerating}
            className="p-2 -ml-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors disabled:opacity-50"
            title="Go back to previous step"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 font-semibold text-sm">
              {currentLevel}
            </span>
            <span className="text-sm font-medium text-slate-500">of 5 Whys</span>
          </div>
        </div>
        
        {currentLevel > 2 && (
          <button
            type="button"
            onClick={handleEarlyAnalysis}
            disabled={isGenerating}
            className="text-sm text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-1 disabled:opacity-50"
          >
            <CheckCircle2 className="w-4 h-4" />
            Analyze Now
          </button>
        )}
      </div>

      <div className="mb-8">
        <h3 className="text-xl font-medium text-slate-900 leading-relaxed">
          {currentQuestion}
        </h3>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <textarea
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Type your answer here..."
            className="w-full min-h-[120px] p-4 text-slate-900 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all resize-none"
            disabled={isGenerating}
            autoFocus
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
          disabled={!answer.trim() || isGenerating}
          className="w-full flex items-center justify-center gap-2 py-3 px-6 bg-slate-900 hover:bg-slate-800 text-white font-medium rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isGenerating ? (
            <span className="flex items-center gap-2">
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              {isLastQuestion ? 'Generating Analysis...' : 'Thinking...'}
            </span>
          ) : (
            <>
              {isLastQuestion ? 'Complete & Analyze' : 'Next Question'}
              <ArrowRight className="w-5 h-5" />
            </>
          )}
        </button>
      </form>
    </motion.div>
  );
}

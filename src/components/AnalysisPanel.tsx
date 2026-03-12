import React from 'react';
import { useAppStore } from '../store/useAppStore';
import { motion } from 'motion/react';
import { CheckCircle2, AlertTriangle, Lightbulb, FileText, RefreshCw } from 'lucide-react';
import { ExportPDFButton } from './ExportPDFButton';

export function AnalysisPanel() {
  const { conversation, reset } = useAppStore();
  const { analysis, problemStatement, steps } = conversation;

  if (!analysis) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-4xl mx-auto space-y-8"
      id="analysis-report"
    >
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-slate-900">Root Cause Analysis Report</h2>
          <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 rounded-full font-medium">
            <CheckCircle2 className="w-5 h-5" />
            Confidence: {analysis.confidence}%
          </div>
        </div>

        <div className="space-y-8">
          <section>
            <h3 className="text-lg font-semibold text-slate-900 mb-3 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-500" />
              Identified Root Cause
            </h3>
            <div className="p-6 bg-slate-50 rounded-xl border border-slate-100">
              <p className="text-xl text-slate-800 font-medium leading-relaxed">
                {analysis.rootCause}
              </p>
            </div>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-slate-900 mb-3 flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-500" />
              Detailed Explanation
            </h3>
            <p className="text-slate-600 leading-relaxed">
              {analysis.explanation}
            </p>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-slate-900 mb-3 flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-amber-400" />
              Recommended Actions
            </h3>
            <ul className="space-y-3">
              {analysis.recommendations.map((rec, index) => (
                <li key={index} className="flex items-start gap-3 p-4 bg-indigo-50/50 rounded-xl border border-indigo-100/50">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 font-semibold text-xs shrink-0 mt-0.5">
                    {index + 1}
                  </span>
                  <span className="text-slate-700 leading-relaxed">{rec}</span>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>

      <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
        <h3 className="text-xl font-bold text-slate-900 mb-6">Investigation Timeline</h3>
        
        <div className="space-y-6">
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 block">Initial Problem</span>
            <p className="text-slate-900 font-medium">{problemStatement}</p>
          </div>

          <div className="space-y-4 pl-4 border-l-2 border-indigo-100">
            {steps.map((step, index) => (
              <div key={index} className="relative pl-6">
                <div className="absolute -left-[25px] top-2 w-4 h-4 rounded-full bg-white border-2 border-indigo-500" />
                <div className="space-y-2">
                  <p className="text-sm font-medium text-indigo-600">Why {step.level}: {step.question}</p>
                  <p className="text-slate-700 bg-slate-50 p-3 rounded-lg border border-slate-100">{step.answer}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-end gap-4 pt-4">
        <button
          onClick={reset}
          className="flex items-center gap-2 px-6 py-3 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl font-medium transition-colors"
        >
          <RefreshCw className="w-5 h-5" />
          Start New Analysis
        </button>
        <ExportPDFButton />
      </div>
    </motion.div>
  );
}

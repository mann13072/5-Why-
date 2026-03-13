"use client";

import { create } from 'zustand';
import { AppState, Conversation, Step, Analysis } from '../types';

interface StoreState {
  appState: AppState;
  conversation: Conversation;
  currentQuestion: string;
  isGenerating: boolean;
  error: string | null;
  theme: 'light' | 'dark';
  
  setAppState: (state: AppState) => void;
  setProblemStatement: (problem: string) => void;
  addStep: (step: Step) => void;
  setCurrentQuestion: (question: string) => void;
  setAnalysis: (analysis: Analysis) => void;
  setIsGenerating: (isGenerating: boolean) => void;
  setError: (error: string | null) => void;
  toggleTheme: () => void;
  goBack: () => void;
  reset: () => void;
}

const initialState = {
  appState: 'PROBLEM_INPUT' as AppState,
  conversation: {
    problemStatement: '',
    steps: [],
    analysis: null,
  },
  currentQuestion: '',
  isGenerating: false,
  error: null,
  theme: 'light' as 'light' | 'dark',
};

export const useAppStore = create<StoreState>((set) => ({
  ...initialState,
  setAppState: (appState) => set({ appState }),
  setProblemStatement: (problemStatement) => 
    set((state) => ({ 
      conversation: { ...state.conversation, problemStatement } 
    })),
  addStep: (step) => 
    set((state) => ({ 
      conversation: { 
        ...state.conversation, 
        steps: [...state.conversation.steps, step] 
      } 
    })),
  setCurrentQuestion: (currentQuestion) => set({ currentQuestion }),
  setAnalysis: (analysis) => 
    set((state) => ({ 
      conversation: { ...state.conversation, analysis } 
    })),
  setIsGenerating: (isGenerating) => set({ isGenerating }),
  setError: (error) => set({ error }),
  toggleTheme: () => set((state) => ({ theme: state.theme === 'light' ? 'dark' : 'light' })),
  goBack: () => set((state) => {
    if (state.appState === 'QUESTIONING') {
      if (state.conversation.steps.length === 0) {
        return { appState: 'PROBLEM_INPUT', currentQuestion: '' };
      }
      const newSteps = [...state.conversation.steps];
      const lastStep = newSteps.pop();
      return {
        conversation: { ...state.conversation, steps: newSteps },
        currentQuestion: lastStep?.question || '',
      };
    }
    return state;
  }),
  reset: () => set(initialState),
}));

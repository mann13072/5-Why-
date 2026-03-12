export interface Step {
  level: number;
  question: string;
  answer: string;
}

export interface Analysis {
  rootCause: string;
  explanation: string;
  recommendations: string[];
  confidence: number;
}

export interface Conversation {
  problemStatement: string;
  steps: Step[];
  analysis: Analysis | null;
}

export type AppState = 'PROBLEM_INPUT' | 'QUESTIONING' | 'ANALYSIS_RESULTS';

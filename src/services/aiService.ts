"use client";

import { GoogleGenAI } from '@google/genai';
import { Conversation } from '../types';

function getAIClient() {
  const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("NEXT_PUBLIC_GEMINI_API_KEY is not set.");
  }
  return new GoogleGenAI({ apiKey });
}

async function callAIWithRetry<T>(fn: () => Promise<T>, retries = 3, delay = 1000): Promise<T> {
  try {
    return await fn();
  } catch (error: any) {
    if (error?.status === 429 && retries > 0) {
      console.warn(`Rate limit hit, retrying in ${delay}ms...`);
      await new Promise(resolve => setTimeout(resolve, delay));
      return callAIWithRetry(fn, retries - 1, delay * 2);
    }
    throw error;
  }
}

export async function generateNextQuestion(conversation: Conversation): Promise<string> {
  try {
    const ai = getAIClient();
    const model = 'gemini-flash-latest';
    
    const prompt = `5 Whys expert. Next diagnostic question?
Problem: ${conversation.problemStatement}
History: ${conversation.steps.map((s: any) => s.answer).join('; ')}
Next Q (only):`;

    const response = await callAIWithRetry(() => ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        temperature: 0.7,
      }
    }));

    return response.text?.trim() || "Why did this happen?";
  } catch (error) {
    console.error("Error generating question:", error);
    throw new Error("Failed to generate the next question. Please try again.");
  }
}

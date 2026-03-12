import { GoogleGenAI, Type } from '@google/genai';
import { Conversation, Analysis } from '../types';

// Initialize the Gemini API client
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function generateNextQuestion(conversation: Conversation): Promise<string> {
  const model = 'gemini-3.1-pro-preview';
  
  const prompt = `You are a root cause analysis expert using the 5 Whys method.
Given the following problem and conversation history, generate the next diagnostic question that investigates deeper causes.

Problem:
${conversation.problemStatement}

Conversation so far:
${conversation.steps.map(s => `Q: ${s.question}\nA: ${s.answer}`).join('\n\n')}

Generate the next question that reveals underlying causes. Avoid repeating previous questions.
Focus on operational insight and identify causal direction.
Return ONLY the question text, without any introductory or concluding remarks.`;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        temperature: 0.7,
      }
    });

    return response.text?.trim() || "Why did this happen?";
  } catch (error) {
    console.error("Error generating question:", error);
    throw new Error("Failed to generate the next question. Please try again.");
  }
}

export async function analyzeRootCause(conversation: Conversation): Promise<Analysis> {
  const model = 'gemini-3.1-pro-preview';

  const prompt = `You are an expert in operational diagnostics and root cause analysis.
Using the 5 Whys framework, analyze the following investigation and identify the most likely root cause.

Problem:
${conversation.problemStatement}

Conversation:
${conversation.steps.map(s => `Q: ${s.question}\nA: ${s.answer}`).join('\n\n')}

Provide a detailed analysis in JSON format with the following structure:
{
  "rootCause": "A concise statement of the identified root cause",
  "explanation": "Detailed reasoning and evidence from the answers",
  "recommendations": ["Actionable recommendation 1", "Actionable recommendation 2", ...],
  "confidence": 85 // A number between 0 and 100 representing confidence score
}`;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            rootCause: { type: Type.STRING, description: "A concise statement of the identified root cause" },
            explanation: { type: Type.STRING, description: "Detailed reasoning and evidence from the answers" },
            recommendations: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING },
              description: "Actionable recommendations" 
            },
            confidence: { type: Type.NUMBER, description: "Confidence score between 0 and 100" }
          },
          required: ["rootCause", "explanation", "recommendations", "confidence"]
        },
        temperature: 0.2,
      }
    });

    const jsonStr = response.text?.trim() || "{}";
    return JSON.parse(jsonStr) as Analysis;
  } catch (error) {
    console.error("Error analyzing root cause:", error);
    throw new Error("Failed to analyze the root cause. Please try again.");
  }
}

import { NextResponse } from 'next/server';
import { GoogleGenAI, Type } from '@google/genai';
import { Conversation } from '../../../types';

export async function POST(req: Request) {
  try {
    const { conversation } = await req.json();
    const apiKey = process.env.GEMINI_API_KEY;

    console.log('API Key loaded:', !!apiKey);

    if (!apiKey) {
      return NextResponse.json({ error: 'GEMINI_API_KEY is not set' }, { status: 500 });
    }

    const ai = new GoogleGenAI({ apiKey });
    const model = 'gemini-flash-latest';

    // Optimized prompt for minimal token usage
    const prompt = `Analyze 5 Whys investigation. Root cause?
Problem: ${conversation.problemStatement}
Answers: ${conversation.steps.map((s: any) => s.answer).join('; ')}
JSON: {"rootCause": "string", "explanation": "string", "recommendations": ["string"], "confidence": number}`;

    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            rootCause: { type: Type.STRING },
            explanation: { type: Type.STRING },
            recommendations: { type: Type.ARRAY, items: { type: Type.STRING } },
            confidence: { type: Type.NUMBER }
          },
          required: ["rootCause", "explanation", "recommendations", "confidence"]
        },
        temperature: 0.2,
      }
    });

    const jsonStr = response.text?.trim() || "{}";
    return NextResponse.json(JSON.parse(jsonStr));
  } catch (error) {
    console.error("Error analyzing root cause:", error);
    return NextResponse.json({ error: 'Failed to analyze the root cause' }, { status: 500 });
  }
}

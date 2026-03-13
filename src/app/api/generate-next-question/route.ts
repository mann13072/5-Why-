import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

export async function POST(req: Request) {
  try {
    const { conversation } = await req.json();
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ error: 'GEMINI_API_KEY is not set' }, { status: 500 });
    }

    const ai = new GoogleGenAI({ apiKey });
    const model = 'gemini-flash-latest';
    
    const prompt = `5 Whys expert. Next diagnostic question?
Problem: ${conversation.problemStatement}
History: ${conversation.steps.map((s: any) => s.answer).join('; ')}
Next Q (only):`;

    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        temperature: 0.7,
      }
    });

    return NextResponse.json({ question: response.text?.trim() || "Why did this happen?" });
  } catch (error) {
    console.error("Error generating question:", error);
    return NextResponse.json({ error: 'Failed to generate the next question' }, { status: 500 });
  }
}

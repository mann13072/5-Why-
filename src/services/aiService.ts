import { Conversation } from '../types';

export async function generateNextQuestion(conversation: Conversation): Promise<string> {
  try {
    const response = await fetch('/api/generate-next-question', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ conversation }),
    });

    if (!response.ok) {
      throw new Error('Failed to generate the next question');
    }

    const data = await response.json();
    return data.question;
  } catch (error) {
    console.error("Error generating question:", error);
    throw new Error("Failed to generate the next question. Please try again.");
  }
}

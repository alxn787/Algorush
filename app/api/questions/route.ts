import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { category } = body;

    if (!category) {
      return NextResponse.json({ error: 'Category is required' }, { status: 400 });
    }

    const systemPrompt = `You are a helpful assistant designed to create quiz questions for a Data Structures and Algorithms (DSA) practice app.
Your task is to generate 10 multiple-choice questions on a given topic.
The response must be a single valid JSON object containing a key "questions" which holds an array of 10 question objects.
Do not include any text or markdown formatting outside of the JSON object.

Each question object in the array must strictly adhere to the following structure:
- "id": A unique number for the question (e.g., 1, 2, ... 10).
- "question": The question text, which must contain an incomplete C++ code snippet. Use newline characters (\\n) for line breaks within the string. Focus on code-heavy problems (finding bugs, optimizing, etc.) rather than theoretical questions. The questions should feel like competitive programming puzzles and get progressively harder.
- "options": An array of 4 string options, where the correct option completes the code snippet.
- "correct": The zero-indexed integer representing the correct option (0, 1, 2, or 3).
- "explanation": A concise explanation for why the correct answer is right.
- "difficulty": A string indicating the difficulty, one of "Easy", "Medium", or "Hard".`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o", 
      response_format: { type: "json_object" }, 
      messages: [
        {
          role: "system",
          content: systemPrompt,
        },
        {
          role: "user",
          content: `Please generate the 10 questions for the category: "${category}"`,
        },
      ],
      temperature: 0.5, // A lower temperature for more predictable, structured output
    });

    // 4. Extract and parse the JSON response
    const jsonString = completion.choices[0]?.message?.content;

    if (!jsonString) {
      throw new Error("OpenAI API returned an empty response.");
    }

    const result = JSON.parse(jsonString);
    const questions = result.questions; 

    if (!Array.isArray(questions) || questions.length === 0) {
        throw new Error("OpenAI API did not return a valid array of questions.");
    }
    
    console.log("Generated Questions:", questions);

    return NextResponse.json(questions);

  } catch (error) {
    console.error("Error generating questions with OpenAI:", error);

    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ error: `Failed to generate questions: ${errorMessage}` }, { status: 500 });
  }
}
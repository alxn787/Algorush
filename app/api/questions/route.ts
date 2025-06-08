import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { category } = body;

    if (!category) {
      return NextResponse.json({ error: 'Category is required' }, { status: 400 });
    }

    const fullPrompt = `You are a helpful assistant designed to create quiz questions for a Data Structures and Algorithms (DSA) practice app.
Your task is to generate 10 multiple-choice questions on the topic: "${category}".
Questions should contain incomplete code snippets, and the correct option should complete them.
Questions should get harder as we move from 1 to 10.
Focus more on code-heavy problems (finding bugs, optimizing, etc.) than theoretical questions.
make it more puzzle like competitive programmming
Give the code snippets in C++.
Always return exactly 10 questions.

The response must be a valid JSON array of objects, strictly adhering to the following structure for each question:
- "id": A unique number for the question (e.g., 1, 2, ... 10).
- "question": The question text, which can include formatted code snippets. Use newline characters (\\n) for line breaks within the string.
- "options": An array of 4 string options.
- "correct": The zero-indexed integer representing the correct option (0, 1, 2, or 3).
- "explanation": A concise explanation for why the correct answer is right.
- "difficulty": A string indicating the difficulty, one of "Easy", "Medium", or "Hard".`;

    const chatHistory = [];
    chatHistory.push({ role: "user", parts: [{ text: fullPrompt }] });

    const payload = {
      contents: chatHistory,
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: {
          type: "ARRAY",
          items: {
            type: "OBJECT",
            properties: {
              "id": { "type": "NUMBER" },
              "question": { "type": "STRING" },
              "options": {
                "type": "ARRAY",
                "items": { "type": "STRING" }
              },
              "correct": { "type": "NUMBER" },
              "explanation": { "type": "STRING" },
              "difficulty": { "type": "STRING", "enum": ["Easy", "Medium", "Hard"] }
            },
            "required": ["id", "question", "options", "correct", "explanation", "difficulty"],
            "propertyOrdering": ["id", "question", "options", "correct", "explanation", "difficulty"]
          }
        }
      }
    };
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`;

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Gemini API error:", errorData);
      throw new Error(`Failed to fetch questions from Gemini API: ${JSON.stringify(errorData)}`);
    }

    const result = await response.json();
    if (result.candidates && result.candidates.length > 0 &&
        result.candidates[0].content && result.candidates[0].content.parts &&
        result.candidates[0].content.parts.length > 0) {
      const questionsJsonString = result.candidates[0].content.parts[0].text;
      const questions = JSON.parse(questionsJsonString);
      console.log("Generated Questions:", questions);

      if (!Array.isArray(questions)) {
        throw new Error("Gemini API did not return an array of questions.");
      }

      return NextResponse.json(questions);
    } else {
      throw new Error("Failed to get a valid response from Gemini API.");
    }

  } catch (error) {
    console.error("Error generating questions:", error);

    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: `Failed to generate questions: ${errorMessage}` }, { status: 500 });
  }
}
"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";
import { ChallengeSchema } from "@/lib/schemas/challenge-schema";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash", 
  generationConfig: {
    responseMimeType: "application/json",
  }
});

const SYSTEM_PROMPT = `
You are a Senior Software Architect creating debugging challenges for junior developers.

Your goal is to generate a JSON object representing a coding challenge.
The challenge must contain a subtle but critical bug (logical, performance, or visual).
The code MUST compile and run, but produce incorrect results or behavior.

Constraints:
- Use Vite as the base environment.
- logic should be compatible with React 18+.
- Do NOT use create-react-app.
- Use ONLY: react, react-dom, lucide-react, tailwindcss (standard classes).
- Keep it simple but educational.

Output Format: JSON only, matching this structure:
{
  "meta": {
    "title": "Challenge Title",
    "description": "Brief description of the task (not the bug)",
    "difficulty": "Easy" | "Medium" | "Hard",
    "techStack": ["React", "Tailwind"]
  },
  "filesystem": {
    "/src/App.tsx": { "content": "..." },
    "/src/components/BuggyComponent.tsx": { "content": "..." }
  },
  "validation": {
    "testFile": "Content of a .test.tsx file using Vitest syntax that FAILS initially and PASSES when fixed."
  },
  "tutorContext": {
    "hint": "A helpful hint for the user without giving away the solution.",
    "solutionExplanation": "Technical explanation of the bug and usage of best practices."
  }
}
`;

export async function generateChallenge(topic: string) {
  if (!process.env.GEMINI_API_KEY) {
    return { success: false, error: "Missing GEMINI_API_KEY" };
  }

  try {
    const prompt = `Topic: "${topic}". Generate a debugging challenge JSON.`;
    
    const result = await model.generateContent([SYSTEM_PROMPT, prompt]);
    const response = await result.response;
    const text = response.text();
    
    // Clean up markdown code blocks if present (though responseMimeType should handle it)
    const jsonStr = text.replace(/```json\n?|\n?```/g, "").trim();
    
    const data = JSON.parse(jsonStr);
    const challenge = ChallengeSchema.parse(data);
    
    return { success: true, data: challenge };
  } catch (error: any) {
    console.error("AI Generation Failed:", error);
    return { success: false, error: error.message || "Failed to generate challenge" };
  }
}

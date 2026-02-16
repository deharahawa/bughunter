import { z } from 'zod';

export const ChallengeSchema = z.object({
  meta: z.object({
    title: z.string(),
    description: z.string(),
    difficulty: z.enum(['Easy', 'Medium', 'Hard']),
    techStack: z.array(z.string()), // ex: ['React', 'Tailwind']
  }),
  filesystem: z.record(z.string(), z.object({ // Key is the path (ex: "/src/App.tsx")
    content: z.string(), // Source code
    // language is optional as we infer it from extension
  })),
  validation: z.object({
    testFile: z.string(), // Content of the .test.tsx file
  }),
  tutorContext: z.object({
    hint: z.string(), // Hint for the user
    solutionExplanation: z.string(), // Technical explanation for the Tutor AI
  })
});

export type Challenge = z.infer<typeof ChallengeSchema>;

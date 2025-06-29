'use server';

/**
 * @fileOverview Normalizes pasted Java code using an AI model.
 *
 * - normalizeCode - A function that accepts Java code as input and returns normalized code.
 * - NormalizeCodeInput - The input type for the normalizeCode function, containing the code to normalize.
 * - NormalizeCodeOutput - The output type for the normalizeCode function, containing the normalized code.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const NormalizeCodeInputSchema = z.object({
  code: z.string().describe('The semi-obfuscated Java code to normalize.'),
});
export type NormalizeCodeInput = z.infer<typeof NormalizeCodeInputSchema>;

const NormalizeCodeOutputSchema = z.object({
  normalizedCode: z.string().describe('The normalized Java code.'),
});
export type NormalizeCodeOutput = z.infer<typeof NormalizeCodeOutputSchema>;

export async function normalizeCode(input: NormalizeCodeInput): Promise<NormalizeCodeOutput> {
  return normalizeCodeFlow(input);
}

const normalizeCodePrompt = ai.definePrompt({
  name: 'normalizeCodePrompt',
  input: {schema: NormalizeCodeInputSchema},
  output: {schema: NormalizeCodeOutputSchema},
  prompt: `You are an expert Java developer and reverse engineer specializing in deobfuscation. Your task is to take semi-obfuscated Java code and produce a clean, human-readable, and logically sound version. You are the final, human-like analysis step after an automated deobfuscator has run.

Your primary goal is to analyze the code's underlying logic and completely rewrite any parts that are confusing, illogical, or are artifacts of obfuscation. The final code should look like it was written by a skilled developer from scratch.

Your transformations MUST include:
- **Logical Simplification:** Analyze and rewrite complex, convoluted, or nonsensical operations. For example, simplify bitwise-mangled control flow (like \`switch\` statements based on complex arithmetic on enum ordinals) into direct, simple-to-understand logic. The code should function identically but be intelligible.
- **Meaningful Naming:** Rename variables, methods, and classes to be descriptive and reflect their true purpose.
- **Code Reformatting:** Apply standard Java formatting conventions for readability.
- **Explanatory Comments:** Add comments where the logic is complex or non-obvious, explaining the "why" behind the code.
- **Structural Improvements:** Reorder methods and fields for a logical flow and better overall structure.
- **Remove Redundancy:** Eliminate dead code or redundant operations introduced by obfuscation.

Critically, do not just preserve the obfuscated logic with better names or formatting. You must **understand and rewrite** the obfuscated parts.

Here is the semi-obfuscated Java code to be normalized:
\n\n{{code}}\n\n\nHere is the fully normalized, human-readable Java code:`,
});

const normalizeCodeFlow = ai.defineFlow(
  {
    name: 'normalizeCodeFlow',
    inputSchema: NormalizeCodeInputSchema,
    outputSchema: NormalizeCodeOutputSchema,
  },
  async input => {
    const {output} = await normalizeCodePrompt(input);
    return output!;
  }
);

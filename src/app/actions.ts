'use server';

import { normalizeCode } from '@/ai/flows/normalize-code';
import type { NormalizeCodeOutput } from '@/ai/flows/normalize-code';

export async function getNormalizedCode(code: string): Promise<{ data?: NormalizeCodeOutput; error?: string }> {
  if (!code || !code.trim()) {
    return { error: 'Please enter some code to normalize.' };
  }

  try {
    const result = await normalizeCode({ code });
    return { data: result };
  } catch (e) {
    console.error('Error normalizing code:', e);
    return { error: 'An unexpected error occurred while communicating with the AI. Please try again later.' };
  }
}

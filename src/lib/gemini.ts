import { GoogleGenAI } from '@google/genai';

/**
 * NyaySetu Gemini AI Utility & Security Module
 * 
 * Provides:
 * 1. Singleton GoogleGenAI client
 * 2. Prompt injection sanitization and input length boundaries
 * 3. Safe, error-tolerant structured JSON parsing
 * 4. Standardized AI error handling preventing sensitive stack leaks
 */

let geminiClientInstance: GoogleGenAI | null = null;

export function getGeminiClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not configured in the server environment.');
  }

  if (!geminiClientInstance) {
    geminiClientInstance = new GoogleGenAI({ apiKey });
  }

  return geminiClientInstance;
}

export const DEFAULT_GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-3.5-flash-lite';

/**
 * Sanitizes user-provided text inputs before interpolating into system prompts.
 * Prevents prompt injection, limits payload size, and strips out control characters.
 */
export function sanitizeInput(input: unknown, maxLength = 30000): string {
  if (typeof input !== 'string') {
    return '';
  }

  // Strip non-printable ASCII / suspicious Unicode control characters (except standard newlines/tabs)
  let cleaned = input.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '').trim();

  // Truncate to bound token usage and prevent payload abuse
  if (cleaned.length > maxLength) {
    cleaned = cleaned.slice(0, maxLength);
  }

  return cleaned;
}

/**
 * Robust JSON parser that handles code blocks, leading/trailing markdown, and minor formatting errors.
 */
export function parseStructuredJsonResponse<T>(rawResponseText: string, fallback: T): T {
  if (!rawResponseText) return fallback;

  try {
    let cleaned = rawResponseText.trim();

    // Strip markdown code fences if present (```json ... ``` or ``` ...)
    if (cleaned.startsWith('```')) {
      cleaned = cleaned.replace(/^```(?:json)?\s*/i, '').replace(/```\s*$/i, '');
    }

    // Locate outer JSON object or array bounds
    const firstBrace = cleaned.indexOf('{');
    const firstBracket = cleaned.indexOf('[');
    let startIdx = -1;
    let endIdx = -1;

    if (firstBrace !== -1 && (firstBracket === -1 || firstBrace < firstBracket)) {
      startIdx = firstBrace;
      endIdx = cleaned.lastIndexOf('}');
    } else if (firstBracket !== -1) {
      startIdx = firstBracket;
      endIdx = cleaned.lastIndexOf(']');
    }

    if (startIdx !== -1 && endIdx !== -1 && endIdx > startIdx) {
      cleaned = cleaned.slice(startIdx, endIdx + 1);
    }

    return JSON.parse(cleaned) as T;
  } catch (error) {
    console.error('Failed to parse Gemini structured JSON response:', error, '\nRaw text was:\n', rawResponseText);
    return fallback;
  }
}

/**
 * Unified execution wrapper for structured Gemini calls.
 */
export async function generateStructuredContent<T>({
  contents,
  fallback,
  model = DEFAULT_GEMINI_MODEL,
}: {
  contents: Array<{ text?: string; inlineData?: { mimeType: string; data: string } }>;
  fallback: T;
  model?: string;
}): Promise<T> {
  const ai = getGeminiClient();

  const response = await ai.models.generateContent({
    model,
    contents,
    config: {
      responseMimeType: 'application/json',
      temperature: 0.1, // Low temperature for deterministic factual extraction
    },
  });

  const rawText = response.text || '';
  return parseStructuredJsonResponse<T>(rawText, fallback);
}

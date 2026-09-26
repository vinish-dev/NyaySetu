import { NextRequest, NextResponse } from 'next/server';
import { generateStructuredContent, sanitizeInput } from '@/lib/gemini';

export const maxDuration = 60;

const MAX_FILE_SIZE_BYTES = 20 * 1024 * 1024; // 20 MB max payload
const ALLOWED_MIME_TYPES = new Set([
  'application/pdf',
  'image/png',
  'image/jpeg',
  'image/webp',
  'text/plain',
]);

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const directText = formData.get('text') as string | null;

    let extractedText = '';
    let inlinePart: { inlineData: { data: string; mimeType: string } } | null = null;
    let fileName = 'Uploaded Document';

    if (file) {
      if (file.size > MAX_FILE_SIZE_BYTES) {
        return NextResponse.json(
          { error: 'File size exceeds maximum allowable limit of 20MB.' },
          { status: 413 }
        );
      }

      fileName = sanitizeInput(file.name, 100) || 'Uploaded Document';
      const fileType = file.type || '';
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      if (fileType === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')) {
        inlinePart = {
          inlineData: {
            data: buffer.toString('base64'),
            mimeType: 'application/pdf',
          },
        };
      } else if (
        fileType.startsWith('image/') ||
        /\.(png|jpe?g|webp)$/i.test(file.name)
      ) {
        const mimeType = ALLOWED_MIME_TYPES.has(fileType)
          ? fileType
          : file.name.toLowerCase().endsWith('.png')
          ? 'image/png'
          : 'image/jpeg';

        inlinePart = {
          inlineData: {
            data: buffer.toString('base64'),
            mimeType,
          },
        };
      } else {
        extractedText = sanitizeInput(buffer.toString('utf-8'), 50000);
      }
    } else if (directText) {
      extractedText = sanitizeInput(directText, 50000);
    } else {
      return NextResponse.json(
        { error: 'No document file or text provided for analysis.' },
        { status: 400 }
      );
    }

    const prompt = `
You are the legal document understanding engine of "NyaySetu", an AI legal information and case-preparation platform.
Your purpose is to help citizens understand legal documents with clarity, calm, and objective factual accuracy.

CRITICAL TONE & COMPLIANCE RULES:
1. Do NOT give conclusive legal judgments. Never use words like "Unenforceable" or declare a clause legally invalid.
2. Use objective terms like "Potential concern", "Requires professional review", "Standard", or "Moderate".
3. Emphasize that your findings are informational to prepare the citizen for a qualified advocate consultation.
4. Output MUST be strictly valid JSON matching this exact structure:

{
  "title": "Clean, descriptive document title",
  "meta": "Short metadata (e.g. Reference Framework: Indian Contract Act / Consumer Protection)",
  "simplifiedExplanation": "A 2-3 paragraph plain-language summary of what this document does, the core transaction, financial values involved, and overall balance of terms.",
  "importantClauses": [
    {
      "tag": "e.g., Clause 4 • Security Deposit",
      "risk": "Standard",
      "raw": "Exact or closely paraphrased quote from the document text",
      "meaning": "What this means in plain words for the citizen"
    }
  ],
  "obligations": [
    "Specific affirmative obligation citizen must perform (e.g. Notice period, payment timing, maintenance responsibility)"
  ],
  "potentialConcerns": [
    "Specific unilateral conditions, heavy lock-in penalties, or ambiguous terms"
  ],
  "inconsistencies": [
    {
      "title": "Brief title of conflicting terms",
      "description": "Explanation of how two clauses or conditions contradict each other"
    }
  ],
  "questionsForProfessional": [
    "Precise, highly actionable question the citizen should ask a lawyer or legal aid clinic"
  ]
}
`;

    const contents: Array<{ text?: string; inlineData?: { mimeType: string; data: string } }> = [];
    if (inlinePart) {
      contents.push(inlinePart);
    }
    if (extractedText) {
      contents.push({ text: `Document Name: ${fileName}\n\nDocument Content:\n${extractedText}` });
    }
    contents.push({ text: prompt });

    const fallbackData = {
      title: fileName,
      meta: 'Document Record',
      simplifiedExplanation: 'Document content processed for legal fact structuring.',
      importantClauses: [],
      obligations: [],
      potentialConcerns: [],
      inconsistencies: [],
      questionsForProfessional: [],
    };

    const structuredResult = await generateStructuredContent({
      contents,
      fallback: fallbackData,
    });

    return NextResponse.json({
      success: true,
      fileName,
      data: structuredResult,
    });
  } catch (error: unknown) {
    console.error('Error in analyze-document API:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred while processing the document. Please verify your file format and retry.' },
      { status: 500 }
    );
  }
}

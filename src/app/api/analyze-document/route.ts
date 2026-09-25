import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

export const maxDuration = 60;

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'GEMINI_API_KEY is not configured in the server environment.' },
        { status: 500 }
      );
    }

    const ai = new GoogleGenAI({ apiKey });
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const directText = formData.get('text') as string | null;

    let extractedText = '';
    let inlinePart: { inlineData: { data: string; mimeType: string } } | null = null;
    let fileName = 'Uploaded Document';

    if (file) {
      fileName = file.name;
      const fileType = file.type || '';
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      if (fileType === 'application/pdf' || file.name.endsWith('.pdf')) {
        // Native multimodal PDF ingest via Gemini
        inlinePart = {
          inlineData: {
            data: buffer.toString('base64'),
            mimeType: 'application/pdf',
          },
        };
      } else if (fileType.startsWith('image/') || /\.(png|jpe?g|webp)$/i.test(file.name)) {
        // Native multimodal Image ingest via Gemini
        const mimeType = fileType || (file.name.endsWith('.png') ? 'image/png' : 'image/jpeg');
        inlinePart = {
          inlineData: {
            data: buffer.toString('base64'),
            mimeType,
          },
        };
      } else {
        // Plain text (.txt, markdown, etc.)
        extractedText = buffer.toString('utf-8');
      }
    } else if (directText) {
      extractedText = directText;
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
4. Output MUST be strictly valid JSON without any markdown code fences, matching this exact structure:

{
  "title": "Clean, descriptive document title",
  "meta": "Short metadata (e.g. Reference Framework: Indian Contract Act / Consumer Protection)",
  "simplifiedExplanation": "A 2-3 paragraph plain-language summary of what this document does, the core transaction, financial values involved, and overall balance of terms.",
  "importantClauses": [
    {
      "tag": "e.g., Clause 4 • Security Deposit",
      "risk": "Standard" | "Potential concern" | "Requires professional review" | "Moderate",
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

    const contents: any[] = [];
    if (inlinePart) {
      contents.push(inlinePart);
    }
    if (extractedText) {
      contents.push({ text: `Document Name: ${fileName}\n\nDocument Content:\n${extractedText.slice(0, 50000)}` });
    }
    contents.push({ text: prompt });

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents,
      config: {
        responseMimeType: 'application/json',
      },
    });

    let rawText = response.text || '{}';
    rawText = rawText.replace(/^```json\s*/i, '').replace(/```\s*$/i, '').trim();

    const parsedJson = JSON.parse(rawText);

    return NextResponse.json({
      success: true,
      fileName,
      data: parsedJson,
    });
  } catch (error: any) {
    console.error('Error in analyze-document API:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to analyze document with Gemini.' },
      { status: 500 }
    );
  }
}

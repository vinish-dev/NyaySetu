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
    const { question, documentContext, caseContext } = await req.json();

    if (!question || typeof question !== 'string') {
      return NextResponse.json(
        { error: 'A question string is required.' },
        { status: 400 }
      );
    }

    const prompt = `
You are the grounded legal information engine of NyaySetu.
You are answering a user inquiry based STRICTLY and EXCLUSIVELY on the provided case facts and document records.

CORE PRINCIPLES:
1. Ground your answer in the specific clauses, exhibits, or facts provided in the context below.
2. If the user asks about an obligation, notice period, or warranty condition, pinpoint the exact source citation (e.g. "Source: Warranty Terms → Section 4" or "Source: Tax Invoice E01 → Return Terms").
3. DO NOT hallucinate facts not present in the records. If an answer cannot be determined from the documents, clearly state: "The provided documents do not contain information regarding [X]. Consider requesting [document Y]."
4. Never issue conclusive judicial rulings. Frame responses as structured legal information and considerations.
5. Return strictly valid JSON without markdown fences matching this schema:

{
  "directAnswer": "Clear, plain-language answer directly resolving the question based on the document facts.",
  "sources": [
    {
      "document": "Document Title or Exhibit Code",
      "clauseOrSection": "e.g. Section 4 / Clause 14 / Return Policy Paragraph 2",
      "quote": "Relevant brief snippet or excerpt from the record"
    }
  ],
  "proceduralSteps": [
    "Actionable step 1 for the citizen",
    "Actionable step 2 for the citizen"
  ],
  "consultationTip": "Specific guidance to discuss with an advocate"
}

---
CURRENT CASE & DOCUMENT CONTEXT:
${documentContext ? `DOCUMENT EXCERPTS:\n${documentContext}\n\n` : ''}
${caseContext ? `CASE RECORD DETAILS:\n${JSON.stringify(caseContext, null, 2)}\n\n` : ''}

USER QUESTION:
"${question}"
`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [{ text: prompt }],
      config: {
        responseMimeType: 'application/json',
      },
    });

    let rawText = response.text || '{}';
    rawText = rawText.replace(/^```json\s*/i, '').replace(/```\s*$/i, '').trim();
    const parsed = JSON.parse(rawText);

    return NextResponse.json({
      success: true,
      data: parsed,
    });
  } catch (error: any) {
    console.error('Error in grounded-ask API:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to process grounded legal inquiry.' },
      { status: 500 }
    );
  }
}

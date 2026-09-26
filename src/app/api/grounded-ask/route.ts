import { NextRequest, NextResponse } from 'next/server';
import { generateStructuredContent, sanitizeInput } from '@/lib/gemini';

export const maxDuration = 60;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const rawQuestion = body?.question;
    const documentContext = sanitizeInput(body?.documentContext, 40000);
    const caseContext = body?.caseContext;

    if (!rawQuestion || typeof rawQuestion !== 'string' || rawQuestion.trim().length === 0) {
      return NextResponse.json(
        { error: 'A valid question string is required.' },
        { status: 400 }
      );
    }

    const question = sanitizeInput(rawQuestion, 2000);

    const prompt = `
You are the grounded legal information engine of NyaySetu.
You are answering a user inquiry based STRICTLY and EXCLUSIVELY on the provided case facts and document records.

CORE PRINCIPLES:
1. Ground your answer in the specific clauses, exhibits, or facts provided in the context below.
2. If the user asks about an obligation, notice period, or warranty condition, pinpoint the exact source citation (e.g. "Source: Warranty Terms → Section 4" or "Source: Tax Invoice E01 → Return Terms").
3. DO NOT hallucinate facts not present in the records. If an answer cannot be determined from the documents, clearly state: "The provided documents do not contain information regarding [X]. Consider requesting [document Y]."
4. Never issue conclusive judicial rulings. Frame responses as structured legal information and considerations.
5. Return strictly valid JSON matching this schema:

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
${caseContext ? `CASE RECORD DETAILS:\n${JSON.stringify(caseContext, null, 2).slice(0, 30000)}\n\n` : ''}

USER QUESTION:
"${question}"
`;

    const fallback = {
      directAnswer: 'The provided records do not contain sufficient verified clauses to address this specific question. Please attach additional supporting records.',
      sources: [],
      proceduralSteps: [
        'Review the original purchase or agreement document for written covenants.',
        'Consult an advocate or legal aid advisor with full documentation.'
      ],
      consultationTip: 'Seek professional legal advice from an advocate or your local District Legal Services Authority.'
    };

    const structuredResult = await generateStructuredContent({
      contents: [{ text: prompt }],
      fallback,
    });

    return NextResponse.json({
      success: true,
      data: structuredResult,
    });
  } catch (error: unknown) {
    console.error('Error in grounded-ask API:', error);
    return NextResponse.json(
      { error: 'An error occurred while answering your inquiry. Please try again.' },
      { status: 500 }
    );
  }
}

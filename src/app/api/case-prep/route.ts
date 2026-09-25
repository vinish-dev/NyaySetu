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
    const { action, payload } = await req.json();

    if (!action) {
      return NextResponse.json({ error: 'Action parameter required.' }, { status: 400 });
    }

    let prompt = '';

    if (action === 'extract-facts') {
      prompt = `
You are the factual intake engine of NyaySetu.
A citizen has described their dispute in plain words.
Extract structured factual metadata and relevant legal considerations without making conclusive judicial determinations.

Input Narrative:
"${payload.narrative || ''}"
Category Hint: "${payload.category || ''}"

Return strictly valid JSON:
{
  "title": "Clean, descriptive case title",
  "category": "Consumer Dispute | Tenancy & Rent | Employment & Salary | Commercial Contract",
  "incidentDate": "YYYY-MM-DD or approx date",
  "location": "City, State",
  "involvedParty": "Opposing party name or entity",
  "involvedPartyContact": "Email, phone, or website if mentioned, else empty",
  "desiredResolution": "Specific financial sum or remedy requested",
  "factualSummary": "Polished, objective 2-sentence summary of the incident",
  "relevantConsiderations": "Relevant legal considerations (e.g. Consumer Protection Act 2019 provisions or limitation windows) framed informatively."
}
`;
    } else if (action === 'generate-timeline') {
      prompt = `
You are the timeline engine of NyaySetu.
Given the incident narrative and available evidence list, extract a chronological sequence of events.

Narrative: "${payload.narrative || ''}"
Evidence Available: ${JSON.stringify(payload.evidence || [])}

Return strictly valid JSON:
{
  "events": [
    {
      "date": "Date string (e.g. 10 Jan 2024)",
      "title": "Short event title (e.g. Order Placed)",
      "description": "What took place during this event",
      "iconType": "cart" | "payment" | "delivery" | "warning" | "chat" | "danger",
      "linkedEvidence": ["Code e.g. E01 Invoice"]
    }
  ]
}
`;
    } else if (action === 'map-claims') {
      prompt = `
You are the evidence-claim linker for NyaySetu.
Given the factual dispute narrative and available evidence exhibits, suggest substantiated legal contentions and link the exhibits that prove each contention.

Narrative: "${payload.narrative || ''}"
Evidence Exhibits: ${JSON.stringify(payload.evidence || [])}

Return strictly valid JSON:
{
  "contentions": [
    {
      "title": "Contention title (e.g. Defective Condition on Arrival)",
      "statutoryReference": "Relevant statutory consideration (e.g. CPA 2019 Section 2(47))",
      "description": "Why this contention is supported by facts",
      "linkedEvidence": ["E01 Invoice", "E03 Photo"],
      "status": "Evidence Linked"
    }
  ]
}
`;
    } else if (action === 'detect-gaps') {
      prompt = `
You are the case completeness auditor for NyaySetu.
Compare what the citizen asserted happened against the documentary exhibits they have uploaded.
Identify missing documentation that the opposing party would likely request, and provide a transparent completion checklist.

Narrative: "${payload.narrative || ''}"
Evidence List: ${JSON.stringify(payload.evidence || [])}

Return strictly valid JSON:
{
  "completionScore": 82, // integer between 0 and 100 representing documentation completeness
  "completionLabel": "e.g. 82% complete",
  "checklist": [
    { "name": "Incident details", "status": "complete" },
    { "name": "Timeline", "status": "complete" },
    { "name": "Payment proof", "status": "complete" },
    { "name": "Communication records", "status": "complete" },
    { "name": "Product serial/IMEI", "status": "missing" },
    { "name": "Warranty document", "status": "missing" }
  ],
  "missingItems": [
    {
      "title": "Document or evidence item name",
      "description": "Why having this document prevents dispute or strengthens factual clarity",
      "severity": "danger" | "warning"
    }
  ],
  "claimsCovered": [
    "Fact point 1 supported by records",
    "Fact point 2 supported by records"
  ]
}
`;
    } else if (action === 'generate-report') {
      prompt = `
You are the Structured Case Preparation Report compiler for NyaySetu.
Assemble a formal, factual Case Preparation Report based on all entered data.

Data: ${JSON.stringify(payload, null, 2)}

Return strictly valid JSON:
{
  "reportTitle": "STRUCTURED CASE PREPARATION REPORT",
  "referenceId": "NS-2024-XXXX",
  "parties": {
    "complainant": "Complainant Name & Location",
    "oppositeParty": "Opposite Party Name & Contact"
  },
  "statementOfFacts": [
    "Numbered factual statement 1",
    "Numbered factual statement 2",
    "Numbered factual statement 3",
    "Numbered factual statement 4"
  ],
  "relevantConsiderations": "Statutory references and grounds to review with an advocate",
  "remedySought": "Specific monetary or remedial relief requested",
  "exhibitIndex": [
    { "code": "E01", "name": "Invoice Name", "details": "Verified proof" }
  ],
  "disclaimer": "This Structured Case Summary is organized for factual clarity and personal preparation. It does not constitute formal legal counsel or a finalized court pleading."
}
`;
    } else {
      return NextResponse.json({ error: `Unknown action: ${action}` }, { status: 400 });
    }

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
      action,
      data: parsed,
    });
  } catch (error: any) {
    console.error('Error in case-prep API:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to execute case preparation AI.' },
      { status: 500 }
    );
  }
}

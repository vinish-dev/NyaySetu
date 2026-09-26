import { NextRequest, NextResponse } from 'next/server';
import { generateStructuredContent, sanitizeInput } from '@/lib/gemini';

export const maxDuration = 60;

const ALLOWED_ACTIONS = new Set([
  'extract-facts',
  'generate-timeline',
  'map-claims',
  'detect-gaps',
  'generate-report',
]);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const action = body?.action;
    const payload = body?.payload || {};

    if (!action || !ALLOWED_ACTIONS.has(action)) {
      return NextResponse.json(
        { error: `Invalid or unsupported action: ${action}` },
        { status: 400 }
      );
    }

    const narrative = sanitizeInput(payload?.narrative, 30000);
    const category = sanitizeInput(payload?.category, 200);

    let prompt = '';
    let fallback: any = {};

    if (action === 'extract-facts') {
      prompt = `
You are the factual intake engine of NyaySetu.
A citizen has described their dispute in plain words.
Extract structured factual metadata and relevant legal considerations without making conclusive judicial determinations.

Input Narrative:
"${narrative}"
Category Hint: "${category}"

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
      fallback = {
        title: 'Dispute Matter',
        category: category || 'Consumer Dispute',
        incidentDate: '',
        location: '',
        involvedParty: '',
        involvedPartyContact: '',
        desiredResolution: '',
        factualSummary: narrative.slice(0, 150),
        relevantConsiderations: 'Dispute governed by applicable statutory provisions. Consult an advocate for legal representation.',
      };
    } else if (action === 'generate-timeline') {
      prompt = `
You are the timeline engine of NyaySetu.
Given the incident narrative and available evidence list, extract a chronological sequence of events.

Narrative: "${narrative}"
Evidence Available: ${JSON.stringify(payload.evidence || []).slice(0, 20000)}

Return strictly valid JSON:
{
  "events": [
    {
      "date": "Date string (e.g. 10 Jan 2024)",
      "title": "Short event title (e.g. Order Placed)",
      "description": "What took place during this event",
      "iconType": "cart",
      "linkedEvidence": ["E01"]
    }
  ]
}
`;
      fallback = { events: [] };
    } else if (action === 'map-claims') {
      prompt = `
You are the evidence-claim linker for NyaySetu.
Given the factual dispute narrative and available evidence exhibits, suggest substantiated legal contentions and link the exhibits that prove each contention.

Narrative: "${narrative}"
Evidence Exhibits: ${JSON.stringify(payload.evidence || []).slice(0, 20000)}

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
      fallback = { contentions: [] };
    } else if (action === 'detect-gaps') {
      prompt = `
You are the case completeness auditor for NyaySetu.
Compare what the citizen asserted happened against the documentary exhibits they have uploaded.
Identify missing documentation that the opposing party would likely request, and provide a transparent completion checklist.

Narrative: "${narrative}"
Evidence List: ${JSON.stringify(payload.evidence || []).slice(0, 20000)}

Return strictly valid JSON:
{
  "completionScore": 75,
  "completionLabel": "75% complete",
  "checklist": [
    { "name": "Incident details", "status": "complete" },
    { "name": "Timeline", "status": "complete" },
    { "name": "Payment proof", "status": "missing" },
    { "name": "Communication records", "status": "missing" }
  ],
  "missingItems": [
    {
      "title": "Document or evidence item name",
      "description": "Why having this document prevents dispute or strengthens factual clarity",
      "severity": "warning"
    }
  ],
  "claimsCovered": [
    "Core incident narrative recorded"
  ]
}
`;
      fallback = {
        completionScore: 50,
        completionLabel: '50% complete',
        checklist: [
          { name: 'Incident details', status: 'complete' },
          { name: 'Timeline', status: 'missing' },
          { name: 'Payment proof', status: 'missing' },
          { name: 'Communication records', status: 'missing' },
        ],
        missingItems: [],
        claimsCovered: ['Initial grievance recorded'],
      };
    } else if (action === 'generate-report') {
      prompt = `
You are the Structured Case Preparation Report compiler for NyaySetu.
Assemble a formal, factual Case Preparation Report based on all entered data.

Data: ${JSON.stringify(payload, null, 2).slice(0, 30000)}

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
    "Numbered factual statement 2"
  ],
  "relevantConsiderations": "Statutory references and grounds to review with an advocate",
  "remedySought": "Specific monetary or remedial relief requested",
  "exhibitIndex": [
    { "code": "E01", "name": "Invoice Name", "details": "Verified proof" }
  ],
  "disclaimer": "This Structured Case Summary is organized for factual clarity and personal preparation. It does not constitute formal legal counsel or a finalized court pleading."
}
`;
      fallback = {
        reportTitle: 'STRUCTURED CASE PREPARATION REPORT',
        referenceId: `NS-${Date.now().toString().slice(-4)}`,
        parties: { complainant: 'Aggrieved Citizen', oppositeParty: 'Opposing Entity' },
        statementOfFacts: [narrative.slice(0, 200)],
        relevantConsiderations: 'To be examined under relevant statutory guidelines.',
        remedySought: 'Fair dispute resolution and compensation as permissible.',
        exhibitIndex: [],
        disclaimer: 'This Structured Case Summary is organized for factual clarity and personal preparation. It does not constitute formal legal counsel or a finalized court pleading.',
      };
    }

    const structuredResult = await generateStructuredContent({
      contents: [{ text: prompt }],
      fallback,
    });

    return NextResponse.json({
      success: true,
      action,
      data: structuredResult,
    });
  } catch (error: unknown) {
    console.error('Error in case-prep API:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred during case preparation analysis.' },
      { status: 500 }
    );
  }
}

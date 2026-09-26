export interface TimelineEvent {
  id: string;
  date: string;
  title: string;
  description: string;
  iconType: 'cart' | 'payment' | 'delivery' | 'warning' | 'chat' | 'danger';
  linkedEvidence: string[];
  alert?: boolean;
  danger?: boolean;
}

export interface EvidenceItem {
  id: string;
  code: string;
  title: string;
  date: string;
  type: 'Document' | 'Image' | 'Chat' | 'Email';
  fileMeta: string;
  verified: boolean;
  needsReview?: boolean;
  summary: string;
  verificationProof: string;
}

export interface ClaimItem {
  id: string;
  title: string;
  statute: string;
  description: string;
  linkedEvidence: string[];
  substantiated: boolean;
}

export interface ReadinessCheckItem {
  name: string;
  status: 'complete' | 'missing';
}

export interface ContentionItem {
  title: string;
  desc: string;
  exhibits: string[];
}

export interface CaseDetail {
  id: string;
  caseId: string;
  title: string;
  createdDate: string;
  category: string;
  status: string;
  completionScore: number;
  completionLabel: string;
  completionNote: string;
  readinessChecklist: ReadinessCheckItem[];
  summary: {
    narrative: string;
    incidentDate: string;
    location: string;
    involvedParty: string;
    involvedPartyContact: string;
    desiredResolution: string;
  };
  timeline: TimelineEvent[];
  evidence: EvidenceItem[];
  claims: ClaimItem[];
  missingItems: {
    title: string;
    description: string;
    severity: 'danger' | 'warning';
  }[];
  claimsCovered: string[];
  potentialFilingChannels: {
    name: string;
    jurisdiction: string;
    reason: string;
    disclaimer: string;
    portalName: string;
    portalUrl: string;
  };
  nextSteps: {
    title: string;
    subtitle: string;
    actionType: string;
  }[];
}

export interface AuditedDocument {
  id: string;
  title: string;
  meta: string;
  summary: string;
  clauses: {
    tag: string;
    risk: string;
    riskVariant: 'default' | 'destructive' | 'warning' | 'success';
    raw: string;
    meaning: string;
  }[];
  obligations: string[];
  inconsistencies: {
    title: string;
    description: string;
  }[];
  lawyerQuestions: string[];
}

export function createNewCase(title: string, category: string): CaseDetail {
  const caseNumber = Math.floor(1000 + Math.random() * 9000);
  const now = new Date();
  const dateStr = now.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

  return {
    id: `case-${Date.now()}`,
    caseId: `NS-${now.getFullYear()}-${caseNumber}`,
    title: title || 'New Dispute Matter',
    createdDate: dateStr,
    category: category || 'Consumer Dispute',
    status: 'In Preparation',
    completionScore: 15,
    completionLabel: '15% complete',
    completionNote: 'Initial matter created. Complete fact intake and upload supporting evidence.',
    readinessChecklist: [
      { name: 'Incident details', status: 'missing' },
      { name: 'Timeline', status: 'missing' },
      { name: 'Payment proof', status: 'missing' },
      { name: 'Communication records', status: 'missing' },
      { name: 'Product serial/IMEI', status: 'missing' },
      { name: 'Warranty document', status: 'missing' },
    ],
    summary: {
      narrative: '',
      incidentDate: '',
      location: '',
      involvedParty: '',
      involvedPartyContact: '',
      desiredResolution: '',
    },
    timeline: [],
    evidence: [],
    claims: [],
    missingItems: [
      {
        title: 'Proof of Transaction / Invoice',
        description: 'Upload invoice, agreement, or receipt showing proof of purchase or contract.',
        severity: 'danger',
      },
      {
        title: 'Communication / Grievance Notice',
        description: 'Provide written communications or emails sent to the opposing party.',
        severity: 'danger',
      },
    ],
    claimsCovered: [],
    potentialFilingChannels: {
      name: 'District Consumer Disputes Redressal Commission / Appropriate Forum',
      jurisdiction: 'District Jurisdiction of Complainant Residence',
      reason: 'Based on the dispute category and facts entered.',
      disclaimer: 'Informational only. NyaySetu does not provide legal representation or formal jurisdiction determinations.',
      portalName: 'e-Daakhil Portal / Relevant Authority Portal',
      portalUrl: 'https://edaakhil.nic.in',
    },
    nextSteps: [
      {
        title: 'Provide factual narrative',
        subtitle: 'Enter incident details in the preparation wizard',
        actionType: 'wizard',
      },
      {
        title: 'Upload documentary evidence',
        subtitle: 'Add receipts, chats, and formal notices to the vault',
        actionType: 'upload',
      },
    ],
  };
}

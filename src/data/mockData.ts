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

export interface CaseDetail {
  id: string;
  caseId: string;
  title: string;
  createdDate: string;
  category: string;
  status: string;
  readinessScore: number;
  readinessLabel: string;
  readinessNote: string;
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
  recommendedAuthority: {
    name: string;
    jurisdiction: string;
    reason: string;
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

export const activeCaseData: CaseDetail = {
  id: 'case-1',
  caseId: 'NS-2024-0456',
  title: 'Defective Product – Refund Denied',
  createdDate: '12 May 2024',
  category: 'Consumer Dispute',
  status: 'In Preparation',
  readinessScore: 82,
  readinessLabel: 'Good',
  readinessNote: "Your case is well-structured. You're almost ready to file.",
  summary: {
    narrative: 'You purchased a smartphone from ABC Store on 10 Jan 2024. The product was defective (not charging) from the day of delivery. You requested a replacement/refund multiple times but the seller refused and stopped responding.',
    incidentDate: '10 Jan 2024',
    location: 'Bangalore, Karnataka',
    involvedParty: 'ABC Store',
    involvedPartyContact: 'abc.store@gmail.com',
    desiredResolution: 'Full Refund of ₹24,999'
  },
  timeline: [
    {
      id: 't-1',
      date: '10 Jan 2024',
      title: 'Order Placed',
      description: 'Placed order on ABC Store website for NeoPhone Pro 5G.',
      iconType: 'cart',
      linkedEvidence: ['E01 Invoice', 'E07 Website Policy']
    },
    {
      id: 't-2',
      date: '12 Jan 2024',
      title: 'Payment Completed',
      description: 'Paid ₹24,999 via UPI transaction ID: 401294821098.',
      iconType: 'payment',
      linkedEvidence: ['E02 Payment Receipt']
    },
    {
      id: 't-3',
      date: '13 Jan 2024',
      title: 'Product Delivered',
      description: 'Received the product via courier service.',
      iconType: 'delivery',
      linkedEvidence: ['E08 Courier Slip']
    },
    {
      id: 't-4',
      date: '13 Jan 2024',
      title: 'Defect Identified',
      description: 'Phone not charging or turning on straight out of the box.',
      iconType: 'warning',
      alert: true,
      linkedEvidence: ['E03 Product Photo (Defect)']
    },
    {
      id: 't-5',
      date: '14 – 20 Jan 2024',
      title: 'Contacted Seller',
      description: 'Requested replacement/refund. No positive response.',
      iconType: 'chat',
      linkedEvidence: ['E04 WhatsApp Chat', 'E05 Email to Seller']
    },
    {
      id: 't-6',
      date: '21 Jan 2024',
      title: 'Seller Refused',
      description: 'Seller denied refund and stopped replying to customer complaints.',
      iconType: 'danger',
      danger: true,
      linkedEvidence: ['E06 Seller Reply (Refund Denied)']
    }
  ],
  evidence: [
    {
      id: 'e-1',
      code: 'E01',
      title: 'Invoice',
      date: '10 Jan 2024',
      type: 'Document',
      fileMeta: 'PDF • 1.2 MB',
      verified: true,
      summary: 'Official tax invoice issued by ABC Store Pvt Ltd. Confirms purchase of NeoPhone Pro 5G for ₹24,999/- with 1-year manufacturer warranty.',
      verificationProof: 'GSTIN: 29AAAAA0000A1Z5 authenticated against CBIC invoice register.'
    },
    {
      id: 'e-2',
      code: 'E02',
      title: 'Payment Receipt',
      date: '12 Jan 2024',
      type: 'Document',
      fileMeta: 'PNG • 420 KB',
      verified: true,
      summary: 'Bank payment screenshot with UPI transaction reference ID #401294821098.',
      verificationProof: 'NPCI bank gateway confirmation timestamp matched.'
    },
    {
      id: 'e-3',
      code: 'E03',
      title: 'Product Photo (Defect)',
      date: '13 Jan 2024',
      type: 'Image',
      fileMeta: 'JPG • 3.4 MB',
      verified: true,
      summary: 'Photo showing dead phone plugged into original charging brick with power meter indicating zero current flow.',
      verificationProof: 'EXIF timestamp confirms photo taken on 13 Jan 2024 at 16:45 PM.'
    },
    {
      id: 'e-4',
      code: 'E04',
      title: 'WhatsApp Chat with Seller',
      date: '14 – 20 Jan 2024',
      type: 'Chat',
      fileMeta: 'TXT • 48 KB',
      verified: true,
      summary: '24 exported messages with seller business support confirming complaint logged within 24 hours of delivery.',
      verificationProof: 'Cryptographic SHA-256 match for Section 65B Indian Evidence Act admissibility.'
    },
    {
      id: 'e-5',
      code: 'E05',
      title: 'Email to Seller',
      date: '15 Jan 2024',
      type: 'Email',
      fileMeta: 'EML • 18 KB',
      verified: false,
      needsReview: true,
      summary: 'Formal notice served via email requesting replacement within 72 hours as per statutory norms.',
      verificationProof: 'Server delivery acknowledgment logged; awaiting explicit counter-party response.'
    },
    {
      id: 'e-6',
      code: 'E06',
      title: 'Seller Reply (Refund Denied)',
      date: '21 Jan 2024',
      type: 'Email',
      fileMeta: 'EML • 22 KB',
      verified: true,
      summary: 'Formal denial by seller stating opened electronics cannot be refunded, contrary to statutory defect warranty.',
      verificationProof: 'Establishes incontrovertible proof of grievance exhaustion.'
    },
    {
      id: 'e-7',
      code: 'E07',
      title: 'Website Return Policy',
      date: '10 Jan 2024',
      type: 'Document',
      fileMeta: 'PDF • 580 KB',
      verified: true,
      summary: 'Screenshot of return policy promising "7-day replacement for dead on arrival units".',
      verificationProof: 'Archived snapshot from web server verified.'
    },
    {
      id: 'e-8',
      code: 'E08',
      title: 'Courier Delivery Slip',
      date: '13 Jan 2024',
      type: 'Document',
      fileMeta: 'PDF • 310 KB',
      verified: true,
      summary: 'Proof of parcel handover by BlueDart courier on 13 Jan 2024 at 14:15 PM.',
      verificationProof: 'Tracking AWB #948210384 delivery scan confirmed.'
    }
  ],
  claims: [
    {
      id: 'c-1',
      title: 'Manufacturing Defect & Deficiency in Goods',
      statute: 'Section 2(47) Consumer Protection Act 2019',
      description: 'The phone delivered was inoperable straight from packaging, rendering it unfit for reasonable use.',
      linkedEvidence: ['E01 Invoice', 'E03 Product Photo (Defect)', 'E08 Courier Slip'],
      substantiated: true
    },
    {
      id: 'c-2',
      title: 'Unfair Trade Practice & False Assurance',
      statute: 'Section 2(47)(viii) Consumer Protection Act 2019',
      description: 'Refusal to honor the 7-day replacement promised on website while withholding paid consideration.',
      linkedEvidence: ['E04 WhatsApp Chat', 'E06 Seller Reply', 'E07 Return Policy'],
      substantiated: true
    }
  ],
  missingItems: [
    {
      title: 'Warranty Card / Proof of Warranty',
      description: 'Helps eliminate manufacturer disputes on repair liability.',
      severity: 'danger'
    },
    {
      title: 'Clear photo of product serial number',
      description: 'Crucial to tie physical device directly to invoice E01.',
      severity: 'danger'
    },
    {
      title: 'Any return request raised on the platform (if any)',
      description: 'Confirms formal cancellation ticket ID was registered within warranty window.',
      severity: 'danger'
    }
  ],
  claimsCovered: [
    'Product delivered was defective',
    'Seller failed to resolve the issue',
    'Refund requested but denied'
  ],
  recommendedAuthority: {
    name: 'District Consumer Disputes Redressal Commission',
    jurisdiction: 'Bangalore Urban District (Pecuniary claims up to ₹50 Lakhs)',
    reason: 'Consumer transaction involving goods and service under CPA 2019.',
    portalName: 'e-Daakhil Portal (edaakhil.nic.in)',
    portalUrl: 'https://edaakhil.nic.in'
  },
  nextSteps: [
    {
      title: 'Review missing items and add if available',
      subtitle: 'Upload serial number photo to hit 95% readiness',
      actionType: 'upload'
    },
    {
      title: 'Generate your Case Report',
      subtitle: 'Export indexed court docket with exhibit coversheets',
      actionType: 'export'
    },
    {
      title: 'File with recommended authority',
      subtitle: 'Submit via e-Daakhil or visit Bangalore District Commission',
      actionType: 'file'
    }
  ]
};

export const sampleAuditedDocs: Record<string, AuditedDocument> = {
  lease: {
    id: 'doc-lease',
    title: 'Standard Residential Tenancy Agreement',
    meta: '11 Pages • Governing Law: Karnataka Rent Control / Model Tenancy Act',
    summary: 'This is an 11-month rental agreement for an apartment in Bangalore with a monthly rent of ₹32,000 and an upfront security deposit of ₹1,60,000 (5 months). The landlord permits termination with 1 month notice, but Clause 14 imposes an aggressive 50% forfeiture if you vacate before 6 months. Maintenance charges are excluded from rent.',
    clauses: [
      {
        tag: 'Clause 4 • Security Deposit',
        risk: 'Standard',
        riskVariant: 'success',
        raw: '"The Tenant shall pay a refundable interest-free deposit of ₹1,60,000/-, repayable upon handover of vacant possession minus legitimate utility dues."',
        meaning: 'Landlord must refund full ₹1.6 Lakhs upon moving out. Deductions are only permitted for unpaid electricity/water or actual physical damage.'
      },
      {
        tag: 'Clause 14 • Lock-in Period & Forfeiture',
        risk: 'High Risk / Unfavorable',
        riskVariant: 'destructive',
        raw: '"In the event the Tenant vacates the premises prior to 180 days, fifty percent (50%) of the total security deposit shall stand unconditionally forfeited as liquidated damages."',
        meaning: 'If your job transfers you or you leave before 6 months, the owner claims a right to keep ₹80,000 automatically, which is often challenged under Indian Contract Act Section 74 unless actual loss is proven.'
      },
      {
        tag: 'Clause 9 • Maintenance & Painting Charges',
        risk: 'Moderate',
        riskVariant: 'warning',
        raw: '"Deduction of 1 month\'s rent (₹32,000/-) shall be made towards painting and sanitization at the time of tenancy termination."',
        meaning: 'A fixed ₹32,000 painting fee will be subtracted irrespective of the actual wall condition when you leave.'
      }
    ],
    obligations: [
      'Pay Rent by the 5th: Monthly transfer of ₹32,000 with a late fee of ₹200/day after the 7th.',
      '1 Month Written Notice: Must notify landlord via email at least 30 calendar days before vacating.',
      'Minor Repairs: You are liable for plumbing washers and bulb replacements up to ₹1,000.'
    ],
    inconsistencies: [
      {
        title: 'Notice Period Contradiction',
        description: 'Clause 7 mentions "Either party may terminate with 30 days notice", but Clause 14 enforces a mandatory 6-month non-refundable lock-in period.'
      },
      {
        title: 'Unilateral Landlord Inspection',
        description: 'Clause 11 grants landlord right of entry "at any hour without prior intimation", which infringes on tenant\'s right to peaceful possession.'
      }
    ],
    lawyerQuestions: [
      'Is the 50% deposit forfeiture under Clause 14 enforceable under Karnataka Rent Control law if a replacement tenant is found immediately?',
      'Can the 1-month painting deduction (Clause 9) be substituted with self-painting or an actual painter\'s tax bill?',
      'Does the agreement require formal registration under the Registration Act if it exceeds 11 months with renewal options?'
    ]
  },
  consumer: {
    id: 'doc-consumer',
    title: 'Electronic Goods Sales Terms & Warranty EULA',
    meta: '7 Pages • Governing Law: Consumer Protection (E-Commerce) Rules 2020',
    summary: 'Standard seller conditions for consumer electronic devices. Restricts liability for pre-existing battery or software boot failure and attempts to force arbitration exclusively in New Delhi, contrary to Section 34 of CPA 2019.',
    clauses: [
      {
        tag: 'Clause 3 • Jurisdiction Restriction',
        risk: 'Unenforceable',
        riskVariant: 'destructive',
        raw: '"Any disputes arising out of purchase shall be submitted exclusively to courts in New Delhi to the exclusion of all other jurisdictions."',
        meaning: 'Under CPA 2019 Sec 34, a consumer can file at their own place of residence. The merchant cannot force you to travel to Delhi.'
      },
      {
        tag: 'Clause 8 • "Opened Box" No-Refund Clause',
        risk: 'Unfair Trade Practice',
        riskVariant: 'destructive',
        raw: '"Goods once unsealed or powered on are deemed accepted and non-refundable under all circumstances."',
        meaning: 'If goods are defective upon arrival, statutory warranty overrides this clause under Section 2(47).'
      }
    ],
    obligations: [
      'Report Defect within 48 Hours: You must preserve original box barcode and accessories.',
      'Authorized Repair Only: Opening device with non-certified technician voids claims.'
    ],
    inconsistencies: [
      {
        title: 'Arbitration Clause vs Consumer Forum',
        description: 'The agreement tries to steer disputes into private arbitration, but Supreme Court has established that Consumer Forum remedies are additional.'
      }
    ],
    lawyerQuestions: [
      'Can the consumer forum award punitive damages for mandatory opened-box exclusions?',
      'How to hold both the marketplace and third-party seller jointly liable?'
    ]
  },
  employment: {
    id: 'doc-employment',
    title: 'Employment Non-Disclosure & Non-Compete Agreement',
    meta: '14 Pages • Governing Law: Indian Contract Act 1872, Section 27',
    summary: 'Standard corporate employment agreement containing post-termination restrictions, intellectual property assignments, and non-solicitation of clients.',
    clauses: [
      {
        tag: 'Clause 6 • Post-Employment Non-Compete (12 Months)',
        risk: 'Void under Sec 27',
        riskVariant: 'destructive',
        raw: '"The Employee covenants not to engage with any competing technology business in India for 12 months after termination."',
        meaning: 'Under Section 27 of Indian Contract Act, post-employment non-compete agreements are void as restraint of trade in India.'
      },
      {
        tag: 'Clause 9 • Withholding Final Settlement for IP Audit',
        risk: 'High Risk',
        riskVariant: 'warning',
        raw: '"Company reserves right to withhold final salary and Gratuity up to 90 days for forensic laptop review."',
        meaning: 'Payment of Wages Act and Gratuity Act mandate strict statutory disbursement timelines (typically within 30 days).'
      }
    ],
    obligations: [
      'Maintain strict confidentiality of source code and client lists indefinitely.',
      'Return company laptop and security tokens within 48 hours of exit.'
    ],
    inconsistencies: [
      {
        title: 'Gratuity Withholding vs Payment of Gratuity Act',
        description: 'Gratuity can only be forfeited for intentional damage or moral turpitude after formal inquiry, not routine exit audits.'
      }
    ],
    lawyerQuestions: [
      'Can the company legally stall Form 16 issuance during notice period disputes?',
      'What is the quickest remedy before the Labor Commissioner for delayed full & final settlement?'
    ]
  }
};

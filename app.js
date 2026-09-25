/**
 * NyaySetu - Legal Information & Case Preparation Platform
 * Client-Side Interactive Engine
 */

// Sample Evidence Dataset
const evidenceDatabase = {
  'E01': {
    code: 'E01',
    title: 'Tax Invoice #INV-29381 (ABC Store)',
    date: '10 Jan 2024',
    type: 'Document (PDF)',
    size: '1.2 MB',
    summary: 'Official GST invoice issued by ABC Store Pvt Ltd for NeoPhone Pro 5G (IMEI 894120894210982). Total sum paid: ₹24,999/- inclusive of 18% IGST. Clearly specifies 7-day return policy and 1-year brand warranty.',
    verified: true,
    verificationNote: 'Hash verified. Valid GSTIN: 29AAAAA0000A1Z5 matched against national taxpayer registry.'
  },
  'E02': {
    code: 'E02',
    title: 'UPI Payment Receipt #UPI-401294821098',
    date: '12 Jan 2024',
    type: 'Payment Slip (PNG)',
    size: '420 KB',
    summary: 'Bank transaction confirmation from HDFC Bank to merchant VPA abcstore@icici. Amount ₹24,999 debited successfully.',
    verified: true,
    verificationNote: 'NPCI bank reference number verified with timestamp 12 Jan 2024, 14:22:10 IST.'
  },
  'E03': {
    code: 'E03',
    title: 'Product Defect Photographic Proof',
    date: '13 Jan 2024',
    type: 'Image (JPG)',
    size: '3.4 MB',
    summary: 'High-resolution unboxing photograph demonstrating unresponsiveness to original charger and black screen with no LED charge indicator.',
    verified: true,
    verificationNote: 'EXIF metadata indicates captured on 13 Jan 2024 at 16:45 PM (within 2 hours of courier delivery).'
  },
  'E04': {
    code: 'E04',
    title: 'WhatsApp Grievance Chat Transcript',
    date: '14 – 20 Jan 2024',
    type: 'Chat Log (TXT)',
    size: '48 KB',
    summary: 'Verified chat with ABC Store Verified Business Account (+91 98800 12345). Includes video transmission of defect and customer support agent promising pickup within 48 hours.',
    verified: true,
    verificationNote: 'Cryptographic hash matched against WhatsApp export file. Meets Section 65B Indian Evidence Act standards.'
  },
  'E05': {
    code: 'E05',
    title: 'Formal Notice Email to Grievance Officer',
    date: '15 Jan 2024',
    type: 'Email (EML)',
    size: '18 KB',
    summary: 'Formal notice served via email to grievance@abcstore.in citing Consumer Protection Act 2019 rights for replacement or refund within 72 hours.',
    verified: false,
    verificationNote: 'Delivery server reported receipt; awaiting formal electronic acknowledgment signature from receiver.'
  },
  'E06': {
    code: 'E06',
    title: 'Merchant Denial Letter / Rejection Email',
    date: '21 Jan 2024',
    type: 'Email (EML)',
    size: '22 KB',
    summary: 'Official email from ABC Store claims manager refusing refund: "As per internal policy, opened electronics cannot be refunded. Contact manufacturer service center directly."',
    verified: true,
    verificationNote: 'Constitutes documented denial of liability, establishing cause of action for Consumer Commission.'
  },
  'E07': {
    code: 'E07',
    title: 'Store Website Return Policy Web Archive',
    date: '10 Jan 2024',
    type: 'Document (PDF)',
    size: '580 KB',
    summary: 'Archived snapshot of ABC Store "Returns & Replacements" page as visible on purchase date stating: "Defective on arrival items will be replaced within 7 days without hassle."',
    verified: true,
    verificationNote: 'Wayback Machine archive snapshot authenticated.'
  },
  'E08': {
    code: 'E08',
    title: 'Courier Delivery Acknowledgment Slip',
    date: '13 Jan 2024',
    type: 'Document (PDF)',
    size: '310 KB',
    summary: 'BlueDart Tracking AWB #948210384 showing package delivery completed on 13 Jan 2024 at 14:15 PM.',
    verified: true,
    verificationNote: 'Confirms exact date of receipt to calculate statutory 14-day defect notice window.'
  }
};

// Sample Documents for "Understand Documents" view
const sampleDocuments = {
  lease: {
    title: 'Standard Residential Tenancy Agreement',
    meta: '11 Pages • Governing Law: Karnataka Rent Control / Model Tenancy Act',
    summary: 'This is an 11-month rental agreement for an apartment in Bangalore with a monthly rent of ₹32,000 and an upfront security deposit of ₹1,60,000 (5 months). The landlord permits termination with 1 month notice, but Clause 14 imposes an aggressive 50% forfeiture if you vacate before 6 months. Maintenance charges are excluded from rent.',
    clauses: [
      {
        tag: 'Clause 4 • Security Deposit',
        risk: 'Standard',
        riskClass: 'badge-success',
        raw: '"The Tenant shall pay a refundable interest-free deposit of ₹1,60,000/-, repayable upon handover of vacant possession minus legitimate utility dues."',
        meaning: 'Landlord must refund full ₹1.6 Lakhs upon moving out. Deductions are only permitted for unpaid electricity/water or actual physical damage.'
      },
      {
        tag: 'Clause 14 • Lock-in Period & Forfeiture',
        risk: 'High Risk / Unfavorable',
        riskClass: 'badge-warning',
        raw: '"In the event the Tenant vacates the premises prior to 180 days, fifty percent (50%) of the total security deposit shall stand unconditionally forfeited as liquidated damages."',
        meaning: 'If your job transfers you or you leave before 6 months, the owner claims a right to keep ₹80,000 automatically, which is often challenged under Indian Contract Act Section 74 unless actual loss is proven.'
      },
      {
        tag: 'Clause 9 • Maintenance & Painting Charges',
        risk: 'Moderate',
        riskClass: 'badge-blue',
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
      { title: 'Notice Period Contradiction', desc: 'Clause 7 mentions "Either party may terminate with 30 days notice", but Clause 14 enforces a mandatory 6-month non-refundable lock-in period.' },
      { title: 'Unilateral Landlord Inspection', desc: 'Clause 11 grants landlord right of entry "at any hour without prior intimation", which infringes on tenant\'s right to peaceful possession.' }
    ],
    lawyerQuestions: [
      'Is the 50% deposit forfeiture under Clause 14 enforceable under Karnataka Rent Control law if a replacement tenant is found immediately?',
      'Can the 1-month painting deduction (Clause 9) be substituted with self-painting or an actual painter\'s tax bill?',
      'Does the agreement require formal registration under the Registration Act if it exceeds 11 months with renewal options?'
    ]
  },
  consumer: {
    title: 'Electronic Goods Sales Terms & Warranty EULA',
    meta: '7 Pages • Governing Law: Consumer Protection (E-Commerce) Rules 2020',
    summary: 'Standard seller conditions for consumer electronic devices. Restricts liability for pre-existing battery or software boot failure and attempts to force arbitration exclusively in New Delhi, contrary to Section 34 of CPA 2019.',
    clauses: [
      {
        tag: 'Clause 3 • Jurisdiction Restriction',
        risk: 'Unenforceable',
        riskClass: 'badge-warning',
        raw: '"Any disputes arising out of purchase shall be submitted exclusively to courts in New Delhi to the exclusion of all other jurisdictions."',
        meaning: 'Under CPA 2019 Sec 34, a consumer can file at their own place of residence. The merchant cannot force you to travel to Delhi.'
      },
      {
        tag: 'Clause 8 • "Opened Box" No-Refund Clause',
        risk: 'Unfair Trade Practice',
        riskClass: 'badge-warning',
        raw: '"Goods once unsealed or powered on are deemed accepted and non-refundable under all circumstances."',
        meaning: 'If goods are defective upon arrival, statutory warranty overrides this clause under Section 2(47).'
      }
    ],
    obligations: [
      'Report Defect within 48 Hours: You must preserve original box barcode and accessories.',
      'Authorized Repair Only: Opening device with non-certified technician voids claims.'
    ],
    inconsistencies: [
      { title: 'Arbitration Clause vs Consumer Forum', desc: 'The agreement tries to steer disputes into private arbitration, but Supreme Court has established that Consumer Forum remedies are additional.' }
    ],
    lawyerQuestions: [
      'Can the consumer forum award punitive damages for mandatory opened-box exclusions?',
      'How to hold both the marketplace and third-party seller jointly liable?'
    ]
  },
  employment: {
    title: 'Employment Non-Disclosure & Non-Compete Agreement',
    meta: '14 Pages • Governing Law: Indian Contract Act 1872, Section 27',
    summary: 'Standard corporate NDA containing post-termination restrictions, intellectual property assignments, and non-solicitation of clients.',
    clauses: [
      {
        tag: 'Clause 6 • Post-Employment Non-Compete (12 Months)',
        risk: 'Void under Sec 27',
        riskClass: 'badge-warning',
        raw: '"The Employee covenants not to engage with any competing technology business in India for 12 months after termination."',
        meaning: 'Under Section 27 of Indian Contract Act, post-employment non-compete agreements are void as restraint of trade in India.'
      },
      {
        tag: 'Clause 9 • Withholding Final Settlement for IP Audit',
        risk: 'High Risk',
        riskClass: 'badge-warning',
        raw: '"Company reserves right to withhold final salary and Gratuity up to 90 days for forensic laptop review."',
        meaning: 'Payment of Wages Act and Gratuity Act mandate strict statutory disbursement timelines (typically within 30 days).'
      }
    ],
    obligations: [
      'Maintain strict confidentiality of source code and client lists indefinitely.',
      'Return company laptop and security tokens within 48 hours of exit.'
    ],
    inconsistencies: [
      { title: 'Gratuity Withholding vs Payment of Gratuity Act', desc: 'Gratuity can only be forfeited for intentional damage or moral turpitude after formal inquiry, not routine exit audits.' }
    ],
    lawyerQuestions: [
      'Can the company legally stall Form 16 issuance during notice period disputes?',
      'What is the quickest remedy before the Labor Commissioner for delayed full & final settlement?'
    ]
  }
};

// DOM Content Loaded Handler
document.addEventListener('DOMContentLoaded', () => {
  setupNavigation();
  setupMobileDrawer();
  setupCategoryRadios();
  setupWizardTabs();
});

/**
 * Main Top-Level Navigation Handler
 */
function setupNavigation() {
  const navLinks = document.querySelectorAll('.nav-link[data-tab]');
  
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetTab = link.getAttribute('data-tab');
      switchTab(targetTab);

      // Close mobile drawer if open
      const sidebar = document.getElementById('sidebar');
      if (sidebar.classList.contains('open')) {
        sidebar.classList.remove('open');
      }
    });
  });

  // Handle URL hash if present
  const hash = window.location.hash.replace('#', '');
  if (hash && ['dashboard', 'my-cases', 'prepare-case', 'understand-docs', 'ask-nyaysetu'].includes(hash)) {
    switchTab(hash);
  }
}

/**
 * Switch view tab
 * @param {string} tabId 
 */
function switchTab(tabId) {
  // Update sidebar active links
  const navLinks = document.querySelectorAll('.nav-link[data-tab]');
  navLinks.forEach(link => {
    if (link.getAttribute('data-tab') === tabId) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });

  // Update tab panes
  const allTabs = document.querySelectorAll('.tab-pane');
  allTabs.forEach(pane => {
    pane.classList.remove('active');
  });

  const activePane = document.getElementById(`tab-${tabId}`);
  if (activePane) {
    activePane.classList.add('active');
  }

  // Update window URL hash without jumping
  window.history.replaceState(null, null, `#${tabId}`);
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/**
 * Mobile Navigation Drawer Toggle
 */
function setupMobileDrawer() {
  const openBtn = document.getElementById('openSidebarBtn');
  const closeBtn = document.getElementById('closeSidebarBtn');
  const sidebar = document.getElementById('sidebar');

  if (openBtn) {
    openBtn.addEventListener('click', () => {
      sidebar.classList.add('open');
    });
  }

  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      sidebar.classList.remove('open');
    });
  }
}

/**
 * Sub-tab switcher in "My Cases" view (Timeline / Evidence / Claims)
 */
function switchCaseSubTab(subTabName) {
  const tabs = document.querySelectorAll('.tabs-list .tab-btn');
  tabs.forEach(btn => btn.classList.remove('active'));

  const activeBtn = event.currentTarget;
  if (activeBtn) activeBtn.classList.add('active');

  const contents = document.querySelectorAll('.subtab-content');
  contents.forEach(content => content.classList.remove('active'));

  const targetContent = document.getElementById(`subtab-${subTabName}`);
  if (targetContent) targetContent.classList.add('active');

  // Toggle action buttons in header
  const timelineActions = document.getElementById('timelineActions');
  const evidenceActions = document.getElementById('evidenceActions');

  if (subTabName === 'timeline') {
    timelineActions.classList.remove('hidden');
    evidenceActions.classList.add('hidden');
  } else if (subTabName === 'evidence') {
    timelineActions.classList.add('hidden');
    evidenceActions.classList.remove('hidden');
  } else {
    timelineActions.classList.add('hidden');
    evidenceActions.classList.add('hidden');
  }
}

/**
 * Prepare Case Wizard Stepper Controls
 */
function setupWizardTabs() {
  // Wizard steps configured via goToWizardStep
}

function goToWizardStep(stepNum) {
  // Update step buttons
  const stepButtons = document.querySelectorAll('.wiz-step-btn');
  stepButtons.forEach(btn => {
    const btnStep = parseInt(btn.getAttribute('data-step'), 10);
    btn.classList.remove('active');
    if (btnStep < stepNum) {
      btn.classList.add('completed');
    } else {
      btn.classList.remove('completed');
    }
    if (btnStep === stepNum) {
      btn.classList.add('active');
    }
  });

  // Update content panels
  const allContents = document.querySelectorAll('.wiz-content');
  allContents.forEach(pane => pane.classList.remove('active'));

  const targetPane = document.getElementById(`wiz-step-${stepNum}`);
  if (targetPane) {
    targetPane.classList.add('active');
  }

  window.scrollTo({ top: 120, behavior: 'smooth' });
}

function resetWizard() {
  if (confirm('Reset wizard back to Step 1? Existing filled data will remain intact.')) {
    goToWizardStep(1);
  }
}

/**
 * Load Sample Documents in Understand Documents
 */
function loadSampleDocument(docKey) {
  const doc = sampleDocuments[docKey];
  if (!doc) return;

  document.getElementById('activeDocTitle').innerText = doc.title;
  document.getElementById('activeDocMeta').innerText = doc.meta;
  document.getElementById('activeDocSummary').innerText = doc.summary;

  // Render Clauses
  const clauseContainer = document.querySelector('.clause-cards-list');
  clauseContainer.innerHTML = '';
  doc.clauses.forEach(cl => {
    const item = document.createElement('div');
    item.className = 'clause-item';
    item.innerHTML = `
      <div class="clause-top">
        <span class="clause-tag">${cl.tag}</span>
        <span class="badge ${cl.riskClass}">${cl.risk}</span>
      </div>
      <p class="clause-raw">${cl.raw}</p>
      <div class="clause-explanation">
        <strong>Plain meaning:</strong> ${cl.meaning}
      </div>
    `;
    clauseContainer.appendChild(item);
  });

  // Render Obligations
  const obligationsContainer = document.querySelector('.obligation-list');
  obligationsContainer.innerHTML = '';
  doc.obligations.forEach(ob => {
    const li = document.createElement('li');
    li.innerHTML = `
      <i class="fa-solid fa-circle-dot text-purple"></i>
      <div>${ob}</div>
    `;
    obligationsContainer.appendChild(li);
  });

  // Render Inconsistencies
  const incContainer = document.querySelector('.inconsistency-list');
  incContainer.innerHTML = '';
  doc.inconsistencies.forEach(inc => {
    const div = document.createElement('div');
    div.className = 'inconsistency-item';
    div.innerHTML = `
      <div class="inc-bullet"></div>
      <div>
        <h6>${inc.title}</h6>
        <p>${inc.desc}</p>
      </div>
    `;
    incContainer.appendChild(div);
  });

  // Render Lawyer Questions
  const lawyerQContainer = document.querySelector('.lawyer-q-list');
  lawyerQContainer.innerHTML = '';
  doc.lawyerQuestions.forEach((q, idx) => {
    const div = document.createElement('div');
    div.className = 'lawyer-q-item';
    div.innerHTML = `
      <span class="q-num">${idx + 1}</span>
      <p>"${q}"</p>
    `;
    lawyerQContainer.appendChild(div);
  });
}

/**
 * Preview Evidence Item Lightbox
 */
function previewEvidence(evidenceCode) {
  const ev = evidenceDatabase[evidenceCode] || {
    code: evidenceCode,
    title: 'Evidence Item',
    date: 'Unknown',
    type: 'Document',
    size: '1 MB',
    summary: 'Standard supporting exhibit attached to case file.',
    verified: true,
    verificationNote: 'Stored in encrypted local vault.'
  };

  document.getElementById('previewCode').innerText = ev.code;
  document.getElementById('previewTitle').innerText = ev.title;

  const previewBody = document.getElementById('previewContent');
  previewBody.innerHTML = `
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; border-bottom: 1px solid #e2e8f0; padding-bottom: 12px;">
      <div>
        <span style="font-size: 12px; color: #64748b;">File Type: <strong>${ev.type}</strong> (${ev.size})</span>
        <div style="font-size: 12px; color: #64748b; margin-top: 2px;">Recorded Date: <strong>${ev.date}</strong></div>
      </div>
      <div>
        <span class="status-pill status-verified"><i class="fa-solid fa-circle-check"></i> ${ev.verified ? 'Verified Exhibit' : 'Pending Verification'}</span>
      </div>
    </div>
    
    <h4 style="font-size: 14px; margin-bottom: 6px; color: #0f172a;">Exhibit Analysis & Contents:</h4>
    <p style="font-size: 13px; color: #334155; line-height: 1.6; margin-bottom: 16px;">
      ${ev.summary}
    </p>

    <div style="background: #f1f5f9; border-radius: 8px; padding: 12px; font-size: 12px; color: #475569;">
      <strong style="color: #0f172a;"><i class="fa-solid fa-fingerprint text-purple"></i> Integrity & Verification Proof:</strong>
      <p style="margin-top: 4px;">${ev.verificationNote}</p>
    </div>
  `;

  openModal('previewEvidenceModal');
}

/**
 * Modal Open & Close Functions
 */
function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.add('show');
  }
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.remove('show');
  }
}

// Close modal on escape key or clicking backdrop
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    document.querySelectorAll('.modal-overlay.show').forEach(m => m.classList.remove('show'));
  }
});

document.addEventListener('click', (e) => {
  if (e.target.classList.contains('modal-overlay')) {
    e.target.classList.remove('show');
  }
});

/**
 * Specific Modal Openers
 */
function openUploadEvidenceModal() {
  openModal('uploadEvidenceModal');
}

function openAddEventModal() {
  openModal('addEventModal');
}

function openFilingProcessModal() {
  openModal('filingModal');
}

function openAuthorityModal() {
  openModal('filingModal');
}

function openNewCaseModal() {
  openModal('newCaseModal');
}

function openUploadDocModal() {
  openModal('uploadEvidenceModal');
}

function openExportModal() {
  alert('Exporting verified legal case docket with table of contents and exhibits.');
}

function openLimitationModal() {
  alert('Limitation Calculator: Under Consumer Protection Act 2019, the limitation period is 2 years from date of cause of action (expires 10 Jan 2026). Your claim is well within time!');
}

function openHelpModal() {
  alert('NyaySetu Help: We empower citizens with procedural clarity and structured exhibits. For official state advocate aid, connect with your District Legal Services Authority (DLSA).');
}

function openEvidenceLinkModal() {
  alert('Evidence Linker: Select any evidence item from the vault to bind it as proof for this legal claim.');
}

function showScoreTooltip() {
  alert('Readiness Score is calculated across 4 pillars: Fact Consistency (25%), Documentary Proof (30%), Statutory Grounds (25%), and Limitation Compliance (20%).');
}

function improveScoreAction() {
  openUploadEvidenceModal();
}

/**
 * Toggle Case Options Menu
 */
function toggleCaseMenu() {
  const menu = document.getElementById('caseDropdownMenu');
  if (menu) {
    menu.classList.toggle('show');
  }
}

document.addEventListener('click', (e) => {
  const menuBtn = document.getElementById('caseMenuBtn');
  const menu = document.getElementById('caseDropdownMenu');
  if (menu && menuBtn && !menuBtn.contains(e.target) && !menu.contains(e.target)) {
    menu.classList.remove('show');
  }
});

/**
 * Form Submit Handlers (UI Only)
 */
function submitEvidenceItem() {
  const title = document.getElementById('evTitleInput').value || 'New Evidence Item';
  alert(`Added "${title}" to your Evidence Vault.`);
  closeModal('uploadEvidenceModal');
}

function submitTimelineEvent() {
  const heading = document.getElementById('eventTitleInput').value || 'New Milestone';
  alert(`Added "${heading}" to case chronological timeline.`);
  closeModal('addEventModal');
}

function confirmNewCase() {
  closeModal('newCaseModal');
  switchTab('prepare-case');
  goToWizardStep(1);
}

function setupCategoryRadios() {
  const radioCards = document.querySelectorAll('.cat-radio-card');
  radioCards.forEach(card => {
    card.addEventListener('click', () => {
      radioCards.forEach(c => c.classList.remove('active'));
      card.classList.add('active');
    });
  });
}

/**
 * Ask NyaySetu Search Simulator
 */
function setSearchQuery(query) {
  const input = document.getElementById('legalSearchInput');
  if (input) {
    input.value = query;
    executeLegalSearch();
  }
}

function executeLegalSearch() {
  const input = document.getElementById('legalSearchInput');
  const query = input ? input.value : '';
  const resultBox = document.getElementById('searchResultBox');

  if (resultBox) {
    resultBox.scrollIntoView({ behavior: 'smooth' });
    resultBox.style.animation = 'none';
    setTimeout(() => {
      resultBox.style.animation = 'fadeIn 0.4s ease forwards';
    }, 10);
  }
}

function openStatuteModal(statuteKey) {
  if (statuteKey === 'cpa2019') {
    setSearchQuery('Consumer Protection Act 2019 defective goods remedies');
  } else if (statuteKey === 'tenancy') {
    setSearchQuery('Model Tenancy Act security deposit return timeline');
  } else if (statuteKey === 'edaakhil') {
    openFilingProcessModal();
  } else {
    setSearchQuery('NALSA free legal aid eligibility criteria Section 12');
  }
}

function copyLawyerQuestions() {
  const questions = [
    '1. Is the 50% deposit forfeiture under Clause 14 enforceable under Karnataka Rent Control law?',
    '2. Can the 1-month painting deduction be substituted with actual painter bills?',
    '3. Does the agreement require formal registration under the Registration Act?'
  ].join('\n');

  if (navigator.clipboard) {
    navigator.clipboard.writeText(questions).then(() => {
      alert('Copied 3 prepared legal consultation questions to clipboard!');
    });
  } else {
    alert('Copied questions to clipboard!');
  }
}

function downloadNoticeTemplate() {
  alert('Downloading "Form_Legal_Notice_Section_2(47)_CPA.docx" template.');
}

function exportSummaryDraft() {
  window.print();
}

function printCaseBrief() {
  window.print();
}

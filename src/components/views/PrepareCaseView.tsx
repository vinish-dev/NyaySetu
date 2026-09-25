'use client';

import * as React from 'react';
import {
  PenTool,
  FolderOpen,
  Calendar,
  Link as LinkIcon,
  SearchCheck,
  FileCheck,
  Info,
  ArrowRight,
  ArrowLeft,
  UploadCloud,
  CheckCircle2,
  AlertCircle,
  Download,
  Plus,
  Sparkles,
  Loader2,
  FileText,
  RotateCcw
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';

interface PrepareCaseViewProps {
  onFinishWizard: () => void;
  onOpenUploadEvidence?: () => void;
  onOpenAddEvent?: () => void;
}

export function PrepareCaseView({
  onFinishWizard,
  onOpenAddEvent,
}: PrepareCaseViewProps) {
  const [currentStep, setCurrentStep] = React.useState(1);

  // Form State
  const [caseTitle, setCaseTitle] = React.useState('Defective Product – Refund Denied');
  const [category, setCategory] = React.useState('Consumer Dispute (Deficiency in Goods / Service)');
  const [opposingParty, setOpposingParty] = React.useState('ABC Store Pvt Ltd (abc.store@gmail.com)');
  const [incidentDate, setIncidentDate] = React.useState('2024-01-10');
  const [location, setLocation] = React.useState('Bangalore, Karnataka');
  const [narrative, setNarrative] = React.useState(
    "I purchased a smartphone from ABC Store on 10 Jan 2024 for ₹24,999. The package was delivered on 13 Jan 2024. Right after opening, the phone wouldn't turn on or charge. I promptly informed the store customer care on 14 Jan via WhatsApp and email. They promised an inspection within 48 hours, but on 21 Jan 2024, they flatly refused replacement stating opened items cannot be returned, violating their published return policy."
  );
  const [desiredResolution, setDesiredResolution] = React.useState(
    'Full refund of ₹24,999 plus reimbursement of courier and repair costs.'
  );
  const [relevantConsiderations, setRelevantConsiderations] = React.useState(
    'Disputes involving product defects and refund refusal commonly reference provisions under the Consumer Protection Act 2019 (such as deficiency in goods or unfair trade practices). Under Section 69, complaints are typically subject to a 2-year limitation window from the date the cause of action arose. Consult an advocate to determine applicable statutory grounds.'
  );

  // Evidence Items State
  const [evidenceList, setEvidenceList] = React.useState([
    { code: 'E01', title: 'Tax Invoice #29381', meta: 'PDF • 10 Jan 2024', verified: true },
    { code: 'E02', title: 'UPI Bank Confirmation', meta: 'PNG • 12 Jan 2024', verified: true },
    { code: 'E03', title: 'Product Defect Photo', meta: 'JPG • 13 Jan 2024', verified: true },
    { code: 'E04', title: 'WhatsApp Chat Log', meta: 'TXT • 14 Jan 2024', verified: true },
  ]);

  // Timeline Events State
  const [timelineEvents, setTimelineEvents] = React.useState([
    { date: '2024-01-10', title: 'Order placed on ABC Store online portal', evidence: 'E01 Linked' },
    { date: '2024-01-13', title: 'Package delivered; defect identified within 2 hours', evidence: 'E03 Linked' },
    { date: '2024-01-14', title: 'Customer service contacted via WhatsApp', evidence: 'E04 Linked' },
    { date: '2024-01-21', title: 'Seller refused refund citing unsealed box exclusion', evidence: 'E06 Linked' },
  ]);

  // Contentions State
  const [contentions, setContentions] = React.useState([
    {
      title: 'Contention 1: Defective Condition on Arrival',
      desc: 'Product delivered was dead on arrival and could not be powered on.',
      exhibits: ['✓ E01 Invoice', '✓ E03 Photo (Defect)', '✓ E08 Delivery Slip'],
    },
    {
      title: 'Contention 2: Denial of Published Return Terms',
      desc: 'Denying replacement despite 7-day replacement window advertised on the website.',
      exhibits: ['✓ E04 WhatsApp Chat', '✓ E06 Denial Letter', '✓ E07 Return Policy'],
    },
  ]);

  // Completeness State
  const [completenessScore, setCompletenessScore] = React.useState(82);
  const [checklist, setChecklist] = React.useState([
    { name: 'Incident details', status: 'complete' },
    { name: 'Timeline', status: 'complete' },
    { name: 'Payment proof', status: 'complete' },
    { name: 'Communication records', status: 'complete' },
    { name: 'Product serial/IMEI', status: 'missing' },
    { name: 'Warranty document', status: 'missing' },
  ]);

  // Loading States for GenAI
  const [isAiLoading, setIsAiLoading] = React.useState(false);
  const [aiLoadingMsg, setAiLoadingMsg] = React.useState('');

  const fileInputRef = React.useRef<HTMLInputElement | null>(null);

  const steps = [
    { num: 1, label: 'What Happened?', icon: PenTool },
    { num: 2, label: 'Add Evidence', icon: FolderOpen },
    { num: 3, label: 'Build Timeline', icon: Calendar },
    { num: 4, label: 'Connect Claims', icon: LinkIcon },
    { num: 5, label: 'Identify Gaps', icon: SearchCheck },
    { num: 6, label: 'Case Summary', icon: FileCheck },
  ];

  // STEP 1: Gemini Fact Extraction
  const handleExtractFactsWithGemini = async () => {
    if (!narrative.trim()) return;
    setIsAiLoading(true);
    setAiLoadingMsg('Extracting structured facts with Gemini...');

    try {
      const res = await fetch('/api/case-prep', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'extract-facts',
          payload: { narrative, category },
        }),
      });

      if (!res.ok) throw new Error('Failed to extract facts');
      const json = await res.json();
      const facts = json.data;

      if (facts.title) setCaseTitle(facts.title);
      if (facts.incidentDate) setIncidentDate(facts.incidentDate);
      if (facts.location) setLocation(facts.location);
      if (facts.involvedParty) setOpposingParty(facts.involvedParty);
      if (facts.desiredResolution) setDesiredResolution(facts.desiredResolution);
      if (facts.relevantConsiderations) setRelevantConsiderations(facts.relevantConsiderations);
    } catch (err: any) {
      console.error(err);
      alert('Could not extract facts automatically. You can proceed with manual entry.');
    } finally {
      setIsAiLoading(false);
      setAiLoadingMsg('');
    }
  };

  // STEP 2: Real Document Upload in Evidence Vault
  const handleUploadEvidenceFile = async (file: File) => {
    if (!file) return;
    setIsAiLoading(true);
    setAiLoadingMsg(`Analyzing ${file.name} with Gemini...`);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/analyze-document', {
        method: 'POST',
        body: formData,
      });

      const nextCode = `E0${evidenceList.length + 1}`;
      let title = file.name;
      let meta = `${(file.size / 1024).toFixed(0)} KB • Live Upload`;

      if (res.ok) {
        const json = await res.json();
        if (json.data?.title) title = json.data.title;
        if (json.data?.meta) meta = json.data.meta;
      }

      setEvidenceList((prev) => [
        ...prev,
        { code: nextCode, title, meta, verified: true },
      ]);
    } catch (err) {
      console.error(err);
      // Fallback add
      const nextCode = `E0${evidenceList.length + 1}`;
      setEvidenceList((prev) => [
        ...prev,
        { code: nextCode, title: file.name, meta: `${(file.size / 1024).toFixed(0)} KB`, verified: true },
      ]);
    } finally {
      setIsAiLoading(false);
      setAiLoadingMsg('');
    }
  };

  // STEP 3: Auto-Generate Timeline with AI
  const handleGenerateTimeline = async () => {
    setIsAiLoading(true);
    setAiLoadingMsg('Building chronological timeline with Gemini...');

    try {
      const res = await fetch('/api/case-prep', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'generate-timeline',
          payload: { narrative, evidence: evidenceList },
        }),
      });

      if (!res.ok) throw new Error('Failed to generate timeline');
      const json = await res.json();
      if (json.data?.events && json.data.events.length > 0) {
        setTimelineEvents(
          json.data.events.map((ev: any) => ({
            date: ev.date || 'Jan 2024',
            title: ev.title || 'Milestone',
            evidence: ev.linkedEvidence?.[0] ? `${ev.linkedEvidence[0]} Linked` : 'Verified',
          }))
        );
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsAiLoading(false);
      setAiLoadingMsg('');
    }
  };

  // STEP 4: AI Map Claims to Evidence
  const handleMapClaims = async () => {
    setIsAiLoading(true);
    setAiLoadingMsg('Linking documentary evidence to contentions...');

    try {
      const res = await fetch('/api/case-prep', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'map-claims',
          payload: { narrative, evidence: evidenceList },
        }),
      });

      if (!res.ok) throw new Error('Failed to map claims');
      const json = await res.json();
      if (json.data?.contentions && json.data.contentions.length > 0) {
        setContentions(
          json.data.contentions.map((c: any) => ({
            title: c.title,
            desc: c.description || c.statutoryReference,
            exhibits: (c.linkedEvidence || []).map((e: string) => `✓ ${e}`),
          }))
        );
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsAiLoading(false);
      setAiLoadingMsg('');
    }
  };

  // STEP 5: Audit Gaps with AI
  const handleAuditGaps = async () => {
    setIsAiLoading(true);
    setAiLoadingMsg('Auditing evidence completeness with Gemini...');

    try {
      const res = await fetch('/api/case-prep', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'detect-gaps',
          payload: { narrative, evidence: evidenceList },
        }),
      });

      if (!res.ok) throw new Error('Failed to audit gaps');
      const json = await res.json();
      if (json.data?.completionScore) setCompletenessScore(json.data.completionScore);
      if (json.data?.checklist) setChecklist(json.data.checklist);
    } catch (err) {
      console.error(err);
    } finally {
      setIsAiLoading(false);
      setAiLoadingMsg('');
    }
  };

  return (
    <div className="space-y-6">
      {/* Hidden File Input for Real Evidence Upload */}
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept=".pdf,.txt,.png,.jpg,.jpeg,.webp,application/pdf,text/plain,image/*"
        onChange={(e) => {
          if (e.target.files && e.target.files[0]) {
            handleUploadEvidenceFile(e.target.files[0]);
          }
        }}
      />

      {/* Wizard Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <span className="text-[10.5px] font-bold uppercase tracking-wider text-indigo-600">
            Case Preparation Engine
          </span>
          <h1 className="font-heading text-2xl font-extrabold tracking-tight text-slate-900">
            Guided Case Preparation Workflow
          </h1>
          <p className="text-xs text-slate-500 max-w-2xl">
            Step-by-step assistant powered by Gemini to assemble facts, organize exhibits, and compile a structured case preparation report.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentStep(1)}
            className="rounded-xl text-xs font-semibold"
          >
            Start Over
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => window.print()}
            className="rounded-xl text-xs font-semibold gap-1.5"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Export Summary</span>
          </Button>
        </div>
      </div>

      {/* Stepper Navigation Tabs */}
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
        {steps.map((s) => {
          const isCurrent = currentStep === s.num;
          const isCompleted = currentStep > s.num;
          return (
            <button
              key={s.num}
              onClick={() => setCurrentStep(s.num)}
              className={`flex flex-col items-center gap-1.5 rounded-2xl border p-3 text-center transition-all cursor-pointer ${
                isCurrent
                  ? 'border-indigo-600 bg-indigo-50/70 text-indigo-700 shadow-xs font-bold'
                  : isCompleted
                  ? 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                  : 'border-slate-200 bg-white text-slate-400 hover:text-slate-600'
              }`}
            >
              <div
                className={`flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-bold ${
                  isCurrent
                    ? 'bg-indigo-600 text-white'
                    : isCompleted
                    ? 'bg-emerald-500 text-white'
                    : 'bg-slate-100 text-slate-400'
                }`}
              >
                {isCompleted ? <CheckCircle2 className="h-3.5 w-3.5" /> : s.num}
              </div>
              <span className="text-[11px] truncate max-w-full font-semibold">
                {s.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* Wizard Body Card */}
      <Card className="p-6 md:p-8 relative overflow-hidden">
        {/* AI Loading Overlay */}
        {isAiLoading && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-white/80 backdrop-blur-xs p-6 text-center">
            <Loader2 className="h-8 w-8 animate-spin text-indigo-600 mb-2" />
            <p className="text-sm font-bold text-slate-800">{aiLoadingMsg}</p>
            <span className="text-xs text-slate-400">Processing structured data with Gemini 2.5...</span>
          </div>
        )}

        {/* STEP 1: WHAT HAPPENED? */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-100 pb-4">
              <div className="flex items-start gap-3">
                <div className="rounded-xl bg-indigo-50 p-2.5 text-indigo-600">
                  <PenTool className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="font-heading text-lg font-bold text-slate-900">
                    Step 1: What Happened?
                  </h2>
                  <p className="text-xs text-slate-500">
                    Provide the core facts in plain language. NyaySetu helps organize dates, parties, and transaction records.
                  </p>
                </div>
              </div>
              <Button
                variant="outlinePurple"
                size="sm"
                onClick={handleExtractFactsWithGemini}
                disabled={isAiLoading}
                className="rounded-xl text-xs font-semibold gap-1.5 shrink-0"
              >
                <Sparkles className="h-3.5 w-3.5" />
                <span>Auto-Extract with Gemini</span>
              </Button>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2 space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Case Title / Topic</label>
                <Input
                  value={caseTitle}
                  onChange={(e) => setCaseTitle(e.target.value)}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Dispute Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="h-9 w-full rounded-lg border border-slate-200 bg-white px-3 text-xs text-slate-800 focus:outline-indigo-500"
                >
                  <option>Consumer Dispute (Deficiency in Goods / Service)</option>
                  <option>Tenancy & Real Estate (RERA / Deposit)</option>
                  <option>Employment & Salary Delay</option>
                  <option>Commercial Contract Breach</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Opposing Party Name & Contact</label>
                <Input
                  value={opposingParty}
                  onChange={(e) => setOpposingParty(e.target.value)}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Primary Incident Date</label>
                <Input
                  type="date"
                  value={incidentDate}
                  onChange={(e) => setIncidentDate(e.target.value)}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Location / City of Transaction</label>
                <Input
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>

              <div className="sm:col-span-2 space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700">Incident Narrative (In your own words)</label>
                  <span className="text-[11px] text-slate-400">Gemini analyzes this text</span>
                </div>
                <textarea
                  rows={4}
                  value={narrative}
                  onChange={(e) => setNarrative(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 p-3 text-xs text-slate-800 focus:outline-indigo-500 font-sans"
                />
              </div>

              <div className="sm:col-span-2 space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Specific Resolution or Remedy Desired</label>
                <Input
                  value={desiredResolution}
                  onChange={(e) => setDesiredResolution(e.target.value)}
                />
              </div>
            </div>

            {/* Relevant information & considerations */}
            <div className="rounded-2xl border border-indigo-200 bg-indigo-50/50 p-4">
              <div className="flex items-center gap-2 text-xs font-bold text-indigo-700 pb-1">
                <Info className="h-4 w-4" />
                <span>Relevant information & considerations</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                {relevantConsiderations}
              </p>
            </div>

            <div className="flex justify-end pt-4 border-t border-slate-100">
              <Button
                variant="primary"
                onClick={() => setCurrentStep(2)}
                className="gap-1.5 rounded-xl text-xs font-semibold"
              >
                <span>Continue to Evidence</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {/* STEP 2: ADD RELEVANT DOCUMENTS / EVIDENCE */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <div className="flex items-start gap-3 border-b border-slate-100 pb-4">
              <div className="rounded-xl bg-indigo-50 p-2.5 text-indigo-600">
                <FolderOpen className="h-5 w-5" />
              </div>
              <div>
                <h2 className="font-heading text-lg font-bold text-slate-900">
                  Step 2: Add Relevant Documents & Evidence
                </h2>
                <p className="text-xs text-slate-500">
                  Upload real documents (PDF, TXT, Images). Gemini identifies the document type, extracts key details, and catalogs it.
                </p>
              </div>
            </div>

            <div
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                if (e.dataTransfer.files?.[0]) handleUploadEvidenceFile(e.dataTransfer.files[0]);
              }}
              className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50/50 p-8 text-center transition-colors hover:border-indigo-400 hover:bg-indigo-50/20 cursor-pointer"
            >
              <div className="rounded-2xl bg-indigo-50 p-3 text-indigo-600">
                <UploadCloud className="h-7 w-7" />
              </div>
              <h3 className="mt-3 text-sm font-bold text-slate-800">
                Drag and drop files here, or <span className="text-indigo-600 font-extrabold">browse files</span>
              </h3>
              <p className="mt-1 text-xs text-slate-400">
                Supports <strong>PDF</strong>, <strong>TXT</strong>, and <strong>Images</strong> (PNG, JPG, WEBP). Analyzed with Gemini.
              </p>
            </div>

            {/* Evidence Vault Items */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-700 block">Cataloged Exhibits ({evidenceList.length}):</span>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {evidenceList.map((item, idx) => (
                  <div key={idx} className="rounded-xl border border-slate-200 bg-white p-3 space-y-1">
                    <div className="flex items-center justify-between">
                      <Badge variant="purple" className="text-[10px]">{item.code}</Badge>
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                    </div>
                    <h4 className="text-xs font-bold text-slate-800 truncate">{item.title}</h4>
                    <p className="text-[10px] text-slate-400">{item.meta}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-between pt-4 border-t border-slate-100">
              <Button
                variant="outline"
                onClick={() => setCurrentStep(1)}
                className="gap-1.5 rounded-xl text-xs font-semibold"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back</span>
              </Button>
              <Button
                variant="primary"
                onClick={() => setCurrentStep(3)}
                className="gap-1.5 rounded-xl text-xs font-semibold"
              >
                <span>Continue to Timeline</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {/* STEP 3: BUILD TIMELINE */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-100 pb-4">
              <div className="flex items-start gap-3">
                <div className="rounded-xl bg-indigo-50 p-2.5 text-indigo-600">
                  <Calendar className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="font-heading text-lg font-bold text-slate-900">
                    Step 3: Build an Unbroken Chronological Timeline
                  </h2>
                  <p className="text-xs text-slate-500">
                    Chronological records demonstrate a continuous chain of events and prove timely notice.
                  </p>
                </div>
              </div>
              <Button
                variant="outlinePurple"
                size="sm"
                onClick={handleGenerateTimeline}
                disabled={isAiLoading}
                className="rounded-xl text-xs font-semibold gap-1.5 shrink-0"
              >
                <Sparkles className="h-3.5 w-3.5" />
                <span>Auto-Synthesize with Gemini</span>
              </Button>
            </div>

            <div className="space-y-3">
              {timelineEvents.map((ev, idx) => (
                <div key={idx} className="flex flex-col sm:flex-row items-center gap-3 rounded-xl border border-slate-200 bg-white p-3.5">
                  <span className="font-bold text-indigo-600 text-xs w-16">Event {idx + 1}</span>
                  <Input type="text" defaultValue={ev.date} className="w-full sm:w-40 font-mono text-xs" />
                  <Input defaultValue={ev.title} className="flex-1 text-xs" />
                  <Badge variant="success" className="text-[10px] shrink-0">{ev.evidence}</Badge>
                </div>
              ))}

              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setTimelineEvents((prev) => [
                    ...prev,
                    { date: '2024-01-25', title: 'Follow-up communication lodged', evidence: 'Pending' },
                  ])
                }
                className="w-full justify-center gap-1.5 rounded-xl text-xs font-semibold"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Add Additional Event</span>
              </Button>
            </div>

            <div className="flex justify-between pt-4 border-t border-slate-100">
              <Button
                variant="outline"
                onClick={() => setCurrentStep(2)}
                className="gap-1.5 rounded-xl text-xs font-semibold"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back</span>
              </Button>
              <Button
                variant="primary"
                onClick={() => setCurrentStep(4)}
                className="gap-1.5 rounded-xl text-xs font-semibold"
              >
                <span>Connect Claims</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {/* STEP 4: CONNECT EVIDENCE TO EVENTS & CLAIMS */}
        {currentStep === 4 && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-100 pb-4">
              <div className="flex items-start gap-3">
                <div className="rounded-xl bg-indigo-50 p-2.5 text-indigo-600">
                  <LinkIcon className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="font-heading text-lg font-bold text-slate-900">
                    Step 4: Connect Evidence to Events & Potential Claims
                  </h2>
                  <p className="text-xs text-slate-500">
                    Tie documentary proof directly to each factual grievance so your advocate or forum has clean exhibit indexing.
                  </p>
                </div>
              </div>
              <Button
                variant="outlinePurple"
                size="sm"
                onClick={handleMapClaims}
                disabled={isAiLoading}
                className="rounded-xl text-xs font-semibold gap-1.5 shrink-0"
              >
                <Sparkles className="h-3.5 w-3.5" />
                <span>AI Map Exhibits to Claims</span>
              </Button>
            </div>

            <div className="space-y-4">
              {contentions.map((c, idx) => (
                <div key={idx} className="rounded-2xl border border-slate-200 bg-white p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="font-heading text-sm font-bold text-slate-900">
                      {c.title}
                    </h3>
                    <Badge variant="success">Evidence Linked</Badge>
                  </div>
                  <p className="text-xs text-slate-500">{c.desc}</p>
                  <div className="flex flex-wrap gap-2 pt-2">
                    {c.exhibits.map((ex, eIdx) => (
                      <span key={eIdx} className="rounded-lg bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                        {ex}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-between pt-4 border-t border-slate-100">
              <Button
                variant="outline"
                onClick={() => setCurrentStep(3)}
                className="gap-1.5 rounded-xl text-xs font-semibold"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back</span>
              </Button>
              <Button
                variant="primary"
                onClick={() => setCurrentStep(5)}
                className="gap-1.5 rounded-xl text-xs font-semibold"
              >
                <span>Identify Gaps</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {/* STEP 5: IDENTIFY MISSING INFORMATION */}
        {currentStep === 5 && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-100 pb-4">
              <div className="flex items-start gap-3">
                <div className="rounded-xl bg-indigo-50 p-2.5 text-indigo-600">
                  <SearchCheck className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="font-heading text-lg font-bold text-slate-900">
                    Step 5: Identify Missing Information & Evidence Gaps
                  </h2>
                  <p className="text-xs text-slate-500">
                    Gemini audits your narrative against uploaded exhibits to uncover missing pieces before you consult an advocate.
                  </p>
                </div>
              </div>
              <Button
                variant="outlinePurple"
                size="sm"
                onClick={handleAuditGaps}
                disabled={isAiLoading}
                className="rounded-xl text-xs font-semibold gap-1.5 shrink-0"
              >
                <Sparkles className="h-3.5 w-3.5" />
                <span>Audit Completeness with Gemini</span>
              </Button>
            </div>

            {/* Completion Metric */}
            <div className="flex items-center justify-between rounded-xl bg-slate-50 p-4 border border-slate-200">
              <div>
                <span className="text-[10px] font-bold uppercase text-slate-400">Documentation Completeness</span>
                <h3 className="font-heading text-base font-extrabold text-slate-900">{completenessScore}% Complete</h3>
              </div>
              <span className="text-xs text-slate-500 italic">Documentation completion metric, not a prediction of legal outcome.</span>
            </div>

            <div className="space-y-3">
              <div className="flex items-start gap-3 rounded-2xl border border-rose-200 bg-rose-50/20 p-4">
                <AlertCircle className="h-5 w-5 text-rose-500 shrink-0 mt-0.5" />
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold text-slate-900">
                      Product Serial Number / IMEI Photo
                    </h3>
                    <Badge variant="destructive">Pending</Badge>
                  </div>
                  <p className="text-xs text-slate-600">
                    Links the defective unit shown in photo E03 directly to the item described on tax invoice E01.
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                    className="mt-2 text-xs rounded-xl"
                  >
                    Upload Photo Now
                  </Button>
                </div>
              </div>

              <div className="flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50/20 p-4">
                <AlertCircle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold text-slate-900">
                      Manufacturer Warranty Card
                    </h3>
                    <Badge variant="warning">Recommended</Badge>
                  </div>
                  <p className="text-xs text-slate-600">
                    Having the stamped warranty leaflet eliminates questions regarding dealer servicing authorization.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-between pt-4 border-t border-slate-100">
              <Button
                variant="outline"
                onClick={() => setCurrentStep(4)}
                className="gap-1.5 rounded-xl text-xs font-semibold"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back</span>
              </Button>
              <Button
                variant="primary"
                onClick={() => setCurrentStep(6)}
                className="gap-1.5 rounded-xl text-xs font-semibold"
              >
                <span>Generate Summary</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {/* STEP 6: STRUCTURED CASE SUMMARY / CASE PREPARATION REPORT */}
        {currentStep === 6 && (
          <div className="space-y-6">
            <div className="flex items-start gap-3 border-b border-slate-100 pb-4">
              <div className="rounded-xl bg-indigo-50 p-2.5 text-indigo-600">
                <FileCheck className="h-5 w-5" />
              </div>
              <div>
                <h2 className="font-heading text-lg font-bold text-slate-900">
                  Step 6: Structured Case Summary
                </h2>
                <p className="text-xs text-slate-500">
                  Your Case Preparation Report has been synthesized from your inputs and Gemini analysis.
                </p>
              </div>
            </div>

            {/* Case Preparation Report Box */}
            <div className="rounded-2xl border-2 border-slate-800 bg-white p-6 shadow-sm font-serif space-y-5">
              <div className="border-b border-slate-800 pb-3 flex justify-between items-start font-sans">
                <div>
                  <h3 className="font-bold text-sm text-slate-900 uppercase tracking-wider">
                    Structured Case Preparation Report
                  </h3>
                  <span className="text-[11px] text-slate-500">
                    Prepared for Advocate Consultation / Personal Reference • NyaySetu Preparation Docket
                  </span>
                </div>
                <Badge variant="purple" className="text-[10px]">Ref: NS-2024-0456</Badge>
              </div>

              <div className="space-y-1">
                <h4 className="font-sans text-xs font-bold text-slate-800 uppercase tracking-wide">
                  I. Parties to Dispute
                </h4>
                <p className="text-xs text-slate-700">
                  <strong>Complainant:</strong> Ananya Sharma, {location}.<br />
                  <strong>Opposite Party:</strong> {opposingParty}.
                </p>
              </div>

              <div className="space-y-1">
                <h4 className="font-sans text-xs font-bold text-slate-800 uppercase tracking-wide">
                  II. Chronological Statement of Facts
                </h4>
                <ol className="list-decimal pl-5 text-xs text-slate-700 space-y-1">
                  {timelineEvents.map((ev, idx) => (
                    <li key={idx}>On {ev.date}, {ev.title}.</li>
                  ))}
                </ol>
              </div>

              <div className="space-y-1">
                <h4 className="font-sans text-xs font-bold text-slate-800 uppercase tracking-wide">
                  III. Desired Remedy / Relief
                </h4>
                <p className="text-xs text-slate-700">
                  {desiredResolution}
                </p>
              </div>

              <div className="space-y-1 font-sans">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                  IV. Exhibit Index
                </h4>
                <div className="flex flex-wrap gap-1.5 pt-1 text-[11px]">
                  {evidenceList.map((e, idx) => (
                    <span key={idx} className="rounded bg-slate-100 px-2 py-0.5 border border-slate-200">
                      {e.code}: {e.title}
                    </span>
                  ))}
                </div>
              </div>

              {/* Disclaimer at bottom of brief */}
              <div className="pt-3 border-t border-slate-200 text-[10.5px] italic text-slate-400 font-sans">
                Notice: This Structured Case Summary is organized for factual clarity and personal preparation. It does not constitute formal legal counsel or a finalized court pleading.
              </div>
            </div>

            <div className="flex justify-between pt-4 border-t border-slate-100">
              <Button
                variant="outline"
                onClick={() => setCurrentStep(5)}
                className="gap-1.5 rounded-xl text-xs font-semibold"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back</span>
              </Button>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  onClick={() => window.print()}
                  className="gap-1.5 rounded-xl text-xs font-semibold"
                >
                  <Download className="h-3.5 w-3.5" />
                  <span>Print Case Report</span>
                </Button>
                <Button
                  variant="primary"
                  onClick={onFinishWizard}
                  className="rounded-xl text-xs font-semibold"
                >
                  Save & Go to My Cases
                </Button>
              </div>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}

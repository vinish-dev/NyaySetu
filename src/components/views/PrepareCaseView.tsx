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
  FileText
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { CaseDetail, EvidenceItem, ReadinessCheckItem, TimelineEvent, ContentionItem } from '@/data/mockData';

interface PrepareCaseViewProps {
  onFinishWizard: (savedCase: CaseDetail) => void;
  activeCase?: CaseDetail | null;
  onOpenUploadEvidence?: () => void;
  onOpenAddEvent?: () => void;
}

export function PrepareCaseView({
  onFinishWizard,
  activeCase,
}: PrepareCaseViewProps) {
  const [currentStep, setCurrentStep] = React.useState(1);

  // Form State (Dynamic, starts with activeCase values or clean blanks)
  const [caseTitle, setCaseTitle] = React.useState(activeCase?.title || '');
  const [category, setCategory] = React.useState(activeCase?.category || 'Consumer Dispute (Deficiency in Goods / Service)');
  const [opposingParty, setOpposingParty] = React.useState(activeCase?.summary.involvedParty || '');
  const [incidentDate, setIncidentDate] = React.useState(activeCase?.summary.incidentDate || '');
  const [location, setLocation] = React.useState(activeCase?.summary.location || '');
  const [narrative, setNarrative] = React.useState(activeCase?.summary.narrative || '');
  const [desiredResolution, setDesiredResolution] = React.useState(activeCase?.summary.desiredResolution || '');
  const [relevantConsiderations, setRelevantConsiderations] = React.useState(
    'Disputes involving consumer transactions, tenancy deposits, or employment claims are governed by statutory limitation windows. Enter your narrative above and click "Auto-Extract with Gemini" to generate considerations.'
  );

  // Evidence Items State
  const [evidenceList, setEvidenceList] = React.useState<EvidenceItem[]>(activeCase?.evidence || []);

  // Timeline Events State
  const [timelineEvents, setTimelineEvents] = React.useState<TimelineEvent[]>(activeCase?.timeline || []);

  // Contentions State
  const [contentions, setContentions] = React.useState<ContentionItem[]>(
    activeCase?.claims.map(c => ({
      title: c.title,
      desc: c.description,
      exhibits: c.linkedEvidence,
    })) || []
  );

  // Completeness State
  const [completenessScore, setCompletenessScore] = React.useState(activeCase?.completionScore || 20);
  const [checklist, setChecklist] = React.useState<ReadinessCheckItem[]>(
    activeCase?.readinessChecklist || [
      { name: 'Incident details', status: 'missing' },
      { name: 'Timeline', status: 'missing' },
      { name: 'Payment proof', status: 'missing' },
      { name: 'Communication records', status: 'missing' },
      { name: 'Product serial/IMEI', status: 'missing' },
      { name: 'Warranty document', status: 'missing' },
    ]
  );

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
    if (!narrative.trim()) {
      alert('Please describe what happened in the narrative box first.');
      return;
    }
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
      let fileMeta = `${(file.size / 1024).toFixed(0)} KB • Uploaded File`;
      let summary = 'Document uploaded into Evidence Vault.';

      if (res.ok) {
        const json = await res.json();
        if (json.data?.title) title = json.data.title;
        if (json.data?.meta) fileMeta = json.data.meta;
        if (json.data?.simplifiedExplanation) summary = json.data.simplifiedExplanation;
      }

      const newEv: EvidenceItem = {
        id: `ev-${Date.now()}`,
        code: nextCode,
        title,
        date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
        type: file.type.startsWith('image/') ? 'Image' : 'Document',
        fileMeta,
        verified: true,
        summary,
        verificationProof: 'Uploaded and analyzed with Gemini.',
      };

      setEvidenceList((prev) => [...prev, newEv]);
    } catch (err) {
      console.error(err);
      const nextCode = `E0${evidenceList.length + 1}`;
      const newEv: EvidenceItem = {
        id: `ev-${Date.now()}`,
        code: nextCode,
        title: file.name,
        date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
        type: 'Document',
        fileMeta: `${(file.size / 1024).toFixed(0)} KB`,
        verified: true,
        summary: 'Uploaded exhibit.',
        verificationProof: 'Stored in local vault.',
      };
      setEvidenceList((prev) => [...prev, newEv]);
    } finally {
      setIsAiLoading(false);
      setAiLoadingMsg('');
    }
  };

  // STEP 3: Auto-Generate Timeline with AI
  const handleGenerateTimeline = async () => {
    if (!narrative.trim()) {
      alert('Please enter your narrative in Step 1 first.');
      return;
    }
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
          json.data.events.map((ev: any, idx: number) => ({
            id: `ev-${Date.now()}-${idx}`,
            date: ev.date || 'Incident Date',
            title: ev.title || 'Milestone',
            description: ev.description || 'Milestone event in dispute history.',
            iconType: ev.iconType || 'chat',
            linkedEvidence: Array.isArray(ev.linkedEvidence) ? ev.linkedEvidence : [],
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
    if (!narrative.trim()) {
      alert('Please enter your narrative in Step 1 first.');
      return;
    }
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
      if (json.data?.checklist) {
        setChecklist(
          json.data.checklist.map((c: any) => ({
            name: c.name,
            status: c.status === 'complete' ? 'complete' : 'missing',
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

  const handleSaveCase = () => {
    const compiledCase: CaseDetail = {
      id: activeCase?.id || `case-${Date.now()}`,
      caseId: activeCase?.caseId || `NS-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      title: caseTitle || 'Untitled Case Matter',
      createdDate: activeCase?.createdDate || new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
      category,
      status: 'In Preparation',
      completionScore: completenessScore,
      completionLabel: `${completenessScore}% complete`,
      completionNote: 'Case files assembled. Review potential filing channels or consult counsel.',
      readinessChecklist: checklist,
      summary: {
        narrative,
        incidentDate,
        location,
        involvedParty: opposingParty,
        involvedPartyContact: '',
        desiredResolution,
      },
      timeline: timelineEvents.map((te, idx) => ({
        id: te.id || `t-${idx}`,
        date: te.date,
        title: te.title,
        description: te.description || te.title,
        iconType: te.iconType || (idx === 0 ? 'cart' : idx === timelineEvents.length - 1 ? 'danger' : 'chat'),
        linkedEvidence: Array.isArray(te.linkedEvidence) ? te.linkedEvidence : [],
      })),
      evidence: evidenceList,
      claims: contentions.map((c, idx) => ({
        id: `c-${idx}`,
        title: c.title,
        statute: 'Applicable Statutory Framework',
        description: c.desc,
        linkedEvidence: c.exhibits,
        substantiated: true,
      })),
      missingItems: [
        {
          title: 'Additional Corroborating Records',
          description: 'Upload any remaining receipts or email communications.',
          severity: 'warning',
        },
      ],
      claimsCovered: contentions.map((c) => c.title),
      potentialFilingChannels: {
        name: 'Appropriate District Commission or Regulatory Authority',
        jurisdiction: location || 'District of Complainant Residence',
        reason: 'Based on the entered transaction details.',
        disclaimer: 'Informational only. NyaySetu does not provide legal representation or formal jurisdiction determinations.',
        portalName: 'Filing Portal',
        portalUrl: 'https://edaakhil.nic.in',
      },
      nextSteps: [
        {
          title: 'Review Structured Case Preparation Report',
          subtitle: 'Export indexed fact sheet with exhibit coversheets',
          actionType: 'export',
        },
        {
          title: 'Explore potential filing channels',
          subtitle: 'Review e-filing guidelines or consult an advocate',
          actionType: 'file',
        },
      ],
    };

    onFinishWizard(compiledCase);
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
                    Describe your dispute below in your own words, then click Auto-Extract to let Gemini structure the key details.
                  </p>
                </div>
              </div>
              <Button
                variant="outlinePurple"
                size="sm"
                onClick={handleExtractFactsWithGemini}
                disabled={isAiLoading || !narrative.trim()}
                className="rounded-xl text-xs font-semibold gap-1.5 shrink-0"
              >
                <Sparkles className="h-3.5 w-3.5" />
                <span>Auto-Extract with Gemini</span>
              </Button>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2 space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700">Incident Narrative (Describe what took place)</label>
                  <span className="text-[11px] text-slate-400">Type your story here</span>
                </div>
                <textarea
                  rows={4}
                  value={narrative}
                  onChange={(e) => setNarrative(e.target.value)}
                  placeholder="e.g., I ordered a refrigerator online on 15 Feb from XYZ Electronics. When delivered, the cooling compressor was completely non-functional. I contacted customer service on 16 Feb demanding replacement, but they refused stating that unboxed appliances cannot be returned..."
                  className="w-full rounded-lg border border-slate-200 p-3 text-xs text-slate-800 focus:outline-indigo-500 font-sans"
                />
              </div>

              <div className="sm:col-span-2 space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Case Matter Title</label>
                <Input
                  value={caseTitle}
                  onChange={(e) => setCaseTitle(e.target.value)}
                  placeholder="e.g., Defective Refrigerator – Replacement Denied"
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
                  placeholder="e.g., XYZ Electronics Pvt Ltd (support@xyzelec.in)"
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
                  placeholder="e.g., Mumbai, Maharashtra"
                />
              </div>

              <div className="sm:col-span-2 space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Specific Resolution or Remedy Desired</label>
                <Input
                  value={desiredResolution}
                  onChange={(e) => setDesiredResolution(e.target.value)}
                  placeholder="e.g., Full refund of purchase price plus reimbursement of delivery fee"
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
              {evidenceList.length === 0 ? (
                <p className="text-xs text-slate-400 italic p-4 text-center rounded-xl bg-slate-50 border border-slate-100">
                  No exhibits added yet. Upload receipts, invoices, or screenshots above.
                </p>
              ) : (
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {evidenceList.map((item, idx) => (
                    <div key={idx} className="rounded-xl border border-slate-200 bg-white p-3 space-y-1">
                      <div className="flex items-center justify-between">
                        <Badge variant="purple" className="text-[10px]">{item.code}</Badge>
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                      </div>
                      <h4 className="text-xs font-bold text-slate-800 truncate">{item.title}</h4>
                      <p className="text-[10px] text-slate-400">{item.fileMeta}</p>
                    </div>
                  ))}
                </div>
              )}
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
              {timelineEvents.length === 0 ? (
                <div className="text-center p-8 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                  <p className="text-xs text-slate-500">No milestones recorded yet.</p>
                  <Button
                    variant="outlinePurple"
                    size="sm"
                    onClick={handleGenerateTimeline}
                    className="text-xs rounded-xl gap-1.5"
                  >
                    <Sparkles className="h-3.5 w-3.5" />
                    <span>Generate Timeline from Narrative with Gemini</span>
                  </Button>
                </div>
              ) : (
                timelineEvents.map((ev, idx) => (
                  <div key={idx} className="flex flex-col sm:flex-row items-center gap-3 rounded-xl border border-slate-200 bg-white p-3.5">
                    <span className="font-bold text-indigo-600 text-xs w-16">Event {idx + 1}</span>
                    <Input type="text" defaultValue={ev.date} className="w-full sm:w-40 font-mono text-xs" />
                    <Input defaultValue={ev.title} className="flex-1 text-xs" />
                    <Badge variant="success" className="text-[10px] shrink-0">
                      {ev.linkedEvidence?.[0] ? `${ev.linkedEvidence[0]} Linked` : 'Recorded'}
                    </Badge>
                  </div>
                ))
              )}

              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setTimelineEvents((prev) => [
                    ...prev,
                    {
                      id: `ev-${Date.now()}`,
                      date: new Date().toLocaleDateString('en-GB'),
                      title: 'New milestone event',
                      description: 'Milestone logged in case preparation timeline.',
                      iconType: 'chat',
                      linkedEvidence: [],
                    },
                  ])
                }
                className="w-full justify-center gap-1.5 rounded-xl text-xs font-semibold"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Add Milestone Manually</span>
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
              {contentions.length === 0 ? (
                <div className="text-center p-8 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                  <p className="text-xs text-slate-500">No contentions mapped yet.</p>
                  <Button
                    variant="outlinePurple"
                    size="sm"
                    onClick={handleMapClaims}
                    className="text-xs rounded-xl gap-1.5"
                  >
                    <Sparkles className="h-3.5 w-3.5" />
                    <span>Auto-Map Contentions with Gemini</span>
                  </Button>
                </div>
              ) : (
                contentions.map((c, idx) => (
                  <div key={idx} className="rounded-2xl border border-slate-200 bg-white p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="font-heading text-sm font-bold text-slate-900">
                        {c.title}
                      </h3>
                      <Badge variant="success">Evidence Linked</Badge>
                    </div>
                    <p className="text-xs text-slate-500">{c.desc}</p>
                    <div className="flex flex-wrap gap-2 pt-2">
                      {c.exhibits.map((ex: string, eIdx: number) => (
                        <span key={eIdx} className="rounded-lg bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                          {ex}
                        </span>
                      ))}
                    </div>
                  </div>
                ))
              )}
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

            {/* Checklist */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-700 block">Checklist Items:</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {checklist.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between p-2.5 rounded-xl border border-slate-100 bg-white">
                    <span className="text-xs text-slate-700 font-medium">{item.name}</span>
                    <Badge variant={item.status === 'complete' ? 'success' : 'warning'} className="text-[10px]">
                      {item.status === 'complete' ? 'Complete' : 'Missing'}
                    </Badge>
                  </div>
                ))}
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
                <Badge variant="purple" className="text-[10px]">Case ID: {activeCase?.caseId || 'NS-2024'}</Badge>
              </div>

              <div className="space-y-1">
                <h4 className="font-sans text-xs font-bold text-slate-800 uppercase tracking-wide">
                  I. Parties to Dispute
                </h4>
                <p className="text-xs text-slate-700">
                  <strong>Complainant:</strong> Ananya Sharma, {location || 'Resident'}.<br />
                  <strong>Opposite Party:</strong> {opposingParty || 'Opposing Party'}.
                </p>
              </div>

              <div className="space-y-1">
                <h4 className="font-sans text-xs font-bold text-slate-800 uppercase tracking-wide">
                  II. Chronological Statement of Facts
                </h4>
                {timelineEvents.length === 0 ? (
                  <p className="text-xs text-slate-500 italic">No timeline events compiled yet.</p>
                ) : (
                  <ol className="list-decimal pl-5 text-xs text-slate-700 space-y-1">
                    {timelineEvents.map((ev, idx) => (
                      <li key={idx}>On {ev.date}, {ev.title}.</li>
                    ))}
                  </ol>
                )}
              </div>

              <div className="space-y-1">
                <h4 className="font-sans text-xs font-bold text-slate-800 uppercase tracking-wide">
                  III. Desired Remedy / Relief
                </h4>
                <p className="text-xs text-slate-700">
                  {desiredResolution || 'Remedy pending specification.'}
                </p>
              </div>

              <div className="space-y-1 font-sans">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                  IV. Exhibit Index
                </h4>
                {evidenceList.length === 0 ? (
                  <p className="text-xs text-slate-400 italic">No exhibits attached yet.</p>
                ) : (
                  <div className="flex flex-wrap gap-1.5 pt-1 text-[11px]">
                    {evidenceList.map((e, idx) => (
                      <span key={idx} className="rounded bg-slate-100 px-2 py-0.5 border border-slate-200">
                        {e.code}: {e.title}
                      </span>
                    ))}
                  </div>
                )}
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
                  onClick={handleSaveCase}
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

'use client';

import * as React from 'react';
import {
  PenTool,
  FolderOpen,
  Calendar,
  Link as LinkIcon,
  SearchCheck,
  FileCheck,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  UploadCloud,
  CheckCircle2,
  AlertCircle,
  Download,
  Plus
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';

interface PrepareCaseViewProps {
  onFinishWizard: () => void;
  onOpenUploadEvidence: () => void;
  onOpenAddEvent: () => void;
}

export function PrepareCaseView({
  onFinishWizard,
  onOpenUploadEvidence,
  onOpenAddEvent,
}: PrepareCaseViewProps) {
  const [currentStep, setCurrentStep] = React.useState(1);

  const steps = [
    { num: 1, label: 'What Happened?', icon: PenTool },
    { num: 2, label: 'Add Evidence', icon: FolderOpen },
    { num: 3, label: 'Build Timeline', icon: Calendar },
    { num: 4, label: 'Connect Claims', icon: LinkIcon },
    { num: 5, label: 'Identify Gaps', icon: SearchCheck },
    { num: 6, label: 'Case Summary', icon: FileCheck },
  ];

  return (
    <div className="space-y-6">
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
            Step-by-step assistant to assemble facts, organize exhibits, and generate a structured legal dossier.
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
            <span>Export Brief</span>
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
      <Card className="p-6 md:p-8">
        {/* STEP 1: WHAT HAPPENED? */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <div className="flex items-start gap-3 border-b border-slate-100 pb-4">
              <div className="rounded-xl bg-indigo-50 p-2.5 text-indigo-600">
                <PenTool className="h-5 w-5" />
              </div>
              <div>
                <h2 className="font-heading text-lg font-bold text-slate-900">
                  Step 1: What Happened?
                </h2>
                <p className="text-xs text-slate-500">
                  Provide the core facts in plain language. NyaySetu extracts relevant dates, parties, and causes of action.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2 space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Case Title / Topic</label>
                <Input defaultValue="Defective Product – Refund Denied" />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Dispute Category</label>
                <select className="h-9 w-full rounded-lg border border-slate-200 bg-white px-3 text-xs text-slate-800">
                  <option>Consumer Dispute (Deficiency in Goods / Service)</option>
                  <option>Tenancy & Real Estate (RERA / Deposit)</option>
                  <option>Employment & Salary Delay</option>
                  <option>Commercial Contract Breach</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Opposing Party Name & Contact</label>
                <Input defaultValue="ABC Store Pvt Ltd (abc.store@gmail.com)" />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Primary Incident Date</label>
                <Input type="date" defaultValue="2024-01-10" />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Location / City of Transaction</label>
                <Input defaultValue="Bangalore, Karnataka" />
              </div>

              <div className="sm:col-span-2 space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Incident Narrative (In your own words)</label>
                <textarea
                  rows={4}
                  defaultValue="I purchased a smartphone from ABC Store on 10 Jan 2024 for ₹24,999. The package was delivered on 13 Jan 2024. Right after opening, the phone wouldn't turn on or charge. I promptly informed the store customer care on 14 Jan via WhatsApp and email. They promised an inspection within 48 hours, but on 21 Jan 2024, they flatly refused replacement stating opened items cannot be returned, violating their published return policy."
                  className="w-full rounded-lg border border-slate-200 p-3 text-xs text-slate-800 focus:outline-indigo-500"
                />
              </div>

              <div className="sm:col-span-2 space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Specific Resolution or Remedy Desired</label>
                <Input defaultValue="Full refund of ₹24,999 plus ₹5,000 compensation for mental harassment." />
              </div>
            </div>

            {/* AI Assistant Assessment Box */}
            <div className="rounded-2xl border border-indigo-200 bg-indigo-50/50 p-4">
              <div className="flex items-center gap-2 text-xs font-bold text-indigo-700 pb-1">
                <Sparkles className="h-4 w-4" />
                <span>Extracted Legal Qualification</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Appears actionable under <strong>Consumer Protection Act 2019</strong> (Deficiency of Goods under Section 2(47), Unfair Trade Practice under Section 2(47)(viii)). The limitation period is <strong>2 years</strong> from the date of refusal (expires Jan 2026).
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
                  In formal proceedings, assertions without documentary proof are dismissed. Upload your invoices, receipts, and chats.
                </p>
              </div>
            </div>

            <div
              onClick={onOpenUploadEvidence}
              className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50/50 p-8 text-center transition-colors hover:border-indigo-400 hover:bg-indigo-50/20 cursor-pointer"
            >
              <div className="rounded-2xl bg-indigo-50 p-3 text-indigo-600">
                <UploadCloud className="h-7 w-7" />
              </div>
              <h3 className="mt-3 text-sm font-bold text-slate-800">
                Drag and drop files here, or <span className="text-indigo-600 font-extrabold">browse files</span>
              </h3>
              <p className="mt-1 text-xs text-slate-400">
                Supports PDF, JPG, PNG, TXT, EML up to 50MB. Cryptographically encrypted.
              </p>
            </div>

            {/* Existing Vault Items */}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <div className="rounded-xl border border-slate-200 bg-white p-3 space-y-1">
                <Badge variant="purple" className="text-[10px]">E01</Badge>
                <h4 className="text-xs font-bold text-slate-800 truncate">Tax Invoice #29381</h4>
                <p className="text-[10px] text-slate-400">PDF • 10 Jan 2024</p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-white p-3 space-y-1">
                <Badge variant="purple" className="text-[10px]">E02</Badge>
                <h4 className="text-xs font-bold text-slate-800 truncate">UPI Bank Confirmation</h4>
                <p className="text-[10px] text-slate-400">PNG • 12 Jan 2024</p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-white p-3 space-y-1">
                <Badge variant="purple" className="text-[10px]">E03</Badge>
                <h4 className="text-xs font-bold text-slate-800 truncate">Product Defect Photo</h4>
                <p className="text-[10px] text-slate-400">JPG • 13 Jan 2024</p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-white p-3 space-y-1">
                <Badge variant="purple" className="text-[10px]">E04</Badge>
                <h4 className="text-xs font-bold text-slate-800 truncate">WhatsApp Chat Log</h4>
                <p className="text-[10px] text-slate-400">TXT • 14 Jan 2024</p>
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
            <div className="flex items-start gap-3 border-b border-slate-100 pb-4">
              <div className="rounded-xl bg-indigo-50 p-2.5 text-indigo-600">
                <Calendar className="h-5 w-5" />
              </div>
              <div>
                <h2 className="font-heading text-lg font-bold text-slate-900">
                  Step 3: Build an Unbroken Chronological Timeline
                </h2>
                <p className="text-xs text-slate-500">
                  A coherent timeline establishes clear cause and effect and disproves claims of delayed communication.
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex flex-col sm:flex-row items-center gap-3 rounded-xl border border-slate-200 bg-white p-3.5">
                <span className="font-bold text-indigo-600 text-xs w-16">Event 1</span>
                <Input type="date" defaultValue="2024-01-10" className="w-full sm:w-40" />
                <Input defaultValue="Order placed on ABC Store online portal" className="flex-1" />
                <Badge variant="success" className="text-[10px]">E01 Linked</Badge>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-3 rounded-xl border border-slate-200 bg-white p-3.5">
                <span className="font-bold text-indigo-600 text-xs w-16">Event 2</span>
                <Input type="date" defaultValue="2024-01-13" className="w-full sm:w-40" />
                <Input defaultValue="Package delivered; defect identified within 2 hours" className="flex-1" />
                <Badge variant="success" className="text-[10px]">E03 Linked</Badge>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-3 rounded-xl border border-slate-200 bg-white p-3.5">
                <span className="font-bold text-indigo-600 text-xs w-16">Event 3</span>
                <Input type="date" defaultValue="2024-01-14" className="w-full sm:w-40" />
                <Input defaultValue="Customer service contacted via WhatsApp" className="flex-1" />
                <Badge variant="success" className="text-[10px]">E04 Linked</Badge>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-3 rounded-xl border border-slate-200 bg-white p-3.5">
                <span className="font-bold text-indigo-600 text-xs w-16">Event 4</span>
                <Input type="date" defaultValue="2024-01-21" className="w-full sm:w-40" />
                <Input defaultValue="Seller refused refund citing unsealed box exclusion" className="flex-1" />
                <Badge variant="success" className="text-[10px]">E06 Linked</Badge>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={onOpenAddEvent}
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
            <div className="flex items-start gap-3 border-b border-slate-100 pb-4">
              <div className="rounded-xl bg-indigo-50 p-2.5 text-indigo-600">
                <LinkIcon className="h-5 w-5" />
              </div>
              <div>
                <h2 className="font-heading text-lg font-bold text-slate-900">
                  Step 4: Connect Evidence to Events & Legal Claims
                </h2>
                <p className="text-xs text-slate-500">
                  Every legal contention requires concrete exhibits to avoid dismissal as unsupported assertions.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="rounded-2xl border border-slate-200 bg-white p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="font-heading text-sm font-bold text-slate-900">
                    Contention 1: Deficiency in Goods (Section 2(47))
                  </h3>
                  <Badge variant="success">Evidence Linked</Badge>
                </div>
                <p className="text-xs text-slate-500">
                  Product delivered was dead on arrival and failed fitness of purpose.
                </p>
                <div className="flex flex-wrap gap-2 pt-2">
                  <span className="rounded-lg bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                    ✓ E01 Invoice
                  </span>
                  <span className="rounded-lg bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                    ✓ E03 Photo (Defect)
                  </span>
                  <span className="rounded-lg bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                    ✓ E08 Delivery Slip
                  </span>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="font-heading text-sm font-bold text-slate-900">
                    Contention 2: Unfair Trade Practice (Section 2(47)(viii))
                  </h3>
                  <Badge variant="success">Evidence Linked</Badge>
                </div>
                <p className="text-xs text-slate-500">
                  Arbitrarily denying 7-day replacement promise published on sales website.
                </p>
                <div className="flex flex-wrap gap-2 pt-2">
                  <span className="rounded-lg bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                    ✓ E04 WhatsApp Chat
                  </span>
                  <span className="rounded-lg bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                    ✓ E06 Denial Letter
                  </span>
                  <span className="rounded-lg bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                    ✓ E07 Return Policy
                  </span>
                </div>
              </div>
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
            <div className="flex items-start gap-3 border-b border-slate-100 pb-4">
              <div className="rounded-xl bg-indigo-50 p-2.5 text-indigo-600">
                <SearchCheck className="h-5 w-5" />
              </div>
              <div>
                <h2 className="font-heading text-lg font-bold text-slate-900">
                  Step 5: Identify Missing Information & Evidence Gaps
                </h2>
                <p className="text-xs text-slate-500">
                  Anticipate the opposite party's defense objections before you submit your formal grievance.
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-start gap-3 rounded-2xl border border-rose-200 bg-rose-50/20 p-4">
                <AlertCircle className="h-5 w-5 text-rose-500 shrink-0 mt-0.5" />
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold text-slate-900">
                      Product Serial Number / IMEI Photo
                    </h3>
                    <Badge variant="destructive">High Priority</Badge>
                  </div>
                  <p className="text-xs text-slate-600">
                    The merchant may argue that the defective phone shown in photo E03 is not the unit billed under invoice E01. A photo of the IMEI barcode on the retail box closes this defense.
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={onOpenUploadEvidence}
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
                    Having the stamped warranty leaflet eliminates objections regarding authorized dealer servicing.
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

        {/* STEP 6: GENERATE STRUCTURED CASE SUMMARY */}
        {currentStep === 6 && (
          <div className="space-y-6">
            <div className="flex items-start gap-3 border-b border-slate-100 pb-4">
              <div className="rounded-xl bg-indigo-50 p-2.5 text-indigo-600">
                <FileCheck className="h-5 w-5" />
              </div>
              <div>
                <h2 className="font-heading text-lg font-bold text-slate-900">
                  Step 6: Structured Case Summary & Draft Dossier
                </h2>
                <p className="text-xs text-slate-500">
                  Your structured case brief is compiled and ready for review or export.
                </p>
              </div>
            </div>

            {/* Formal Legal Brief Box */}
            <div className="rounded-2xl border-2 border-slate-800 bg-white p-6 shadow-sm font-serif space-y-5">
              <div className="border-b border-slate-800 pb-3 flex justify-between items-start font-sans">
                <div>
                  <h3 className="font-bold text-sm text-slate-900 uppercase tracking-wider">
                    Case Preparation Brief (Consumer Redressal)
                  </h3>
                  <span className="text-[11px] text-slate-500">
                    Target Forum: District Consumer Disputes Redressal Commission, Bangalore Urban
                  </span>
                </div>
                <Badge variant="purple" className="text-[10px]">Ref: NS-2024-0456</Badge>
              </div>

              <div className="space-y-1">
                <h4 className="font-sans text-xs font-bold text-slate-800 uppercase tracking-wide">
                  I. Parties
                </h4>
                <p className="text-xs text-slate-700">
                  <strong>Complainant:</strong> Ananya Sharma, Resident of Bangalore Urban, Karnataka.<br />
                  <strong>Opposite Party:</strong> ABC Store Pvt Ltd (abc.store@gmail.com).
                </p>
              </div>

              <div className="space-y-1">
                <h4 className="font-sans text-xs font-bold text-slate-800 uppercase tracking-wide">
                  II. Summary of Facts
                </h4>
                <ol className="list-decimal pl-5 text-xs text-slate-700 space-y-1">
                  <li>On 10-01-2024, Complainant purchased a smartphone for ₹24,999/- via Opp. Party website (Exhibit E01).</li>
                  <li>On 13-01-2024, the product was delivered and found dead on arrival (Exhibits E03, E08).</li>
                  <li>Between 14-01-2024 and 20-01-2024, replacement grievances were logged with merchant support (Exhibit E04).</li>
                  <li>On 21-01-2024, Opp. Party refused refund in violation of warranty laws (Exhibit E06).</li>
                </ol>
              </div>

              <div className="space-y-1">
                <h4 className="font-sans text-xs font-bold text-slate-800 uppercase tracking-wide">
                  III. Relief Claimed
                </h4>
                <p className="text-xs text-slate-700">
                  1. Full refund of consideration paid: <strong>₹24,999/-</strong> with 9% interest.<br />
                  2. Hardship and litigation compensation: <strong>₹5,000/-</strong>.
                </p>
              </div>

              <div className="space-y-1 font-sans">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                  IV. Exhibit Index
                </h4>
                <div className="flex flex-wrap gap-1.5 pt-1 text-[11px]">
                  <span className="rounded bg-slate-100 px-2 py-0.5 border border-slate-200">E01: Invoice</span>
                  <span className="rounded bg-slate-100 px-2 py-0.5 border border-slate-200">E02: UPI Slip</span>
                  <span className="rounded bg-slate-100 px-2 py-0.5 border border-slate-200">E03: Defect Photo</span>
                  <span className="rounded bg-slate-100 px-2 py-0.5 border border-slate-200">E04: Chat Log</span>
                  <span className="rounded bg-slate-100 px-2 py-0.5 border border-slate-200">E06: Denial Email</span>
                  <span className="rounded bg-slate-100 px-2 py-0.5 border border-slate-200">E07: Policy Copy</span>
                </div>
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
                  <span>Print Brief</span>
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

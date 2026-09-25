'use client';

import * as React from 'react';
import {
  FileText,
  UploadCloud,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  Copy,
  Check,
  FileCheck2,
  ChevronDown
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { sampleAuditedDocs } from '@/data/mockData';

interface UnderstandDocsViewProps {
  onOpenUpload: () => void;
}

export function UnderstandDocsView({ onOpenUpload }: UnderstandDocsViewProps) {
  const [selectedKey, setSelectedKey] = React.useState<string>('lease');
  const [copied, setCopied] = React.useState(false);

  const doc = sampleAuditedDocs[selectedKey];

  const handleCopyQuestions = () => {
    if (doc) {
      navigator.clipboard.writeText(doc.lawyerQuestions.join('\n\n'));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Row */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <span className="text-[10.5px] font-bold uppercase tracking-wider text-indigo-600">
            Legal Document Translator & Risk Auditor
          </span>
          <h1 className="font-heading text-2xl font-extrabold tracking-tight text-slate-900">
            Understand Documents
          </h1>
          <p className="text-xs text-slate-500 max-w-2xl">
            Upload contracts, notices, and agreements. Get plain-English explanations, audit hidden obligations, and prepare questions for your advocate.
          </p>
        </div>

        {/* Sample Document Selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 font-medium">Sample Doc:</span>
          <select
            value={selectedKey}
            onChange={(e) => setSelectedKey(e.target.value)}
            className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-800 shadow-xs cursor-pointer focus:outline-indigo-500"
          >
            <option value="lease">Residential Tenancy Lease Agreement</option>
            <option value="consumer">Electronic Goods Sales Terms & Warranty</option>
            <option value="employment">Employment Non-Disclosure & Non-Compete</option>
          </select>
        </div>
      </div>

      {/* Upload Drag & Drop Box */}
      <div
        onClick={onOpenUpload}
        className="flex items-center gap-4 rounded-2xl border-2 border-dashed border-indigo-200 bg-indigo-50/20 p-5 transition-colors hover:border-indigo-400 hover:bg-indigo-50/40 cursor-pointer"
      >
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600">
          <UploadCloud className="h-6 w-6" />
        </div>
        <div className="flex-1 space-y-0.5">
          <h3 className="text-xs font-bold text-slate-900">
            Upload any contract, notice, or lease to audit
          </h3>
          <p className="text-[11px] text-slate-500">
            Drag PDF, scanned document, or Word doc here (max 50MB). Evaluated with local privacy controls.
          </p>
        </div>
        <Button variant="outlinePurple" size="sm" className="rounded-xl text-xs font-semibold">
          Select File
        </Button>
      </div>

      {/* Main Split Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Left Column (8 cols): Simplified Explanation & Clauses */}
        <div className="space-y-6 lg:col-span-8">
          {/* Document Header & Simplified Explanation */}
          <Card className="p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-rose-50 p-2.5 text-rose-500">
                  <FileText className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="font-heading text-base font-bold text-slate-900">
                    {doc.title}
                  </h2>
                  <span className="text-[11px] text-slate-400">{doc.meta}</span>
                </div>
              </div>
              <Badge variant="success" className="gap-1 text-[11px] font-semibold">
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span>Audited</span>
              </Badge>
            </div>

            {/* Simplified Explanation */}
            <div className="rounded-2xl border border-indigo-100 bg-[#fbfbfe] p-4.5 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-indigo-700">
                <Sparkles className="h-4 w-4" />
                <span>Simplified Explanation (Plain Language)</span>
              </div>
              <p className="text-xs leading-relaxed text-slate-700 font-sans">
                {doc.summary}
              </p>
            </div>
          </Card>

          {/* Important Clauses Extracted */}
          <Card className="p-6">
            <h2 className="font-heading text-sm font-bold text-slate-900 pb-4">
              Important Clauses Extracted ({doc.clauses.length})
            </h2>

            <div className="space-y-4">
              {doc.clauses.map((clause, idx) => (
                <div
                  key={idx}
                  className="rounded-2xl border border-slate-200/90 bg-white p-4.5 space-y-2.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-heading text-xs font-bold text-slate-900">
                      {clause.tag}
                    </span>
                    <Badge variant={clause.riskVariant} className="text-[10px] font-bold">
                      {clause.risk}
                    </Badge>
                  </div>

                  <p className="rounded-xl bg-slate-50 p-3 text-xs italic text-slate-500 border border-slate-100">
                    {clause.raw}
                  </p>

                  <div className="text-xs text-slate-700 leading-relaxed">
                    <strong className="text-slate-900">Plain meaning: </strong>
                    {clause.meaning}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Right Column (4 cols): Obligations, Inconsistencies, Questions for Lawyer */}
        <div className="space-y-6 lg:col-span-4">
          {/* Obligations Card */}
          <Card className="p-5">
            <h3 className="font-heading text-sm font-bold text-slate-900 pb-3 flex items-center gap-2">
              <FileCheck2 className="h-4 w-4 text-indigo-600" />
              <span>Your Obligations</span>
            </h3>
            <ul className="space-y-2.5">
              {doc.obligations.map((ob, idx) => (
                <li key={idx} className="flex items-start gap-2 text-xs text-slate-700 leading-snug">
                  <div className="mt-1 h-1.5 w-1.5 rounded-full bg-indigo-600 shrink-0" />
                  <span>{ob}</span>
                </li>
              ))}
            </ul>
          </Card>

          {/* Potential Inconsistencies & Red Flags */}
          <Card className="border-rose-200 bg-rose-50/20 p-5">
            <h3 className="font-heading text-sm font-bold text-rose-800 pb-3 flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-rose-600" />
              <span>Potential Inconsistencies</span>
            </h3>
            <div className="space-y-3">
              {doc.inconsistencies.map((inc, idx) => (
                <div key={idx} className="rounded-xl border border-rose-200 bg-white p-3 space-y-1">
                  <span className="block text-xs font-bold text-slate-900">
                    {inc.title}
                  </span>
                  <span className="block text-[11px] text-slate-500 leading-relaxed">
                    {inc.description}
                  </span>
                </div>
              ))}
            </div>
          </Card>

          {/* Questions to Ask a Legal Professional */}
          <Card className="p-5 bg-indigo-50/40 border-indigo-200">
            <div className="flex items-center justify-between pb-3">
              <h3 className="font-heading text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <HelpCircle className="h-4 w-4 text-indigo-600" />
                <span>Questions to Ask a Lawyer</span>
              </h3>
              <Button
                variant="ghostPurple"
                size="sm"
                onClick={handleCopyQuestions}
                className="text-[11px] gap-1 h-7 px-2"
              >
                {copied ? <Check className="h-3 w-3 text-emerald-600" /> : <Copy className="h-3 w-3" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </Button>
            </div>
            <p className="text-[11px] text-slate-500 mb-2">
              Take these actionable questions to your advocate consultation:
            </p>
            <div className="space-y-2">
              {doc.lawyerQuestions.map((q, idx) => (
                <div key={idx} className="flex items-start gap-2 rounded-xl bg-white p-2.5 border border-indigo-100 text-xs text-slate-700 italic">
                  <span className="font-bold text-indigo-600 not-italic shrink-0">{idx + 1}.</span>
                  <span>"{q}"</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

'use client';

import * as React from 'react';
import {
  Search,
  ArrowRight,
  Scale,
  Landmark,
  Home,
  Laptop,
  HeartHandshake,
  Download,
  CheckCircle2,
  Sparkles,
  BookOpen
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface AskNyaySetuViewProps {
  onStartPreparation: () => void;
  onOpenFilingGuide: () => void;
}

export function AskNyaySetuView({
  onStartPreparation,
  onOpenFilingGuide,
}: AskNyaySetuViewProps) {
  const [query, setQuery] = React.useState('');
  const [showResult, setShowResult] = React.useState(true);

  const suggestedQueries = [
    'Defective Product Refund under CPA 2019',
    'Landlord withholding security deposit Karnataka',
    'e-Daakhil consumer complaint court fees 2024',
    'Limitation period for filing consumer case in India',
  ];

  const handleSelectQuery = (text: string) => {
    setQuery(text);
    setShowResult(true);
  };

  return (
    <div className="space-y-6">
      {/* Hero Search Section */}
      <div className="rounded-3xl border border-slate-200/80 bg-gradient-to-b from-white via-indigo-50/20 to-white p-8 text-center shadow-xs">
        <span className="text-[10.5px] font-bold uppercase tracking-wider text-indigo-600">
          Legal Information & Procedural Navigator
        </span>
        <h1 className="font-heading mt-1 text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900">
          Ask NyaySetu
        </h1>
        <p className="mx-auto mt-2 max-w-xl text-xs text-slate-500 leading-relaxed">
          Search Indian statutes, procedural timelines, consumer forum remedies, and tenancy rules in plain words. Structured for legal literacy, not casual hallucination.
        </p>

        {/* Search Input Bar */}
        <div className="mx-auto mt-6 max-w-2xl">
          <div className="flex items-center rounded-full border-2 border-slate-200 bg-white p-1.5 pl-5 shadow-sm transition-all focus-within:border-indigo-600 focus-within:ring-4 focus-within:ring-indigo-100">
            <Search className="h-4 w-4 text-slate-400 shrink-0 mr-3" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ask about rights, limitation periods, or procedure (e.g., 'How to file against an e-commerce seller?')"
              className="w-full text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none"
            />
            <Button
              variant="primary"
              onClick={() => setShowResult(true)}
              className="rounded-full px-5 py-2 text-xs font-semibold shrink-0 gap-1.5 shadow-xs"
            >
              <span>Search Rights</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </div>

          {/* Suggested Query Chips */}
          <div className="mt-3.5 flex flex-wrap items-center justify-center gap-1.5 text-xs">
            <span className="text-[11px] text-slate-400 font-medium">Suggested topics:</span>
            {suggestedQueries.map((item, idx) => (
              <button
                key={idx}
                onClick={() => handleSelectQuery(item)}
                className="rounded-full border border-slate-200 bg-white px-3 py-1 text-[11px] font-medium text-slate-600 transition-colors hover:border-indigo-300 hover:bg-indigo-50/50 hover:text-indigo-700 cursor-pointer"
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Featured Legal Knowledge Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card
          onClick={() => handleSelectQuery('Defective Goods remedies Section 2(47) CPA 2019')}
          className="p-5 cursor-pointer hover:border-indigo-300 transition-all space-y-2.5"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
            <Scale className="h-5 w-5" />
          </div>
          <Badge variant="purple" className="text-[10px]">CPA 2019</Badge>
          <h3 className="font-heading text-xs font-bold text-slate-900">
            Defective Goods & Product Liability
          </h3>
          <p className="text-[11px] text-slate-500 leading-relaxed">
            Statutory 30-day replacement norms and compensation claims up to ₹50 Lakhs.
          </p>
        </Card>

        <Card
          onClick={() => handleSelectQuery('Tenancy deposit return rules Karnataka Model Tenancy')}
          className="p-5 cursor-pointer hover:border-indigo-300 transition-all space-y-2.5"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
            <Home className="h-5 w-5" />
          </div>
          <Badge variant="success" className="text-[10px]">Tenancy & RERA</Badge>
          <h3 className="font-heading text-xs font-bold text-slate-900">
            Security Deposit Withholding
          </h3>
          <p className="text-[11px] text-slate-500 leading-relaxed">
            Ceilings on rental deposit deductions and legal notice serving procedures.
          </p>
        </Card>

        <Card
          onClick={onOpenFilingGuide}
          className="p-5 cursor-pointer hover:border-indigo-300 transition-all space-y-2.5"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50 text-orange-600">
            <Laptop className="h-5 w-5" />
          </div>
          <Badge variant="warning" className="text-[10px]">Filing Procedures</Badge>
          <h3 className="font-heading text-xs font-bold text-slate-900">
            e-Daakhil Online Filing Guide
          </h3>
          <p className="text-[11px] text-slate-500 leading-relaxed">
            How citizens file from home with ₹0 court fee for claims under ₹5 Lakhs.
          </p>
        </Card>

        <Card
          onClick={() => handleSelectQuery('NALSA free legal aid eligibility criteria Section 12')}
          className="p-5 cursor-pointer hover:border-indigo-300 transition-all space-y-2.5"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
            <HeartHandshake className="h-5 w-5" />
          </div>
          <Badge variant="secondary" className="text-[10px]">Legal Services Authority</Badge>
          <h3 className="font-heading text-xs font-bold text-slate-900">
            Free State Legal Aid (NALSA)
          </h3>
          <p className="text-[11px] text-slate-500 leading-relaxed">
            Who qualifies for free government advocates under Section 12 of the Legal Services Act.
          </p>
        </Card>
      </div>

      {/* Structured Legal Response Box */}
      {showResult && (
        <Card className="border-l-4 border-l-indigo-600 p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2 text-xs font-bold text-indigo-700">
              <Sparkles className="h-4 w-4" />
              <span>Structured Legal Information Response</span>
            </div>
            <span className="text-[11px] text-slate-400">
              Statutory Citation: Consumer Protection Act 2019 (Act No. 35 of 2019)
            </span>
          </div>

          <h2 className="font-heading text-base font-bold text-slate-900">
            Remedies and Filing Steps for Defective Electronic Goods / Denial of Refund
          </h2>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div className="rounded-xl border border-slate-200 bg-white p-4 space-y-1">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-50 font-bold text-indigo-600 text-xs">
                1
              </div>
              <h3 className="text-xs font-bold text-slate-900 pt-1">
                Issue Formal 15-Day Legal Notice
              </h3>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Send registered notice to the merchant detailing defect proofs and demanding replacement or refund within 15 days.
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-4 space-y-1">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-50 font-bold text-indigo-600 text-xs">
                2
              </div>
              <h3 className="text-xs font-bold text-slate-900 pt-1">
                Lodge Grievance on National Helpline
              </h3>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Dial 1915 or register on <code>consumerhelpline.gov.in</code>. Over 60% of e-commerce grievances resolve here without litigation.
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-4 space-y-1">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-50 font-bold text-indigo-600 text-xs">
                3
              </div>
              <h3 className="text-xs font-bold text-slate-900 pt-1">
                Submit File on e-Daakhil Portal
              </h3>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Under CPA rules, claims up to ₹5,00,000 carry <strong>₹0 court fee</strong>. You can attend consumer commission hearings virtually.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-slate-100">
            <Button
              variant="primary"
              size="sm"
              onClick={onStartPreparation}
              className="rounded-xl text-xs font-semibold gap-1.5 shadow-xs"
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>Prepare Case in Wizard</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => alert('Downloading "Notice_Under_Section_2(47)_CPA.docx"')}
              className="rounded-xl text-xs font-semibold gap-1.5"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Download Legal Notice Template</span>
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}

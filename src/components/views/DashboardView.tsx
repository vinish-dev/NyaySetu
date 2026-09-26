'use client';

import * as React from 'react';
import {
  Briefcase,
  TrendingUp,
  FileCheck2,
  AlertTriangle,
  Plus,
  FileText,
  Clock,
  Sparkles,
  Calculator,
  Building2,
  ChevronRight,
  ArrowRight,
  FolderOpen
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CaseDetail, AuditedDocument } from '@/data/mockData';

interface DashboardViewProps {
  cases: CaseDetail[];
  recentDocs: AuditedDocument[];
  onOpenCase: (caseId?: string) => void;
  onOpenWizard: () => void;
  onOpenDocAnalysis: () => void;
  onOpenNewCase: () => void;
  onOpenAuthorityGuide: () => void;
}

export function DashboardView({
  cases = [],
  recentDocs = [],
  onOpenCase,
  onOpenWizard,
  onOpenDocAnalysis,
  onOpenNewCase,
  onOpenAuthorityGuide,
}: DashboardViewProps) {
  // Dynamic metrics computed from real user cases
  const activeMattersCount = cases.length;
  const avgCompletion =
    cases.length > 0
      ? Math.round(cases.reduce((sum, c) => sum + (c.completionScore || 0), 0) / cases.length)
      : 0;
  const pendingItemsCount = cases.reduce((sum, c) => sum + (c.missingItems?.length || 0), 0);
  const indexedExhibitsCount = cases.reduce((sum, c) => sum + (c.evidence?.length || 0), 0);

  // Collect real action-required gaps across active cases
  const allGaps = cases.flatMap((c) =>
    (c.missingItems || []).map((item) => ({
      caseId: c.id,
      caseTitle: c.title,
      caseRef: c.caseId,
      ...item,
    }))
  );

  return (
    <div className="space-y-6">
      {/* Welcome Hero Banner */}
      <div className="flex flex-col gap-4 rounded-3xl border border-slate-200/80 bg-gradient-to-r from-white via-indigo-50/20 to-white p-6 shadow-xs sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <h1 className="font-heading text-2xl font-extrabold tracking-tight text-slate-900">
            {cases.length > 0 ? 'Welcome to NyaySetu' : 'Welcome to NyaySetu'}
          </h1>
          <p className="text-xs text-slate-500">
            {cases.length > 0 ? (
              <>
                You have <strong className="text-slate-700">{cases.length} active case{cases.length === 1 ? '' : 's'}</strong> in preparation.
                {avgCompletion > 0 && ` Overall case preparation is ${avgCompletion}% complete on average.`}
              </>
            ) : (
              'Prepare structured legal records, audit agreements with Gemini, and organize verified timelines.'
            )}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2.5">
          <Button
            onClick={onOpenNewCase}
            variant="primary"
            className="rounded-xl text-xs font-semibold shadow-xs gap-1.5"
          >
            <Plus className="h-4 w-4" />
            <span>New Case Intake</span>
          </Button>
          <Button
            onClick={onOpenDocAnalysis}
            variant="outline"
            className="rounded-xl text-xs font-semibold shadow-xs gap-1.5"
          >
            <FileText className="h-4 w-4" />
            <span>Analyze Document</span>
          </Button>
        </div>
      </div>

      {/* Metrics Row (Derived dynamically) */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <Card className="p-4 flex items-center gap-3.5">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
            <Briefcase className="h-5 w-5" />
          </div>
          <div>
            <span className="block text-2xl font-extrabold text-slate-900 leading-tight">
              {activeMattersCount}
            </span>
            <span className="block text-[11px] font-medium text-slate-400">Active Matters</span>
          </div>
        </Card>

        <Card className="p-4 flex items-center gap-3.5">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
            <TrendingUp className="h-5 w-5" />
          </div>
          <div>
            <span className="block text-2xl font-extrabold text-slate-900 leading-tight">
              {avgCompletion}%
            </span>
            <span className="block text-[11px] font-medium text-slate-400">Avg. Completion</span>
          </div>
        </Card>

        <Card className="p-4 flex items-center gap-3.5">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
            <AlertTriangle className="h-5 w-5" />
          </div>
          <div>
            <span className="block text-2xl font-extrabold text-slate-900 leading-tight">
              {pendingItemsCount}
            </span>
            <span className="block text-[11px] font-medium text-slate-400">Pending Items</span>
          </div>
        </Card>

        <Card className="p-4 flex items-center gap-3.5">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
            <FileCheck2 className="h-5 w-5" />
          </div>
          <div>
            <span className="block text-2xl font-extrabold text-slate-900 leading-tight">
              {indexedExhibitsCount}
            </span>
            <span className="block text-[11px] font-medium text-slate-400">Indexed Exhibits</span>
          </div>
        </Card>
      </div>

      {/* Main Split Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Left Column (8 cols): Active Cases & Quick Actions */}
        <div className="space-y-6 lg:col-span-8">
          {/* Active Cases List Card */}
          <Card className="p-6">
            <div className="flex items-center justify-between pb-4">
              <h2 className="font-heading text-base font-bold text-slate-900">
                Active Cases {cases.length > 0 && `(${cases.length})`}
              </h2>
              {cases.length > 0 && (
                <button
                  onClick={() => onOpenCase(cases[0].id)}
                  className="text-xs font-semibold text-indigo-600 hover:underline cursor-pointer flex items-center gap-1"
                >
                  <span>Open Primary Docket</span>
                  <ArrowRight className="h-3 w-3" />
                </button>
              )}
            </div>

            {cases.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-200 p-8 text-center">
                <FolderOpen className="h-10 w-10 text-slate-300 mx-auto mb-2" />
                <h3 className="text-sm font-bold text-slate-700">No Cases in Progress</h3>
                <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto leading-relaxed">
                  Start an intake for your consumer dispute, tenancy issue, or employment matter. NyaySetu organizes dates, exhibits, and legal claims.
                </p>
                <div className="mt-4 flex justify-center gap-2">
                  <Button
                    onClick={onOpenNewCase}
                    variant="primary"
                    size="sm"
                    className="rounded-xl text-xs font-semibold"
                  >
                    <Plus className="h-3.5 w-3.5 mr-1" />
                    <span>Create Case Docket</span>
                  </Button>
                  <Button
                    onClick={onOpenWizard}
                    variant="outline"
                    size="sm"
                    className="rounded-xl text-xs font-semibold"
                  >
                    <span>Launch Wizard</span>
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-3.5">
                {cases.map((c) => (
                  <div
                    key={c.id}
                    onClick={() => onOpenCase(c.id)}
                    className="group rounded-2xl border border-slate-200/80 bg-white p-4.5 transition-all hover:border-indigo-300 hover:shadow-xs cursor-pointer"
                  >
                    <div className="flex items-center justify-between pb-1.5">
                      <Badge variant="purple" className="text-[10.5px]">
                        {c.category}
                      </Badge>
                      <span className="font-mono text-[11px] text-slate-400">
                        {c.caseId}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <h3 className="font-heading text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                        {c.title}
                      </h3>
                      <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-700">
                        {c.completionScore}% Prepared
                      </span>
                    </div>

                    <p className="mt-1 text-xs text-slate-500 leading-relaxed line-clamp-2">
                      {c.summary?.narrative || 'Draft matter initialized. Complete intake narrative and upload supporting exhibits.'}
                    </p>

                    <div className="mt-3.5 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          c.completionScore >= 75
                            ? 'bg-emerald-500'
                            : c.completionScore >= 45
                            ? 'bg-amber-500'
                            : 'bg-indigo-500'
                        }`}
                        style={{ width: `${Math.max(c.completionScore, 5)}%` }}
                      />
                    </div>

                    <div className="mt-2.5 flex items-center justify-between text-[11px] text-slate-400">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        Created {c.createdDate}
                      </span>
                      <span className="font-semibold text-indigo-600 group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
                        Open Docket <ChevronRight className="h-3 w-3" />
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Quick Actions Grid */}
          <Card className="p-6">
            <h2 className="font-heading text-base font-bold text-slate-900 pb-4">
              Preparation Tools & Guides
            </h2>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <button
                onClick={onOpenWizard}
                className="group flex flex-col items-start rounded-2xl border border-slate-200/80 bg-white p-4 text-left transition-all hover:border-indigo-300 hover:bg-indigo-50/20 cursor-pointer"
              >
                <div className="rounded-xl bg-indigo-50 p-2.5 text-indigo-600 group-hover:scale-105 transition-transform">
                  <Sparkles className="h-5 w-5" />
                </div>
                <h3 className="mt-3 font-heading text-xs font-bold text-slate-900">
                  Case Preparation Wizard
                </h3>
                <p className="mt-0.5 text-[11px] text-slate-500 leading-tight">
                  Guided 6-step intake with Gemini fact extraction, timeline, and claims formulation.
                </p>
              </button>

              <button
                onClick={onOpenDocAnalysis}
                className="group flex flex-col items-start rounded-2xl border border-slate-200/80 bg-white p-4 text-left transition-all hover:border-indigo-300 hover:bg-indigo-50/20 cursor-pointer"
              >
                <div className="rounded-xl bg-emerald-50 text-emerald-600 group-hover:scale-105 transition-transform">
                  <FileText className="h-5 w-5" />
                </div>
                <h3 className="mt-3 font-heading text-xs font-bold text-slate-900">
                  Analyze Agreement / Notice
                </h3>
                <p className="mt-0.5 text-[11px] text-slate-500 leading-tight">
                  Audit leases, invoices, and warranties with Gemini to extract obligations and risks.
                </p>
              </button>

              <button
                onClick={() =>
                  alert('Limitation Calculator: Under Section 69 of the Consumer Protection Act 2019, complaints must be filed within 2 years from the date on which the cause of action arose.')
                }
                className="group flex flex-col items-start rounded-2xl border border-slate-200/80 bg-white p-4 text-left transition-all hover:border-indigo-300 hover:bg-indigo-50/20 cursor-pointer"
              >
                <div className="rounded-xl bg-amber-50 text-amber-600 group-hover:scale-105 transition-transform">
                  <Calculator className="h-5 w-5" />
                </div>
                <h3 className="mt-3 font-heading text-xs font-bold text-slate-900">
                  Limitation Period Calculator
                </h3>
                <p className="mt-0.5 text-[11px] text-slate-500 leading-tight">
                  Check statutory limitation deadlines before issuing legal notice or filing.
                </p>
              </button>

              <button
                onClick={onOpenAuthorityGuide}
                className="group flex flex-col items-start rounded-2xl border border-slate-200/80 bg-white p-4 text-left transition-all hover:border-indigo-300 hover:bg-indigo-50/20 cursor-pointer"
              >
                <div className="rounded-xl bg-blue-50 text-blue-600 group-hover:scale-105 transition-transform">
                  <Building2 className="h-5 w-5" />
                </div>
                <h3 className="mt-3 font-heading text-xs font-bold text-slate-900">
                  Find Legal Aid / DLSA
                </h3>
                <p className="mt-0.5 text-[11px] text-slate-500 leading-tight">
                  Locate district legal services authorities for free legal representation under NALSA.
                </p>
              </button>
            </div>
          </Card>
        </div>

        {/* Right Column (4 cols): Missing Pieces & Recent Docs */}
        <div className="space-y-6 lg:col-span-4">
          {/* Missing Information Attention Card */}
          <Card className="border-amber-200 bg-amber-50/20 p-5">
            <div className="flex items-center justify-between pb-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-amber-800">
                <AlertTriangle className="h-4 w-4 text-amber-600" />
                <span>Action Required ({allGaps.length})</span>
              </div>
              {allGaps.length > 0 && (
                <Badge variant="warning" className="text-[10px]">
                  Priority
                </Badge>
              )}
            </div>
            
            {allGaps.length === 0 ? (
              <p className="text-[11px] text-slate-500 leading-relaxed mt-1">
                No missing documentary items flagged across your cases.
              </p>
            ) : (
              <>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  NyaySetu flagged these evidentiary items that could weaken your standing if challenged:
                </p>

                <div className="mt-3 space-y-2.5">
                  {allGaps.slice(0, 3).map((gap, idx) => (
                    <div key={idx} className="rounded-xl border border-amber-200 bg-white p-3">
                      <span className="block text-[11px] font-bold text-slate-800">
                        {gap.caseTitle} ({gap.caseRef})
                      </span>
                      <span className="block text-[11px] text-slate-500 mt-0.5">
                        {gap.title}: {gap.description}
                      </span>
                      <button
                        onClick={() => onOpenCase(gap.caseId)}
                        className="mt-1 text-[11px] font-semibold text-indigo-600 hover:underline cursor-pointer"
                      >
                        Upload in Vault &rarr;
                      </button>
                    </div>
                  ))}
                </div>
              </>
            )}
          </Card>

          {/* Recent Documents */}
          <Card className="p-5">
            <div className="flex items-center justify-between pb-3">
              <h2 className="font-heading text-sm font-bold text-slate-900">
                Audited Documents ({recentDocs.length})
              </h2>
              <button
                onClick={onOpenDocAnalysis}
                className="text-[11px] font-semibold text-indigo-600 hover:underline cursor-pointer"
              >
                Upload New
              </button>
            </div>

            {recentDocs.length === 0 ? (
              <div className="rounded-xl border border-dashed border-slate-200 p-4 text-center">
                <FileText className="h-6 w-6 text-slate-300 mx-auto mb-1.5" />
                <p className="text-[11px] text-slate-400">
                  No documents analyzed yet. Upload an agreement, notice, or invoice to inspect clauses.
                </p>
                <button
                  onClick={onOpenDocAnalysis}
                  className="mt-2 text-xs font-semibold text-indigo-600 hover:underline cursor-pointer"
                >
                  Analyze with Gemini &rarr;
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                {recentDocs.map((doc) => (
                  <div
                    key={doc.id}
                    onClick={onOpenDocAnalysis}
                    className="flex items-center gap-3 rounded-xl p-2.5 hover:bg-slate-50 transition-colors cursor-pointer border border-transparent hover:border-slate-200"
                  >
                    <div className="rounded-lg bg-indigo-50 p-2 text-indigo-600 shrink-0">
                      <FileText className="h-4 w-4" />
                    </div>
                    <div className="flex-1 overflow-hidden">
                      <span className="block truncate text-xs font-semibold text-slate-800">
                        {doc.title}
                      </span>
                      <span className="block text-[10px] text-slate-400">
                        {doc.meta} • {doc.clauses?.length || 0} clauses analyzed
                      </span>
                    </div>
                    <ChevronRight className="h-4 w-4 text-slate-300 shrink-0" />
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}

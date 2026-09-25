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
  ArrowRight
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { activeCaseData } from '@/data/mockData';

interface DashboardViewProps {
  onOpenCase: () => void;
  onOpenWizard: () => void;
  onOpenDocAnalysis: () => void;
  onOpenNewCase: () => void;
  onOpenAuthorityGuide: () => void;
}

export const allCases = [
  {
    id: 'case-1',
    caseId: 'NS-2024-0456',
    title: 'Defective Product – Refund Denied',
    category: 'Consumer Dispute',
    progress: 82,
    snippet: 'ABC Store refused replacement of unboxing defect phone. 8 exhibits verified.',
    updated: 'Updated 2 days ago',
    badgeVariant: 'purple' as const,
  },
  {
    id: 'case-2',
    caseId: 'NS-2024-0312',
    title: 'Security Deposit Forfeiture Dispute',
    category: 'Tenancy & Rental',
    progress: 58,
    snippet: 'Landlord withheld ₹60,000 security deposit without itemized repair receipts.',
    updated: 'Updated 6 days ago',
    badgeVariant: 'warning' as const,
  },
  {
    id: 'case-3',
    caseId: 'NS-2024-0198',
    title: 'Pending Severance & Form 16 Delay',
    category: 'Employment & Labor',
    progress: 35,
    snippet: 'Employer delayed full & final settlement clearance past statutory 30 days period.',
    updated: 'Updated 2 weeks ago',
    badgeVariant: 'secondary' as const,
  },
];

export function DashboardView({
  onOpenCase,
  onOpenWizard,
  onOpenDocAnalysis,
  onOpenNewCase,
  onOpenAuthorityGuide,
}: DashboardViewProps) {
  return (
    <div className="space-y-6">
      {/* Welcome Hero Banner */}
      <div className="flex flex-col gap-4 rounded-3xl border border-slate-200/80 bg-gradient-to-r from-white via-indigo-50/20 to-white p-6 shadow-xs sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <h1 className="font-heading text-2xl font-extrabold tracking-tight text-slate-900">
            Welcome back, Ananya
          </h1>
          <p className="text-xs text-slate-500">
            You have <strong className="text-slate-700">3 active cases</strong> in preparation. 1 case is ready for legal notice generation.
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

      {/* Metrics Row */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <Card className="p-4 flex items-center gap-3.5">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
            <Briefcase className="h-5 w-5" />
          </div>
          <div>
            <span className="block text-2xl font-extrabold text-slate-900 leading-tight">3</span>
            <span className="block text-[11px] font-medium text-slate-400">Active Matters</span>
          </div>
        </Card>

        <Card className="p-4 flex items-center gap-3.5">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
            <TrendingUp className="h-5 w-5" />
          </div>
          <div>
            <span className="block text-2xl font-extrabold text-slate-900 leading-tight">82%</span>
            <span className="block text-[11px] font-medium text-slate-400">Avg. Completion</span>
          </div>
        </Card>

        <Card className="p-4 flex items-center gap-3.5">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
            <AlertTriangle className="h-5 w-5" />
          </div>
          <div>
            <span className="block text-2xl font-extrabold text-slate-900 leading-tight">4</span>
            <span className="block text-[11px] font-medium text-slate-400">Pending Items</span>
          </div>
        </Card>

        <Card className="p-4 flex items-center gap-3.5">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
            <FileCheck2 className="h-5 w-5" />
          </div>
          <div>
            <span className="block text-2xl font-extrabold text-slate-900 leading-tight">14</span>
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
                Active Cases
              </h2>
              <button
                onClick={onOpenCase}
                className="text-xs font-semibold text-indigo-600 hover:underline cursor-pointer flex items-center gap-1"
              >
                <span>View Primary Case File</span>
                <ArrowRight className="h-3 w-3" />
              </button>
            </div>

            <div className="space-y-3.5">
              {allCases.map((c) => (
                <div
                  key={c.id}
                  onClick={onOpenCase}
                  className="group rounded-2xl border border-slate-200/80 bg-white p-4.5 transition-all hover:border-indigo-300 hover:shadow-xs cursor-pointer"
                >
                  <div className="flex items-center justify-between pb-1.5">
                    <Badge variant={c.badgeVariant} className="text-[10.5px]">
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
                      {c.progress}% Prepared
                    </span>
                  </div>

                  <p className="mt-1 text-xs text-slate-500 leading-relaxed">
                    {c.snippet}
                  </p>

                  <div className="mt-3.5 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        c.progress >= 75
                          ? 'bg-emerald-500'
                          : c.progress >= 50
                          ? 'bg-amber-500'
                          : 'bg-rose-500'
                      }`}
                      style={{ width: `${c.progress}%` }}
                    />
                  </div>

                  <div className="mt-2.5 flex items-center justify-between text-[11px] text-slate-400">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {c.updated}
                    </span>
                    <span className="font-semibold text-indigo-600 group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
                      Open Docket <ChevronRight className="h-3 w-3" />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Quick Actions Grid */}
          <Card className="p-6">
            <h2 className="font-heading text-base font-bold text-slate-900 pb-4">
              Quick Actions
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
                  6-step guided intake with automatic evidence-to-claim linking.
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
                  Audit leases and contracts for one-sided forfeiture clauses.
                </p>
              </button>

              <button
                onClick={() =>
                  alert('Limitation Calculator: For consumer disputes in India, Section 69 of CPA 2019 sets a 2-year limitation period from cause of action.')
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
                  Check statutory limitation deadline before filing your grievance.
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
                  Locate district legal services authority for free appointed representation.
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
                <span>Action Required</span>
              </div>
              <Badge variant="warning" className="text-[10px]">
                Priority
              </Badge>
            </div>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              NyaySetu flagged these gaps that could weaken your standing if challenged:
            </p>

            <div className="mt-3 space-y-2.5">
              <div className="rounded-xl border border-amber-200 bg-white p-3">
                <span className="block text-[11px] font-bold text-slate-800">
                  Defective Product (NS-2024-0456)
                </span>
                <span className="block text-[11px] text-slate-500 mt-0.5">
                  Missing photo of manufacturer IMEI / Serial number label.
                </span>
                <button
                  onClick={onOpenCase}
                  className="mt-1 text-[11px] font-semibold text-indigo-600 hover:underline cursor-pointer"
                >
                  Upload in Vault &rarr;
                </button>
              </div>

              <div className="rounded-xl border border-amber-200 bg-white p-3">
                <span className="block text-[11px] font-bold text-slate-800">
                  Security Deposit (NS-2024-0312)
                </span>
                <span className="block text-[11px] text-slate-500 mt-0.5">
                  Move-in inspection photos not linked to Clause 8 of lease.
                </span>
                <button
                  onClick={onOpenCase}
                  className="mt-1 text-[11px] font-semibold text-indigo-600 hover:underline cursor-pointer"
                >
                  Link Document &rarr;
                </button>
              </div>
            </div>
          </Card>

          {/* Recent Documents */}
          <Card className="p-5">
            <div className="flex items-center justify-between pb-3">
              <h2 className="font-heading text-sm font-bold text-slate-900">
                Recent Documents
              </h2>
              <button
                onClick={onOpenDocAnalysis}
                className="text-[11px] font-semibold text-indigo-600 hover:underline cursor-pointer"
              >
                Upload New
              </button>
            </div>

            <div className="space-y-2">
              <div
                onClick={onOpenDocAnalysis}
                className="flex items-center gap-3 rounded-xl p-2.5 hover:bg-slate-50 transition-colors cursor-pointer"
              >
                <div className="rounded-lg bg-rose-50 p-2 text-rose-500">
                  <FileText className="h-4 w-4" />
                </div>
                <div className="flex-1 overflow-hidden">
                  <span className="block truncate text-xs font-semibold text-slate-800">
                    Residential Lease Agreement.pdf
                  </span>
                  <span className="block text-[10px] text-slate-400">
                    Analyzed yesterday • 3 obligations
                  </span>
                </div>
                <ChevronRight className="h-4 w-4 text-slate-300" />
              </div>

              <div
                onClick={onOpenCase}
                className="flex items-center gap-3 rounded-xl p-2.5 hover:bg-slate-50 transition-colors cursor-pointer"
              >
                <div className="rounded-lg bg-indigo-50 p-2 text-indigo-600">
                  <FileText className="h-4 w-4" />
                </div>
                <div className="flex-1 overflow-hidden">
                  <span className="block truncate text-xs font-semibold text-slate-800">
                    ABC Store Tax Invoice #29381
                  </span>
                  <span className="block text-[10px] text-slate-400">
                    NS-2024-0456 • Verified receipt
                  </span>
                </div>
                <ChevronRight className="h-4 w-4 text-slate-300" />
              </div>

              <div
                onClick={onOpenCase}
                className="flex items-center gap-3 rounded-xl p-2.5 hover:bg-slate-50 transition-colors cursor-pointer"
              >
                <div className="rounded-lg bg-emerald-50 p-2 text-emerald-600">
                  <FileText className="h-4 w-4" />
                </div>
                <div className="flex-1 overflow-hidden">
                  <span className="block truncate text-xs font-semibold text-slate-800">
                    Seller WhatsApp Support Log
                  </span>
                  <span className="block text-[10px] text-slate-400">
                    NS-2024-0456 • 24 messages
                  </span>
                </div>
                <ChevronRight className="h-4 w-4 text-slate-300" />
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

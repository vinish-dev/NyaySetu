'use client';

import * as React from 'react';
import {
  ArrowLeft,
  Share2,
  MoreVertical,
  Calendar,
  MapPin,
  Users,
  Coins,
  ShoppingCart,
  CreditCard,
  Package,
  AlertTriangle,
  MessageSquare,
  Ban,
  FileText,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  Landmark,
  Plus,
  ExternalLink,
  Lock,
  Eye,
  Info,
  Check
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { activeCaseData, EvidenceItem } from '@/data/mockData';

interface MyCasesViewProps {
  onBackToDashboard: () => void;
  onOpenUploadEvidence: () => void;
  onOpenAddEvent: () => void;
  onPreviewEvidence: (ev: EvidenceItem) => void;
  onOpenFilingProcess: () => void;
  onEditFacts: () => void;
}

export function MyCasesView({
  onBackToDashboard,
  onOpenUploadEvidence,
  onOpenAddEvent,
  onPreviewEvidence,
  onOpenFilingProcess,
  onEditFacts,
}: MyCasesViewProps) {
  const [subTab, setSubTab] = React.useState<'timeline' | 'evidence' | 'claims'>('timeline');

  // Timeline icon mapper
  const getTimelineIcon = (iconType: string) => {
    switch (iconType) {
      case 'cart':
        return <ShoppingCart className="h-4 w-4 text-indigo-600" />;
      case 'payment':
        return <CreditCard className="h-4 w-4 text-emerald-600" />;
      case 'delivery':
        return <Package className="h-4 w-4 text-orange-600" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-amber-600" />;
      case 'chat':
        return <MessageSquare className="h-4 w-4 text-blue-600" />;
      case 'danger':
        return <Ban className="h-4 w-4 text-rose-600" />;
      default:
        return <CheckCircle2 className="h-4 w-4 text-slate-600" />;
    }
  };

  const getTimelineBadgeBg = (iconType: string) => {
    switch (iconType) {
      case 'cart':
        return 'bg-indigo-50 border-indigo-200';
      case 'payment':
        return 'bg-emerald-50 border-emerald-200';
      case 'delivery':
        return 'bg-orange-50 border-orange-200';
      case 'warning':
        return 'bg-amber-50 border-amber-200';
      case 'chat':
        return 'bg-blue-50 border-blue-200';
      case 'danger':
        return 'bg-rose-50 border-rose-200';
      default:
        return 'bg-slate-50 border-slate-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header Row */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <button
            onClick={onBackToDashboard}
            className="group mb-2 inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-indigo-600 cursor-pointer transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-1" />
            <span>Back to My Cases</span>
          </button>
          <div className="space-y-1">
            <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 font-heading">
              {activeCaseData.title}
            </h1>
            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
              <span>
                Case ID: <strong className="text-slate-700 font-semibold">{activeCaseData.caseId}</strong>
              </span>
              <span>•</span>
              <span>Created on {activeCaseData.createdDate}</span>
              <span>•</span>
              <Badge variant="purple" className="font-semibold">
                {activeCaseData.category}
              </Badge>
              <Badge variant="secondary" className="font-semibold text-indigo-700 bg-indigo-50">
                {activeCaseData.status}
              </Badge>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            className="gap-2 rounded-xl text-xs font-semibold shadow-xs"
            onClick={() => alert('Sharing Case Preparation Report (Structured summary with verified exhibit indexing).')}
          >
            <Share2 className="h-3.5 w-3.5" />
            <span>Share Case Report</span>
          </Button>
          <Button variant="outline" size="icon" className="rounded-xl shadow-xs">
            <MoreVertical className="h-4 w-4 text-slate-500" />
          </Button>
        </div>
      </div>

      {/* Progress Pipeline Stepper */}
      <div className="rounded-2xl border border-slate-200/90 bg-white p-4 shadow-xs">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-2">
          {/* Step 1 */}
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-white font-bold text-xs shadow-xs">
              <CheckCircle2 className="h-4 w-4" />
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-bold text-slate-900">1. Tell Us</span>
              <span className="text-[11px] text-slate-500">About incident</span>
            </div>
          </div>

          {/* Step 2 */}
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-white font-bold text-xs shadow-xs">
              <CheckCircle2 className="h-4 w-4" />
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-bold text-slate-900">2. Collect Evidence</span>
              <span className="text-[11px] text-slate-500">Upload & add details</span>
            </div>
          </div>

          {/* Step 3 (Active) */}
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-white font-bold text-xs ring-4 ring-indigo-100 shadow-xs">
              3
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-bold text-indigo-700">3. Review & Organize</span>
              <span className="text-[11px] text-indigo-600 font-medium">Fact synthesis</span>
            </div>
          </div>

          {/* Step 4 */}
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-400 font-bold text-xs">
              4
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-bold text-slate-400">4. Case Report</span>
              <span className="text-[11px] text-slate-400">Ready to export</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Two-Column Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Left Column (8 cols) */}
        <div className="space-y-6 lg:col-span-8">
          {/* Case Summary Card */}
          <Card className="overflow-hidden p-6">
            <div className="flex items-center justify-between pb-4">
              <h3 className="font-heading text-base font-bold text-slate-900">Case Summary</h3>
              <Button
                variant="ghostPurple"
                size="sm"
                className="text-xs font-semibold cursor-pointer"
                onClick={onEditFacts}
              >
                Edit Details
              </Button>
            </div>

            <p className="text-sm leading-relaxed text-slate-600">
              {activeCaseData.summary.narrative}
            </p>

            <div className="mt-5 grid grid-cols-1 gap-4 border-t border-slate-100 pt-4 sm:grid-cols-2">
              <div className="flex items-start gap-3">
                <div className="rounded-xl bg-indigo-50 p-2 text-indigo-600">
                  <Calendar className="h-4 w-4" />
                </div>
                <div>
                  <span className="block text-[11px] font-medium text-slate-400">Incident Date</span>
                  <span className="block text-xs font-bold text-slate-800">{activeCaseData.summary.incidentDate}</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="rounded-xl bg-indigo-50 p-2 text-indigo-600">
                  <MapPin className="h-4 w-4" />
                </div>
                <div>
                  <span className="block text-[11px] font-medium text-slate-400">Location</span>
                  <span className="block text-xs font-bold text-slate-800">{activeCaseData.summary.location}</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="rounded-xl bg-indigo-50 p-2 text-indigo-600">
                  <Users className="h-4 w-4" />
                </div>
                <div>
                  <span className="block text-[11px] font-medium text-slate-400">Involved Party</span>
                  <span className="block text-xs font-bold text-slate-800">
                    {activeCaseData.summary.involvedParty}{' '}
                    <span className="text-[11px] font-normal text-slate-400">({activeCaseData.summary.involvedPartyContact})</span>
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="rounded-xl bg-indigo-50 p-2 text-indigo-600">
                  <Coins className="h-4 w-4" />
                </div>
                <div>
                  <span className="block text-[11px] font-medium text-slate-400">Your Desired Resolution</span>
                  <span className="block text-xs font-extrabold text-indigo-600">
                    {activeCaseData.summary.desiredResolution}
                  </span>
                </div>
              </div>
            </div>
          </Card>

          {/* Sub-Tabs View Card (Timeline View / Evidence View / Claims & Issues) */}
          <Card className="overflow-hidden p-0">
            {/* Tab Navigation Bar */}
            <div className="flex flex-wrap items-center justify-between border-b border-slate-100 bg-slate-50/50 px-5 py-2.5">
              <div className="flex gap-1.5">
                <button
                  onClick={() => setSubTab('timeline')}
                  className={`rounded-xl px-3.5 py-1.5 text-xs font-bold transition-all cursor-pointer ${
                    subTab === 'timeline'
                      ? 'bg-white text-indigo-700 shadow-xs'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  Timeline View
                </button>
                <button
                  onClick={() => setSubTab('evidence')}
                  className={`rounded-xl px-3.5 py-1.5 text-xs font-bold transition-all cursor-pointer ${
                    subTab === 'evidence'
                      ? 'bg-white text-indigo-700 shadow-xs'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  Evidence View ({activeCaseData.evidence.length})
                </button>
                <button
                  onClick={() => setSubTab('claims')}
                  className={`rounded-xl px-3.5 py-1.5 text-xs font-bold transition-all cursor-pointer ${
                    subTab === 'claims'
                      ? 'bg-white text-indigo-700 shadow-xs'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  Claims & Issues
                </button>
              </div>

              {subTab === 'timeline' && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onOpenAddEvent}
                  className="rounded-xl text-xs font-semibold gap-1.5 shadow-xs"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>Add Event</span>
                </Button>
              )}

              {subTab === 'evidence' && (
                <Button
                  variant="primary"
                  size="sm"
                  onClick={onOpenUploadEvidence}
                  className="rounded-xl text-xs font-semibold gap-1.5 shadow-xs"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>Upload Evidence</span>
                </Button>
              )}
            </div>

            {/* TAB 1: TIMELINE VIEW */}
            {subTab === 'timeline' && (
              <div className="p-6">
                <div className="relative border-l-2 border-slate-100 ml-4 space-y-6">
                  {activeCaseData.timeline.map((ev) => (
                    <div key={ev.id} className="relative pl-6">
                      {/* Node Bullet Icon */}
                      <div
                        className={`absolute -left-[17px] top-0 flex h-8 w-8 items-center justify-center rounded-full border-2 bg-white shadow-xs ${getTimelineBadgeBg(
                          ev.iconType
                        )}`}
                      >
                        {getTimelineIcon(ev.iconType)}
                      </div>

                      {/* Event Details Card */}
                      <div
                        className={`rounded-xl border p-4 transition-all hover:border-slate-300 ${
                          ev.alert
                            ? 'border-amber-200 bg-amber-50/20'
                            : ev.danger
                            ? 'border-rose-200 bg-rose-50/20'
                            : 'border-slate-100 bg-white'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span
                            className={`text-[11px] font-bold ${
                              ev.danger
                                ? 'text-rose-600'
                                : ev.alert
                                ? 'text-amber-600'
                                : 'text-slate-400'
                            }`}
                          >
                            {ev.date}
                          </span>
                        </div>
                        <h4 className="mt-0.5 text-sm font-bold text-slate-800 font-heading">
                          {ev.title}
                        </h4>
                        <p className="mt-1 text-xs text-slate-600 leading-relaxed">
                          {ev.description}
                        </p>

                        {/* Linked Evidence Pills */}
                        {ev.linkedEvidence.length > 0 && (
                          <div className="mt-3 flex flex-wrap gap-2">
                            {ev.linkedEvidence.map((code, idx) => (
                              <button
                                key={idx}
                                onClick={() => {
                                  const evItem = activeCaseData.evidence.find((e) =>
                                    code.startsWith(e.code)
                                  );
                                  if (evItem) onPreviewEvidence(evItem);
                                }}
                                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50/70 px-2.5 py-1 text-[11px] font-semibold text-slate-600 transition-colors hover:border-indigo-300 hover:bg-indigo-50/60 hover:text-indigo-700 cursor-pointer"
                              >
                                <FileText className="h-3 w-3 text-slate-400" />
                                <span>{code}</span>
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 flex justify-center border-t border-slate-100 pt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={onOpenAddEvent}
                    className="gap-2 rounded-xl text-xs font-semibold"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    <span>Add Event</span>
                  </Button>
                </div>
              </div>
            )}

            {/* TAB 2: EVIDENCE VIEW */}
            {subTab === 'evidence' && (
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between pb-2">
                  <span className="text-xs font-medium text-slate-500">
                    Key Evidence (<strong>{activeCaseData.evidence.length}</strong>)
                  </span>
                  <button
                    onClick={() => alert('Filtering exhibits by status.')}
                    className="text-xs font-semibold text-indigo-600 hover:underline cursor-pointer"
                  >
                    View All
                  </button>
                </div>

                <div className="overflow-x-auto rounded-xl border border-slate-100">
                  <table className="w-full text-left text-xs">
                    <thead className="border-b border-slate-100 bg-slate-50/70 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                      <tr>
                        <th className="px-4 py-3">Code</th>
                        <th className="px-4 py-3">Evidence Item</th>
                        <th className="px-4 py-3">Date</th>
                        <th className="px-4 py-3">Type</th>
                        <th className="px-4 py-3">Status</th>
                        <th className="px-4 py-3 text-right">Preview</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {activeCaseData.evidence.map((ev) => (
                        <tr
                          key={ev.id}
                          className="hover:bg-slate-50/50 transition-colors"
                        >
                          <td className="px-4 py-3 font-mono font-bold text-indigo-700">
                            {ev.code}
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2.5">
                              {ev.type === 'Document' ? (
                                <FileText className="h-4 w-4 text-rose-500 shrink-0" />
                              ) : ev.type === 'Image' ? (
                                <ImageIcon className="h-4 w-4 text-blue-500 shrink-0" />
                              ) : (
                                <MessageSquare className="h-4 w-4 text-emerald-500 shrink-0" />
                              )}
                              <div>
                                <span className="font-semibold text-slate-800 block">
                                  {ev.title}
                                </span>
                                <span className="text-[10px] text-slate-400 block">
                                  {ev.fileMeta}
                                </span>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-slate-500">{ev.date}</td>
                          <td className="px-4 py-3">
                            <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-600">
                              {ev.type}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            {ev.verified ? (
                              <Badge variant="success" className="gap-1 font-semibold text-[10px]">
                                <CheckCircle2 className="h-3 w-3" />
                                <span>Verified</span>
                              </Badge>
                            ) : (
                              <Badge variant="warning" className="gap-1 font-semibold text-[10px]">
                                <AlertCircle className="h-3 w-3" />
                                <span>Needs Review</span>
                              </Badge>
                            )}
                          </td>
                          <td className="px-4 py-3 text-right">
                            <Button
                              variant="ghost"
                              size="iconSm"
                              onClick={() => onPreviewEvidence(ev)}
                              title="Inspect Exhibit"
                            >
                              <Eye className="h-3.5 w-3.5 text-slate-500" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="flex justify-center pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={onOpenUploadEvidence}
                    className="gap-2 rounded-xl text-xs font-semibold"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    <span>Upload Evidence</span>
                  </Button>
                </div>
              </div>
            )}

            {/* TAB 3: CLAIMS & ISSUES */}
            {subTab === 'claims' && (
              <div className="p-6 space-y-4">
                {activeCaseData.claims.map((claim) => (
                  <div
                    key={claim.id}
                    className="rounded-xl border border-slate-200 bg-white p-4"
                  >
                    <div className="flex items-center justify-between pb-2">
                      <Badge variant="purple" className="text-[10px] font-bold">
                        {claim.statute}
                      </Badge>
                      <Badge variant="success" className="gap-1 text-[10px]">
                        <CheckCircle2 className="h-3 w-3" />
                        <span>Substantiated</span>
                      </Badge>
                    </div>
                    <h4 className="font-heading text-sm font-bold text-slate-900">
                      {claim.title}
                    </h4>
                    <p className="mt-1 text-xs text-slate-600">{claim.description}</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {claim.linkedEvidence.map((ev, idx) => (
                        <span
                          key={idx}
                          className="rounded-md border border-slate-200 bg-slate-50 px-2 py-0.5 text-[11px] font-medium text-slate-600"
                        >
                          {ev}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>

        {/* Right Rail Column (4 cols) */}
        <div className="space-y-6 lg:col-span-4">
          
          {/* ============================================================ */}
          {/* TRANSPARENT CASE PREPARATION COMPLETION GAUGE               */}
          {/* ============================================================ */}
          <Card className="p-5">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="space-y-0.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  Case Preparation
                </span>
                <h3 className="font-heading text-base font-extrabold text-slate-900">
                  82% complete
                </h3>
              </div>
              <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-bold text-emerald-700 border border-emerald-200">
                Well-Structured
              </span>
            </div>

            {/* Transparent Calculation Checklist */}
            <div className="mt-3.5 space-y-2">
              <span className="text-[11px] font-semibold text-slate-500 block">
                Preparation Progress Breakdown:
              </span>
              <ul className="space-y-1.5 text-xs">
                {activeCaseData.readinessChecklist.map((item, idx) => (
                  <li
                    key={idx}
                    className="flex items-center justify-between rounded-lg px-2.5 py-1.5 bg-slate-50/70 border border-slate-100"
                  >
                    <span className="flex items-center gap-2 text-slate-700">
                      {item.status === 'complete' ? (
                        <Check className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                      ) : (
                        <AlertTriangle className="h-3.5 w-3.5 text-amber-500 shrink-0" />
                      )}
                      <span className={item.status === 'complete' ? 'font-medium' : 'font-semibold text-amber-900'}>
                        {item.name}
                      </span>
                    </span>
                    <span
                      className={`text-[10.5px] font-bold ${
                        item.status === 'complete' ? 'text-emerald-700' : 'text-amber-700'
                      }`}
                    >
                      {item.status === 'complete' ? 'Done' : 'Pending'}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Note clarifying completion metric */}
            <div className="mt-3.5 flex items-start gap-2 rounded-xl bg-slate-50 p-2.5 text-[11px] text-slate-500 border border-slate-100 leading-snug">
              <Info className="h-3.5 w-3.5 text-slate-400 shrink-0 mt-0.5" />
              <span>
                This is a documentation completeness metric, not an AI judgment or prediction of legal outcome.
              </span>
            </div>

            <div className="mt-3 pt-3 border-t border-slate-100">
              <Button
                variant="outlinePurple"
                size="sm"
                onClick={onOpenUploadEvidence}
                className="w-full justify-center text-xs font-semibold rounded-xl"
              >
                Add Missing Documents
              </Button>
            </div>
          </Card>

          {/* Missing / Recommended Card */}
          <Card className="p-5">
            <h3 className="font-heading text-sm font-bold text-slate-900 pb-3">
              Missing / Recommended ({activeCaseData.missingItems.length})
            </h3>
            <div className="space-y-3">
              {activeCaseData.missingItems.map((item, index) => (
                <div key={index} className="flex items-start gap-2.5">
                  <div className="mt-1 h-2 w-2 rounded-full bg-rose-500 shrink-0 ring-4 ring-rose-50" />
                  <div className="space-y-0.5 flex-1">
                    <span className="block text-xs font-semibold text-slate-800 leading-snug">
                      {item.title}
                    </span>
                    <span className="block text-[11px] text-slate-500 leading-tight">
                      {item.description}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Claims Covered Card */}
          <Card className="p-5">
            <h3 className="font-heading text-sm font-bold text-slate-900 pb-3">
              Claims Covered
            </h3>
            <ul className="space-y-2.5">
              {activeCaseData.claimsCovered.map((claim, idx) => (
                <li key={idx} className="flex items-center gap-2 text-xs text-slate-700">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                  <span>{claim}</span>
                </li>
              ))}
            </ul>
          </Card>

          {/* ============================================================ */}
          {/* POTENTIAL FILING CHANNELS (REPLACED RECOMMENDED AUTHORITY)  */}
          {/* ============================================================ */}
          <Card className="p-5">
            <div className="space-y-1 pb-3">
              <h3 className="font-heading text-sm font-bold text-slate-900">
                Potential Filing Channels
              </h3>
              <p className="text-[11px] text-slate-500 leading-snug">
                {activeCaseData.potentialFilingChannels.reason}
              </p>
            </div>

            <div className="flex items-start gap-3 rounded-xl bg-slate-50/70 p-3 border border-slate-100">
              <div className="rounded-xl bg-indigo-50 p-2 text-indigo-600 shrink-0">
                <Landmark className="h-4 w-4" />
              </div>
              <div className="space-y-0.5">
                <h4 className="text-xs font-bold text-slate-900 leading-snug">
                  {activeCaseData.potentialFilingChannels.name}
                </h4>
                <p className="text-[11px] text-slate-500">
                  {activeCaseData.potentialFilingChannels.jurisdiction}
                </p>
              </div>
            </div>

            {/* Subtle channel disclaimer */}
            <p className="mt-2.5 text-[10.5px] italic text-slate-400 leading-tight">
              ⚠️ {activeCaseData.potentialFilingChannels.disclaimer}
            </p>

            <div className="mt-3.5">
              <Button
                variant="outline"
                size="sm"
                onClick={onOpenFilingProcess}
                className="w-full justify-center gap-1.5 rounded-xl text-xs font-semibold shadow-xs"
              >
                <span>Explore Filing Channel Details</span>
                <ExternalLink className="h-3 w-3" />
              </Button>
            </div>
          </Card>

          {/* Next Steps Checklist */}
          <Card className="p-5">
            <h3 className="font-heading text-sm font-bold text-slate-900 pb-3">
              Next Steps
            </h3>
            <div className="space-y-3">
              {activeCaseData.nextSteps.map((step, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md border border-slate-200 bg-slate-50 text-[10px] font-bold text-slate-600">
                    {idx + 1}
                  </div>
                  <div className="space-y-0.5">
                    <span className="block text-xs font-semibold text-slate-800">
                      {step.title}
                    </span>
                    <span className="block text-[11px] text-slate-400">
                      {step.subtitle}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* Bottom Privacy & Security Banner */}
      <div className="flex items-center gap-2.5 rounded-2xl border border-slate-200/80 bg-white px-5 py-3 text-xs text-slate-500 shadow-xs">
        <Lock className="h-4 w-4 text-indigo-600 shrink-0" />
        <span>Your data is encrypted and private. We never share your information.</span>
      </div>
    </div>
  );
}

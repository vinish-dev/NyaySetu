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
  Sparkles,
  Loader2,
  FileText,
  AlertCircle,
  HelpCircle
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CaseDetail, AuditedDocument } from '@/data/mockData';

interface AskNyaySetuViewProps {
  onStartPreparation: () => void;
  onOpenFilingGuide: () => void;
  activeCase?: CaseDetail | null;
  uploadedDocuments?: AuditedDocument[];
}

interface GroundedResponse {
  directAnswer: string;
  sources: {
    document: string;
    clauseOrSection: string;
    quote: string;
  }[];
  proceduralSteps: string[];
  consultationTip?: string;
}

export function AskNyaySetuView({
  onStartPreparation,
  onOpenFilingGuide,
  activeCase,
  uploadedDocuments = [],
}: AskNyaySetuViewProps) {
  const [query, setQuery] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);
  const [groundedResult, setGroundedResult] = React.useState<GroundedResponse | null>(null);

  const suggestedQueries = [
    'What do my uploaded documents require me to do?',
    'What is the notice period mentioned in my records?',
    'What remedies exist under the Consumer Protection Act 2019?',
    'What is the statutory limitation period for my dispute?',
  ];

  const handleSearch = async (searchQuery?: string) => {
    const q = searchQuery || query;
    if (!q.trim()) return;

    setIsLoading(true);
    setErrorMsg(null);

    try {
      // Build context strictly from real active case and real uploaded documents
      let documentContext = '';

      if (uploadedDocuments.length > 0) {
        documentContext += uploadedDocuments
          .map(
            (doc) =>
              `DOCUMENT: ${doc.title}\nSUMMARY: ${doc.summary}\nCLAUSES: ${JSON.stringify(doc.clauses)}\nOBLIGATIONS: ${doc.obligations.join('; ')}`
          )
          .join('\n\n');
      }

      if (activeCase) {
        documentContext += `\n\nCASE MATTERS: ${activeCase.title} (${activeCase.caseId})
Category: ${activeCase.category}
Incident Date: ${activeCase.summary.incidentDate}
Involved Party: ${activeCase.summary.involvedParty}
Narrative: ${activeCase.summary.narrative}
Exhibits: ${JSON.stringify(activeCase.evidence)}`;
      }

      const res = await fetch('/api/grounded-ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: q,
          documentContext: documentContext || undefined,
          caseContext: activeCase || undefined,
        }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || `Server responded with status ${res.status}`);
      }

      const json = await res.json();
      setGroundedResult(json.data);
    } catch (err: any) {
      console.error('Error during grounded query:', err);
      setErrorMsg(err.message || 'Failed to retrieve answer. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectQuery = (text: string) => {
    setQuery(text);
    handleSearch(text);
  };

  return (
    <div className="space-y-6">
      {/* Hero Search Section */}
      <div className="rounded-3xl border border-slate-200/80 bg-gradient-to-b from-white via-indigo-50/20 to-white p-8 text-center shadow-xs">
        <span className="text-[10.5px] font-bold uppercase tracking-wider text-indigo-600">
          Document-Grounded Legal Information
        </span>
        <h1 className="font-heading mt-1 text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900">
          Ask NyaySetu
        </h1>
        <p className="mx-auto mt-2 max-w-xl text-xs text-slate-500 leading-relaxed">
          Ask questions grounded in your uploaded documents and case records. NyaySetu identifies specific clauses, citations, and procedural considerations.
        </p>

        {/* Search Input Bar */}
        <div className="mx-auto mt-6 max-w-2xl">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSearch();
            }}
            className="flex items-center rounded-full border-2 border-slate-200 bg-white p-1.5 pl-5 shadow-sm transition-all focus-within:border-indigo-600 focus-within:ring-4 focus-within:ring-indigo-100"
          >
            <Search className="h-4 w-4 text-slate-400 shrink-0 mr-3" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ask about your rights, document terms, or procedural steps..."
              className="w-full text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none"
            />
            <Button
              type="submit"
              variant="primary"
              disabled={isLoading || !query.trim()}
              className="rounded-full px-5 py-2 text-xs font-semibold shrink-0 gap-1.5 shadow-xs"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  <span>Searching...</span>
                </>
              ) : (
                <>
                  <span>Search</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </>
              )}
            </Button>
          </form>

          {/* Suggested Query Chips */}
          <div className="mt-3.5 flex flex-wrap items-center justify-center gap-1.5 text-xs">
            <span className="text-[11px] text-slate-400 font-medium">Topic ideas:</span>
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

      {/* Error Message */}
      {errorMsg && (
        <div className="flex items-center gap-2 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-xs text-rose-800">
          <AlertCircle className="h-4 w-4 text-rose-600 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Structured Grounded Legal Response Box (Rendered when search executed) */}
      {groundedResult && (
        <Card className="border-l-4 border-l-indigo-600 p-6 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2 text-xs font-bold text-indigo-700">
              <Sparkles className="h-4 w-4" />
              <span>Grounded Legal Information Response</span>
            </div>
            <span className="text-[11px] text-slate-400">
              Grounded in current case context & statutory reference
            </span>
          </div>

          {/* Direct Answer */}
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Summary Analysis
            </span>
            <p className="text-sm font-semibold text-slate-900 leading-relaxed font-heading whitespace-pre-line">
              {groundedResult.directAnswer}
            </p>
          </div>

          {/* Source Citations with exact quotes */}
          {groundedResult.sources && groundedResult.sources.length > 0 && (
            <div className="space-y-2.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                Verified Document Sources & References:
              </span>
              <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                {groundedResult.sources.map((src, idx) => (
                  <div
                    key={idx}
                    className="rounded-xl border border-indigo-100 bg-[#fbfbfe] p-3.5 space-y-1.5"
                  >
                    <div className="flex items-center gap-2">
                      <FileText className="h-3.5 w-3.5 text-indigo-600 shrink-0" />
                      <span className="text-xs font-bold text-slate-900 truncate">
                        {src.document}
                      </span>
                    </div>
                    <Badge variant="purple" className="text-[10px]">
                      Source: {src.clauseOrSection}
                    </Badge>
                    {src.quote && (
                      <p className="rounded-lg bg-white p-2 text-[11px] italic text-slate-600 border border-slate-100 leading-relaxed">
                        "{src.quote}"
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Procedural Steps */}
          {groundedResult.proceduralSteps && groundedResult.proceduralSteps.length > 0 && (
            <div className="space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                Recommended Procedural Next Steps:
              </span>
              <div className="space-y-1.5">
                {groundedResult.proceduralSteps.map((step, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-2.5 rounded-lg border border-slate-100 bg-slate-50/70 p-2.5 text-xs text-slate-700"
                  >
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-[10px] font-bold text-indigo-700">
                      {idx + 1}
                    </span>
                    <span>{step}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Consultation Tip */}
          {groundedResult.consultationTip && (
            <div className="rounded-xl bg-slate-50 p-3 border border-slate-100 text-xs text-slate-600">
              <strong className="text-slate-800">Advocate Consultation Note:</strong>{' '}
              {groundedResult.consultationTip}
            </div>
          )}

          <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-slate-100">
            <Button
              variant="primary"
              size="sm"
              onClick={onStartPreparation}
              className="rounded-xl text-xs font-semibold gap-1.5 shadow-xs"
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>Continue Case in Wizard</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onOpenFilingGuide}
              className="rounded-xl text-xs font-semibold gap-1.5"
            >
              <Landmark className="h-3.5 w-3.5" />
              <span>Explore Filing Channels</span>
            </Button>
          </div>
        </Card>
      )}

      {/* Featured Procedural Knowledge Guides */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card
          onClick={() => handleSelectQuery('What remedies exist for Defective Goods under Section 2(47) CPA 2019?')}
          className="p-5 cursor-pointer hover:border-indigo-300 transition-all space-y-2.5"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
            <Scale className="h-5 w-5" />
          </div>
          <Badge variant="purple" className="text-[10px]">CPA 2019</Badge>
          <h3 className="font-heading text-xs font-bold text-slate-900">
            Defective Goods & Services
          </h3>
          <p className="text-[11px] text-slate-500 leading-relaxed">
            Statutory replacement norms, manufacturer liability, and filing thresholds.
          </p>
        </Card>

        <Card
          onClick={() => handleSelectQuery('What are the rules for returning a tenancy security deposit?')}
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
            Permissible deductions, notice standards, and formal notice drafting.
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
            e-Daakhil Online Portal
          </h3>
          <p className="text-[11px] text-slate-500 leading-relaxed">
            How citizens file complaints from home with ₹0 fee for claims under ₹5 Lakhs.
          </p>
        </Card>

        <Card
          onClick={() => handleSelectQuery('Who is eligible for free legal aid under Section 12 of Legal Services Authorities Act?')}
          className="p-5 cursor-pointer hover:border-indigo-300 transition-all space-y-2.5"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
            <HeartHandshake className="h-5 w-5" />
          </div>
          <Badge variant="secondary" className="text-[10px]">Legal Services Authority</Badge>
          <h3 className="font-heading text-xs font-bold text-slate-900">
            Free Legal Aid (NALSA)
          </h3>
          <p className="text-[11px] text-slate-500 leading-relaxed">
            Who qualifies for free government advocates under Section 12 of the NALSA Act.
          </p>
        </Card>
      </div>
    </div>
  );
}

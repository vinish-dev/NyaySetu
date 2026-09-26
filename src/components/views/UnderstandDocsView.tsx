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
  Loader2,
  AlertCircle,
  FileUp,
  RotateCcw,
  AlignLeft
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AuditedDocument } from '@/data/mockData';

interface UnderstandDocsViewProps {
  onDocumentAudited?: (doc: AuditedDocument) => void;
}

export function UnderstandDocsView({ onDocumentAudited }: UnderstandDocsViewProps) {
  const [copied, setCopied] = React.useState(false);
  const [showTextInput, setShowTextInput] = React.useState(false);
  const [rawText, setRawText] = React.useState('');

  // Real Upload & AI State
  const [isAnalyzing, setIsAnalyzing] = React.useState(false);
  const [analyzeStep, setAnalyzeStep] = React.useState<string>('');
  const [uploadedFileName, setUploadedFileName] = React.useState<string | null>(null);
  const [aiAnalysisResult, setAiAnalysisResult] = React.useState<AuditedDocument | null>(null);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  const fileInputRef = React.useRef<HTMLInputElement | null>(null);

  const handleCopyQuestions = () => {
    if (aiAnalysisResult) {
      navigator.clipboard.writeText(aiAnalysisResult.lawyerQuestions.join('\n\n'));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const processAnalysis = async (formData: FormData, displayTitle: string) => {
    setIsAnalyzing(true);
    setErrorMessage(null);
    setUploadedFileName(displayTitle);
    setAnalyzeStep('Reading document content...');

    try {
      setTimeout(() => {
        setAnalyzeStep('Analyzing clauses & potential concerns with Gemini...');
      }, 1200);

      const res = await fetch('/api/analyze-document', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || `Server responded with status ${res.status}`);
      }

      setAnalyzeStep('Structuring plain-language legal explanation...');

      const json = await res.json();
      const aiData = json.data;

      const formattedDoc: AuditedDocument = {
        id: `doc-${Date.now()}`,
        title: aiData.title || displayTitle,
        meta: aiData.meta || `Live Gemini Document Analysis`,
        summary: aiData.simplifiedExplanation || 'Document analyzed successfully.',
        clauses: (aiData.importantClauses || []).map((cl: any) => ({
          tag: cl.tag || 'Audited Clause',
          risk: cl.risk || 'Requires professional review',
          riskVariant:
            cl.risk?.toLowerCase().includes('potential') || cl.risk?.toLowerCase().includes('concern')
              ? 'warning'
              : cl.risk?.toLowerCase().includes('professional') || cl.risk?.toLowerCase().includes('high')
              ? 'destructive'
              : cl.risk?.toLowerCase().includes('standard')
              ? 'success'
              : 'default',
          raw: cl.raw || 'Excerpt from document',
          meaning: cl.meaning || 'Explanation',
        })),
        obligations: aiData.obligations || [],
        inconsistencies: aiData.inconsistencies || [],
        lawyerQuestions: aiData.questionsForProfessional || [],
      };

      setAiAnalysisResult(formattedDoc);
      if (onDocumentAudited) {
        onDocumentAudited(formattedDoc);
      }
    } catch (err: any) {
      console.error('Error analyzing document:', err);
      setErrorMessage(err.message || 'Failed to analyze document. Please check the file and try again.');
    } finally {
      setIsAnalyzing(false);
      setAnalyzeStep('');
    }
  };

  const handleFileUpload = (file: File) => {
    if (!file) return;
    const validExtensions = ['.pdf', '.txt', '.png', '.jpg', '.jpeg', '.webp'];
    const isSupported =
      validExtensions.some((ext) => file.name.toLowerCase().endsWith(ext)) ||
      file.type.startsWith('image/') ||
      file.type === 'application/pdf' ||
      file.type.startsWith('text/');

    if (!isSupported) {
      alert('Please upload a PDF, TXT, or Image file (PNG, JPG, WEBP).');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    processAnalysis(formData, file.name);
  };

  const handleDirectTextSubmit = () => {
    if (!rawText.trim()) return;
    const formData = new FormData();
    formData.append('text', rawText);
    processAnalysis(formData, 'Pasted Agreement Text');
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleReset = () => {
    setAiAnalysisResult(null);
    setUploadedFileName(null);
    setErrorMessage(null);
    setRawText('');
    setShowTextInput(false);
  };

  return (
    <div className="space-y-6">
      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept=".pdf,.txt,.png,.jpg,.jpeg,.webp,application/pdf,text/plain,image/*"
        onChange={(e) => {
          if (e.target.files && e.target.files[0]) {
            handleFileUpload(e.target.files[0]);
          }
        }}
      />

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
            Upload contracts, notices, and agreements (PDF, TXT, Images). Get plain-language explanations, audit hidden obligations, and prepare questions for your advocate.
          </p>
        </div>

        {aiAnalysisResult && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleReset}
            className="rounded-xl text-xs gap-1.5 self-start sm:self-auto"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Analyze Another Document</span>
          </Button>
        )}
      </div>

      {/* Real Upload Drag & Drop Box */}
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative flex items-center gap-4 rounded-2xl border-2 border-dashed p-6 transition-all cursor-pointer ${
          isAnalyzing
            ? 'border-indigo-400 bg-indigo-50/50 pointer-events-none'
            : 'border-indigo-200 bg-indigo-50/20 hover:border-indigo-400 hover:bg-indigo-50/40'
        }`}
      >
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600">
          {isAnalyzing ? (
            <Loader2 className="h-6 w-6 animate-spin text-indigo-600" />
          ) : (
            <UploadCloud className="h-6 w-6" />
          )}
        </div>
        <div className="flex-1 space-y-0.5">
          <h3 className="text-xs font-bold text-slate-900">
            {isAnalyzing
              ? analyzeStep
              : uploadedFileName
              ? `Currently analyzed: ${uploadedFileName} (Click to replace file)`
              : 'Upload a contract, lease, warranty, or legal notice to audit'}
          </h3>
          <p className="text-[11px] text-slate-500">
            Supports <strong>PDF</strong>, <strong>TXT</strong>, and <strong>Images</strong> (PNG, JPG, WEBP). Analyzed in real time using Gemini 2.5.
          </p>
        </div>
        <Button
          variant="outlinePurple"
          size="sm"
          disabled={isAnalyzing}
          className="rounded-xl text-xs font-semibold shrink-0 gap-1.5"
        >
          {isAnalyzing ? (
            <>
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              <span>Processing...</span>
            </>
          ) : (
            <>
              <FileUp className="h-3.5 w-3.5" />
              <span>Choose Document</span>
            </>
          )}
        </Button>
      </div>

      {/* Paste Text Option Toggle */}
      {!aiAnalysisResult && !isAnalyzing && (
        <div className="text-center">
          <button
            type="button"
            onClick={() => setShowTextInput(!showTextInput)}
            className="text-xs font-semibold text-indigo-600 hover:underline cursor-pointer inline-flex items-center gap-1.5"
          >
            <AlignLeft className="h-3.5 w-3.5" />
            <span>{showTextInput ? 'Hide Text Input' : 'Or paste text directly from an agreement'}</span>
          </button>

          {showTextInput && (
            <div className="mt-3 text-left space-y-2 max-w-3xl mx-auto rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
              <label className="text-xs font-bold text-slate-700 block">
                Paste Agreement Text or Notice Paragraphs:
              </label>
              <textarea
                rows={5}
                value={rawText}
                onChange={(e) => setRawText(e.target.value)}
                placeholder="Paste contract clauses, tenancy terms, or warranty text here..."
                className="w-full rounded-xl border border-slate-200 p-3 text-xs text-slate-800 focus:outline-indigo-500 font-sans"
              />
              <div className="flex justify-end">
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleDirectTextSubmit}
                  disabled={!rawText.trim() || isAnalyzing}
                  className="rounded-xl text-xs gap-1.5"
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>Audit Pasted Text with Gemini</span>
                </Button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Error Alert if upload failed */}
      {errorMessage && (
        <div className="flex items-center gap-3 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-xs text-rose-800">
          <AlertCircle className="h-5 w-5 shrink-0 text-rose-600" />
          <div className="flex-1">
            <strong>Error analyzing document:</strong> {errorMessage}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setErrorMessage(null)}
            className="text-xs rounded-xl"
          >
            Dismiss
          </Button>
        </div>
      )}

      {/* EMPTY ONBOARDING STATE IF NO DOCUMENT IS ANALYZED YET */}
      {!aiAnalysisResult && !isAnalyzing && (
        <Card className="p-12 text-center border-dashed border-slate-200 bg-white">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 mb-4">
            <FileText className="h-7 w-7" />
          </div>
          <h2 className="font-heading text-base font-bold text-slate-900">
            No document uploaded yet
          </h2>
          <p className="mx-auto mt-1 max-w-md text-xs text-slate-500 leading-relaxed">
            Drop your lease, sales terms, employment contract, or legal notice above. Gemini will extract clauses, detect hidden obligations, highlight potential concerns, and prepare consultation questions.
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <Button
              variant="primary"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              className="rounded-xl text-xs gap-1.5"
            >
              <FileUp className="h-4 w-4" />
              <span>Upload Document</span>
            </Button>
          </div>
        </Card>
      )}

      {/* Main Split Grid (RENDERED WHEN GEMINI ANALYSIS COMPLETES) */}
      {aiAnalysisResult && (
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
                      {aiAnalysisResult.title}
                    </h2>
                    <span className="text-[11px] text-slate-400">{aiAnalysisResult.meta}</span>
                  </div>
                </div>
                <Badge variant="success" className="gap-1 text-[11px] font-semibold">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  <span>Audited via Gemini</span>
                </Badge>
              </div>

              {/* Simplified Explanation */}
              <div className="rounded-2xl border border-indigo-100 bg-[#fbfbfe] p-4.5 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-indigo-700">
                  <Sparkles className="h-4 w-4" />
                  <span>Simplified Explanation (Plain Language)</span>
                </div>
                <p className="text-xs leading-relaxed text-slate-700 font-sans whitespace-pre-line">
                  {aiAnalysisResult.summary}
                </p>
              </div>
            </Card>

            {/* Important Clauses Extracted */}
            <Card className="p-6">
              <div className="flex items-center justify-between pb-4">
                <h2 className="font-heading text-sm font-bold text-slate-900">
                  Important Clauses Extracted ({aiAnalysisResult.clauses.length})
                </h2>
                <span className="text-[11px] text-slate-400">
                  Categorized by potential risk & obligations
                </span>
              </div>

              <div className="space-y-4">
                {aiAnalysisResult.clauses.map((clause, idx) => (
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
                {aiAnalysisResult.obligations.length > 0 ? (
                  aiAnalysisResult.obligations.map((ob, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-xs text-slate-700 leading-snug">
                      <div className="mt-1 h-1.5 w-1.5 rounded-full bg-indigo-600 shrink-0" />
                      <span>{ob}</span>
                    </li>
                  ))
                ) : (
                  <li className="text-xs text-slate-400 italic">No affirmative duties identified.</li>
                )}
              </ul>
            </Card>

            {/* Potential Inconsistencies & Red Flags */}
            <Card className="border-rose-200 bg-rose-50/20 p-5">
              <h3 className="font-heading text-sm font-bold text-rose-800 pb-3 flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-rose-600" />
                <span>Potential Inconsistencies & Ambiguities</span>
              </h3>
              <div className="space-y-3">
                {aiAnalysisResult.inconsistencies.length > 0 ? (
                  aiAnalysisResult.inconsistencies.map((inc, idx) => (
                    <div key={idx} className="rounded-xl border border-rose-200 bg-white p-3 space-y-1">
                      <span className="block text-xs font-bold text-slate-900">
                        {inc.title}
                      </span>
                      <span className="block text-[11px] text-slate-500 leading-relaxed">
                        {inc.description}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-500 italic">No overt contractual contradictions detected in this document.</p>
                )}
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
                {aiAnalysisResult.lawyerQuestions.map((q, idx) => (
                  <div key={idx} className="flex items-start gap-2 rounded-xl bg-white p-2.5 border border-indigo-100 text-xs text-slate-700 italic">
                    <span className="font-bold text-indigo-600 not-italic shrink-0">{idx + 1}.</span>
                    <span>"{q}"</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}

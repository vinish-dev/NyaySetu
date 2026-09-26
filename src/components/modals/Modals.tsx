'use client';

import * as React from 'react';
import {
  UploadCloud,
  Calendar,
  Landmark,
  Plus,
  ExternalLink,
  CheckCircle2,
  FileText,
  Fingerprint,
  Download,
  AlertCircle
} from 'lucide-react';
import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { EvidenceItem } from '@/data/mockData';

// 1. UPLOAD EVIDENCE MODAL
interface UploadEvidenceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (title: string, type: 'Document' | 'Image' | 'Chat' | 'Email', fileMeta?: string) => void;
}

export function UploadEvidenceModal({
  isOpen,
  onClose,
  onSubmit,
}: UploadEvidenceModalProps) {
  const [title, setTitle] = React.useState('');
  const [type, setType] = React.useState<'Document' | 'Image' | 'Chat' | 'Email'>('Document');
  const [fileName, setFileName] = React.useState<string>('');
  const [date, setDate] = React.useState<string>(() => new Date().toISOString().split('T')[0]);
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFileName(`${file.name} (${(file.size / 1024).toFixed(1)} KB)`);
      if (!title) {
        setTitle(file.name.replace(/\.[^/.]+$/, ''));
      }
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-2 text-indigo-700">
          <UploadCloud className="h-5 w-5" />
          <span>Upload Evidence / Document</span>
        </div>
      }
      footer={
        <>
          <Button variant="outline" size="sm" onClick={onClose} className="rounded-xl">
            Cancel
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => {
              onSubmit(title || 'New Exhibit', type, fileName || 'User Attached File');
              setTitle('');
              setFileName('');
              onClose();
            }}
            className="rounded-xl"
          >
            Add to Evidence Vault
          </Button>
        </>
      }
    >
      <div className="space-y-3.5 text-xs">
        <div className="space-y-1">
          <label className="font-bold text-slate-700">Evidence Title</label>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., Courier Slip or WhatsApp Screenshot"
          />
        </div>

        <div className="space-y-1">
          <label className="font-bold text-slate-700">Evidence Type</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value as any)}
            className="h-9 w-full rounded-lg border border-slate-200 bg-white px-3 text-xs text-slate-800"
          >
            <option value="Document">Document (PDF / Scan)</option>
            <option value="Image">Photo / Screenshot (JPG / PNG)</option>
            <option value="Chat">Chat Export (WhatsApp / SMS)</option>
            <option value="Email">Email Communication (EML / PDF)</option>
          </select>
        </div>

        <div className="space-y-1">
          <label className="font-bold text-slate-700">Date of Document</label>
          <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        </div>

        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          accept=".pdf,.png,.jpg,.jpeg,.txt,.doc,.docx"
        />

        <div
          onClick={() => fileInputRef.current?.click()}
          className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-200 p-6 text-center bg-slate-50/50 hover:bg-slate-50 cursor-pointer transition-colors"
        >
          <UploadCloud className="h-6 w-6 text-slate-400 mb-1" />
          <p className="font-bold text-slate-700 text-xs">
            {fileName ? fileName : 'Click to browse or drop file'}
          </p>
          <span className="text-[10px] text-slate-400">PDF, PNG, JPG, TXT up to 50MB</span>
        </div>
      </div>
    </Modal>
  );
}

// 2. ADD EVENT MODAL
interface AddEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  availableEvidence?: EvidenceItem[];
  onSubmit: (title: string, date: string, description: string, linkedCode?: string) => void;
}

export function AddEventModal({ isOpen, onClose, availableEvidence = [], onSubmit }: AddEventModalProps) {
  const [title, setTitle] = React.useState('');
  const [date, setDate] = React.useState<string>(() => new Date().toISOString().split('T')[0]);
  const [desc, setDesc] = React.useState('');
  const [linkedExhibit, setLinkedExhibit] = React.useState('');

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-2 text-indigo-700">
          <Calendar className="h-5 w-5" />
          <span>Add Timeline Milestone</span>
        </div>
      }
      footer={
        <>
          <Button variant="outline" size="sm" onClick={onClose} className="rounded-xl">
            Cancel
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => {
              onSubmit(title || 'New Milestone', date, desc, linkedExhibit || undefined);
              setTitle('');
              setDesc('');
              onClose();
            }}
            className="rounded-xl"
          >
            Save Milestone
          </Button>
        </>
      }
    >
      <div className="space-y-3.5 text-xs">
        <div className="space-y-1">
          <label className="font-bold text-slate-700">Event Date</label>
          <Input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>

        <div className="space-y-1">
          <label className="font-bold text-slate-700">Milestone Heading</label>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., Escalation Call to Customer Executive"
          />
        </div>

        <div className="space-y-1">
          <label className="font-bold text-slate-700">Detailed Notes</label>
          <textarea
            rows={3}
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            className="w-full rounded-lg border border-slate-200 p-2.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            placeholder="What occurred, who communicated, and what promises were made?"
          />
        </div>

        {availableEvidence.length > 0 && (
          <div className="space-y-1">
            <label className="font-bold text-slate-700">Link Supporting Exhibit</label>
            <select
              value={linkedExhibit}
              onChange={(e) => setLinkedExhibit(e.target.value)}
              className="h-9 w-full rounded-lg border border-slate-200 bg-white px-3 text-xs text-slate-800"
            >
              <option value="">No exhibit linked</option>
              {availableEvidence.map((ev) => (
                <option key={ev.id} value={ev.code}>
                  {ev.code} - {ev.title}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>
    </Modal>
  );
}

// 3. EVIDENCE PREVIEW MODAL
interface EvidencePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  evidence: EvidenceItem | null;
}

export function EvidencePreviewModal({
  isOpen,
  onClose,
  evidence,
}: EvidencePreviewModalProps) {
  if (!evidence) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="lg"
      title={
        <div className="flex items-center gap-2.5">
          <span className="font-mono text-xs font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-200">
            {evidence.code}
          </span>
          <span className="text-sm font-bold text-slate-900">{evidence.title}</span>
        </div>
      }
      footer={
        <>
          <Button variant="outline" size="sm" onClick={onClose} className="rounded-xl">
            Close
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => alert(`Downloading verified exhibit ${evidence.code}.`)}
            className="rounded-xl gap-1.5"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Download Verified File</span>
          </Button>
        </>
      }
    >
      <div className="space-y-4 text-xs">
        <div className="flex flex-wrap items-center justify-between border-b border-slate-100 pb-3 gap-2">
          <div>
            <span className="text-slate-500">
              Type: <strong className="text-slate-800">{evidence.type}</strong> ({evidence.fileMeta})
            </span>
            <div className="text-slate-500">
              Recorded Date: <strong className="text-slate-800">{evidence.date}</strong>
            </div>
          </div>
          <div>
            {evidence.verified ? (
              <Badge variant="success" className="gap-1 font-semibold">
                <CheckCircle2 className="h-3 w-3" />
                <span>Verified Exhibit</span>
              </Badge>
            ) : (
              <Badge variant="warning" className="gap-1 font-semibold">
                <AlertCircle className="h-3 w-3" />
                <span>Needs Review</span>
              </Badge>
            )}
          </div>
        </div>

        <div className="space-y-1.5">
          <h4 className="font-bold text-slate-900">Exhibit Summary & Analysis:</h4>
          <p className="rounded-xl bg-slate-50 p-3.5 text-xs text-slate-700 leading-relaxed border border-slate-100">
            {evidence.summary || 'Uploaded document stored in case evidence vault.'}
          </p>
        </div>

        <div className="rounded-xl border border-indigo-100 bg-indigo-50/40 p-3.5 space-y-1">
          <div className="flex items-center gap-1.5 font-bold text-slate-900 text-xs">
            <Fingerprint className="h-4 w-4 text-indigo-600" />
            <span>Cryptographic Integrity Verification (Sec 65B Admissibility):</span>
          </div>
          <p className="text-[11px] text-slate-600 font-mono">
            {evidence.verificationProof || 'SHA-256 Checksum generated upon upload'}
          </p>
        </div>
      </div>
    </Modal>
  );
}

// 4. FILING PROCESS & AUTHORITY GUIDE MODAL
interface FilingProcessModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function FilingProcessModal({ isOpen, onClose }: FilingProcessModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="lg"
      title={
        <div className="flex items-center gap-2 text-indigo-700">
          <Landmark className="h-5 w-5" />
          <span>Potential Filing Channels & Procedure</span>
        </div>
      }
      footer={
        <>
          <Button variant="outline" size="sm" onClick={onClose} className="rounded-xl">
            Close
          </Button>
          <a
            href="https://edaakhil.nic.in"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-indigo-700 transition-colors"
          >
            <span>Open National e-Daakhil Portal</span>
            <ExternalLink className="h-3 w-3" />
          </a>
        </>
      }
    >
      <div className="space-y-4 text-xs">
        <div className="rounded-xl bg-slate-50 p-2.5 text-[11px] text-slate-500 border border-slate-200 leading-snug">
          <strong>Notice:</strong> Based on the information provided, these channels may be relevant. NyaySetu provides procedural information only and does not provide legal representation.
        </div>

        <div className="flex flex-wrap gap-2">
          <Badge variant="purple">District Consumer Commission (DCDRC)</Badge>
          <Badge variant="success">Pecuniary Limit: Up to ₹50 Lakhs</Badge>
          <Badge variant="secondary">Court Fee: ₹0 (For claims under ₹5L)</Badge>
        </div>

        <h4 className="font-bold text-slate-900 pt-1">
          Step-by-Step e-Filing Instructions on e-Daakhil:
        </h4>
        <ol className="list-decimal pl-5 space-y-2 text-slate-600 leading-relaxed">
          <li>Visit <code>edaakhil.nic.in</code> and register using Mobile/Aadhaar OTP.</li>
          <li>Select your State and District Commission having appropriate territorial jurisdiction.</li>
          <li>Upload your NyaySetu-generated Case Preparation Report as your primary grievance statement.</li>
          <li>Attach your indexed exhibits under Annexures corresponding to each claim.</li>
          <li>Pay applicable court fee (disputes below ₹5,00,000 are 100% exempt from filing fees).</li>
          <li>Track case admission date and receive notices directly through the portal.</li>
        </ol>

        <div className="rounded-xl bg-slate-50 p-3 border border-slate-200">
          <h5 className="font-bold text-slate-900 text-xs">Free Legal Aid via NALSA / DLSA:</h5>
          <p className="text-[11px] text-slate-500 mt-0.5">
            Eligible citizens (including consumers, women, and workers) can request a free legal aid counsel through the District Legal Services Authority (DLSA) at their local district court complex.
          </p>
        </div>
      </div>
    </Modal>
  );
}

// 5. NEW CASE INTAKE MODAL
interface NewCaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStart: (title: string, category: string) => void;
}

export function NewCaseModal({ isOpen, onClose, onStart }: NewCaseModalProps) {
  const [title, setTitle] = React.useState('');
  const [selectedCat, setSelectedCat] = React.useState('Consumer Dispute');

  const categories = [
    'Consumer Dispute',
    'Tenancy & Lease',
    'Employment & Labor',
    'Contract Breach',
    'Digital Fraud & Cyber',
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-2 text-indigo-700">
          <Plus className="h-5 w-5" />
          <span>Start New Case Preparation</span>
        </div>
      }
      footer={
        <>
          <Button variant="outline" size="sm" onClick={onClose} className="rounded-xl">
            Cancel
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => {
              onStart(title || 'New Dispute Matter', selectedCat);
              setTitle('');
              onClose();
            }}
            className="rounded-xl"
          >
            Launch Case Wizard &rarr;
          </Button>
        </>
      }
    >
      <div className="space-y-4 text-xs">
        <div className="space-y-1.5">
          <label className="font-bold text-slate-700">Select Dispute Category</label>
          <div className="grid grid-cols-2 gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCat(cat)}
                className={`rounded-xl border p-3 text-left font-bold transition-all cursor-pointer ${
                  selectedCat === cat
                    ? 'border-indigo-600 bg-indigo-50/60 text-indigo-700'
                    : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-1">
          <label className="font-bold text-slate-700">Short Matter Title</label>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., Security Deposit Delay or Defective Appliance"
          />
        </div>
      </div>
    </Modal>
  );
}

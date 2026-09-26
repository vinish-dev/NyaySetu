'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sidebar } from '@/components/Sidebar';
import { TopBanner } from '@/components/TopBanner';
import { DashboardView } from '@/components/views/DashboardView';
import { MyCasesView } from '@/components/views/MyCasesView';
import { PrepareCaseView } from '@/components/views/PrepareCaseView';
import { UnderstandDocsView } from '@/components/views/UnderstandDocsView';
import { AskNyaySetuView } from '@/components/views/AskNyaySetuView';
import {
  UploadEvidenceModal,
  AddEventModal,
  EvidencePreviewModal,
  FilingProcessModal,
  NewCaseModal,
} from '@/components/modals/Modals';
import { CaseDetail, AuditedDocument, EvidenceItem, TimelineEvent, createNewCase } from '@/data/mockData';

export default function NyaySetuApp() {
  const [currentTab, setCurrentTab] = React.useState<string>('dashboard');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = React.useState(false);

  // Dynamic Case & Document State
  const [cases, setCases] = React.useState<CaseDetail[]>([]);
  const [activeCaseId, setActiveCaseId] = React.useState<string | null>(null);
  const [auditedDocs, setAuditedDocs] = React.useState<AuditedDocument[]>([]);
  const [isInitialized, setIsInitialized] = React.useState(false);

  // Modal states
  const [isUploadOpen, setIsUploadOpen] = React.useState(false);
  const [isAddEventOpen, setIsAddEventOpen] = React.useState(false);
  const [previewItem, setPreviewItem] = React.useState<EvidenceItem | null>(null);
  const [isFilingGuideOpen, setIsFilingGuideOpen] = React.useState(false);
  const [isNewCaseOpen, setIsNewCaseOpen] = React.useState(false);

  // Load persisted state from localStorage on client mount
  React.useEffect(() => {
    try {
      const storedCases = localStorage.getItem('nyaysetu_cases');
      const storedDocs = localStorage.getItem('nyaysetu_docs');

      if (storedCases) {
        const parsed = JSON.parse(storedCases);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setCases(parsed);
          setActiveCaseId(parsed[0].id);
        }
      }
      if (storedDocs) {
        const parsed = JSON.parse(storedDocs);
        if (Array.isArray(parsed)) {
          setAuditedDocs(parsed);
        }
      }
    } catch (e) {
      console.error('Error loading state from localStorage:', e);
    } finally {
      setIsInitialized(true);
    }
  }, []);

  // Sync cases to localStorage whenever updated
  React.useEffect(() => {
    if (!isInitialized) return;
    try {
      localStorage.setItem('nyaysetu_cases', JSON.stringify(cases));
    } catch (e) {
      console.error('Error saving cases to localStorage:', e);
    }
  }, [cases, isInitialized]);

  // Sync audited documents to localStorage
  React.useEffect(() => {
    if (!isInitialized) return;
    try {
      localStorage.setItem('nyaysetu_docs', JSON.stringify(auditedDocs));
    } catch (e) {
      console.error('Error saving documents to localStorage:', e);
    }
  }, [auditedDocs, isInitialized]);

  const activeCase = cases.find((c) => c.id === activeCaseId) || cases[0] || null;

  const handleTabChange = (tabId: string) => {
    setCurrentTab(tabId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectCase = (caseId: string) => {
    setActiveCaseId(caseId);
    setCurrentTab('my-cases');
  };

  const handleCreateNewCase = (title: string, category: string) => {
    const newCase = createNewCase(title, category);
    setCases((prev) => [newCase, ...prev]);
    setActiveCaseId(newCase.id);
    setCurrentTab('prepare-case');
  };

  const handleSaveCaseFromWizard = (savedCase: CaseDetail) => {
    setCases((prev) => {
      const exists = prev.some((c) => c.id === savedCase.id);
      if (exists) {
        return prev.map((c) => (c.id === savedCase.id ? savedCase : c));
      }
      return [savedCase, ...prev];
    });
    setActiveCaseId(savedCase.id);
    setCurrentTab('my-cases');
  };

  const handleAddEvidence = (title: string, type: 'Document' | 'Image' | 'Chat' | 'Email', fileMeta?: string) => {
    if (!activeCase) return;

    const nextExhibitNum = activeCase.evidence.length + 1;
    const code = `E${nextExhibitNum < 10 ? '0' : ''}${nextExhibitNum}`;

    const newEvidence: EvidenceItem = {
      id: `ev-${Date.now()}`,
      code,
      title,
      date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
      type,
      fileMeta: fileMeta || 'Attached Document',
      verified: true,
      summary: `Document registered in case vault for "${activeCase.title}".`,
      verificationProof: `SHA-256 Checksum: ${Array.from({ length: 32 }, () =>
        Math.floor(Math.random() * 16).toString(16)
      ).join('')}`,
    };

    const updatedCase: CaseDetail = {
      ...activeCase,
      evidence: [newEvidence, ...activeCase.evidence],
      completionScore: Math.min(100, (activeCase.completionScore || 15) + 10),
      completionLabel: `${Math.min(100, (activeCase.completionScore || 15) + 10)}% complete`,
    };

    setCases((prev) => prev.map((c) => (c.id === updatedCase.id ? updatedCase : c)));
  };

  const handleAddTimelineEvent = (title: string, date: string, description: string, linkedCode?: string) => {
    if (!activeCase) return;

    const newEvent: TimelineEvent = {
      id: `evt-${Date.now()}`,
      date,
      title,
      description: description || 'Chronological milestone logged in case docket.',
      iconType: 'chat',
      linkedEvidence: linkedCode ? [linkedCode] : [],
    };

    const updatedCase: CaseDetail = {
      ...activeCase,
      timeline: [...activeCase.timeline, newEvent],
      completionScore: Math.min(100, (activeCase.completionScore || 15) + 8),
      completionLabel: `${Math.min(100, (activeCase.completionScore || 15) + 8)}% complete`,
    };

    setCases((prev) => prev.map((c) => (c.id === updatedCase.id ? updatedCase : c)));
  };

  const handleDocumentAudited = (doc: AuditedDocument) => {
    setAuditedDocs((prev) => {
      const filtered = prev.filter((d) => d.id !== doc.id && d.title !== doc.title);
      return [doc, ...filtered];
    });

    // If an active case exists, optionally add as an indexed exhibit in the case
    if (activeCase) {
      const nextExhibitNum = activeCase.evidence.length + 1;
      const code = `E${nextExhibitNum < 10 ? '0' : ''}${nextExhibitNum}`;
      const newEv: EvidenceItem = {
        id: `ev-${Date.now()}`,
        code,
        title: doc.title,
        date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
        type: 'Document',
        fileMeta: doc.meta,
        verified: true,
        summary: doc.summary,
        verificationProof: `SHA-256 Checksum: ${Array.from({ length: 32 }, () =>
          Math.floor(Math.random() * 16).toString(16)
        ).join('')}`,
      };

      const updatedCase: CaseDetail = {
        ...activeCase,
        evidence: [newEv, ...activeCase.evidence],
      };
      setCases((prev) => prev.map((c) => (c.id === updatedCase.id ? updatedCase : c)));
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-800">
      {/* Sidebar Component */}
      <Sidebar
        currentTab={currentTab}
        onSelectTab={handleTabChange}
        onOpenNewCase={() => setIsNewCaseOpen(true)}
        onOpenAuthorityGuide={() => setIsFilingGuideOpen(true)}
        isMobileOpen={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col min-w-0">
        <TopBanner
          onOpenMobileSidebar={() => setIsMobileSidebarOpen(true)}
          onOpenHelp={() => setIsFilingGuideOpen(true)}
        />

        <main className="flex-1 px-4 py-6 sm:px-8 sm:py-8 max-w-7xl w-full mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentTab}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.18, ease: 'easeOut' }}
            >
              {currentTab === 'my-cases' && (
                <MyCasesView
                  activeCase={activeCase}
                  allCases={cases}
                  onSelectCase={handleSelectCase}
                  onStartNewCase={() => setIsNewCaseOpen(true)}
                  onBackToDashboard={() => handleTabChange('dashboard')}
                  onOpenUploadEvidence={() => setIsUploadOpen(true)}
                  onOpenAddEvent={() => setIsAddEventOpen(true)}
                  onPreviewEvidence={(ev) => setPreviewItem(ev)}
                  onOpenFilingProcess={() => setIsFilingGuideOpen(true)}
                  onEditFacts={() => handleTabChange('prepare-case')}
                />
              )}

              {currentTab === 'dashboard' && (
                <DashboardView
                  cases={cases}
                  recentDocs={auditedDocs}
                  onOpenCase={(caseId) => {
                    if (caseId) setActiveCaseId(caseId);
                    handleTabChange('my-cases');
                  }}
                  onOpenWizard={() => handleTabChange('prepare-case')}
                  onOpenDocAnalysis={() => handleTabChange('understand-docs')}
                  onOpenNewCase={() => setIsNewCaseOpen(true)}
                  onOpenAuthorityGuide={() => setIsFilingGuideOpen(true)}
                />
              )}

              {currentTab === 'prepare-case' && (
                <PrepareCaseView
                  activeCase={activeCase}
                  onFinishWizard={handleSaveCaseFromWizard}
                  onOpenUploadEvidence={() => setIsUploadOpen(true)}
                  onOpenAddEvent={() => setIsAddEventOpen(true)}
                />
              )}

              {currentTab === 'understand-docs' && (
                <UnderstandDocsView
                  onDocumentAudited={handleDocumentAudited}
                />
              )}

              {currentTab === 'ask-nyaysetu' && (
                <AskNyaySetuView
                  activeCase={activeCase}
                  uploadedDocuments={auditedDocs}
                  onStartPreparation={() => handleTabChange('prepare-case')}
                  onOpenFilingGuide={() => setIsFilingGuideOpen(true)}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Global Modals */}
      <UploadEvidenceModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onSubmit={handleAddEvidence}
      />

      <AddEventModal
        isOpen={isAddEventOpen}
        onClose={() => setIsAddEventOpen(false)}
        availableEvidence={activeCase?.evidence || []}
        onSubmit={handleAddTimelineEvent}
      />

      <EvidencePreviewModal
        isOpen={!!previewItem}
        onClose={() => setPreviewItem(null)}
        evidence={previewItem}
      />

      <FilingProcessModal
        isOpen={isFilingGuideOpen}
        onClose={() => setIsFilingGuideOpen(false)}
      />

      <NewCaseModal
        isOpen={isNewCaseOpen}
        onClose={() => setIsNewCaseOpen(false)}
        onStart={handleCreateNewCase}
      />
    </div>
  );
}

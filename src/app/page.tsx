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
import { EvidenceItem } from '@/data/mockData';

export default function NyaySetuApp() {
  const [currentTab, setCurrentTab] = React.useState<string>('my-cases');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = React.useState(false);

  // Modal states
  const [isUploadOpen, setIsUploadOpen] = React.useState(false);
  const [isAddEventOpen, setIsAddEventOpen] = React.useState(false);
  const [previewItem, setPreviewItem] = React.useState<EvidenceItem | null>(null);
  const [isFilingGuideOpen, setIsFilingGuideOpen] = React.useState(false);
  const [isNewCaseOpen, setIsNewCaseOpen] = React.useState(false);

  const handleTabChange = (tabId: string) => {
    setCurrentTab(tabId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
                  onOpenCase={() => handleTabChange('my-cases')}
                  onOpenWizard={() => handleTabChange('prepare-case')}
                  onOpenDocAnalysis={() => handleTabChange('understand-docs')}
                  onOpenNewCase={() => setIsNewCaseOpen(true)}
                  onOpenAuthorityGuide={() => setIsFilingGuideOpen(true)}
                />
              )}

              {currentTab === 'prepare-case' && (
                <PrepareCaseView
                  onFinishWizard={() => handleTabChange('my-cases')}
                  onOpenUploadEvidence={() => setIsUploadOpen(true)}
                  onOpenAddEvent={() => setIsAddEventOpen(true)}
                />
              )}

              {currentTab === 'understand-docs' && (
                <UnderstandDocsView
                  onOpenUpload={() => setIsUploadOpen(true)}
                />
              )}

              {currentTab === 'ask-nyaysetu' && (
                <AskNyaySetuView
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
        onSubmit={(title) => {
          alert(`Added "${title}" to your Evidence Vault.`);
        }}
      />

      <AddEventModal
        isOpen={isAddEventOpen}
        onClose={() => setIsAddEventOpen(false)}
        onSubmit={(title, date) => {
          alert(`Added timeline milestone "${title}" on ${date}.`);
        }}
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
        onStart={(title, category) => {
          handleTabChange('prepare-case');
        }}
      />
    </div>
  );
}

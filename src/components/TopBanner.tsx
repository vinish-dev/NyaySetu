'use client';

import * as React from 'react';
import { ShieldAlert, ArrowRight, Menu } from 'lucide-react';

interface TopBannerProps {
  onOpenMobileSidebar: () => void;
  onOpenHelp: () => void;
}

export function TopBanner({ onOpenMobileSidebar, onOpenHelp }: TopBannerProps) {
  return (
    <>
      {/* Mobile Bar */}
      <div className="flex h-14 items-center justify-between border-b border-slate-200 bg-white px-4 lg:hidden">
        <button
          onClick={onOpenMobileSidebar}
          className="rounded-lg p-2 text-slate-600 hover:bg-slate-100"
        >
          <Menu className="h-5 w-5" />
        </button>
        <span className="font-heading font-extrabold text-slate-900 text-base">
          NyaySetu
        </span>
        <div className="w-8" />
      </div>

      {/* Global Legal Information Banner */}
      <div className="flex items-center justify-between border-b border-indigo-100 bg-[#fbfbfe] px-6 py-2 text-xs text-slate-500">
        <div className="flex items-center gap-2">
          <ShieldAlert className="h-4 w-4 text-indigo-600 shrink-0" />
          <span>
            <strong className="text-slate-700">Legal Information Notice:</strong>{' '}
            NyaySetu provides legal information and preparation assistance and does not replace professional legal advice.
          </span>
        </div>
        <button
          onClick={onOpenHelp}
          className="hidden sm:inline-flex items-center gap-1 font-semibold text-indigo-600 hover:text-indigo-700 shrink-0 cursor-pointer"
        >
          <span>Learn how we protect you</span>
          <ArrowRight className="h-3 w-3" />
        </button>
      </div>
    </>
  );
}

'use client';

import * as React from 'react';
import {
  Scale,
  Plus,
  LayoutDashboard,
  Briefcase,
  FileText,
  ListCheck,
  Search,
  Landmark,
  HelpCircle,
  ShieldCheck,
  ChevronDown,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SidebarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  onOpenNewCase: () => void;
  onOpenAuthorityGuide: () => void;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
}

export function Sidebar({
  currentTab,
  onSelectTab,
  onOpenNewCase,
  onOpenAuthorityGuide,
  isMobileOpen,
  onCloseMobile,
}: SidebarProps) {
  const mainNav = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'my-cases', label: 'My Cases', icon: Briefcase, badge: '3' },
    { id: 'prepare-case', label: 'Prepare Case', icon: ListCheck, badge: 'Wizard', badgePulse: true },
    { id: 'understand-docs', label: 'Understand Documents', icon: FileText },
    { id: 'ask-nyaysetu', label: 'Ask NyaySetu', icon: Search },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-xs lg:hidden"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-slate-200/90 bg-white transition-transform duration-200 ease-in-out lg:static lg:translate-x-0 ${
          isMobileOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
        }`}
      >
        {/* Header / Brand */}
        <div className="flex h-16 items-center justify-between px-5">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-700 via-indigo-600 to-violet-500 text-white shadow-md shadow-indigo-500/20">
              <Scale className="h-5 w-5" />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold tracking-tight text-slate-900 leading-tight text-base font-heading">
                NyaySetu
              </span>
              <span className="text-[11px] font-medium text-slate-500 tracking-tight">
                Case Preparation Assistant
              </span>
            </div>
          </div>
          <button
            onClick={onCloseMobile}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 lg:hidden"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Primary Action Button */}
        <div className="px-4 py-2">
          <Button
            onClick={onOpenNewCase}
            variant="primary"
            className="w-full justify-center gap-2 rounded-xl py-2.5 font-semibold text-sm shadow-sm"
          >
            <Plus className="h-4 w-4" />
            <span>New Case</span>
          </Button>
        </div>

        {/* Navigation Sections */}
        <div className="flex-1 overflow-y-auto px-3 py-3 space-y-6">
          <div>
            <div className="px-3 pb-2 text-[10.5px] font-bold tracking-wider text-slate-400 uppercase">
              Main Workspace
            </div>
            <nav className="space-y-1">
              {mainNav.map((item) => {
                const Icon = item.icon;
                const isActive = currentTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      onSelectTab(item.id);
                      onCloseMobile();
                    }}
                    className={`group flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-xs font-semibold transition-all cursor-pointer ${
                      isActive
                        ? 'bg-indigo-50 text-indigo-700 font-bold'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon
                        className={`h-4 w-4 transition-colors ${
                          isActive
                            ? 'text-indigo-600'
                            : 'text-slate-400 group-hover:text-slate-600'
                        }`}
                      />
                      <span>{item.label}</span>
                    </div>

                    {item.badge && (
                      <span
                        className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                          item.badgePulse
                            ? 'bg-indigo-100 text-indigo-700'
                            : 'bg-indigo-50 text-indigo-600'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          <div>
            <div className="px-3 pb-2 text-[10.5px] font-bold tracking-wider text-slate-400 uppercase">
              Help & Authority Guides
            </div>
            <nav className="space-y-1">
              <button
                onClick={onOpenAuthorityGuide}
                className="group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-medium text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-900 cursor-pointer"
              >
                <Landmark className="h-4 w-4 text-slate-400 group-hover:text-slate-600" />
                <span>Authority Guide</span>
              </button>
              <button
                onClick={onOpenAuthorityGuide}
                className="group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-medium text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-900 cursor-pointer"
              >
                <HelpCircle className="h-4 w-4 text-slate-400 group-hover:text-slate-600" />
                <span>Help Center</span>
              </button>
            </nav>
          </div>

          {/* Trust Disclaimer Card */}
          <div className="mx-1 rounded-2xl border border-dashed border-indigo-200 bg-indigo-50/40 p-3.5">
            <div className="flex items-start gap-2.5">
              <div className="mt-0.5 rounded-lg bg-indigo-100 p-1.5 text-indigo-600">
                <ShieldCheck className="h-4 w-4" />
              </div>
              <div className="space-y-1">
                <p className="text-xs font-bold text-slate-800 leading-snug">
                  We don't provide legal advice.
                </p>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  We help you prepare your case so you can take informed action.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* User Footer Profile */}
        <div className="border-t border-slate-200/80 p-3.5">
          <div className="flex items-center gap-3 rounded-xl p-1.5 transition-colors hover:bg-slate-50 cursor-pointer">
            <img
              src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80"
              alt="Ananya Sharma"
              className="h-8 w-8 rounded-full object-cover ring-2 ring-indigo-100"
            />
            <div className="flex flex-1 flex-col overflow-hidden">
              <span className="truncate text-xs font-bold text-slate-800">
                Ananya Sharma
              </span>
              <span className="truncate text-[11px] text-slate-400">
                ananya@gmail.com
              </span>
            </div>
            <ChevronDown className="h-4 w-4 text-slate-400" />
          </div>
        </div>
      </aside>
    </>
  );
}

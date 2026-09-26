'use client';

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
  size?: "default" | "lg" | "xl";
  ariaLabel?: string;
}

export function Modal({
  isOpen,
  onClose,
  title,
  children,
  footer,
  className,
  size = "default",
  ariaLabel,
}: ModalProps) {
  const modalRef = React.useRef<HTMLDivElement>(null);
  const titleId = React.useId();

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
      // Accessibility focus management
      setTimeout(() => {
        modalRef.current?.focus();
      }, 50);
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  const sizeClass = {
    default: "max-w-md",
    lg: "max-w-2xl",
    xl: "max-w-3xl",
  }[size];

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          role="presentation"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            onClick={onClose}
            aria-hidden="true"
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs cursor-pointer"
          />

          {/* Dialog Body */}
          <motion.div
            ref={modalRef}
            tabIndex={-1}
            role="dialog"
            aria-modal="true"
            aria-labelledby={title ? titleId : undefined}
            aria-label={!title ? (ariaLabel || "Dialog") : undefined}
            initial={{ opacity: 0, scale: 0.97, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: 8 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className={cn(
              "relative z-10 w-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl flex flex-col max-h-[90vh] focus:outline-none",
              sizeClass,
              className
            )}
          >
            {title && (
              <header className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
                <div id={titleId} className="text-base font-bold text-slate-900">
                  {title}
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Close dialog"
                  className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors focus:ring-2 focus:ring-indigo-500 focus:outline-none cursor-pointer"
                >
                  <X className="h-5 w-5" aria-hidden="true" />
                </button>
              </header>
            )}

            <div className="overflow-y-auto px-6 py-4 space-y-4 flex-1">
              {children}
            </div>

            {footer && (
              <footer className="flex items-center justify-end gap-2 border-t border-slate-100 bg-slate-50/60 px-6 py-3">
                {footer}
              </footer>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

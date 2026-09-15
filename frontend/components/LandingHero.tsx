"use client";

import React from "react";
import {
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  FileSearch,
  Layers,
  FileCheck2,
  HelpCircle,
  AlertTriangle,
} from "lucide-react";

interface LandingHeroProps {
  onStartAnalysis: () => void;
  onViewSample: () => void;
  onNavigateTab?: (tab: any) => void;
}

export function LandingHero({
  onStartAnalysis,
  onViewSample,
  onNavigateTab,
}: LandingHeroProps) {
  return (
    <div className="space-y-14 py-6 max-w-5xl mx-auto transition-colors duration-200">
      {/* 5-Second Pitch Hero */}
      <div className="text-center space-y-5 max-w-3xl mx-auto">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#f1f1ef] dark:bg-[#202020] border border-[#e9e9e7] dark:border-[#2f2f2f] text-xs text-[#2f3437] dark:text-[#e6e6e6]">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          <span className="font-medium">Evidence-First Document Intelligence</span>
        </div>

        <h1 className="text-4xl sm:text-5xl font-extrabold text-[#2f3437] dark:text-white tracking-tight leading-[1.18]">
          Know exactly how your resume matches the job.
        </h1>

        <p className="text-base sm:text-lg text-[#787774] dark:text-[#9b9a97] leading-relaxed max-w-2xl mx-auto">
          AlignMatrix maps job requirements to exact evidence in your resume, identifies strong,
          partial, missing, and unsupported matches, and prepares you for the interview.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            onClick={onStartAnalysis}
            className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-6 py-2.5 rounded-md bg-[#2f3437] dark:bg-white hover:bg-[#1f2326] dark:hover:bg-[#e6e6e6] text-white dark:text-[#191919] font-medium text-sm transition-all shadow-xs"
          >
            <span>Analyze my resume</span>
            <ArrowRight className="h-4 w-4" />
          </button>

          <button
            onClick={onViewSample}
            className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-5 py-2.5 rounded-md bg-white dark:bg-[#202020] hover:bg-[#fbfbfa] dark:hover:bg-[#282828] text-[#2f3437] dark:text-[#e6e6e6] border border-[#e9e9e7] dark:border-[#2f2f2f] font-medium text-sm transition-all shadow-xs"
          >
            <Layers className="h-4 w-4 text-[#787774] dark:text-[#9b9a97]" />
            <span>Explore Evidence Matrix</span>
          </button>
        </div>

        {/* Coverage Preview Pill Bar */}
        <div className="pt-3">
          <div className="inline-flex flex-wrap items-center justify-center gap-2.5 text-xs px-4 py-2 rounded-lg bg-white dark:bg-[#202020] border border-[#e9e9e7] dark:border-[#2f2f2f] text-[#787774] dark:text-[#9b9a97] font-mono shadow-2xs">
            <span className="text-emerald-700 dark:text-emerald-400 font-bold">78% requirement coverage</span>
            <span className="text-[#d3d1cb] dark:text-[#383838]">•</span>
            <span>12 strong matches</span>
            <span className="text-[#d3d1cb] dark:text-[#383838]">•</span>
            <span>4 partial matches</span>
            <span className="text-[#d3d1cb] dark:text-[#383838]">•</span>
            <span className="text-rose-700 dark:text-rose-400">3 missing requirements</span>
            <span className="text-[#d3d1cb] dark:text-[#383838]">•</span>
            <span className="text-amber-700 dark:text-amber-400">2 claims requiring proof</span>
          </div>
        </div>
      </div>

      {/* 3-Step Simple Flow */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-2">
        <div
          onClick={onStartAnalysis}
          className="p-5 rounded-lg bg-white dark:bg-[#202020] border border-[#e9e9e7] dark:border-[#2f2f2f] space-y-2 shadow-2xs hover:border-[#d3d1cb] dark:hover:border-[#444444] transition-colors cursor-pointer"
        >
          <div className="text-[11px] font-mono text-[#9b9a97] uppercase tracking-wider font-semibold">
            01 / Upload
          </div>
          <h3 className="text-sm font-semibold text-[#2f3437] dark:text-white">Upload your resume</h3>
          <p className="text-xs text-[#787774] dark:text-[#9b9a97] leading-relaxed">
            Drag and drop PDF, DOCX, or text. PII (phone, email, address) is redacted before AI evaluation.
          </p>
        </div>

        <div
          onClick={onStartAnalysis}
          className="p-5 rounded-lg bg-white dark:bg-[#202020] border border-[#e9e9e7] dark:border-[#2f2f2f] space-y-2 shadow-2xs hover:border-[#d3d1cb] dark:hover:border-[#444444] transition-colors cursor-pointer"
        >
          <div className="text-[11px] font-mono text-[#9b9a97] uppercase tracking-wider font-semibold">
            02 / Target
          </div>
          <h3 className="text-sm font-semibold text-[#2f3437] dark:text-white">Add job description</h3>
          <p className="text-xs text-[#787774] dark:text-[#9b9a97] leading-relaxed">
            Paste target role responsibilities and criteria for deterministic requirement mapping.
          </p>
        </div>

        <div
          onClick={onViewSample}
          className="p-5 rounded-lg bg-white dark:bg-[#202020] border border-[#e9e9e7] dark:border-[#2f2f2f] space-y-2 shadow-2xs hover:border-[#d3d1cb] dark:hover:border-[#444444] transition-colors cursor-pointer"
        >
          <div className="text-[11px] font-mono text-[#9b9a97] uppercase tracking-wider font-semibold">
            03 / Evidence
          </div>
          <h3 className="text-sm font-semibold text-[#2f3437] dark:text-white">Review evidence & gaps</h3>
          <p className="text-xs text-[#787774] dark:text-[#9b9a97] leading-relaxed">
            Inspect verbatim quotes for every match, identify gaps, and practice interview defense.
          </p>
        </div>
      </div>

      {/* Direct Page Redirection Showcases */}
      <div className="space-y-4 pt-4 border-t border-[#e9e9e7] dark:border-[#2f2f2f]">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-[#2f3437] dark:text-white">
              Explore Analysis Workspace Pages
            </h2>
            <p className="text-xs text-[#787774] dark:text-[#9b9a97]">
              Jump straight to any section to see how AlignMatrix evaluates documents.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <button
            onClick={() => onNavigateTab ? onNavigateTab("matrix") : onViewSample()}
            className="p-4 text-left rounded-lg bg-white dark:bg-[#202020] border border-[#e9e9e7] dark:border-[#2f2f2f] hover:border-[#2f3437] dark:hover:border-white transition-all shadow-2xs group"
          >
            <div className="flex items-center justify-between text-xs font-semibold text-[#2f3437] dark:text-white mb-1">
              <span className="flex items-center space-x-1.5">
                <Layers className="h-4 w-4 text-[#787774] dark:text-[#9b9a97] group-hover:text-[#2f3437] dark:group-hover:text-white" />
                <span>Evidence Matrix</span>
              </span>
              <ArrowRight className="h-3.5 w-3.5 text-[#9b9a97] group-hover:translate-x-0.5 transition-transform" />
            </div>
            <p className="text-[11px] text-[#787774] dark:text-[#9b9a97]">
              Verbatim quotes proving every qualification.
            </p>
          </button>

          <button
            onClick={() => onNavigateTab ? onNavigateTab("inspector") : onViewSample()}
            className="p-4 text-left rounded-lg bg-white dark:bg-[#202020] border border-[#e9e9e7] dark:border-[#2f2f2f] hover:border-[#2f3437] dark:hover:border-white transition-all shadow-2xs group"
          >
            <div className="flex items-center justify-between text-xs font-semibold text-[#2f3437] dark:text-white mb-1">
              <span className="flex items-center space-x-1.5">
                <FileCheck2 className="h-4 w-4 text-[#787774] dark:text-[#9b9a97] group-hover:text-[#2f3437] dark:group-hover:text-white" />
                <span>Document Inspector</span>
              </span>
              <ArrowRight className="h-3.5 w-3.5 text-[#9b9a97] group-hover:translate-x-0.5 transition-transform" />
            </div>
            <p className="text-[11px] text-[#787774] dark:text-[#9b9a97]">
              Static ATS readability and claim auditor.
            </p>
          </button>

          <button
            onClick={() => onNavigateTab ? onNavigateTab("missing") : onViewSample()}
            className="p-4 text-left rounded-lg bg-white dark:bg-[#202020] border border-[#e9e9e7] dark:border-[#2f2f2f] hover:border-[#2f3437] dark:hover:border-white transition-all shadow-2xs group"
          >
            <div className="flex items-center justify-between text-xs font-semibold text-[#2f3437] dark:text-white mb-1">
              <span className="flex items-center space-x-1.5">
                <AlertTriangle className="h-4 w-4 text-[#787774] dark:text-[#9b9a97] group-hover:text-[#2f3437] dark:group-hover:text-white" />
                <span>Missing Gaps</span>
              </span>
              <ArrowRight className="h-3.5 w-3.5 text-[#9b9a97] group-hover:translate-x-0.5 transition-transform" />
            </div>
            <p className="text-[11px] text-[#787774] dark:text-[#9b9a97]">
              High-impact missing requirements & answers.
            </p>
          </button>

          <button
            onClick={() => onNavigateTab ? onNavigateTab("interview") : onViewSample()}
            className="p-4 text-left rounded-lg bg-white dark:bg-[#202020] border border-[#e9e9e7] dark:border-[#2f2f2f] hover:border-[#2f3437] dark:hover:border-white transition-all shadow-2xs group"
          >
            <div className="flex items-center justify-between text-xs font-semibold text-[#2f3437] dark:text-white mb-1">
              <span className="flex items-center space-x-1.5">
                <HelpCircle className="h-4 w-4 text-[#787774] dark:text-[#9b9a97] group-hover:text-[#2f3437] dark:group-hover:text-white" />
                <span>Interview Prep</span>
              </span>
              <ArrowRight className="h-3.5 w-3.5 text-[#9b9a97] group-hover:translate-x-0.5 transition-transform" />
            </div>
            <p className="text-[11px] text-[#787774] dark:text-[#9b9a97]">
              STAR technical defense cheat sheets.
            </p>
          </button>
        </div>
      </div>
    </div>
  );
}

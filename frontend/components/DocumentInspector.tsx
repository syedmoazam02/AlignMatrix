"use client";

import React, { useState, useRef, useEffect } from "react";
import { Quote, CheckCircle2, Search, ArrowRight, Eye, ShieldCheck, Sparkles } from "lucide-react";
import { ScoreBreakdown, MatchEvidence } from "@/lib/types";

interface DocumentInspectorProps {
  scorecard: ScoreBreakdown;
  resumeText: string;
}

export function DocumentInspector({ scorecard, resumeText }: DocumentInspectorProps) {
  const [activeExcerpt, setActiveExcerpt] = useState<string | null>(null);
  const documentRef = useRef<HTMLDivElement>(null);

  // Collect all citations across categories
  const allEvidence: { category: string; evidence: MatchEvidence }[] = [
    ...(scorecard.skills_match?.evidence || []).map((e) => ({ category: "Skills Match", evidence: e })),
    ...(scorecard.experience_match?.evidence || []).map((e) => ({ category: "Experience Match", evidence: e })),
    ...(scorecard.job_alignment?.evidence || []).map((e) => ({ category: "Job Alignment", evidence: e })),
    ...(scorecard.impact_and_achievements?.evidence || []).map((e) => ({ category: "Impact & Deliverables", evidence: e })),
    ...(scorecard.education_match?.evidence || []).map((e) => ({ category: "Education Match", evidence: e })),
  ].filter((item) => item.evidence.resume_excerpt);

  // Set default active excerpt on load
  useEffect(() => {
    if (allEvidence.length > 0 && !activeExcerpt) {
      setActiveExcerpt(allEvidence[0].evidence.resume_excerpt);
    }
  }, [allEvidence, activeExcerpt]);

  // Scroll to active citation in document pane
  useEffect(() => {
    if (activeExcerpt && documentRef.current) {
      const highlightedEl = documentRef.current.querySelector(".citation-highlight");
      if (highlightedEl) {
        highlightedEl.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
  }, [activeExcerpt]);

  // Render document text with highlighted excerpt
  const renderHighlightedDocument = () => {
    if (!activeExcerpt) {
      return <pre className="whitespace-pre-wrap font-mono text-xs text-slate-300 leading-relaxed">{resumeText}</pre>;
    }

    // Clean excerpt for substring search
    const cleanExcerpt = activeExcerpt.trim();
    const index = resumeText.toLowerCase().indexOf(cleanExcerpt.toLowerCase());

    if (index === -1) {
      return (
        <div className="space-y-4">
          <div className="p-3 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-xs text-indigo-300 flex items-center space-x-2">
            <Quote className="h-4 w-4 shrink-0" />
            <span>Active Citation Quote: "{cleanExcerpt}"</span>
          </div>
          <pre className="whitespace-pre-wrap font-mono text-xs text-slate-300 leading-relaxed">{resumeText}</pre>
        </div>
      );
    }

    const before = resumeText.slice(0, index);
    const match = resumeText.slice(index, index + cleanExcerpt.length);
    const after = resumeText.slice(index + cleanExcerpt.length);

    return (
      <div className="whitespace-pre-wrap font-mono text-xs text-slate-300 leading-relaxed">
        <span>{before}</span>
        <mark className="citation-highlight bg-indigo-500/30 text-indigo-200 border border-indigo-400/50 rounded px-1.5 py-0.5 shadow-lg shadow-indigo-500/20 inline-block font-semibold transition-all">
          <span className="inline-flex items-center space-x-1 text-[9px] uppercase font-bold text-indigo-300 mr-1.5 px-1 py-0.2 bg-indigo-950/80 rounded border border-indigo-500/40">
            <CheckCircle2 className="h-2.5 w-2.5 text-emerald-400" />
            <span>Verified Citation</span>
          </span>
          {match}
        </mark>
        <span>{after}</span>
      </div>
    );
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-800">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center space-x-2">
            <Eye className="h-5 w-5 text-indigo-400" />
            <span>Split Document Inspector</span>
          </h3>
          <p className="text-xs text-slate-400">
            Click any evidence citation on the right to inspect the exact sentence and surrounding context in the candidate resume.
          </p>
        </div>
        <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 self-start sm:self-auto">
          {allEvidence.length} Verifiable Citations Found
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Pane: Document Viewer (7 cols) */}
        <div className="lg:col-span-7 glass-panel rounded-2xl border border-slate-800 overflow-hidden flex flex-col h-[650px]">
          <div className="px-4 py-3 bg-slate-900/80 border-b border-slate-800 flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-300 flex items-center space-x-2">
              <span className="h-2 w-2 rounded-full bg-indigo-500 inline-block" />
              <span>Candidate Resume Source Document</span>
            </span>
            <span className="text-slate-500 text-[11px]">Auto-Highlighting Active</span>
          </div>

          <div ref={documentRef} className="p-6 overflow-y-auto flex-1 bg-slate-950/60">
            {renderHighlightedDocument()}
          </div>
        </div>

        {/* Right Pane: Citation Selector (5 cols) */}
        <div className="lg:col-span-5 space-y-3 h-[650px] overflow-y-auto pr-1">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
            Select Match Citation to Inspect
          </div>

          {allEvidence.map((item, idx) => {
            const isSelected = activeExcerpt === item.evidence.resume_excerpt;
            return (
              <div
                key={idx}
                onClick={() => setActiveExcerpt(item.evidence.resume_excerpt)}
                className={`p-4 rounded-xl border transition-all cursor-pointer space-y-2 ${
                  isSelected
                    ? "bg-indigo-950/40 border-indigo-500 shadow-lg shadow-indigo-500/10 ring-1 ring-indigo-500/50 scale-[1.01]"
                    : "bg-slate-900/70 hover:bg-slate-900/90 border-slate-800"
                }`}
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-indigo-300 text-[11px] uppercase tracking-wider">
                    {item.category}
                  </span>
                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                      item.evidence.assessment === "matched"
                        ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                        : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                    }`}
                  >
                    {item.evidence.assessment.toUpperCase()}
                  </span>
                </div>

                <div className="text-xs font-semibold text-white leading-snug">
                  {item.evidence.requirement}
                </div>

                <div className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-800/80 text-[11px] text-slate-300 font-mono italic flex items-start space-x-1.5">
                  <Quote className="h-3.5 w-3.5 text-indigo-400 shrink-0 mt-0.5" />
                  <span className="line-clamp-2">"{item.evidence.resume_excerpt}"</span>
                </div>

                <p className="text-[11px] text-slate-400 leading-relaxed">
                  {item.evidence.explanation}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

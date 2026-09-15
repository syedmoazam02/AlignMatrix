"use client";

import React from "react";
import {
  CheckCircle2,
  Clock,
  Layers,
  ArrowRight,
  ShieldAlert,
  Info,
  FileCheck2,
  HelpCircle,
} from "lucide-react";
import { ScoreBreakdown } from "@/lib/types";
import { ActiveView } from "./Sidebar";

interface OverviewViewProps {
  scorecard: ScoreBreakdown;
  evaluationId: number;
  onNavigate: (view: ActiveView) => void;
}

export function OverviewView({
  scorecard,
  evaluationId,
  onNavigate,
}: OverviewViewProps) {
  const { overall_score } = scorecard;
  const strengths = scorecard.strengths || [
    "Exceptional evidence density for core technical competencies.",
    "Quantifiable production achievements cited in work history.",
  ];
  const recommendations = scorecard.recommendations || [
    "Prepare proactive interview responses for system scaling trade-offs.",
    "Document baseline metrics to substantiate performance gains.",
  ];

  return (
    <div className="space-y-6 max-w-6xl mx-auto animate-in fade-in duration-200">
      {/* Target Role & Header */}
      <div className="p-5 rounded-lg bg-white dark:bg-[#202020] border border-[#e9e9e7] dark:border-[#2f2f2f] flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-2xs transition-colors">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-[#f1f1ef] dark:bg-[#2c2c2c] text-[#2f3437] dark:text-[#e6e6e6] border border-[#e9e9e7] dark:border-[#2f2f2f] font-mono">
              Job #{evaluationId}
            </span>
            <span className="text-xs text-[#787774] dark:text-[#9b9a97] font-mono">
              Verified Candidate Scorecard
            </span>
          </div>
          <h2 className="text-xl font-bold text-[#2f3437] dark:text-white tracking-tight">
            Senior Backend Engineer (Distributed Systems)
          </h2>
          <p className="text-xs text-[#787774] dark:text-[#9b9a97]">
            CloudScale Systems • San Francisco, CA (or Remote)
          </p>
        </div>

        <button
          onClick={() => onNavigate("matrix")}
          className="inline-flex items-center space-x-2 px-4 py-2 rounded-md bg-[#2f3437] dark:bg-white hover:bg-[#1f2326] dark:hover:bg-[#e6e6e6] text-white dark:text-[#191919] font-medium text-xs transition-all shadow-2xs shrink-0"
        >
          <span>View Evidence Matrix</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Calm Coverage Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3.5">
        <div className="p-4 rounded-lg bg-white dark:bg-[#202020] border border-[#e9e9e7] dark:border-[#2f2f2f] space-y-1 shadow-2xs transition-colors">
          <span className="text-[11px] uppercase font-bold text-[#9b9a97] tracking-wider block">
            Requirement Coverage
          </span>
          <div className="text-2xl font-bold text-[#2f3437] dark:text-white font-mono">78%</div>
          <p className="text-[11px] text-[#787774] dark:text-[#9b9a97]">12 of 15 criteria verified</p>
        </div>

        <div className="p-4 rounded-lg bg-white dark:bg-[#202020] border border-[#e9e9e7] dark:border-[#2f2f2f] space-y-1 shadow-2xs transition-colors">
          <span className="text-[11px] uppercase font-bold text-[#9b9a97] tracking-wider block">
            Evidence Strength
          </span>
          <div className="text-2xl font-bold text-[#2f3437] dark:text-white font-mono">68%</div>
          <p className="text-[11px] text-[#787774] dark:text-[#9b9a97]">Substantiated with quotes</p>
        </div>

        <div className="p-4 rounded-lg bg-white dark:bg-[#202020] border border-[#e9e9e7] dark:border-[#2f2f2f] space-y-1 shadow-2xs transition-colors">
          <span className="text-[11px] uppercase font-bold text-[#9b9a97] tracking-wider block">
            Critical Requirements
          </span>
          <div className="text-2xl font-bold text-[#2f3437] dark:text-white font-mono">5 / 6</div>
          <p className="text-[11px] text-amber-700 dark:text-amber-400">1 high-priority gap</p>
        </div>

        <div className="p-4 rounded-lg bg-white dark:bg-[#202020] border border-[#e9e9e7] dark:border-[#2f2f2f] space-y-1 shadow-2xs transition-colors">
          <span className="text-[11px] uppercase font-bold text-[#9b9a97] tracking-wider block">
            Document Quality
          </span>
          <div className="text-2xl font-bold text-emerald-700 dark:text-emerald-400 font-mono">High</div>
          <p className="text-[11px] text-[#787774] dark:text-[#9b9a97]">Clean ATS parseability</p>
        </div>

        <div className="p-4 rounded-lg bg-white dark:bg-[#202020] border border-[#e9e9e7] dark:border-[#2f2f2f] space-y-1 shadow-2xs col-span-2 lg:col-span-1 transition-colors">
          <span className="text-[11px] uppercase font-bold text-[#9b9a97] tracking-wider block">
            Claims to Verify
          </span>
          <div className="text-2xl font-bold text-[#2f3437] dark:text-white font-mono">2</div>
          <p className="text-[11px] text-[#787774] dark:text-[#9b9a97]">Metrics lacking baseline</p>
        </div>
      </div>

      {/* Honest Clarifying Disclaimer */}
      <div className="p-3.5 rounded-lg bg-[#fbfbfa] dark:bg-[#202020] border border-[#e9e9e7] dark:border-[#2f2f2f] flex items-center justify-between text-xs text-[#787774] dark:text-[#9b9a97] transition-colors">
        <div className="flex items-center space-x-2">
          <Info className="h-4 w-4 text-[#9b9a97] shrink-0" />
          <span>
            <strong>Evaluation Disclaimer:</strong> These metrics represent documented requirement coverage based on textual evidence, not an arbitrary hiring decision.
          </span>
        </div>
        <span className="font-mono text-[11px] text-[#9b9a97] hidden md:inline">Deterministic Backend Scoring</span>
      </div>

      {/* Strengths & Immediate Recommendations */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="p-5 rounded-lg bg-white dark:bg-[#202020] border border-[#e9e9e7] dark:border-[#2f2f2f] space-y-3 shadow-2xs transition-colors">
          <div className="flex items-center space-x-2 text-xs font-bold text-[#2f3437] dark:text-white">
            <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            <span>Documented Strengths</span>
          </div>
          <ul className="space-y-2 text-xs text-[#787774] dark:text-[#9b9a97]">
            {strengths.map((str, i) => (
              <li key={i} className="flex items-start space-x-2">
                <span className="text-[#9b9a97] font-mono">•</span>
                <span className="leading-relaxed text-[#2f3437] dark:text-[#e6e6e6]">{str}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="p-5 rounded-lg bg-white dark:bg-[#202020] border border-[#e9e9e7] dark:border-[#2f2f2f] space-y-3 shadow-2xs transition-colors">
          <div className="flex items-center space-x-2 text-xs font-bold text-[#2f3437] dark:text-white">
            <ShieldAlert className="h-4 w-4 text-amber-600 dark:text-amber-400" />
            <span>Priority Recommendations</span>
          </div>
          <ul className="space-y-2 text-xs text-[#787774] dark:text-[#9b9a97]">
            {recommendations.map((rec, i) => (
              <li key={i} className="flex items-start space-x-2">
                <span className="text-[#9b9a97] font-mono">•</span>
                <span className="leading-relaxed text-[#2f3437] dark:text-[#e6e6e6]">{rec}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Quick Navigation Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
        <button
          onClick={() => onNavigate("inspector")}
          className="p-4 rounded-lg bg-white dark:bg-[#202020] border border-[#e9e9e7] dark:border-[#2f2f2f] hover:border-[#2f3437] dark:hover:border-white transition-all text-left shadow-2xs group"
        >
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-semibold text-[#2f3437] dark:text-white">Document Inspector</span>
            <FileCheck2 className="h-4 w-4 text-[#787774] dark:text-[#9b9a97] group-hover:text-[#2f3437] dark:group-hover:text-white" />
          </div>
          <p className="text-[11px] text-[#787774] dark:text-[#9b9a97]">
            Audit formatting, bullet consistency, and unsupported claim risks.
          </p>
        </button>

        <button
          onClick={() => onNavigate("missing")}
          className="p-4 rounded-lg bg-white dark:bg-[#202020] border border-[#e9e9e7] dark:border-[#2f2f2f] hover:border-[#2f3437] dark:hover:border-white transition-all text-left shadow-2xs group"
        >
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-semibold text-[#2f3437] dark:text-white">Missing Requirements</span>
            <ShieldAlert className="h-4 w-4 text-[#787774] dark:text-[#9b9a97] group-hover:text-[#2f3437] dark:group-hover:text-white" />
          </div>
          <p className="text-[11px] text-[#787774] dark:text-[#9b9a97]">
            Triage gap impact and formulate truthful interview responses.
          </p>
        </button>

        <button
          onClick={() => onNavigate("interview")}
          className="p-4 rounded-lg bg-white dark:bg-[#202020] border border-[#e9e9e7] dark:border-[#2f2f2f] hover:border-[#2f3437] dark:hover:border-white transition-all text-left shadow-2xs group"
        >
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-semibold text-[#2f3437] dark:text-white">Interview Prep</span>
            <HelpCircle className="h-4 w-4 text-[#787774] dark:text-[#9b9a97] group-hover:text-[#2f3437] dark:group-hover:text-white" />
          </div>
          <p className="text-[11px] text-[#787774] dark:text-[#9b9a97]">
            Practice STAR technical questions based on your resume evidence.
          </p>
        </button>
      </div>
    </div>
  );
}

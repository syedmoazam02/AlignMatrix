"use client";

import React, { useState } from "react";
import {
  ShieldCheck,
  Check,
  Sparkles,
  Layers,
  ArrowRight,
  Info,
  CheckCircle2,
} from "lucide-react";

interface ResumeEditorViewProps {
  initialResumeText: string;
}

export function ResumeEditorView({ initialResumeText }: ResumeEditorViewProps) {
  const [resumeText, setResumeText] = useState(initialResumeText);
  const [truthProtection, setTruthProtection] = useState(true);
  const [selectedBulletIndex, setSelectedBulletIndex] = useState(0);

  const sampleBullets = [
    {
      id: 0,
      text: "Designed and maintained high-throughput asynchronous backend services using Python and FastAPI serving 12M+ monthly requests.",
      supports: [
        { req: "Python & FastAPI", status: "Demonstrated" },
        { req: "Asynchronous APIs", status: "Demonstrated" },
      ],
      suggestion: "Add concurrency architecture details (e.g. uvloop, connection pooling) to emphasize senior depth.",
    },
    {
      id: 1,
      text: "Optimized complex PostgreSQL relational queries, introducing database partitioning and indexing that slashed p99 latency by 38%.",
      supports: [
        { req: "PostgreSQL Modeling", status: "Demonstrated" },
        { req: "Query Optimization", status: "Demonstrated" },
      ],
      suggestion: "Add baseline numbers if known (e.g., from 420ms to 260ms) to make the metric bulletproof in interviews.",
    },
    {
      id: 2,
      text: "Implemented Redis caching layers with semantic invalidation to reduce database load under peak load conditions.",
      supports: [
        { req: "Redis Caching", status: "Partial Match" },
        { req: "Latency Reduction", status: "Partial Match" },
      ],
      suggestion: "State the estimated cache hit ratio or database offload percentage you personally observed in staging or production.",
    },
    {
      id: 3,
      text: "Spearheaded test automation coverage from 64% to 92% utilizing pytest and integration suites.",
      supports: [
        { req: "pytest Test Suites", status: "Demonstrated" },
        { req: "CI/CD Automation", status: "Demonstrated" },
      ],
      suggestion: "Mention how this impacted release frequency or lowered escaped bugs in production.",
    },
  ];

  const activeBullet = sampleBullets[selectedBulletIndex] || sampleBullets[0];

  return (
    <div className="space-y-6 max-w-6xl mx-auto animate-in fade-in duration-200">
      {/* Header with Truth Protection Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#e9e9e7] dark:border-[#2f2f2f]">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-[#f1f1ef] dark:bg-[#202020] text-[#2f3437] dark:text-[#e6e6e6] border border-[#e9e9e7] dark:border-[#2f2f2f] font-mono">
              Context Editor
            </span>
            <span className="text-xs text-[#787774] dark:text-[#9b9a97] font-mono">
              Live Requirement Mapping
            </span>
          </div>
          <h2 className="text-xl font-bold text-[#2f3437] dark:text-white tracking-tight mt-1">
            Resume Bullet Editor
          </h2>
          <p className="text-xs text-[#787774] dark:text-[#9b9a97] mt-0.5">
            Refine your statements with live requirement context. Suggestions only rephrase user-confirmed facts.
          </p>
        </div>

        {/* Truth Protection Toggle */}
        <div className="flex items-center space-x-3 p-2 rounded-lg bg-white dark:bg-[#202020] border border-[#e9e9e7] dark:border-[#2f2f2f] shadow-2xs transition-colors">
          <div className="flex items-center space-x-2 text-xs">
            <ShieldCheck
              className={`h-4 w-4 ${
                truthProtection ? "text-emerald-700 dark:text-emerald-400" : "text-[#9b9a97]"
              }`}
            />
            <span className="font-semibold text-[#2f3437] dark:text-white">Truth Protection:</span>
            <span
              className={`font-mono font-bold ${
                truthProtection ? "text-emerald-700 dark:text-emerald-400" : "text-amber-700 dark:text-amber-400"
              }`}
            >
              {truthProtection ? "ON" : "OFF"}
            </span>
          </div>

          <button
            type="button"
            onClick={() => setTruthProtection(!truthProtection)}
            className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
              truthProtection ? "bg-[#2f3437] dark:bg-white" : "bg-[#e9e9e7] dark:bg-[#383838]"
            }`}
          >
            <span
              className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white dark:bg-[#191919] shadow-md ring-0 transition duration-200 ease-in-out ${
                truthProtection ? "translate-x-4" : "translate-x-0"
              }`}
            />
          </button>
        </div>
      </div>

      {/* Split-Screen Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Bullet Selector & Editor (7 cols) */}
        <div className="lg:col-span-7 space-y-3">
          <div className="text-[11px] font-bold uppercase tracking-wider text-[#9b9a97]">
            Select Bullet to Inspect & Refine
          </div>

          <div className="space-y-2.5">
            {sampleBullets.map((bullet, idx) => {
              const isSelected = selectedBulletIndex === idx;
              return (
                <div
                  key={bullet.id}
                  onClick={() => setSelectedBulletIndex(idx)}
                  className={`p-4 rounded-lg border transition-all cursor-pointer space-y-2 ${
                    isSelected
                      ? "bg-white dark:bg-[#202020] border-[#2f3437] dark:border-white shadow-xs ring-1 ring-[#2f3437] dark:ring-white"
                      : "bg-white dark:bg-[#202020] hover:bg-[#fbfbfa] dark:hover:bg-[#252525] border-[#e9e9e7] dark:border-[#2f2f2f] shadow-2xs"
                  }`}
                >
                  <div className="flex items-center justify-between text-xs text-[#787774] dark:text-[#9b9a97]">
                    <span className="font-mono text-[11px] font-semibold text-[#2f3437] dark:text-white">
                      Bullet #{idx + 1}
                    </span>
                    <span className="text-[11px] text-emerald-800 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-1.5 py-0.2 rounded border border-emerald-200 dark:border-emerald-800 font-mono">
                      Supports {bullet.supports.length} Requirements
                    </span>
                  </div>

                  <p className="text-xs text-[#2f3437] dark:text-[#e6e6e6] leading-relaxed font-mono">
                    • {bullet.text}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Live Requirement Context & Truthful Advice (5 cols) */}
        <div className="lg:col-span-5 space-y-3">
          <div className="text-[11px] font-bold uppercase tracking-wider text-[#9b9a97]">
            Live Requirement Context
          </div>

          <div className="p-5 rounded-lg bg-white dark:bg-[#202020] border border-[#e9e9e7] dark:border-[#2f2f2f] shadow-2xs space-y-4 transition-colors">
            <div>
              <span className="text-[10px] uppercase font-bold text-[#9b9a97] tracking-wider block">
                Requirements Supported by Selected Bullet
              </span>
              <div className="space-y-1.5 mt-2">
                {activeBullet.supports.map((sup, sIdx) => (
                  <div
                    key={sIdx}
                    className="p-2.5 rounded-md bg-[#fbfbfa] dark:bg-[#191919] border border-[#e9e9e7] dark:border-[#2f2f2f] flex items-center justify-between text-xs"
                  >
                    <span className="font-medium text-[#2f3437] dark:text-white">{sup.req}</span>
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${
                        sup.status === "Demonstrated"
                          ? "bg-emerald-50 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800"
                          : "bg-amber-50 dark:bg-amber-950/50 text-amber-800 dark:text-amber-400 border-amber-200 dark:border-amber-800"
                      }`}
                    >
                      {sup.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Truthful Refinement Recommendation */}
            <div className="pt-3 border-t border-[#e9e9e7] dark:border-[#2f2f2f] space-y-1.5">
              <span className="text-[10px] uppercase font-bold text-[#2f3437] dark:text-white tracking-wider flex items-center space-x-1">
                <Sparkles className="h-3.5 w-3.5 text-[#787774] dark:text-[#9b9a97]" />
                <span>Truth-Guarded Coaching</span>
              </span>
              <p className="text-xs text-[#2f3437] dark:text-[#e6e6e6] leading-relaxed bg-[#fbfbfa] dark:bg-[#191919] p-3 rounded-md border border-[#e9e9e7] dark:border-[#2f2f2f]">
                {activeBullet.suggestion}
              </p>
            </div>

            {/* Guardrail Policy Disclaimer */}
            <div className="p-3 rounded-md bg-[#fbfbfa] dark:bg-[#191919] border border-[#e9e9e7] dark:border-[#2f2f2f] text-[11px] text-[#787774] dark:text-[#9b9a97] space-y-1">
              <span className="font-semibold text-[#2f3437] dark:text-white block">
                Truth Protection Policy:
              </span>
              <span>
                The assistant strictly forbids fabricating performance gains, imaginary tools, or unverified accomplishments. All suggestions preserve factual honesty.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

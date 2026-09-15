"use client";

import React, { useState } from "react";
import {
  CheckCircle2,
  AlertTriangle,
  Info,
  Check,
  X,
  FileCheck2,
} from "lucide-react";

interface Finding {
  id: string;
  category: "Structure" | "Evidence Quality" | "ATS Readability";
  severity: "passing" | "warning" | "critical";
  title: string;
  explanation: string;
  location: string;
  suggestedFix: string;
  status: "open" | "resolved" | "dismissed";
}

export function InspectorView() {
  const [findings, setFindings] = useState<Finding[]>([
    {
      id: "f-1",
      category: "Structure",
      severity: "passing",
      title: "Contact information verified",
      explanation: "Full name, phone, email, and location header cleanly detected and parsable.",
      location: "Lines 1-4 (Header)",
      suggestedFix: "No action required.",
      status: "open",
    },
    {
      id: "f-2",
      category: "Structure",
      severity: "passing",
      title: "Education section standard format",
      explanation: "Standard degree title, institution, and graduation year clearly structured.",
      location: "Lines 34-35 (Education)",
      suggestedFix: "No action required.",
      status: "open",
    },
    {
      id: "f-3",
      category: "Structure",
      severity: "warning",
      title: "Inconsistent employment date separators",
      explanation: "Mix of en-dash '–' and hyphen '-' used across role date ranges. Some legacy ATS tools misparse mixed date separators.",
      location: "Lines 19, 27 (Experience)",
      suggestedFix: "Standardize all date ranges to 'Month Year – Month Year' format.",
      status: "open",
    },
    {
      id: "f-4",
      category: "Evidence Quality",
      severity: "warning",
      title: "Impact claim lacks baseline measurement",
      explanation: "'...slashed p99 latency by 38%' is a strong outcome, but omitting initial baseline (e.g. from 420ms to 260ms) invites interview scrutiny.",
      location: "Line 21 (CloudScale Systems)",
      suggestedFix: "Add starting and ending latency metrics to make this bullet incontrovertible.",
      status: "open",
    },
    {
      id: "f-5",
      category: "Evidence Quality",
      severity: "critical",
      title: "Keyword exists only in skills list without project proof",
      explanation: "'AWS' is listed under Core Technical Competencies, but no work experience bullets cite AWS services (ECS, RDS, S3). This triggers interview credibility flags.",
      location: "Line 11 (Competencies)",
      suggestedFix: "Substantiate AWS usage in an experience bullet or remove it from the skills block.",
      status: "open",
    },
    {
      id: "f-6",
      category: "ATS Readability",
      severity: "passing",
      title: "Pure machine-readable selectable text",
      explanation: "Zero multi-column tables, graphics, or nested textboxes detected that break OCR parsers.",
      location: "Global Document",
      suggestedFix: "No action required.",
      status: "open",
    },
  ]);

  const [filterCategory, setFilterCategory] = useState<string>("All");

  const markStatus = (id: string, newStatus: "resolved" | "dismissed") => {
    setFindings((prev) =>
      prev.map((f) => (f.id === id ? { ...f, status: newStatus } : f))
    );
  };

  const getSeverityBadge = (sev: Finding["severity"]) => {
    switch (sev) {
      case "passing":
        return (
          <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 flex items-center space-x-1">
            <CheckCircle2 className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
            <span>Passing</span>
          </span>
        );
      case "warning":
        return (
          <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-amber-50 dark:bg-amber-950/50 text-amber-800 dark:text-amber-400 border border-amber-200 dark:border-amber-800 flex items-center space-x-1">
            <AlertTriangle className="h-3 w-3 text-amber-600 dark:text-amber-400" />
            <span>Warning</span>
          </span>
        );
      case "critical":
        return (
          <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-rose-50 dark:bg-rose-950/50 text-rose-800 dark:text-rose-400 border border-rose-200 dark:border-rose-800 flex items-center space-x-1">
            <AlertTriangle className="h-3 w-3 text-rose-600 dark:text-rose-400" />
            <span>Critical Proof Risk</span>
          </span>
        );
    }
  };

  const filteredFindings = findings.filter((f) => {
    if (filterCategory === "All") return true;
    return f.category === filterCategory;
  });

  return (
    <div className="space-y-6 max-w-6xl mx-auto animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#e9e9e7] dark:border-[#2f2f2f]">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-[#f1f1ef] dark:bg-[#202020] text-[#2f3437] dark:text-[#e6e6e6] border border-[#e9e9e7] dark:border-[#2f2f2f] font-mono">
              Static Code Linter
            </span>
            <span className="text-xs text-[#787774] dark:text-[#9b9a97] font-mono">
              ATS & Document Integrity
            </span>
          </div>
          <h2 className="text-xl font-bold text-[#2f3437] dark:text-white tracking-tight mt-1">
            Document Quality & Evidence Inspector
          </h2>
          <p className="text-xs text-[#787774] dark:text-[#9b9a97] mt-0.5">
            Automated static audit of document structure, ATS machine readability, and unverifiable claim risks.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center space-x-1.5 overflow-x-auto pb-1">
          {["All", "Structure", "Evidence Quality", "ATS Readability"].map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`px-2.5 py-1 rounded-md text-xs transition-colors ${
                filterCategory === cat
                  ? "bg-[#2f3437] dark:bg-white text-white dark:text-[#191919] font-medium"
                  : "bg-white dark:bg-[#202020] text-[#787774] dark:text-[#9b9a97] hover:text-[#2f3437] dark:hover:text-white border border-[#e9e9e7] dark:border-[#2f2f2f] hover:bg-[#fbfbfa] dark:hover:bg-[#282828]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Findings List */}
      <div className="space-y-3">
        {filteredFindings.map((finding) => (
          <div
            key={finding.id}
            className={`p-4 rounded-lg bg-white dark:bg-[#202020] border border-[#e9e9e7] dark:border-[#2f2f2f] shadow-2xs space-y-3 transition-colors ${
              finding.status !== "open"
                ? "opacity-60 bg-[#fbfbfa] dark:bg-[#1c1c1c]"
                : ""
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center space-x-2.5">
                {getSeverityBadge(finding.severity)}
                <span className="text-xs font-bold text-[#2f3437] dark:text-white">
                  {finding.title}
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#f1f1ef] dark:bg-[#2c2c2c] text-[#787774] dark:text-[#9b9a97] border border-[#e9e9e7] dark:border-[#383838]">
                  {finding.category} • {finding.location}
                </span>
              </div>

              {finding.status === "open" && finding.severity !== "passing" && (
                <div className="flex items-center space-x-1.5 shrink-0">
                  <button
                    onClick={() => markStatus(finding.id, "resolved")}
                    className="flex items-center space-x-1 px-2.5 py-1 rounded-md bg-[#f1f1ef] dark:bg-[#2c2c2c] hover:bg-[#eaeae8] dark:hover:bg-[#383838] text-[#2f3437] dark:text-[#e6e6e6] text-[11px] font-medium border border-[#e9e9e7] dark:border-[#383838] transition-colors"
                  >
                    <Check className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
                    <span>Mark Resolved</span>
                  </button>
                  <button
                    onClick={() => markStatus(finding.id, "dismissed")}
                    className="flex items-center space-x-1 px-2 py-1 rounded-md hover:bg-[#f1f1ef] dark:hover:bg-[#2c2c2c] text-[#9b9a97] hover:text-[#2f3437] dark:hover:text-white text-[11px] transition-colors"
                  >
                    <X className="h-3 w-3" />
                    <span>Dismiss</span>
                  </button>
                </div>
              )}

              {finding.status !== "open" && (
                <span className="text-[11px] font-mono text-[#9b9a97] uppercase">
                  [{finding.status}]
                </span>
              )}
            </div>

            <p className="text-xs text-[#787774] dark:text-[#9b9a97] leading-relaxed">
              {finding.explanation}
            </p>

            {finding.severity !== "passing" && (
              <div className="p-2.5 rounded-md bg-[#fbfbfa] dark:bg-[#191919] border border-[#e9e9e7] dark:border-[#2f2f2f] text-xs text-[#2f3437] dark:text-[#e6e6e6] flex items-start space-x-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#9b9a97] shrink-0 mt-0.5">
                  Recommendation:
                </span>
                <span className="text-[#2f3437] dark:text-[#e6e6e6] font-medium">{finding.suggestedFix}</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

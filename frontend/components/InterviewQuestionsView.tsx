"use client";

import React, { useState } from "react";
import { Copy, Check, HelpCircle, ShieldAlert, Sparkles, UserCheck, AlertTriangle } from "lucide-react";
import { ScoreBreakdown, GapEvidence } from "@/lib/types";

interface InterviewQuestionsViewProps {
  scorecard: ScoreBreakdown;
}

interface GeneratedQuestion {
  target: string;
  type: "gap" | "partial";
  severity: "high" | "medium" | "low";
  probeQuestion: string;
  scenarioQuestion: string;
  positiveIndicators: string[];
  redFlags: string[];
}

export function InterviewQuestionsView({ scorecard }: InterviewQuestionsViewProps) {
  const [copied, setCopied] = useState(false);
  const [filter, setFilter] = useState<"all" | "gaps" | "partial">("all");

  const identified_gaps = scorecard.identified_gaps || [];
  const skills_match = scorecard.skills_match;
  const experience_match = scorecard.experience_match;
  const job_alignment = scorecard.job_alignment;
  const impact_and_achievements = scorecard.impact_and_achievements;
  const education_match = scorecard.education_match;

  // Synthesize questions from gaps and partial match evidence
  const questions: GeneratedQuestion[] = [];

  // 1. From Identified Gaps
  identified_gaps.forEach((gap) => {
    questions.push({
      target: gap.missing_requirement,
      type: "gap",
      severity: gap.impact,
      probeQuestion: `Can you walk us through your practical experience with ${gap.missing_requirement}? If you haven't used it directly in production, what comparable technologies have you utilized?`,
      scenarioQuestion: `Suppose our team needs to implement a solution using ${gap.missing_requirement} to resolve an immediate bottleneck. How would you approach researching, designing, and onboarding the team?`,
      positiveIndicators: [
        "Articulates fundamental architectural principles even if tooling differs.",
        "Demonstrates rapid learning methodology and curiosity.",
        "Acknowledges boundary of experience honestly without fabricating.",
      ],
      redFlags: [
        "Claims extensive production mastery without ability to explain tradeoffs.",
        "Dismisses the requirement as unimportant without justification.",
      ],
    });
  });

  // Fallback from Evidence Matrix missing items if no identified_gaps
  if (identified_gaps.length === 0 && scorecard.evidence_matrix) {
    scorecard.evidence_matrix
      .filter((m) => m.status === "Missing" || m.status === "Unsupported")
      .forEach((item) => {
        questions.push({
          target: item.requirement,
          type: "gap",
          severity: item.status === "Missing" ? "high" : "medium",
          probeQuestion: `Can you walk us through your practical experience with ${item.requirement}? If you haven't used it directly in production, what comparable technologies have you utilized?`,
          scenarioQuestion: `Suppose our team needs to implement a solution using ${item.requirement} to resolve an immediate bottleneck. How would you approach researching, designing, and onboarding the team?`,
          positiveIndicators: [
            "Articulates fundamental architectural principles even if tooling differs.",
            "Demonstrates rapid learning methodology and curiosity.",
            "Acknowledges boundary of experience honestly without fabricating.",
          ],
          redFlags: [
            "Claims extensive production mastery without ability to explain tradeoffs.",
            "Dismisses the requirement as unimportant without justification.",
          ],
        });
      });
  }

  // 2. From Partial Matches across categories
  const allEvidence = [
    ...(skills_match?.evidence || []),
    ...(experience_match?.evidence || []),
    ...(job_alignment?.evidence || []),
    ...(impact_and_achievements?.evidence || []),
    ...(education_match?.evidence || []),
  ];

  allEvidence
    .filter((e) => e.assessment === "partial")
    .forEach((partial) => {
      questions.push({
        target: partial.requirement,
        type: "partial",
        severity: "medium",
        probeQuestion: `In reviewing your background, you demonstrate partial exposure to ${partial.requirement}. What was your specific individual contribution vs the broader team's scope?`,
        scenarioQuestion: `If given full ownership of an initiative requiring ${partial.requirement}, what key risks would you anticipate and how would you mitigate them?`,
        positiveIndicators: [
          "Clearly delineates personal ownership vs team contributions.",
          "Cites concrete metrics or architectural decisions made.",
        ],
        redFlags: [
          "Vague responses about 'we implemented' without personal clarity.",
          "Unfamiliarity with underlying mechanics.",
        ],
      });
    });

  // Fallback from Evidence Matrix partial matches if no category evidence
  if (allEvidence.length === 0 && scorecard.evidence_matrix) {
    scorecard.evidence_matrix
      .filter((m) => m.status === "Partial Match")
      .forEach((partial) => {
        questions.push({
          target: partial.requirement,
          type: "partial",
          severity: "medium",
          probeQuestion: `In reviewing your background, you demonstrate partial exposure to ${partial.requirement}. What was your specific individual contribution vs the broader team's scope?`,
          scenarioQuestion: `If given full ownership of an initiative requiring ${partial.requirement}, what key risks would you anticipate and how would you mitigate them?`,
          positiveIndicators: [
            "Clearly delineates personal ownership vs team contributions.",
            "Cites concrete metrics or architectural decisions made.",
          ],
          redFlags: [
            "Vague responses about 'we implemented' without personal clarity.",
            "Unfamiliarity with underlying mechanics.",
          ],
        });
      });
  }

  const filteredQuestions = questions.filter((q) => {
    if (filter === "gaps") return q.type === "gap";
    if (filter === "partial") return q.type === "partial";
    return true;
  });

  const handleCopyAll = () => {
    const formattedText = questions
      .map(
        (q, idx) =>
          `### ${idx + 1}. Focus Area: ${q.target} [${q.type.toUpperCase()} - ${q.severity.toUpperCase()} PRIORITY]\n\n` +
          `**Technical Probe:** ${q.probeQuestion}\n\n` +
          `**Scenario Challenge:** ${q.scenarioQuestion}\n\n` +
          `*Look for:* ${q.positiveIndicators.join(", ")}\n` +
          `*Red flags:* ${q.redFlags.join(", ")}\n`
      )
      .join("\n---\n\n");

    navigator.clipboard.writeText(
      `# Targeted Interview Cheat Sheet (Generated by AlignMatrix)\n\n${formattedText}`
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header & Copy Button */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/20">
              Hiring Manager Toolkit
            </span>
            <span className="text-xs text-slate-400">
              {questions.length} Targeted Questions Generated
            </span>
          </div>
          <h3 className="text-xl font-bold text-white mt-1">
            Tailored Candidate Interview Cheat Sheet
          </h3>
          <p className="text-xs text-slate-400 max-w-xl mt-0.5">
            These questions probe the exact competency gaps and partial matches identified in the candidate's scorecard.
          </p>
        </div>

        <button
          onClick={handleCopyAll}
          className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-all shadow-lg shadow-indigo-500/20 hover:scale-[1.02] active:scale-[0.98] shrink-0"
        >
          {copied ? (
            <>
              <Check className="h-4 w-4 text-emerald-300" />
              <span>Copied to Clipboard!</span>
            </>
          ) : (
            <>
              <Copy className="h-4 w-4" />
              <span>Copy Questions to Clipboard</span>
            </>
          )}
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center space-x-2">
        <button
          onClick={() => setFilter("all")}
          className={`text-xs font-semibold px-3 py-1.5 rounded-lg border transition-all ${
            filter === "all"
              ? "bg-indigo-600 text-white border-indigo-500"
              : "bg-slate-900/60 text-slate-400 hover:text-white border-slate-800"
          }`}
        >
          All ({questions.length})
        </button>
        <button
          onClick={() => setFilter("gaps")}
          className={`text-xs font-semibold px-3 py-1.5 rounded-lg border transition-all ${
            filter === "gaps"
              ? "bg-amber-600 text-white border-amber-500"
              : "bg-slate-900/60 text-slate-400 hover:text-white border-slate-800"
          }`}
        >
          Missing Requirements ({questions.filter((q) => q.type === "gap").length})
        </button>
        <button
          onClick={() => setFilter("partial")}
          className={`text-xs font-semibold px-3 py-1.5 rounded-lg border transition-all ${
            filter === "partial"
              ? "bg-purple-600 text-white border-purple-500"
              : "bg-slate-900/60 text-slate-400 hover:text-white border-slate-800"
          }`}
        >
          Partial Matches ({questions.filter((q) => q.type === "partial").length})
        </button>
      </div>

      {/* Questions Cards */}
      <div className="space-y-4">
        {filteredQuestions.map((q, idx) => (
          <div
            key={idx}
            className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4 hover:border-slate-700 transition-all"
          >
            <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-800">
              <div className="flex items-center space-x-2">
                <span className="h-6 w-6 rounded-full bg-slate-800 text-indigo-400 font-bold text-xs flex items-center justify-center border border-slate-700">
                  {idx + 1}
                </span>
                <span className="text-sm font-bold text-white">{q.target}</span>
              </div>

              <div className="flex items-center space-x-2 text-[10px] font-bold uppercase">
                <span
                  className={`px-2.5 py-0.5 rounded-full border ${
                    q.type === "gap"
                      ? "bg-rose-500/10 text-rose-400 border-rose-500/20"
                      : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                  }`}
                >
                  {q.type === "gap" ? "Identified Gap" : "Partial Match"}
                </span>
                <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700">
                  {q.severity} Impact
                </span>
              </div>
            </div>

            {/* Questions block */}
            <div className="space-y-3">
              <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400 block">
                  1. Technical Probe
                </span>
                <p className="text-xs text-slate-200 leading-relaxed font-medium">
                  {q.probeQuestion}
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400 block">
                  2. Scenario / Design Challenge
                </span>
                <p className="text-xs text-slate-200 leading-relaxed font-medium">
                  {q.scenarioQuestion}
                </p>
              </div>
            </div>

            {/* Signal guides */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
              <div className="p-3 rounded-xl bg-emerald-950/20 border border-emerald-500/20 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 flex items-center space-x-1">
                  <UserCheck className="h-3 w-3" />
                  <span>Positive Signals (Green Flags)</span>
                </span>
                <ul className="text-[11px] text-slate-300 space-y-0.5">
                  {q.positiveIndicators.map((pos, pIdx) => (
                    <li key={pIdx} className="flex items-start space-x-1.5">
                      <span className="text-emerald-400">•</span>
                      <span>{pos}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-3 rounded-xl bg-rose-950/20 border border-rose-500/20 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-rose-400 flex items-center space-x-1">
                  <AlertTriangle className="h-3 w-3" />
                  <span>Red Flags (Warning Signals)</span>
                </span>
                <ul className="text-[11px] text-slate-300 space-y-0.5">
                  {q.redFlags.map((rf, rIdx) => (
                    <li key={rIdx} className="flex items-start space-x-1.5">
                      <span className="text-rose-400">•</span>
                      <span>{rf}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

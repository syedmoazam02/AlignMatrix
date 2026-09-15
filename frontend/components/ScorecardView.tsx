"use client";

import React, { useState } from "react";
import {
  CheckCircle2,
  Award,
  BookOpen,
  Briefcase,
  Layers,
  Sparkles,
  TrendingUp,
  RefreshCw,
  Quote,
  ShieldAlert,
  BarChart3,
  Eye,
  HelpCircle,
} from "lucide-react";
import { ScoreBreakdown, MatchEvidence } from "@/lib/types";
import { RadialScoreGauge } from "./RadialScoreGauge";
import { CompetencyRadar } from "./CompetencyRadar";
import { DocumentInspector } from "./DocumentInspector";
import { InterviewQuestionsView } from "./InterviewQuestionsView";

interface ScorecardViewProps {
  scorecard: ScoreBreakdown;
  evaluationId: number;
  resumeText: string;
  onReset: () => void;
}

export function ScorecardView({
  scorecard,
  evaluationId,
  resumeText,
  onReset,
}: ScorecardViewProps) {
  const [activeTab, setActiveTab] = useState<"scorecard" | "inspector" | "interview">("scorecard");
  const [selectedCategory, setSelectedCategory] = useState<
    "skills" | "experience" | "alignment" | "impact" | "education"
  >("skills");

  const overall_score = scorecard.overall_score;
  const skills_match = scorecard.skills_match;
  const experience_match = scorecard.experience_match;
  const job_alignment = scorecard.job_alignment;
  const impact_and_achievements = scorecard.impact_and_achievements;
  const education_match = scorecard.education_match;
  const identified_gaps = scorecard.identified_gaps || [];
  const strengths = scorecard.strengths || [];
  const recommendations = scorecard.recommendations || [];

  const categories = [
    {
      key: "skills" as const,
      label: "Skills Match",
      weight: "30%",
      data: skills_match,
      icon: Layers,
    },
    {
      key: "experience" as const,
      label: "Experience Match",
      weight: "25%",
      data: experience_match,
      icon: Briefcase,
    },
    {
      key: "alignment" as const,
      label: "Job Alignment",
      weight: "20%",
      data: job_alignment,
      icon: TrendingUp,
    },
    {
      key: "impact" as const,
      label: "Impact & Deliverables",
      weight: "15%",
      data: impact_and_achievements,
      icon: Award,
    },
    {
      key: "education" as const,
      label: "Education Match",
      weight: "10%",
      data: education_match,
      icon: BookOpen,
    },
  ];

  const currentCategoryData = categories.find((c) => c.key === selectedCategory)?.data;

  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-7xl mx-auto">
      {/* Top Banner with Navigation Tabs */}
      <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl -z-10 pointer-events-none" />

        <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left space-y-4 sm:space-y-0 sm:space-x-6">
          <RadialScoreGauge score={overall_score} size={130} />

          <div className="space-y-1">
            <div className="flex items-center justify-center sm:justify-start space-x-2">
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700 font-mono">
                Job ID #{evaluationId}
              </span>
              <span className="text-xs font-semibold text-emerald-400 flex items-center space-x-1">
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span>Deterministic Score Verified</span>
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Candidate Evaluation Intelligence
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 max-w-xl">
              Weighted backend formula: Skills (30%) + Experience (25%) + Alignment (20%) + Impact (15%) + Education (10%).
            </p>
          </div>
        </div>

        <button
          onClick={onReset}
          className="inline-flex items-center space-x-2 text-xs font-semibold px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700/80 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg shrink-0"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          <span>Evaluate Another Document</span>
        </button>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center space-x-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab("scorecard")}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            activeTab === "scorecard"
              ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/20"
              : "bg-slate-900/60 text-slate-400 hover:text-white border border-slate-800"
          }`}
        >
          <BarChart3 className="h-4 w-4" />
          <span>Executive Scorecard</span>
        </button>

        <button
          onClick={() => setActiveTab("inspector")}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            activeTab === "inspector"
              ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/20"
              : "bg-slate-900/60 text-slate-400 hover:text-white border border-slate-800"
          }`}
        >
          <Eye className="h-4 w-4" />
          <span>Split Document Inspector</span>
        </button>

        <button
          onClick={() => setActiveTab("interview")}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            activeTab === "interview"
              ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/20"
              : "bg-slate-900/60 text-slate-400 hover:text-white border border-slate-800"
          }`}
        >
          <HelpCircle className="h-4 w-4" />
          <span>Interview Cheat Sheet ({identified_gaps.length})</span>
        </button>
      </div>

      {/* Tab 1: Executive Scorecard */}
      {activeTab === "scorecard" && (
        <div className="space-y-8 animate-in fade-in duration-300">
          {/* Radar Chart & 5 Weighted Categories */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            {/* 5 Weighted Categories Matrix (8 cols) */}
            <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {categories.map((cat) => {
                const Icon = cat.icon;
                const isSelected = selectedCategory === cat.key;
                return (
                  <button
                    key={cat.key}
                    onClick={() => setSelectedCategory(cat.key)}
                    className={`p-4 rounded-xl text-left border transition-all ${
                      isSelected
                        ? "bg-indigo-950/40 border-indigo-500/60 shadow-lg shadow-indigo-500/10 ring-1 ring-indigo-500/40"
                        : "bg-slate-900/60 hover:bg-slate-900/90 border-slate-800"
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                      <div className="flex items-center space-x-1.5">
                        <Icon className="h-3.5 w-3.5 text-indigo-400" />
                        <span className="font-medium">{cat.label}</span>
                      </div>
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
                        {cat.weight}
                      </span>
                    </div>

                    <div className="flex items-baseline justify-between">
                      <span className="text-2xl font-bold text-white font-mono">
                        {cat.data?.score ?? 0}
                      </span>
                      <span className="text-xs text-slate-400">/ 100</span>
                    </div>

                    <div className="w-full bg-slate-800 h-1.5 rounded-full mt-3 overflow-hidden">
                      <div
                        className="bg-indigo-500 h-full rounded-full transition-all duration-700"
                        style={{ width: `${cat.data?.score ?? 0}%` }}
                      />
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Radar Chart (4 cols) */}
            <div className="lg:col-span-4 flex justify-center">
              <CompetencyRadar scorecard={scorecard} size={300} />
            </div>
          </div>

          {/* Evidence Explorer & Detailed Breakdown */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left 2 Cols: Category Evidence Cards */}
            <div className="lg:col-span-2 space-y-6">
              <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div>
                    <h3 className="text-lg font-bold text-white flex items-center space-x-2">
                      <span>Evidence Explorer:</span>
                      <span className="text-indigo-400">
                        {categories.find((c) => c.key === selectedCategory)?.label}
                      </span>
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Exact resume excerpts programmatically verified against role requirements.
                    </p>
                  </div>
                  <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                    Score: {currentCategoryData?.score}/100
                  </span>
                </div>

                {/* Category Rationale */}
                <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 text-sm text-slate-300 leading-relaxed">
                  <span className="font-semibold text-white block mb-1 text-xs uppercase tracking-wider">
                    Category Assessment Rationale
                  </span>
                  {currentCategoryData?.rationale}
                </div>

                {/* Evidence items */}
                <div className="space-y-4 pt-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Cited Evidence & Direct Excerpts
                  </h4>

                  {currentCategoryData?.evidence && currentCategoryData.evidence.length > 0 ? (
                    currentCategoryData.evidence.map((ev, idx) => (
                      <div
                        key={idx}
                        className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-3"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <span className="text-sm font-semibold text-white">
                            {ev.requirement}
                          </span>
                          <div className="flex items-center space-x-2 text-xs font-semibold">
                            <span
                              className={`px-2 py-0.5 rounded-full border ${
                                ev.assessment === "matched"
                                  ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                                  : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                              }`}
                            >
                              {ev.assessment.toUpperCase()}
                            </span>
                            <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700">
                              {ev.confidence.toUpperCase()} CONFIDENCE
                            </span>
                          </div>
                        </div>

                        {ev.resume_excerpt && (
                          <div className="p-3 rounded-lg bg-indigo-950/20 border border-indigo-500/20 text-xs text-indigo-200 font-mono flex items-start space-x-2">
                            <Quote className="h-4 w-4 text-indigo-400 shrink-0 mt-0.5" />
                            <span className="italic leading-relaxed">
                              "{ev.resume_excerpt}"
                            </span>
                          </div>
                        )}

                        <p className="text-xs text-slate-400 leading-relaxed">
                          <strong className="text-slate-300">Explanation: </strong>
                          {ev.explanation}
                        </p>
                      </div>
                    ))
                  ) : (
                    <div className="p-4 rounded-xl bg-slate-900 text-xs text-slate-500">
                      No individual match citations reported for this section.
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right Col: Gaps, Strengths & Recommendations */}
            <div className="space-y-6">
              {/* Gaps Panel */}
              <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
                <div className="flex items-center space-x-2">
                  <ShieldAlert className="h-5 w-5 text-amber-400" />
                  <h3 className="text-md font-bold text-white">Identified Gaps</h3>
                </div>

                {identified_gaps && identified_gaps.length > 0 ? (
                  <div className="space-y-3">
                    {identified_gaps.map((gap, i) => (
                      <div
                        key={i}
                        className="p-3.5 rounded-xl bg-slate-900/80 border border-amber-500/20 space-y-1.5"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-200">
                            {gap.missing_requirement}
                          </span>
                          <span
                            className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border ${
                              gap.impact === "high"
                                ? "bg-rose-500/10 text-rose-400 border-rose-500/20"
                                : gap.impact === "medium"
                                ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                                : "bg-slate-800 text-slate-400 border-slate-700"
                            }`}
                          >
                            {gap.impact} Impact
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 leading-relaxed">
                          {gap.explanation}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300">
                    Zero critical competency gaps detected in the evaluated profile.
                  </div>
                )}
              </div>

              {/* Strengths & Recommendations */}
              <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
                <div className="flex items-center space-x-2">
                  <Sparkles className="h-5 w-5 text-indigo-400" />
                  <h3 className="text-md font-bold text-white">
                    Strengths & Guidance
                  </h3>
                </div>

                <div className="space-y-2">
                  <h4 className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
                    Key Strengths
                  </h4>
                  <ul className="space-y-1.5">
                    {strengths.map((str, idx) => (
                      <li
                        key={idx}
                        className="text-xs text-slate-300 flex items-start space-x-2"
                      >
                        <span className="text-emerald-400 font-bold shrink-0">•</span>
                        <span>{str}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-2 pt-2 border-t border-slate-800">
                  <h4 className="text-xs font-semibold text-indigo-400 uppercase tracking-wider">
                    Recommendations
                  </h4>
                  <ul className="space-y-1.5">
                    {recommendations.map((rec, idx) => (
                      <li
                        key={idx}
                        className="text-xs text-slate-300 flex items-start space-x-2"
                      >
                        <span className="text-indigo-400 font-bold shrink-0">•</span>
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Split Document Inspector */}
      {activeTab === "inspector" && (
        <DocumentInspector scorecard={scorecard} resumeText={resumeText} />
      )}

      {/* Tab 3: Targeted Interview Question Generator */}
      {activeTab === "interview" && (
        <InterviewQuestionsView scorecard={scorecard} />
      )}
    </div>
  );
}

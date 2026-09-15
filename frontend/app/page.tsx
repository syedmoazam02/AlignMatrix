"use client";

import React, { useState, useEffect, useRef } from "react";
import { Navbar, NavTab } from "@/components/Navbar";
import { LandingHero } from "@/components/LandingHero";
import { EvaluationForm } from "@/components/EvaluationForm";
import { ProcessingState } from "@/components/ProcessingState";
import { Sidebar, ActiveView } from "@/components/Sidebar";
import { OverviewView } from "@/components/OverviewView";
import { EvidenceMatrix } from "@/components/EvidenceMatrix";
import { InspectorView } from "@/components/InspectorView";
import { MissingRequirementsView } from "@/components/MissingRequirementsView";
import { ResumeEditorView } from "@/components/ResumeEditorView";
import { InterviewPrepView } from "@/components/InterviewPrepView";
import { SettingsView } from "@/components/SettingsView";
import { submitEvaluation, pollEvaluation } from "@/lib/api";
import { EvaluationStatus, ScoreBreakdown } from "@/lib/types";
import { SAMPLE_SCORECARD, SAMPLE_RESUME_TEXT } from "@/lib/sampleData";
import { ShieldAlert, RefreshCw, Info, ArrowRight } from "lucide-react";

export type AppPage =
  | "home"
  | "analyze"
  | "matrix"
  | "overview"
  | "inspector"
  | "missing"
  | "editor"
  | "interview"
  | "settings";

export default function Home() {
  const [currentPage, setCurrentPage] = useState<AppPage>("home");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPolling, setIsPolling] = useState(false);

  const [evaluationId, setEvaluationId] = useState<number | null>(null);
  const [submittedResume, setSubmittedResume] = useState<string>("");
  const [pollStatus, setPollStatus] = useState<EvaluationStatus>("queued");
  const [scorecard, setScorecard] = useState<ScoreBreakdown | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const pollTimerRef = useRef<NodeJS.Timeout | null>(null);

  const clearTimer = () => {
    if (pollTimerRef.current) {
      clearInterval(pollTimerRef.current);
      pollTimerRef.current = null;
    }
  };

  useEffect(() => {
    return () => clearTimer();
  }, []);

  const handleSubmit = async (jobDescription: string, resumeText: string) => {
    setIsSubmitting(true);
    setErrorMessage(null);
    setSubmittedResume(resumeText);

    try {
      const res = await submitEvaluation(jobDescription, resumeText);
      setEvaluationId(res.evaluation_id);
      setPollStatus(res.status);
      setIsSubmitting(false);
      setIsPolling(true);

      // Poll status every 1.5 seconds
      pollTimerRef.current = setInterval(async () => {
        try {
          const pollRes = await pollEvaluation(res.evaluation_id);
          setPollStatus(pollRes.status);

          if (pollRes.status === "completed" && pollRes.score) {
            clearTimer();
            setScorecard(pollRes.score);
            setIsPolling(false);
            setCurrentPage("matrix"); // Launch directly into signature Evidence Matrix!
          } else if (pollRes.status === "failed") {
            clearTimer();
            setErrorMessage(
              pollRes.error?.message ||
                "The evaluation could not be completed safely."
            );
            setIsPolling(false);
          }
        } catch (pollErr: any) {
          clearTimer();
          setErrorMessage(pollErr.message || "Failed during status polling.");
          setIsPolling(false);
        }
      }, 1500);
    } catch (err: any) {
      setErrorMessage(err.message || "Could not submit evaluation job.");
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    clearTimer();
    setIsSubmitting(false);
    setIsPolling(false);
    setErrorMessage(null);
    setCurrentPage("analyze");
  };

  const activeScorecard = scorecard || SAMPLE_SCORECARD;
  const activeResume = submittedResume || SAMPLE_RESUME_TEXT;
  const activeEvalId = evaluationId || 1042;
  const isViewingSample = !scorecard;

  const isWorkspaceView = [
    "matrix",
    "overview",
    "inspector",
    "missing",
    "editor",
    "interview",
    "settings",
  ].includes(currentPage);

  return (
    <div className="flex flex-col min-h-screen bg-[#fbfbfa] dark:bg-[#191919] text-[#2f3437] dark:text-[#e6e6e6] font-sans antialiased transition-colors duration-200">
      {/* Notion Top Navbar with Direct Page Tabs and Dark Mode Toggle */}
      <Navbar
        currentTab={currentPage as NavTab}
        onSelectTab={(tab) => {
          setErrorMessage(null);
          setCurrentPage(tab as AppPage);
        }}
        onNewAnalysis={handleReset}
      />

      {/* Optional Sample Mode Notification Banner */}
      {isWorkspaceView && isViewingSample && (
        <div className="bg-[#f1f1ef] dark:bg-[#202020] border-b border-[#e9e9e7] dark:border-[#2f2f2f] px-6 py-2 text-xs text-[#787774] dark:text-[#9b9a97] flex flex-col sm:flex-row items-center justify-between gap-2 transition-colors">
          <div className="flex items-center space-x-2">
            <Info className="h-3.5 w-3.5 text-[#2f3437] dark:text-[#e6e6e6] shrink-0" />
            <span>
              <strong>Sample Report:</strong> Currently previewing Senior Backend Engineer evaluation data.
            </span>
          </div>
          <button
            onClick={() => setCurrentPage("analyze")}
            className="inline-flex items-center space-x-1 font-semibold text-[#2f3437] dark:text-white hover:underline underline-offset-2"
          >
            <span>Analyze your own resume</span>
            <ArrowRight className="h-3 w-3" />
          </button>
        </div>
      )}

      {/* Processing State (Polling Background Worker) */}
      {isPolling && evaluationId && (
        <main className="flex-1 max-w-4xl w-full mx-auto px-6 py-12">
          <ProcessingState evaluationId={evaluationId} status={pollStatus} />
        </main>
      )}

      {/* Error View */}
      {errorMessage && !isPolling && (
        <main className="flex-1 max-w-xl w-full mx-auto px-6 py-16 flex items-center justify-center">
          <div className="p-8 rounded-lg bg-white dark:bg-[#202020] border border-rose-200 dark:border-rose-900/60 text-center space-y-5 shadow-sm">
            <div className="h-12 w-12 rounded-full bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-400 flex items-center justify-center mx-auto">
              <ShieldAlert className="h-6 w-6" />
            </div>

            <div className="space-y-1.5">
              <h3 className="text-base font-bold text-[#2f3437] dark:text-white">Evaluation Notice</h3>
              <p className="text-xs text-[#787774] dark:text-[#9b9a97] leading-relaxed">
                {errorMessage}
              </p>
            </div>

            <button
              onClick={handleReset}
              className="inline-flex items-center space-x-2 px-4 py-2 rounded-md bg-[#2f3437] dark:bg-white hover:bg-[#1f2326] dark:hover:bg-[#e6e6e6] text-white dark:text-[#191919] font-medium text-xs transition-all shadow-2xs"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              <span>Try Another Document</span>
            </button>
          </div>
        </main>
      )}

      {/* PAGE 1: Home / Landing Page */}
      {currentPage === "home" && !isPolling && !errorMessage && (
        <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-8">
          <LandingHero
            onStartAnalysis={() => setCurrentPage("analyze")}
            onViewSample={() => setCurrentPage("matrix")}
            onNavigateTab={(tab) => setCurrentPage(tab)}
          />
        </main>
      )}

      {/* PAGE 2: Analyze / Evaluation Form */}
      {currentPage === "analyze" && !isPolling && !errorMessage && (
        <main className="flex-1 max-w-5xl w-full mx-auto px-6 py-8">
          <div className="p-6 sm:p-8 rounded-xl bg-white dark:bg-[#202020] border border-[#e9e9e7] dark:border-[#2f2f2f] shadow-2xs">
            <EvaluationForm
              onSubmit={handleSubmit}
              isLoading={isSubmitting}
              error={errorMessage}
            />
          </div>
        </main>
      )}

      {/* PAGES 3-9: Workspace Views with Sidebar */}
      {isWorkspaceView && !isPolling && !errorMessage && (
        <div className="flex-1 flex overflow-hidden">
          <Sidebar
            activeView={currentPage as ActiveView}
            onSelectView={(view) => setCurrentPage(view as AppPage)}
            evidenceCoverage={78}
            criticalGapsCount={activeScorecard.identified_gaps?.length ?? 3}
            onGoHome={() => setCurrentPage("home")}
            onBackToInput={() => setCurrentPage("analyze")}
          />

          <main className="flex-1 overflow-y-auto p-6 lg:p-8 bg-[#fbfbfa] dark:bg-[#191919] transition-colors">
            {currentPage === "matrix" && (
              <EvidenceMatrix
                scorecard={activeScorecard}
                resumeText={activeResume}
              />
            )}

            {currentPage === "overview" && (
              <OverviewView
                scorecard={activeScorecard}
                evaluationId={activeEvalId}
                onNavigate={(view) => setCurrentPage(view as AppPage)}
              />
            )}

            {currentPage === "inspector" && <InspectorView />}

            {currentPage === "missing" && <MissingRequirementsView />}

            {currentPage === "editor" && (
              <ResumeEditorView initialResumeText={activeResume} />
            )}

            {currentPage === "interview" && (
              <InterviewPrepView scorecard={activeScorecard} />
            )}

            {currentPage === "settings" && <SettingsView />}
          </main>
        </div>
      )}

      {/* Notion Minimalist Footer */}
      <footer className="border-t border-[#e9e9e7] dark:border-[#2f2f2f] px-6 py-3.5 text-xs text-[#787774] dark:text-[#787774] bg-white dark:bg-[#191919] transition-colors">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>AlignMatrix • Document Evaluation Platform</span>
          <span>Every qualification is backed by verbatim textual evidence.</span>
        </div>
      </footer>
    </div>
  );
}

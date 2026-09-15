"use client";

import React from "react";
import { Loader2, ShieldCheck, Database, Cpu, CheckCircle2 } from "lucide-react";
import { EvaluationStatus } from "@/lib/types";

interface ProcessingStateProps {
  evaluationId: number;
  status: EvaluationStatus;
}

export function ProcessingState({ evaluationId, status }: ProcessingStateProps) {
  const isQueued = status === "queued";
  const isProcessing = status === "processing";

  return (
    <div className="p-8 rounded-xl bg-white dark:bg-[#202020] border border-[#e9e9e7] dark:border-[#2f2f2f] max-w-3xl mx-auto space-y-6 shadow-2xs animate-in fade-in duration-300 transition-colors">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#f1f1ef] dark:bg-[#2c2c2c] border border-[#e9e9e7] dark:border-[#383838] text-[#2f3437] dark:text-white text-xs font-semibold">
          <Loader2 className="h-3.5 w-3.5 animate-spin text-[#2f3437] dark:text-white" />
          <span>Job #{evaluationId} • Asynchronous Execution</span>
        </div>
        <h3 className="text-2xl font-bold text-[#2f3437] dark:text-white tracking-tight">
          {isQueued
            ? "Evaluation Job Queued"
            : "Processing & Verifying Citations..."}
        </h3>
        <p className="text-xs text-[#787774] dark:text-[#9b9a97] max-w-lg mx-auto">
          The background worker has accepted the job, redacting candidate PII, and
          querying the zero-trust model layer.
        </p>
      </div>

      {/* Visual Stepper */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
        {/* Step 1 */}
        <div className="p-4 rounded-lg bg-[#fbfbfa] dark:bg-[#191919] border border-[#e9e9e7] dark:border-[#2f2f2f] flex items-start space-x-3">
          <div className="p-2 rounded-md bg-emerald-50 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
            <CheckCircle2 className="h-4 w-4" />
          </div>
          <div>
            <div className="text-[10px] font-semibold text-emerald-800 dark:text-emerald-400 uppercase tracking-wider">
              Step 1
            </div>
            <div className="text-xs font-bold text-[#2f3437] dark:text-white">Job Enqueued</div>
            <div className="text-[11px] text-[#787774] dark:text-[#9b9a97] mt-0.5">
              HTTP 202 Accepted & state persisted in DB.
            </div>
          </div>
        </div>

        {/* Step 2 */}
        <div
          className={`p-4 rounded-lg border transition-all ${
            isProcessing
              ? "bg-white dark:bg-[#202020] border-[#2f3437] dark:border-white shadow-xs"
              : "bg-[#fbfbfa] dark:bg-[#191919] border-[#e9e9e7] dark:border-[#2f2f2f]"
          } flex items-start space-x-3`}
        >
          <div
            className={`p-2 rounded-md ${
              isProcessing
                ? "bg-[#2f3437] dark:bg-white text-white dark:text-[#191919]"
                : "bg-[#f1f1ef] dark:bg-[#2c2c2c] text-[#9b9a97]"
            }`}
          >
            {isProcessing ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Cpu className="h-4 w-4" />
            )}
          </div>
          <div>
            <div
              className={`text-[10px] font-semibold uppercase tracking-wider ${
                isProcessing ? "text-[#2f3437] dark:text-white" : "text-[#9b9a97]"
              }`}
            >
              Step 2
            </div>
            <div className="text-xs font-bold text-[#2f3437] dark:text-white">PII & LLM Extraction</div>
            <div className="text-[11px] text-[#787774] dark:text-[#9b9a97] mt-0.5">
              Strict Pydantic firewall validation.
            </div>
          </div>
        </div>

        {/* Step 3 */}
        <div className="p-4 rounded-lg bg-[#fbfbfa] dark:bg-[#191919] border border-[#e9e9e7] dark:border-[#2f2f2f] flex items-start space-x-3 opacity-60">
          <div className="p-2 rounded-md bg-[#f1f1ef] dark:bg-[#2c2c2c] text-[#9b9a97]">
            <Database className="h-4 w-4" />
          </div>
          <div>
            <div className="text-[10px] font-semibold text-[#9b9a97] uppercase tracking-wider">
              Step 3
            </div>
            <div className="text-xs font-bold text-[#2f3437] dark:text-white">Deterministic Score</div>
            <div className="text-[11px] text-[#787774] dark:text-[#9b9a97] mt-0.5">
              Weighted calculation & persistence.
            </div>
          </div>
        </div>
      </div>

      {/* Zero Trust Note */}
      <div className="p-3.5 rounded-lg bg-[#fbfbfa] dark:bg-[#191919] border border-[#e9e9e7] dark:border-[#2f2f2f] flex items-center justify-between text-xs text-[#787774] dark:text-[#9b9a97]">
        <div className="flex items-center space-x-2">
          <ShieldCheck className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
          <span>Zero-Trust AI boundary enforces evidence validation before scoring.</span>
        </div>
        <span className="font-mono text-[11px] text-[#9b9a97] hidden sm:inline">BackgroundTasks Worker</span>
      </div>
    </div>
  );
}

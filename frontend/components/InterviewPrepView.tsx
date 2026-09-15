"use client";

import React, { useState } from "react";
import { Copy, Check, HelpCircle, ShieldAlert, Sparkles, UserCheck, AlertTriangle } from "lucide-react";
import { ScoreBreakdown } from "@/lib/types";

interface InterviewPrepViewProps {
  scorecard: ScoreBreakdown;
}

export function InterviewPrepView({ scorecard }: InterviewPrepViewProps) {
  const [copied, setCopied] = useState(false);

  const interviewKits = [
    {
      question: "Can you walk us through your asynchronous FastAPI microservices architecture and how you handle concurrency?",
      evidenceToMention: "Problem context, asyncio event loop, connection pooling with SQLAlchemy, p99 latency metrics, uvloop worker sizing.",
      risk: "Your resume claims 12M+ monthly requests without mentioning database connection limits or CPU exhaustion risks.",
      responseFramework: [
        { phase: "Situation", detail: "Serving high-volume traffic with spikes causing latency regression in synchronous services." },
        { phase: "Technical Approach", detail: "Migrated to asynchronous FastAPI with parameterized asyncpg connection pool and pydantic v2 schemas." },
        { phase: "Your Contribution", detail: "Personally authored the service layer, worker pools, and zero-trust firewall." },
        { phase: "Result", detail: "Handled 12M+ monthly requests with zero connection leaks." },
        { phase: "Limitation", detail: "CPU-intensive encryption still required process workers to prevent blocking the event loop." },
      ],
      connectedRequirements: "Python, FastAPI, Asynchronous APIs, High Throughput",
    },
    {
      question: "How did you design and implement your Redis caching layer, and what was your invalidation strategy?",
      evidenceToMention: "Semantic keys, TTL strategy, cache-aside pattern, handling stale reads during concurrent writes.",
      risk: "You claim Redis reduced database load, but omit the cache hit ratio or eviction policies.",
      responseFramework: [
        { phase: "Situation", detail: "Read-heavy evaluation queries were consuming database CPU cycles during concurrent surges." },
        { phase: "Technical Approach", detail: "Implemented semantic cache keys with 10-minute TTL and automated invalidation upon document updates." },
        { phase: "Your Contribution", detail: "Built the Redis client wrapper and integrated cache fallbacks to protect database uptime." },
        { phase: "Result", detail: "Absorbed 84% of repetitive document queries." },
        { phase: "Limitation", detail: "Distributed cache invalidation across multiple regions requires pub/sub coordination." },
      ],
      connectedRequirements: "Redis, Caching, PostgreSQL Latency, System Design",
    },
    {
      question: "We noticed extensive Docker experience but no mention of Kubernetes. How would you approach our cluster deployment?",
      evidenceToMention: "Multi-stage Dockerfiles, non-root users, container health checks, eager willingness to learn Pod and Ingress manifests.",
      risk: "Acknowledge the gap openly rather than claiming unverified Kubernetes production experience.",
      responseFramework: [
        { phase: "Situation", detail: "Containerized Python services for consistent development and staging parity." },
        { phase: "Technical Approach", detail: "Used multi-stage builds to produce 110MB minimal alpine images." },
        { phase: "Your Contribution", detail: "Authored Docker Compose setups and CI container verification." },
        { phase: "Result", detail: "Fast CI spin-up and reliable deployment images." },
        { phase: "Limitation / Growth", detail: "While cluster orchestration was managed by platform teams, I understand container lifecycles and look forward to managing Pod manifests." },
      ],
      connectedRequirements: "Docker, Kubernetes, Container Orchestration, Cloud Architecture",
    },
  ];

  const handleCopy = () => {
    const text = interviewKits
      .map(
        (k, idx) =>
          `### ${idx + 1}. ${k.question}\n\n` +
          `**Evidence to Cite:** ${k.evidenceToMention}\n\n` +
          `**Watch Out (Risk):** ${k.risk}\n\n` +
          `**Response Structure:**\n` +
          k.responseFramework.map((f) => `• [${f.phase}]: ${f.detail}`).join("\n") +
          `\n\n**Connected Requirements:** ${k.connectedRequirements}\n`
      )
      .join("\n---\n\n");

    navigator.clipboard.writeText(
      `# AlignMatrix Structured Interview Framework\n\n${text}`
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#e9e9e7] dark:border-[#2f2f2f]">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-[#f1f1ef] dark:bg-[#202020] text-[#2f3437] dark:text-[#e6e6e6] border border-[#e9e9e7] dark:border-[#2f2f2f] font-mono">
              Structured Interview Preparation
            </span>
            <span className="text-xs text-[#787774] dark:text-[#9b9a97] font-mono">
              Situation → Approach → Contribution → Result → Limitation
            </span>
          </div>
          <h2 className="text-xl font-bold text-[#2f3437] dark:text-white tracking-tight mt-1">
            Evidence-Backed Candidate Interview Kits
          </h2>
          <p className="text-xs text-[#787774] dark:text-[#9b9a97] mt-0.5">
            Prepares you for technical and behavioral scrutiny by connecting your exact resume claims directly to interview questions.
          </p>
        </div>

        <button
          onClick={handleCopy}
          className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-md bg-white dark:bg-[#202020] hover:bg-[#fbfbfa] dark:hover:bg-[#282828] text-[#2f3437] dark:text-[#e6e6e6] border border-[#e9e9e7] dark:border-[#2f2f2f] font-medium text-xs transition-all shadow-2xs shrink-0"
        >
          {copied ? (
            <>
              <Check className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>Copied Framework!</span>
            </>
          ) : (
            <>
              <Copy className="h-3.5 w-3.5 text-[#787774] dark:text-[#9b9a97]" />
              <span>Copy All Kits</span>
            </>
          )}
        </button>
      </div>

      {/* Cards */}
      <div className="space-y-4">
        {interviewKits.map((kit, idx) => (
          <div
            key={idx}
            className="p-5 rounded-lg bg-white dark:bg-[#202020] border border-[#e9e9e7] dark:border-[#2f2f2f] space-y-3.5 shadow-2xs transition-colors"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#e9e9e7] dark:border-[#2f2f2f]">
              <span className="text-sm font-bold text-[#2f3437] dark:text-white flex items-center space-x-2">
                <span className="h-5 w-5 rounded-full bg-[#f1f1ef] dark:bg-[#2c2c2c] text-[#2f3437] dark:text-white font-mono text-xs flex items-center justify-center border border-[#e9e9e7] dark:border-[#383838]">
                  {idx + 1}
                </span>
                <span>{kit.question}</span>
              </span>
            </div>

            {/* Evidence & Risk Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 rounded-md bg-[#fbfbfa] dark:bg-[#191919] border border-[#e9e9e7] dark:border-[#2f2f2f] space-y-1">
                <span className="text-[10px] uppercase font-bold text-[#2f3437] dark:text-white tracking-wider block">
                  Evidence to Mention
                </span>
                <p className="text-[#787774] dark:text-[#9b9a97] leading-relaxed font-mono">
                  {kit.evidenceToMention}
                </p>
              </div>

              <div className="p-3.5 rounded-md bg-[#fbfbfa] dark:bg-[#191919] border border-[#e9e9e7] dark:border-[#2f2f2f] space-y-1">
                <span className="text-[10px] uppercase font-bold text-amber-800 dark:text-amber-400 tracking-wider flex items-center space-x-1">
                  <AlertTriangle className="h-3 w-3 text-amber-600 dark:text-amber-400" />
                  <span>Interview Risk / Potential Blindspot</span>
                </span>
                <p className="text-[#787774] dark:text-[#9b9a97] leading-relaxed font-mono">
                  {kit.risk}
                </p>
              </div>
            </div>

            {/* Structured 5-Step Response Framework */}
            <div className="pt-2">
              <span className="text-[10px] uppercase font-bold text-[#9b9a97] tracking-wider block mb-2">
                Structured Response Framework
              </span>

              <div className="space-y-1.5 font-mono text-xs">
                {kit.responseFramework.map((step, sIdx) => (
                  <div
                    key={sIdx}
                    className="p-2.5 rounded-md bg-[#fbfbfa] dark:bg-[#191919] border border-[#e9e9e7] dark:border-[#2f2f2f] flex flex-col sm:flex-row sm:items-center gap-2"
                  >
                    <span className="text-[11px] font-bold text-[#2f3437] dark:text-white uppercase tracking-wider w-24 shrink-0">
                      [{step.phase}]
                    </span>
                    <span className="text-[#787774] dark:text-[#9b9a97] leading-snug">{step.detail}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

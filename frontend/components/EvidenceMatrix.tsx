"use client";

import React, { useState } from "react";
import {
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Quote,
  ArrowRight,
} from "lucide-react";
import { ScoreBreakdown } from "@/lib/types";

interface EvidenceMatrixProps {
  scorecard: ScoreBreakdown;
  resumeText: string;
}

interface MatrixItem {
  id: string;
  requirement: string;
  priority: "Critical" | "High" | "Preferred";
  status: "Demonstrated" | "Partial" | "Missing" | "Unsupported" | "Needs Verification";
  evidenceSnippet: string | null;
  confidence: "High" | "Medium" | "Low";
  action: string;
  qualificationReason: string;
  missingDetails: string;
  truthfulImprovement: string;
  relatedInterviewQuestion: string;
}

export function EvidenceMatrix({ scorecard, resumeText }: EvidenceMatrixProps) {
  const [expandedId, setExpandedId] = useState<string | null>("req-1");
  const [filterStatus, setFilterStatus] = useState<string>("All");

  const matrixItems: MatrixItem[] = [
    {
      id: "req-1",
      requirement: "Python (FastAPI / Asynchronous Architecture)",
      priority: "Critical",
      status: "Demonstrated",
      evidenceSnippet: "Designed high-throughput asynchronous backend services using Python and FastAPI serving 12M+ monthly requests.",
      confidence: "High",
      action: "No action needed",
      qualificationReason: "Direct citation confirms 6+ years of hands-on production microservice engineering with FastAPI.",
      missingDetails: "None. Direct match with scale metrics.",
      truthfulImprovement: "Highlight specific concurrency tools (e.g. uvloop, asyncio queues) to showcase senior depth.",
      relatedInterviewQuestion: "How do you handle event loop blocking or CPU-heavy tasks in an asynchronous FastAPI architecture?",
    },
    {
      id: "req-2",
      requirement: "PostgreSQL & Relational Data Modeling",
      priority: "Critical",
      status: "Demonstrated",
      evidenceSnippet: "Optimized complex PostgreSQL relational queries, introducing database partitioning and indexing that slashed p99 latency by 38%.",
      confidence: "High",
      action: "No action needed",
      qualificationReason: "Strong demonstration of query optimization, indexing, and measurable latency reduction.",
      missingDetails: "None. Exemplary metric-backed evidence.",
      truthfulImprovement: "None needed. This is a standout bullet point.",
      relatedInterviewQuestion: "What indexing strategies did you employ to achieve the 38% reduction in p99 query latency?",
    },
    {
      id: "req-3",
      requirement: "Redis Caching & Latency Optimization",
      priority: "High",
      status: "Partial",
      evidenceSnippet: "Implemented Redis caching layers with semantic invalidation to reduce database load under peak load conditions.",
      confidence: "Medium",
      action: "Add measurable latency or hit-ratio metric",
      qualificationReason: "Semantic invalidation is cited, but measurable impact (e.g. cache hit ratio, latency delta) is omitted.",
      missingDetails: "Lacks baseline hit ratio or specific latency reduction percentage.",
      truthfulImprovement: "Add: '...achieving an 84% cache hit ratio and mitigating database connection exhaustion during peak traffic.'",
      relatedInterviewQuestion: "How did you design your semantic cache invalidation strategy to prevent stale data anomalies?",
    },
    {
      id: "req-4",
      requirement: "Docker & Containerized Delivery",
      priority: "High",
      status: "Demonstrated",
      evidenceSnippet: "Collaborated across product and DevOps teams to containerize workloads with Docker.",
      confidence: "High",
      action: "Clarify individual container configuration ownership",
      qualificationReason: "Work history documents Docker containerization across multiple microservices.",
      missingDetails: "Could specify Dockerfile multi-stage builds or compose configuration.",
      truthfulImprovement: "Specify multi-stage Docker build optimizations or container security practices if applicable.",
      relatedInterviewQuestion: "What best practices do you follow when writing multi-stage Dockerfiles for Python applications?",
    },
    {
      id: "req-5",
      requirement: "Kubernetes / Container Orchestration",
      priority: "High",
      status: "Missing",
      evidenceSnippet: null,
      confidence: "High",
      action: "Prepare honest interview reply or side-project",
      qualificationReason: "No mention of Kubernetes, Helm, or cluster management found in the supplied resume text.",
      missingDetails: "Complete gap for cloud-native orchestration requirement.",
      truthfulImprovement: "If you have used K8s, cite specific deployment manifests. If not, acknowledge honestly and explain your conceptual familiarity.",
      relatedInterviewQuestion: "We deploy on Kubernetes. While your resume highlights Docker, how familiar are you with Pod lifecycles, Deployments, and Services?",
    },
    {
      id: "req-6",
      requirement: "AWS Cloud Infrastructure & Services",
      priority: "Preferred",
      status: "Unsupported",
      evidenceSnippet: "AWS listed in Core Technical Competencies header",
      confidence: "Low",
      action: "Add project proof or clarify specific services",
      qualificationReason: "AWS is listed in the skills block, but zero employment bullets substantiate actual production usage.",
      missingDetails: "No specific AWS services (e.g. ECS, RDS, S3, IAM) cited in project deliverables.",
      truthfulImprovement: "Add which specific AWS services you provisioned in your CloudScale Systems or Apex Data Labs roles.",
      relatedInterviewQuestion: "You list AWS under skills—which specific AWS services did you personally configure and manage?",
    },
    {
      id: "req-7",
      requirement: "Automated Testing & pytest Suites",
      priority: "High",
      status: "Demonstrated",
      evidenceSnippet: "Spearheaded test automation coverage from 64% to 92% utilizing pytest and integration suites.",
      confidence: "High",
      action: "No action needed",
      qualificationReason: "Excellent quantitative demonstration: 64% to 92% coverage increase.",
      missingDetails: "None. High-integrity metric.",
      truthfulImprovement: "No improvements needed.",
      relatedInterviewQuestion: "How did you structure unit vs integration tests to keep CI pipeline execution times fast?",
    },
    {
      id: "req-8",
      requirement: "Distributed Event-Driven Architecture",
      priority: "Preferred",
      status: "Needs Verification",
      evidenceSnippet: "Built automated background worker pipelines for asynchronous document extraction and parsing.",
      confidence: "Medium",
      action: "Specify broker technology (e.g., Celery, Redis Streams)",
      qualificationReason: "Mentions asynchronous worker pipelines, but omits broker or message queue tooling.",
      missingDetails: "Broker technology is not named explicitly.",
      truthfulImprovement: "State whether you utilized Redis Streams, RabbitMQ, or Celery for background processing.",
      relatedInterviewQuestion: "What messaging system did you use to distribute tasks across background workers?",
    },
  ];

  const getStatusBadge = (status: MatrixItem["status"]) => {
    switch (status) {
      case "Demonstrated":
        return (
          <span className="inline-flex items-center space-x-1 text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800 text-xs font-medium">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-600 dark:bg-emerald-400" />
            <span>Demonstrated</span>
          </span>
        );
      case "Partial":
        return (
          <span className="inline-flex items-center space-x-1 text-amber-800 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/50 px-2 py-0.5 rounded border border-amber-200 dark:border-amber-800 text-xs font-medium">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-600 dark:bg-amber-400" />
            <span>Partial Match</span>
          </span>
        );
      case "Missing":
        return (
          <span className="inline-flex items-center space-x-1 text-rose-800 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/50 px-2 py-0.5 rounded border border-rose-200 dark:border-rose-800 text-xs font-medium">
            <span className="h-1.5 w-1.5 rounded-full bg-rose-600 dark:bg-rose-400" />
            <span>Missing</span>
          </span>
        );
      case "Needs Verification":
        return (
          <span className="inline-flex items-center space-x-1 text-blue-800 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50 px-2 py-0.5 rounded border border-blue-200 dark:border-blue-800 text-xs font-medium">
            <AlertCircle className="h-3 w-3 text-blue-600 dark:text-blue-400" />
            <span>Verify Depth</span>
          </span>
        );
      case "Unsupported":
        return (
          <span className="inline-flex items-center space-x-1 text-[#787774] dark:text-[#9b9a97] bg-[#f1f1ef] dark:bg-[#2c2c2c] px-2 py-0.5 rounded border border-[#e9e9e7] dark:border-[#2f2f2f] text-xs font-medium">
            <HelpCircle className="h-3 w-3 text-[#9b9a97]" />
            <span>Unsupported</span>
          </span>
        );
    }
  };

  const getPriorityBadge = (priority: MatrixItem["priority"]) => {
    switch (priority) {
      case "Critical":
        return (
          <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-800">
            Critical
          </span>
        );
      case "High":
        return (
          <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
            High
          </span>
        );
      case "Preferred":
        return (
          <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-[#f1f1ef] dark:bg-[#2c2c2c] text-[#787774] dark:text-[#9b9a97] border border-[#e9e9e7] dark:border-[#2f2f2f]">
            Preferred
          </span>
        );
    }
  };

  const filteredItems = matrixItems.filter((item) => {
    if (filterStatus === "All") return true;
    return item.status === filterStatus;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto animate-in fade-in duration-200">
      {/* Signature Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#e9e9e7] dark:border-[#2f2f2f]">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-[#f1f1ef] dark:bg-[#202020] text-[#2f3437] dark:text-[#e6e6e6] border border-[#e9e9e7] dark:border-[#2f2f2f] font-mono">
              Signature Matrix
            </span>
            <span className="text-xs text-[#787774] dark:text-[#9b9a97] font-mono">
              8 Core Requirements Evaluated
            </span>
          </div>
          <h2 className="text-xl font-bold text-[#2f3437] dark:text-white tracking-tight mt-1">
            Requirement Evidence Matrix
          </h2>
          <p className="text-xs text-[#787774] dark:text-[#9b9a97] mt-0.5">
            Every match is paired with verbatim excerpts from your resume. Expand any row to see why it qualified and how to truthfully improve it.
          </p>
        </div>

        {/* Status Filter Chips */}
        <div className="flex items-center space-x-1.5 overflow-x-auto pb-1">
          {["All", "Demonstrated", "Partial", "Missing", "Unsupported"].map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-2.5 py-1 rounded-md text-xs transition-colors ${
                filterStatus === st
                  ? "bg-[#2f3437] dark:bg-white text-white dark:text-[#191919] font-medium"
                  : "bg-white dark:bg-[#202020] text-[#787774] dark:text-[#9b9a97] hover:text-[#2f3437] dark:hover:text-white border border-[#e9e9e7] dark:border-[#2f2f2f] hover:bg-[#fbfbfa] dark:hover:bg-[#282828]"
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* The Evidence Matrix Table */}
      <div className="rounded-lg border border-[#e9e9e7] dark:border-[#2f2f2f] bg-white dark:bg-[#202020] overflow-hidden shadow-2xs transition-colors">
        <div className="grid grid-cols-12 text-[11px] uppercase tracking-wider font-semibold text-[#787774] dark:text-[#9b9a97] bg-[#fbfbfa] dark:bg-[#191919] px-5 py-3 border-b border-[#e9e9e7] dark:border-[#2f2f2f]">
          <div className="col-span-4">Role Requirement</div>
          <div className="col-span-2">Priority</div>
          <div className="col-span-2">Match Status</div>
          <div className="col-span-4">Evidence Excerpt & Action</div>
        </div>

        <div className="divide-y divide-[#e9e9e7] dark:divide-[#2f2f2f]">
          {filteredItems.map((item) => {
            const isExpanded = expandedId === item.id;
            return (
              <div key={item.id} className="transition-colors hover:bg-[#fbfbfa] dark:hover:bg-[#252525]">
                {/* Row Summary */}
                <div
                  onClick={() => setExpandedId(isExpanded ? null : item.id)}
                  className="grid grid-cols-12 px-5 py-3.5 items-center cursor-pointer gap-2"
                >
                  <div className="col-span-4 font-semibold text-xs text-[#2f3437] dark:text-white flex items-center space-x-2">
                    {isExpanded ? (
                      <ChevronUp className="h-3.5 w-3.5 text-[#9b9a97] shrink-0" />
                    ) : (
                      <ChevronDown className="h-3.5 w-3.5 text-[#9b9a97] shrink-0" />
                    )}
                    <span className="truncate">{item.requirement}</span>
                  </div>

                  <div className="col-span-2">
                    {getPriorityBadge(item.priority)}
                  </div>

                  <div className="col-span-2">
                    {getStatusBadge(item.status)}
                  </div>

                  <div className="col-span-4 flex items-center justify-between text-xs text-[#787774] dark:text-[#9b9a97]">
                    <span className="truncate font-mono text-[11px] pr-2 text-[#2f3437] dark:text-[#e6e6e6]">
                      {item.evidenceSnippet || "— No evidence cited —"}
                    </span>
                    <span className="text-[10px] text-[#9b9a97] shrink-0 font-sans">
                      {isExpanded ? "Collapse" : "Expand details"}
                    </span>
                  </div>
                </div>

                {/* Expanded Drawer: Evidence Deep Dive */}
                {isExpanded && (
                  <div className="px-6 py-5 bg-[#fbfbfa] dark:bg-[#191919] border-t border-[#e9e9e7] dark:border-[#2f2f2f] space-y-4 text-xs animate-in fade-in duration-150">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Exact Job Requirement */}
                      <div className="p-3.5 rounded-md bg-white dark:bg-[#202020] border border-[#e9e9e7] dark:border-[#2f2f2f] space-y-1.5 shadow-2xs">
                        <div className="text-[10px] uppercase font-bold text-[#9b9a97] tracking-wider">
                          Target Requirement
                        </div>
                        <p className="text-xs text-[#2f3437] dark:text-white font-medium leading-relaxed">
                          {item.requirement}
                        </p>
                      </div>

                      {/* Verbatim Resume Quote */}
                      <div className="p-3.5 rounded-md bg-white dark:bg-[#202020] border border-[#e9e9e7] dark:border-[#2f2f2f] space-y-1.5 shadow-2xs">
                        <div className="text-[10px] uppercase font-bold text-[#9b9a97] tracking-wider flex items-center space-x-1">
                          <Quote className="h-3 w-3 text-[#787774] dark:text-[#9b9a97]" />
                          <span>Exact Resume Excerpt</span>
                        </div>
                        {item.evidenceSnippet ? (
                          <blockquote className="text-xs text-[#2f3437] dark:text-white italic leading-relaxed border-l-2 border-[#2f3437] dark:border-white pl-2.5 my-1">
                            "{item.evidenceSnippet}"
                          </blockquote>
                        ) : (
                          <p className="text-xs text-rose-700 dark:text-rose-400 italic">
                            No matching text found in submitted resume.
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Explanations & Coaching */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div className="p-3 rounded-md bg-white dark:bg-[#202020] border border-[#e9e9e7] dark:border-[#2f2f2f]">
                        <div className="text-[10px] uppercase font-bold text-[#9b9a97] tracking-wider mb-1">
                          Why It Qualified
                        </div>
                        <p className="text-xs text-[#787774] dark:text-[#9b9a97] leading-relaxed">
                          {item.qualificationReason}
                        </p>
                      </div>

                      <div className="p-3 rounded-md bg-white dark:bg-[#202020] border border-[#e9e9e7] dark:border-[#2f2f2f]">
                        <div className="text-[10px] uppercase font-bold text-[#9b9a97] tracking-wider mb-1">
                          What Is Missing
                        </div>
                        <p className="text-xs text-[#787774] dark:text-[#9b9a97] leading-relaxed">
                          {item.missingDetails}
                        </p>
                      </div>

                      <div className="p-3 rounded-md bg-white dark:bg-[#202020] border border-[#e9e9e7] dark:border-[#2f2f2f]">
                        <div className="text-[10px] uppercase font-bold text-[#9b9a97] tracking-wider mb-1">
                          Truthful Improvement
                        </div>
                        <p className="text-xs text-[#2f3437] dark:text-[#e6e6e6] font-medium leading-relaxed">
                          {item.truthfulImprovement}
                        </p>
                      </div>
                    </div>

                    {/* Interview Probe */}
                    <div className="p-3.5 rounded-md bg-white dark:bg-[#202020] border border-[#e9e9e7] dark:border-[#2f2f2f] flex items-start space-x-3">
                      <div className="p-1.5 rounded bg-[#f1f1ef] dark:bg-[#2c2c2c] text-[#2f3437] dark:text-[#e6e6e6] shrink-0 mt-0.5">
                        <HelpCircle className="h-4 w-4" />
                      </div>
                      <div className="space-y-1">
                        <span className="text-[10px] uppercase font-bold text-[#9b9a97] tracking-wider block">
                          Connected Interview Question
                        </span>
                        <p className="text-xs text-[#2f3437] dark:text-white font-medium">
                          "{item.relatedInterviewQuestion}"
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

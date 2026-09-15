"use client";

import React from "react";
import { AlertTriangle, HelpCircle, Check, ArrowRight, BookOpen, Layers } from "lucide-react";

interface MissingGap {
  requirement: string;
  category:
    | "Missing but genuinely required"
    | "Possibly present but poorly documented"
    | "Preferred rather than essential"
    | "Cannot be added without new experience";
  whyItMatters: string;
  options: string[];
}

export function MissingRequirementsView() {
  const gaps: MissingGap[] = [
    {
      requirement: "Kubernetes / Container Orchestration",
      category: "Missing but genuinely required",
      whyItMatters: "Core infrastructure requirement for running production microservice clusters at scale.",
      options: [
        "Option 1: If you have managed cluster deployments or written Helm charts, cite the specific project.",
        "Option 2: Stand up a local Minikube or k3s cluster, deploy your FastAPI service, and document it on GitHub.",
        "Option 3: Leave it missing and prepare an honest interview response acknowledging Docker mastery while eager to ramp up on K8s.",
      ],
    },
    {
      requirement: "Message Broker Technology (Kafka / RabbitMQ / SQS)",
      category: "Possibly present but poorly documented",
      whyItMatters: "Your resume mentions background workers for document extraction, but omits the underlying queue.",
      options: [
        "Option 1: Add the exact queuing library (e.g. Celery + Redis, or RabbitMQ) directly to the bullet point.",
        "Option 2: Detail how worker concurrency or retries were handled if using an in-memory queue.",
      ],
    },
    {
      requirement: "AWS Cloud Infrastructure (ECS / RDS / CloudWatch)",
      category: "Preferred rather than essential",
      whyItMatters: "Listed in skills header without employment deliverables. Role states preferred AWS experience.",
      options: [
        "Option 1: Specify which AWS services were integrated in your CloudScale Systems tenure.",
        "Option 2: Remove from the skills list if you only touched it briefly in an academic setting to preserve credibility.",
      ],
    },
  ];

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-in fade-in duration-200">
      {/* Header */}
      <div className="pb-4 border-b border-[#e9e9e7] dark:border-[#2f2f2f]">
        <div className="flex items-center space-x-2">
          <span className="text-xs font-semibold px-2 py-0.5 rounded bg-[#f1f1ef] dark:bg-[#202020] text-[#2f3437] dark:text-[#e6e6e6] border border-[#e9e9e7] dark:border-[#2f2f2f] font-mono">
            Strategic Triage
          </span>
          <span className="text-xs text-[#787774] dark:text-[#9b9a97] font-mono">
            {gaps.length} Gaps Analyzed
          </span>
        </div>
        <h2 className="text-xl font-bold text-[#2f3437] dark:text-white tracking-tight mt-1">
          Categorized Missing Requirements & Honest Options
        </h2>
        <p className="text-xs text-[#787774] dark:text-[#9b9a97] mt-0.5">
          Missing information is not a failure. We categorize gaps by hiring severity and provide practical, truthful career pathways.
        </p>
      </div>

      {/* Gaps List */}
      <div className="space-y-4">
        {gaps.map((gap, idx) => (
          <div
            key={idx}
            className="p-5 rounded-lg bg-white dark:bg-[#202020] border border-[#e9e9e7] dark:border-[#2f2f2f] shadow-2xs space-y-3.5 transition-colors"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#e9e9e7] dark:border-[#2f2f2f]">
              <span className="text-sm font-bold text-[#2f3437] dark:text-white">{gap.requirement}</span>
              <span className="text-[11px] font-medium px-2 py-0.5 rounded bg-[#f1f1ef] dark:bg-[#2c2c2c] text-[#2f3437] dark:text-[#e6e6e6] border border-[#e9e9e7] dark:border-[#383838]">
                {gap.category}
              </span>
            </div>

            <p className="text-xs text-[#787774] dark:text-[#9b9a97] leading-relaxed">
              <strong className="text-[#2f3437] dark:text-white">Context: </strong>
              {gap.whyItMatters}
            </p>

            {/* Practical Career Options */}
            <div className="space-y-2 pt-1">
              <span className="text-[10px] uppercase font-bold text-[#9b9a97] tracking-wider block">
                Honest Action Pathways
              </span>
              <div className="grid grid-cols-1 gap-2">
                {gap.options.map((opt, oIdx) => (
                  <div
                    key={oIdx}
                    className="p-3 rounded-md bg-[#fbfbfa] dark:bg-[#191919] border border-[#e9e9e7] dark:border-[#2f2f2f] text-xs text-[#2f3437] dark:text-[#e6e6e6] font-mono leading-relaxed flex items-start space-x-2"
                  >
                    <span className="text-[#2f3437] dark:text-white font-bold shrink-0">•</span>
                    <span>{opt}</span>
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

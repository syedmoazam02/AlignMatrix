"use client";

import React, { useState } from "react";
import { Settings, Cpu, ShieldCheck, Database, Check } from "lucide-react";

export function SettingsView() {
  const [selectedProvider, setSelectedProvider] = useState<string>("mock");
  const [saved, setSaved] = useState(false);

  const providers = [
    {
      id: "mock",
      name: "Deterministic Mock Adapter (Local Testing)",
      company: "Built-in Zero Cost",
      description: "Deterministic structured outputs with zero API fees. Ideal for CI, testing, and UI validation.",
      badge: "Free / Active",
    },
    {
      id: "openai",
      name: "OpenAI Structured Outputs",
      company: "OpenAI",
      description: "Uses gpt-4o-mini with response_format=LLMScoreBreakdown for strict JSON firewall compliance.",
      badge: "Supported",
    },
    {
      id: "anthropic",
      name: "Anthropic Claude 3.5 Sonnet",
      company: "Anthropic",
      description: "Claude 3.5 Sonnet JSON schema enforcement for nuanced code and architectural evaluation.",
      badge: "Supported",
    },
    {
      id: "gemini",
      name: "Google Gemini 1.5 Pro / 2.0 Flash",
      company: "Google DeepMind",
      description: "Gemini structured response schema with 1M+ token context window support.",
      badge: "Supported",
    },
  ];

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-in fade-in duration-200">
      <div className="pb-4 border-b border-[#e9e9e7] dark:border-[#2f2f2f]">
        <div className="flex items-center space-x-2">
          <span className="text-xs font-semibold px-2 py-0.5 rounded bg-[#f1f1ef] dark:bg-[#202020] text-[#2f3437] dark:text-[#e6e6e6] border border-[#e9e9e7] dark:border-[#2f2f2f] font-mono">
            Provider Architecture
          </span>
          <span className="text-xs text-[#787774] dark:text-[#9b9a97] font-mono">
            Multi-Model Plug & Play
          </span>
        </div>
        <h2 className="text-xl font-bold text-[#2f3437] dark:text-white tracking-tight mt-1">
          AI Provider & Engine Settings
        </h2>
        <p className="text-xs text-[#787774] dark:text-[#9b9a97] mt-0.5">
          AlignMatrix is provider-agnostic. The evaluation worker delegates to any LLMService protocol adapter without touching business logic.
        </p>
      </div>

      <div className="space-y-3">
        {providers.map((p) => {
          const isSelected = selectedProvider === p.id;
          return (
            <div
              key={p.id}
              onClick={() => setSelectedProvider(p.id)}
              className={`p-4 rounded-lg border transition-all cursor-pointer space-y-2 ${
                isSelected
                  ? "bg-white dark:bg-[#202020] border-[#2f3437] dark:border-white shadow-xs ring-1 ring-[#2f3437] dark:ring-white"
                  : "bg-white dark:bg-[#202020] hover:bg-[#fbfbfa] dark:hover:bg-[#252525] border-[#e9e9e7] dark:border-[#2f2f2f] shadow-2xs"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2.5">
                  <Cpu className={`h-4 w-4 ${isSelected ? "text-[#2f3437] dark:text-white" : "text-[#9b9a97]"}`} />
                  <span className="text-xs font-bold text-[#2f3437] dark:text-white">{p.name}</span>
                  <span className="text-xs text-[#787774] dark:text-[#9b9a97] font-mono">({p.company})</span>
                </div>

                <span
                  className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                    isSelected
                      ? "bg-[#2f3437] dark:bg-white text-white dark:text-[#191919] border-[#2f3437] dark:border-white"
                      : "bg-[#f1f1ef] dark:bg-[#2c2c2c] text-[#787774] dark:text-[#9b9a97] border-[#e9e9e7] dark:border-[#383838]"
                  }`}
                >
                  {p.badge}
                </span>
              </div>

              <p className="text-xs text-[#787774] dark:text-[#9b9a97] leading-relaxed pl-6">
                {p.description}
              </p>
            </div>
          );
        })}
      </div>

      <div className="pt-4 flex items-center justify-between border-t border-[#e9e9e7] dark:border-[#2f2f2f]">
        <div className="flex items-center space-x-2 text-xs text-[#787774] dark:text-[#9b9a97]">
          <ShieldCheck className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
          <span>Protocol interface ensures zero vendor lock-in.</span>
        </div>

        <button
          onClick={handleSave}
          className="inline-flex items-center space-x-2 px-4 py-2 rounded-md bg-[#2f3437] dark:bg-white hover:bg-[#1f2326] dark:hover:bg-[#e6e6e6] text-white dark:text-[#191919] font-medium text-xs transition-all shadow-2xs"
        >
          {saved ? (
            <>
              <Check className="h-3.5 w-3.5 text-emerald-400 dark:text-emerald-600" />
              <span>Saved!</span>
            </>
          ) : (
            <span>Save Provider Configuration</span>
          )}
        </button>
      </div>
    </div>
  );
}

"use client";

import React from "react";
import {
  LayoutDashboard,
  Layers,
  FileCheck2,
  FileText,
  AlertTriangle,
  HelpCircle,
  Settings,
  ArrowLeft,
  Home,
  FileUp,
} from "lucide-react";

export type ActiveView =
  | "overview"
  | "matrix"
  | "inspector"
  | "missing"
  | "editor"
  | "interview"
  | "settings";

interface SidebarProps {
  activeView: ActiveView;
  onSelectView: (view: ActiveView) => void;
  evidenceCoverage?: number;
  criticalGapsCount?: number;
  onGoHome?: () => void;
  onBackToInput?: () => void;
}

export function Sidebar({
  activeView,
  onSelectView,
  evidenceCoverage = 78,
  criticalGapsCount = 3,
  onGoHome,
  onBackToInput,
}: SidebarProps) {
  const navItems = [
    { key: "matrix" as const, label: "Evidence Matrix", icon: Layers, badge: "Core" },
    { key: "overview" as const, label: "Overview Scorecard", icon: LayoutDashboard },
    { key: "inspector" as const, label: "Document Inspector", icon: FileCheck2 },
    { key: "missing" as const, label: "Missing Requirements", icon: AlertTriangle, badge: `${criticalGapsCount}` },
    { key: "editor" as const, label: "Resume Bullet Editor", icon: FileText },
    { key: "interview" as const, label: "Interview Cheat Sheet", icon: HelpCircle },
    { key: "settings" as const, label: "API Configuration", icon: Settings },
  ];

  return (
    <aside className="w-64 border-r border-[#e9e9e7] dark:border-[#2f2f2f] bg-[#fbfbfa] dark:bg-[#191919] p-4 flex flex-col justify-between shrink-0 min-h-[calc(100vh-53px)] transition-colors duration-200">
      <div className="space-y-5">
        {/* Quick redirect actions: Home & Analyze */}
        <div className="space-y-1 pb-2 border-b border-[#e9e9e7] dark:border-[#2f2f2f]">
          {onGoHome && (
            <button
              onClick={onGoHome}
              className="flex items-center space-x-2 text-xs text-[#787774] dark:text-[#9b9a97] hover:text-[#2f3437] dark:hover:text-white px-2.5 py-1.5 rounded-md hover:bg-[#f1f1ef] dark:hover:bg-[#252525] transition-colors w-full text-left"
            >
              <Home className="h-3.5 w-3.5 text-[#9b9a97]" />
              <span>Back to Home</span>
            </button>
          )}

          {onBackToInput && (
            <button
              onClick={onBackToInput}
              className="flex items-center space-x-2 text-xs text-[#787774] dark:text-[#9b9a97] hover:text-[#2f3437] dark:hover:text-white px-2.5 py-1.5 rounded-md hover:bg-[#f1f1ef] dark:hover:bg-[#252525] transition-colors w-full text-left"
            >
              <FileUp className="h-3.5 w-3.5 text-[#9b9a97]" />
              <span>Upload / Analyze Custom</span>
            </button>
          )}
        </div>

        {/* Current Job Context */}
        <div className="p-3.5 rounded-lg bg-white dark:bg-[#202020] border border-[#e9e9e7] dark:border-[#2f2f2f] shadow-2xs space-y-1.5 transition-colors">
          <div className="text-[10px] uppercase font-bold text-[#9b9a97] tracking-wider">
            Target Role Analysis
          </div>
          <div className="text-xs font-semibold text-[#2f3437] dark:text-white leading-snug">
            Senior Backend Engineer
          </div>
          <div className="flex items-center justify-between text-[11px] pt-1.5 text-[#787774] dark:text-[#9b9a97] border-t border-[#f1f1ef] dark:border-[#2f2f2f] mt-1.5">
            <span>Coverage:</span>
            <span className="font-mono font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-1.5 py-0.5 rounded border border-emerald-200 dark:border-emerald-800">
              {evidenceCoverage}%
            </span>
          </div>
        </div>

        {/* Navigation List */}
        <nav className="space-y-0.5">
          <div className="text-[10px] uppercase font-bold text-[#9b9a97] tracking-wider px-2.5 mb-1.5">
            Analysis Pages
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.key;
            return (
              <button
                key={item.key}
                onClick={() => onSelectView(item.key)}
                className={`w-full flex items-center justify-between px-2.5 py-2 rounded-md text-xs transition-colors ${
                  isActive
                    ? "bg-[#eaeae8] dark:bg-[#2c2c2c] text-[#2f3437] dark:text-white font-semibold"
                    : "text-[#787774] dark:text-[#9b9a97] hover:text-[#2f3437] dark:hover:text-white hover:bg-[#f1f1ef] dark:hover:bg-[#252525]"
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  <Icon
                    className={`h-4 w-4 ${
                      isActive
                        ? "text-[#2f3437] dark:text-white"
                        : "text-[#9b9a97]"
                    }`}
                  />
                  <span>{item.label}</span>
                </div>

                {item.badge && (
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${
                      isActive
                        ? "bg-[#2f3437] dark:bg-white text-white dark:text-[#191919]"
                        : "bg-[#f1f1ef] dark:bg-[#2c2c2c] text-[#787774] dark:text-[#9b9a97]"
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Truth Protection Notice */}
      <div className="pt-4 border-t border-[#e9e9e7] dark:border-[#2f2f2f]">
        <div className="flex items-center space-x-2 text-[11px] text-[#787774] dark:text-[#9b9a97] px-1">
          <span className="h-2 w-2 rounded-full bg-emerald-500 shrink-0" />
          <span>Evidence-backed zero-trust evaluation</span>
        </div>
      </div>
    </aside>
  );
}

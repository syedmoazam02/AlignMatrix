"use client";

import React, { useEffect, useState } from "react";
import { checkBackendHealth } from "@/lib/api";
import { useTheme } from "@/components/ThemeProvider";
import {
  Plus,
  Command,
  Home,
  FileUp,
  Layers,
  LayoutDashboard,
  FileCheck2,
  AlertTriangle,
  FileText,
  HelpCircle,
  Sun,
  Moon,
} from "lucide-react";

export type NavTab =
  | "home"
  | "analyze"
  | "matrix"
  | "overview"
  | "inspector"
  | "missing"
  | "editor"
  | "interview";

interface NavbarProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  onNewAnalysis?: () => void;
}

export function Navbar({ currentTab, onSelectTab, onNewAnalysis }: NavbarProps) {
  const { theme, toggleTheme } = useTheme();
  const [health, setHealth] = useState<{ status: string; database: string }>({
    status: "checking",
    database: "checking",
  });

  useEffect(() => {
    checkBackendHealth().then((res) => setHealth(res));
    const interval = setInterval(() => {
      checkBackendHealth().then((res) => setHealth(res));
    }, 20000);
    return () => clearInterval(interval);
  }, []);

  // Keyboard shortcut listener: Cmd/Ctrl + K or N to start new analysis
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && (e.key === "k" || e.key === "n")) {
        e.preventDefault();
        onNewAnalysis ? onNewAnalysis() : onSelectTab("analyze");
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onNewAnalysis, onSelectTab]);

  const isOnline = health.status === "ok";

  const tabs: { key: NavTab; label: string; icon: React.ElementType }[] = [
    { key: "home", label: "Home", icon: Home },
    { key: "analyze", label: "Analyze", icon: FileUp },
    { key: "matrix", label: "Evidence Matrix", icon: Layers },
    { key: "overview", label: "Overview", icon: LayoutDashboard },
    { key: "inspector", label: "Inspector", icon: FileCheck2 },
    { key: "missing", label: "Gaps", icon: AlertTriangle },
    { key: "editor", label: "Editor", icon: FileText },
    { key: "interview", label: "Interview", icon: HelpCircle },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-white/95 dark:bg-[#191919]/95 backdrop-blur-md border-b border-[#e9e9e7] dark:border-[#2f2f2f] px-4 sm:px-6 py-2.5 transition-colors duration-200">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Brand identity: Notion minimal */}
        <div
          onClick={() => onSelectTab("home")}
          className="flex items-center space-x-2.5 cursor-pointer select-none shrink-0"
        >
          <div className="h-7 w-7 rounded-md bg-[#2f3437] dark:bg-white text-white dark:text-[#191919] flex items-center justify-center shadow-xs transition-colors">
            <span className="font-mono font-bold text-xs tracking-wider">AM</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="font-semibold text-sm tracking-tight text-[#2f3437] dark:text-white">
              AlignMatrix
            </span>
            <span className="text-[11px] text-[#9b9a97]">/</span>
            <span className="text-xs text-[#787774] dark:text-[#9b9a97] font-medium hidden sm:inline">
              Workspace
            </span>
          </div>
        </div>

        {/* Notion Page Navigation Tabs */}
        <nav className="hidden lg:flex items-center space-x-1 overflow-x-auto py-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = currentTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => onSelectTab(tab.key)}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-md text-xs transition-colors ${
                  isActive
                    ? "bg-[#eaeae8] dark:bg-[#2c2c2c] text-[#2f3437] dark:text-white font-semibold shadow-2xs"
                    : "text-[#787774] dark:text-[#9b9a97] hover:text-[#2f3437] dark:hover:text-white hover:bg-[#f1f1ef] dark:hover:bg-[#252525]"
                }`}
              >
                <Icon
                  className={`h-3.5 w-3.5 ${
                    isActive
                      ? "text-[#2f3437] dark:text-white"
                      : "text-[#9b9a97]"
                  }`}
                />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Telemetry, Dark Mode Toggle & Quick Action */}
        <div className="flex items-center space-x-2 sm:space-x-2.5 shrink-0">
          <div className="hidden sm:flex items-center space-x-1.5 text-xs px-2 py-1 rounded-md bg-[#f7f6f5] dark:bg-[#202020] border border-[#e9e9e7] dark:border-[#2f2f2f]">
            <span
              className={`h-2 w-2 rounded-full ${
                isOnline ? "bg-emerald-500" : "bg-rose-500"
              }`}
            />
            <span className="text-[#787774] dark:text-[#9b9a97] text-[11px]">System:</span>
            <span
              className={`font-mono text-[11px] font-medium ${
                isOnline
                  ? "text-emerald-700 dark:text-emerald-400"
                  : "text-rose-700 dark:text-rose-400"
              }`}
            >
              {isOnline ? "Operational" : "Offline"}
            </span>
          </div>

          {/* Dark / Light Mode Toggle Button */}
          <button
            onClick={toggleTheme}
            className="p-1.5 rounded-md bg-white dark:bg-[#202020] hover:bg-[#f1f1ef] dark:hover:bg-[#2c2c2c] text-[#787774] dark:text-[#e6e6e6] border border-[#e9e9e7] dark:border-[#2f2f2f] shadow-2xs transition-colors"
            title={theme === "dark" ? "Switch to Light mode" : "Switch to Dark mode"}
            aria-label="Toggle theme"
          >
            {theme === "dark" ? (
              <Sun className="h-4 w-4 text-amber-400" />
            ) : (
              <Moon className="h-4 w-4 text-[#787774]" />
            )}
          </button>

          <button
            onClick={onNewAnalysis || (() => onSelectTab("analyze"))}
            className="flex items-center space-x-1.5 text-xs font-medium px-3 py-1.5 rounded-md bg-[#2f3437] dark:bg-white hover:bg-[#1f2326] dark:hover:bg-[#eaeae8] text-white dark:text-[#191919] border border-[#2f3437] dark:border-white shadow-2xs transition-all active:scale-[0.98]"
            title="Start new analysis (Ctrl+N or ⌘N)"
          >
            <Plus className="h-3.5 w-3.5 stroke-[2.5]" />
            <span>New Analysis</span>
            <span className="hidden md:inline-flex items-center space-x-0.5 text-[10px] font-mono opacity-80 px-1 py-0.2 rounded bg-white/20 dark:bg-black/10 ml-0.5">
              <Command className="h-2.5 w-2.5" />
              <span>N</span>
            </span>
          </button>
        </div>
      </div>

      {/* Mobile / Tablet Horizontal Navigation Scroll */}
      <div className="flex lg:hidden items-center space-x-1 overflow-x-auto pt-2 pb-0.5 border-t border-[#f1f1ef] dark:border-[#252525] mt-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => onSelectTab(tab.key)}
              className={`flex items-center space-x-1 px-2.5 py-1 rounded-md text-[11px] whitespace-nowrap shrink-0 ${
                isActive
                  ? "bg-[#eaeae8] dark:bg-[#2c2c2c] text-[#2f3437] dark:text-white font-semibold"
                  : "text-[#787774] dark:text-[#9b9a97] hover:text-[#2f3437] dark:hover:text-white"
              }`}
            >
              <Icon className="h-3 w-3" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>
    </header>
  );
}

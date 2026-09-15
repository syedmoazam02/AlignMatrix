"use client";

import React, { useEffect, useState } from "react";
import { checkBackendHealth } from "@/lib/api";
import { Activity, ShieldCheck, FileText, ExternalLink, Cpu } from "lucide-react";

export function Header() {
  const [health, setHealth] = useState<{ status: string; database: string }>({
    status: "checking...",
    database: "checking...",
  });

  useEffect(() => {
    checkBackendHealth().then((res) => setHealth(res));
    const interval = setInterval(() => {
      checkBackendHealth().then((res) => setHealth(res));
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  const isOnline = health.status === "ok";

  return (
    <header className="sticky top-0 z-50 w-full glass-panel border-b border-slate-800/80 px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Cpu className="h-5 w-5 text-white" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
                AlignMatrix
              </span>
              <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                v1.0 API
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Evidence-Backed Deterministic Document Evaluation
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="hidden sm:flex items-center space-x-2 text-xs px-3 py-1.5 rounded-lg bg-slate-900/60 border border-slate-800">
            <div
              className={`h-2 w-2 rounded-full ${
                isOnline ? "bg-emerald-400 animate-pulse" : "bg-rose-500"
              }`}
            />
            <span className="text-slate-400">Backend:</span>
            <span
              className={`font-medium ${
                isOnline ? "text-emerald-400" : "text-rose-400"
              }`}
            >
              {isOnline ? "Online (DB OK)" : "Disconnected"}
            </span>
          </div>

          <a
            href="http://127.0.0.1:8000/docs"
            target="_blank"
            rel="noreferrer"
            className="flex items-center space-x-1 text-xs font-medium px-3 py-1.5 rounded-lg bg-indigo-600/10 hover:bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 transition-colors"
          >
            <FileText className="h-3.5 w-3.5" />
            <span>OpenAPI Docs</span>
            <ExternalLink className="h-3 w-3 opacity-60" />
          </a>
        </div>
      </div>
    </header>
  );
}

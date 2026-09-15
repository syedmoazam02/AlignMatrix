"use client";

import React, { useEffect, useState } from "react";

interface RadialScoreGaugeProps {
  score: number;
  size?: number;
  strokeWidth?: number;
}

export function RadialScoreGauge({
  score,
  size = 140,
  strokeWidth = 10,
}: RadialScoreGaugeProps) {
  const [animatedScore, setAnimatedScore] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedScore(score);
    }, 150);
    return () => clearTimeout(timer);
  }, [score]);

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (animatedScore / 100) * circumference;

  const getGradientId = () => {
    if (score >= 80) return "emeraldGradient";
    if (score >= 60) return "amberGradient";
    return "roseGradient";
  };

  const getTextColor = () => {
    if (score >= 80) return "text-emerald-400";
    if (score >= 60) return "text-amber-400";
    return "text-rose-400";
  };

  const getTierLabel = () => {
    if (score >= 85) return "Exceptional Fit";
    if (score >= 70) return "Strong Match";
    if (score >= 50) return "Moderate Fit";
    return "High Risk";
  };

  return (
    <div className="flex flex-col items-center justify-center relative">
      <svg width={size} height={size} className="transform -rotate-90">
        <defs>
          <linearGradient id="emeraldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#10b981" />
            <stop offset="100%" stopColor="#34d399" />
          </linearGradient>
          <linearGradient id="amberGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#fbbf24" />
          </linearGradient>
          <linearGradient id="roseGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f43f5e" />
            <stop offset="100%" stopColor="#fb7185" />
          </linearGradient>
        </defs>

        {/* Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-slate-800"
          fill="transparent"
        />

        {/* Animated Progress */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={`url(#${getGradientId()})`}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          fill="transparent"
          className="transition-all duration-1000 ease-out"
        />
      </svg>

      {/* Center Label */}
      <div className="absolute flex flex-col items-center justify-center text-center">
        <span className={`text-3xl font-extrabold font-mono tracking-tight ${getTextColor()}`}>
          {score}
        </span>
        <span className="text-[9px] uppercase font-bold tracking-widest text-slate-400 -mt-0.5">
          / 100
        </span>
      </div>

      <span
        className={`mt-2 text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${
          score >= 80
            ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
            : score >= 60
            ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
            : "bg-rose-500/10 text-rose-400 border-rose-500/20"
        }`}
      >
        {getTierLabel()}
      </span>
    </div>
  );
}

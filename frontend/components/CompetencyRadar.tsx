"use client";

import React from "react";
import { ScoreBreakdown } from "@/lib/types";

interface CompetencyRadarProps {
  scorecard: ScoreBreakdown;
  size?: number;
}

export function CompetencyRadar({ scorecard, size = 320 }: CompetencyRadarProps) {
  const {
    skills_match,
    experience_match,
    job_alignment,
    impact_and_achievements,
    education_match,
  } = scorecard;

  const categories = [
    { label: "Skills (30%)", score: skills_match?.score ?? 85 },
    { label: "Experience (25%)", score: experience_match?.score ?? 80 },
    { label: "Alignment (20%)", score: job_alignment?.score ?? 80 },
    { label: "Impact (15%)", score: impact_and_achievements?.score ?? 78 },
    { label: "Education (10%)", score: education_match?.score ?? 90 },
  ];

  const numAxes = categories.length;
  const center = size / 2;
  const radius = center - 45;
  const angleSlice = (Math.PI * 2) / numAxes;

  // Concentric levels (20%, 40%, 60%, 80%, 100%)
  const levels = [0.2, 0.4, 0.6, 0.8, 1.0];

  // Helper to compute (x, y) coordinates for an axis at a specific ratio
  const getCoordinates = (index: number, ratio: number) => {
    const angle = index * angleSlice - Math.PI / 2;
    const x = center + radius * ratio * Math.cos(angle);
    const y = center + radius * ratio * Math.sin(angle);
    return { x, y };
  };

  // Candidate polygon points
  const candidatePoints = categories
    .map((cat, idx) => {
      const { x, y } = getCoordinates(idx, cat.score / 100);
      return `${x},${y}`;
    })
    .join(" ");

  // Benchmark polygon points (ideal baseline at 80%)
  const benchmarkPoints = categories
    .map((_, idx) => {
      const { x, y } = getCoordinates(idx, 0.8);
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <div className="flex flex-col items-center justify-center p-4 bg-slate-900/60 rounded-2xl border border-slate-800">
      <div className="flex items-center justify-between w-full mb-2">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
          5-Axis Competency Radar
        </h4>
        <div className="flex items-center space-x-3 text-[10px]">
          <span className="flex items-center space-x-1 text-indigo-400">
            <span className="h-2 w-2 rounded-full bg-indigo-500 inline-block" />
            <span>Candidate</span>
          </span>
          <span className="flex items-center space-x-1 text-slate-400">
            <span className="h-2 w-2 rounded-full border border-dashed border-slate-400 inline-block" />
            <span>Target (80%)</span>
          </span>
        </div>
      </div>

      <svg width={size} height={size} className="overflow-visible">
        <defs>
          <linearGradient id="radarGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#6366f1" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#a855f7" stopOpacity="0.2" />
          </linearGradient>
        </defs>

        {/* Concentric grid webs */}
        {levels.map((level, lvlIdx) => {
          const points = Array.from({ length: numAxes })
            .map((_, idx) => {
              const { x, y } = getCoordinates(idx, level);
              return `${x},${y}`;
            })
            .join(" ");

          return (
            <polygon
              key={lvlIdx}
              points={points}
              fill="transparent"
              stroke="#334155"
              strokeWidth="0.75"
              strokeDasharray={lvlIdx === 3 ? "3,3" : "none"}
              opacity={lvlIdx === 4 ? 0.6 : 0.3}
            />
          );
        })}

        {/* Axis spoke lines */}
        {categories.map((_, idx) => {
          const { x, y } = getCoordinates(idx, 1.0);
          return (
            <line
              key={idx}
              x1={center}
              y1={center}
              x2={x}
              y2={y}
              stroke="#334155"
              strokeWidth="0.75"
              opacity="0.5"
            />
          );
        })}

        {/* Benchmark 80% Polygon (Dashed) */}
        <polygon
          points={benchmarkPoints}
          fill="transparent"
          stroke="#94a3b8"
          strokeWidth="1.5"
          strokeDasharray="4,4"
          opacity="0.4"
        />

        {/* Candidate Score Polygon */}
        <polygon
          points={candidatePoints}
          fill="url(#radarGradient)"
          stroke="#818cf8"
          strokeWidth="2.5"
          className="filter drop-shadow-[0_0_8px_rgba(99,102,241,0.4)] transition-all duration-700"
        />

        {/* Candidate Vertices */}
        {categories.map((cat, idx) => {
          const { x, y } = getCoordinates(idx, cat.score / 100);
          return (
            <circle
              key={idx}
              cx={x}
              cy={y}
              r="4"
              fill="#c084fc"
              stroke="#ffffff"
              strokeWidth="1.5"
              className="transition-all duration-700"
            />
          );
        })}

        {/* Category Labels at Spoke Ends */}
        {categories.map((cat, idx) => {
          const { x, y } = getCoordinates(idx, 1.18);
          return (
            <text
              key={idx}
              x={x}
              y={y}
              textAnchor="middle"
              dominantBaseline="middle"
              fill="#cbd5e1"
              fontSize="10"
              fontWeight="600"
              className="select-none"
            >
              {cat.label.split(" ")[0]} ({cat.score})
            </text>
          );
        })}
      </svg>
    </div>
  );
}

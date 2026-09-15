"use client";

import React, { useState } from "react";
import { Sparkles, ArrowRight, FileCheck, ShieldAlert, CheckCircle2, FileUp, Edit3 } from "lucide-react";
import { FileDropzone } from "./FileDropzone";

interface EvaluationFormProps {
  onSubmit: (jobDescription: string, resumeText: string) => void;
  isLoading: boolean;
  error?: string | null;
}

const SAMPLE_JD = `Role: Senior Backend Engineer (Distributed Systems)

Company Overview:
We are building real-time data pipelines and fault-tolerant cloud APIs for enterprise customers.

Key Responsibilities:
- Design, build, and maintain high-throughput asynchronous backend services using Python and FastAPI.
- Architect relational data schemas and optimize complex SQL queries in PostgreSQL.
- Implement Redis caching layers to reduce database latency and absorb sudden traffic spikes.
- Write robust unit, integration, and load tests using pytest and modern CI/CD pipelines.
- Ensure strict zero-trust data boundaries, tenant isolation, and API security.

Requirements:
- 5+ years of software engineering experience with backend systems.
- Demonstrated mastery of Python (FastAPI, SQLAlchemy, Pydantic) and PostgreSQL.
- Experience with Docker, asynchronous event-driven patterns, and distributed system design.
- Strong communication and cross-functional project leadership.`;

const SAMPLE_RESUME = `Candidate Name: Alex Mercer
Email: alex.mercer@cloudtech.dev
Phone: +1 (555) 847-2910
Location: San Francisco, CA

Professional Summary:
Senior Backend Engineer with 6+ years of hands-on experience building high-throughput asynchronous APIs and distributed systems in Python and Go. Proven track record optimizing relational databases and scaling microservices.

Core Technical Competencies:
- Languages & Frameworks: Python (FastAPI, asyncio, SQLAlchemy, Pydantic v2), Go, SQL
- Datastores & Caching: PostgreSQL, Redis, Alembic migrations
- Infrastructure & Testing: Docker, Docker Compose, Linux, pytest, CI/CD automation

Professional Experience:
Senior Backend Engineer | CloudScale Systems (2021 – Present)
- Designed and maintained high-throughput asynchronous backend services using Python and FastAPI serving 12M+ monthly requests.
- Optimized complex PostgreSQL relational queries, introducing database partitioning and indexing that slashed p99 latency by 38%.
- Implemented Redis caching layers with semantic invalidation to reduce database load under peak load conditions.
- Spearheaded test automation coverage from 64% to 92% utilizing pytest and integration suites.
- Enforced strict tenant isolation and automated PII scrubbing across all external integrations.

Software Engineer | Apex Data Labs (2018 – 2021)
- Developed RESTful microservices in Python with automated OpenAPI documentation.
- Built automated background worker pipelines for asynchronous document extraction and parsing.
- Collaborated across product and DevOps teams to containerize workloads with Docker.

Education:
B.S. in Computer Science | University of California, Berkeley`;

export function EvaluationForm({ onSubmit, isLoading, error }: EvaluationFormProps) {
  const [jobDescription, setJobDescription] = useState("");
  const [resumeText, setResumeText] = useState("");
  const [inputMode, setInputMode] = useState<"upload" | "paste">("upload");
  const [uploadError, setUploadError] = useState<string | null>(null);

  const minJd = 100;
  const maxJd = 30000;
  const minResume = 50;
  const maxResume = 50000;

  const isJdValid = jobDescription.length >= minJd && jobDescription.length <= maxJd;
  const isResumeValid = resumeText.length >= minResume && resumeText.length <= maxResume;
  const canSubmit = isJdValid && isResumeValid && !isLoading;

  const handleLoadSample = () => {
    setJobDescription(SAMPLE_JD);
    setResumeText(SAMPLE_RESUME);
    setInputMode("paste");
    setUploadError(null);
  };

  const handleFileParsed = (extractedText: string) => {
    setResumeText(extractedText);
    setUploadError(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (canSubmit) {
      onSubmit(jobDescription, resumeText);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-[#e9e9e7] dark:border-[#2f2f2f]">
        <div>
          <h2 className="text-xl font-bold text-[#2f3437] dark:text-white tracking-tight">
            Document Evaluation Workspace
          </h2>
          <p className="text-xs text-[#787774] dark:text-[#9b9a97]">
            Submit candidate credentials against role requirements for deterministic, evidence-backed evaluation.
          </p>
        </div>

        <button
          type="button"
          onClick={handleLoadSample}
          disabled={isLoading}
          className="inline-flex items-center space-x-2 text-xs font-medium px-3 py-1.5 rounded-md bg-[#f1f1ef] dark:bg-[#2c2c2c] hover:bg-[#eaeae8] dark:hover:bg-[#383838] text-[#2f3437] dark:text-[#e6e6e6] border border-[#e9e9e7] dark:border-[#383838] transition-all shadow-2xs"
        >
          <Sparkles className="h-3.5 w-3.5 text-[#787774] dark:text-[#9b9a97]" />
          <span>Load Senior Engineer Sample</span>
        </button>
      </div>

      {(error || uploadError) && (
        <div className="p-3.5 rounded-lg bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900/60 flex items-start space-x-3 text-rose-900 dark:text-rose-300 text-xs">
          <ShieldAlert className="h-4 w-4 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold block">Notice</span>
            <span>{error || uploadError}</span>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Job Description Input */}
        <div className="flex flex-col space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-[#2f3437] dark:text-white flex items-center space-x-2">
              <FileCheck className="h-4 w-4 text-[#787774] dark:text-[#9b9a97]" />
              <span>Target Job Description</span>
            </label>
            <span
              className={`text-xs ${
                jobDescription.length === 0
                  ? "text-[#9b9a97]"
                  : isJdValid
                  ? "text-[#787774] dark:text-[#9b9a97]"
                  : "text-amber-700 dark:text-amber-400"
              }`}
            >
              {jobDescription.length.toLocaleString()} / {maxJd.toLocaleString()} chars
              {jobDescription.length > 0 && jobDescription.length < minJd && ` (min ${minJd})`}
            </span>
          </div>

          <div className="relative flex-1">
            <textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste target job description, responsibilities, and required competencies here..."
              rows={15}
              disabled={isLoading}
              className="w-full h-full p-3.5 rounded-lg bg-white dark:bg-[#191919] border border-[#e9e9e7] dark:border-[#2f2f2f] text-[#2f3437] dark:text-[#e6e6e6] placeholder:text-[#9b9a97] dark:placeholder:text-[#666666] focus:outline-none focus:border-[#2f3437] dark:focus:border-white focus:ring-1 focus:ring-[#2f3437] dark:focus:ring-white text-xs font-mono leading-relaxed resize-none transition-all shadow-2xs"
            />
          </div>
        </div>

        {/* Resume Input (Dropzone + Direct Editor) */}
        <div className="flex flex-col space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="h-4 w-4 text-[#787774] dark:text-[#9b9a97]" />
              <span className="text-xs font-semibold text-[#2f3437] dark:text-white">Candidate Resume</span>
            </div>

            {/* Toggle Modes */}
            <div className="flex items-center space-x-1 p-0.5 rounded-md bg-[#f1f1ef] dark:bg-[#2c2c2c] border border-[#e9e9e7] dark:border-[#383838] text-xs">
              <button
                type="button"
                onClick={() => setInputMode("upload")}
                className={`px-2 py-1 rounded text-xs font-medium flex items-center space-x-1 transition-all ${
                  inputMode === "upload"
                    ? "bg-white dark:bg-[#191919] text-[#2f3437] dark:text-white shadow-2xs font-semibold"
                    : "text-[#787774] dark:text-[#9b9a97] hover:text-[#2f3437] dark:hover:text-white"
                }`}
              >
                <FileUp className="h-3 w-3" />
                <span>Upload PDF/DOCX</span>
              </button>
              <button
                type="button"
                onClick={() => setInputMode("paste")}
                className={`px-2 py-1 rounded text-xs font-medium flex items-center space-x-1 transition-all ${
                  inputMode === "paste"
                    ? "bg-white dark:bg-[#191919] text-[#2f3437] dark:text-white shadow-2xs font-semibold"
                    : "text-[#787774] dark:text-[#9b9a97] hover:text-[#2f3437] dark:hover:text-white"
                }`}
              >
                <Edit3 className="h-3 w-3" />
                <span>Direct Text</span>
              </button>
            </div>
          </div>

          {inputMode === "upload" ? (
            <div className="flex flex-col space-y-3 flex-1">
              <FileDropzone
                onFileParsed={handleFileParsed}
                onError={setUploadError}
                isLoading={isLoading}
              />
              {resumeText && (
                <div className="flex-1 flex flex-col space-y-1.5">
                  <div className="flex items-center justify-between text-xs text-[#787774] dark:text-[#9b9a97]">
                    <span>Parsed Content Preview</span>
                    <span className={isResumeValid ? "text-[#787774] dark:text-[#9b9a97]" : "text-amber-700 dark:text-amber-400"}>
                      {resumeText.length.toLocaleString()} chars
                    </span>
                  </div>
                  <textarea
                    value={resumeText}
                    onChange={(e) => setResumeText(e.target.value)}
                    rows={8}
                    disabled={isLoading}
                    className="w-full p-3 rounded-lg bg-[#fbfbfa] dark:bg-[#191919] border border-[#e9e9e7] dark:border-[#2f2f2f] text-[#2f3437] dark:text-[#e6e6e6] text-xs font-mono leading-relaxed resize-none focus:outline-none focus:border-[#2f3437] dark:focus:border-white"
                  />
                </div>
              )}
            </div>
          ) : (
            <div className="relative flex-1">
              <textarea
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
                placeholder="Paste raw candidate resume text (PII will be automatically redacted prior to LLM processing)..."
                rows={15}
                disabled={isLoading}
                className="w-full h-full p-3.5 rounded-lg bg-white dark:bg-[#191919] border border-[#e9e9e7] dark:border-[#2f2f2f] text-[#2f3437] dark:text-[#e6e6e6] placeholder:text-[#9b9a97] dark:placeholder:text-[#666666] focus:outline-none focus:border-[#2f3437] dark:focus:border-white focus:ring-1 focus:ring-[#2f3437] dark:focus:ring-white text-xs font-mono leading-relaxed resize-none transition-all shadow-2xs"
              />
            </div>
          )}
        </div>
      </div>

      {/* Action Footer */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-[#e9e9e7] dark:border-[#2f2f2f]">
        <div className="flex items-center space-x-2 text-xs text-[#787774] dark:text-[#9b9a97]">
          <span className="inline-block h-2 w-2 rounded-full bg-emerald-500" />
          <span>Zero-Trust LLM Firewall & Pre-flight PII Scrubbing Active</span>
        </div>

        <button
          type="submit"
          disabled={!canSubmit}
          className={`w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-6 py-2.5 rounded-md font-medium text-xs transition-all ${
            canSubmit
              ? "bg-[#2f3437] dark:bg-white hover:bg-[#1f2326] dark:hover:bg-[#e6e6e6] text-white dark:text-[#191919] shadow-2xs active:scale-[0.99]"
              : "bg-[#f1f1ef] dark:bg-[#2c2c2c] text-[#9b9a97] dark:text-[#666666] cursor-not-allowed border border-[#e9e9e7] dark:border-[#383838]"
          }`}
        >
          <span>Evaluate & Generate Scorecard</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </div>
    </form>
  );
}

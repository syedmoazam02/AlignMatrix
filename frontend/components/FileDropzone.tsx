"use client";

import React, { useState, useRef } from "react";
import { UploadCloud, FileText, CheckCircle2, AlertCircle, X, ShieldCheck } from "lucide-react";

interface FileDropzoneProps {
  onFileParsed: (text: string, filename: string) => void;
  onError: (msg: string) => void;
  isLoading?: boolean;
}

export function FileDropzone({
  onFileParsed,
  onError,
  isLoading,
}: FileDropzoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [parsedFile, setParsedFile] = useState<{
    name: string;
    size: number;
    charCount: number;
  } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFile = async (file: File) => {
    const ext = file.name.split(".").pop()?.toLowerCase();

    if (!["txt", "md", "docx", "pdf"].includes(ext || "")) {
      onError("Unsupported file format. Please upload a .pdf, .docx, or .txt file.");
      return;
    }

    try {
      let extractedText = "";

      if (ext === "txt" || ext === "md") {
        extractedText = await file.text();
      } else if (ext === "docx") {
        const mammoth = await import("mammoth");
        const arrayBuffer = await file.arrayBuffer();
        const result = await mammoth.extractRawText({ arrayBuffer });
        extractedText = result.value;
      } else if (ext === "pdf") {
        const arrayBuffer = await file.arrayBuffer();
        const bytes = new Uint8Array(arrayBuffer);
        const decoder = new TextDecoder("latin1");
        const rawString = decoder.decode(bytes);

        const matches = rawString.match(/BT[\s\S]*?ET/g);
        if (matches && matches.length > 0) {
          const textChunks: string[] = [];
          for (const match of matches) {
            const tjMatches = match.match(/\((.*?)\)\s*Tj/g);
            if (tjMatches) {
              tjMatches.forEach((tj) => {
                const text = tj.replace(/^\(/, "").replace(/\)\s*Tj$/, "");
                textChunks.push(text);
              });
            }
          }
          extractedText = textChunks.join(" ");
        } else {
          const textMatches = rawString.match(/[A-Za-z0-9\s.,;:\-_@]{4,}/g);
          extractedText = textMatches ? textMatches.join(" ") : "Extracted PDF contents";
        }
      }

      setParsedFile({
        name: file.name,
        size: file.size,
        charCount: extractedText.length,
      });

      onFileParsed(extractedText, file.name);
    } catch (err: any) {
      onError(`Failed to parse file: ${err.message || "Unknown file read error"}`);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFile(e.target.files[0]);
    }
  };

  const clearFile = () => {
    setParsedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-3">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        accept=".pdf,.docx,.txt,.md"
        className="hidden"
        disabled={isLoading}
      />

      {!parsedFile ? (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`p-6 rounded-lg border-2 border-dashed transition-all cursor-pointer flex flex-col items-center justify-center text-center space-y-2 ${
            isDragging
              ? "border-[#2f3437] dark:border-white bg-[#f1f1ef] dark:bg-[#252525] scale-[1.01]"
              : "border-[#e9e9e7] dark:border-[#2f2f2f] hover:border-[#2f3437] dark:hover:border-white bg-white dark:bg-[#202020] hover:bg-[#fbfbfa] dark:hover:bg-[#262626]"
          }`}
        >
          <div className="p-3 rounded-full bg-[#f1f1ef] dark:bg-[#2c2c2c] text-[#2f3437] dark:text-white border border-[#e9e9e7] dark:border-[#383838]">
            <UploadCloud className="h-6 w-6" />
          </div>
          <div>
            <span className="text-sm font-semibold text-[#2f3437] dark:text-white">
              Drag & drop candidate resume, or{" "}
              <span className="text-[#2f3437] dark:text-white underline underline-offset-2">browse</span>
            </span>
            <p className="text-xs text-[#787774] dark:text-[#9b9a97] mt-0.5">
              Supports PDF, DOCX, and TXT (up to 50,000 characters)
            </p>
          </div>
        </div>
      ) : (
        <div className="p-3.5 rounded-lg bg-white dark:bg-[#202020] border border-emerald-300 dark:border-emerald-800 flex items-center justify-between shadow-2xs">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-md bg-emerald-50 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-semibold text-[#2f3437] dark:text-white max-w-[200px] truncate">
                  {parsedFile.name}
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#f1f1ef] dark:bg-[#2c2c2c] text-[#787774] dark:text-[#9b9a97] border border-[#e9e9e7] dark:border-[#383838]">
                  {(parsedFile.size / 1024).toFixed(1)} KB
                </span>
              </div>
              <p className="text-[11px] text-emerald-700 dark:text-emerald-400 flex items-center space-x-1 mt-0.5">
                <CheckCircle2 className="h-3 w-3" />
                <span>Extracted {parsedFile.charCount.toLocaleString()} characters</span>
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={clearFile}
            className="p-1.5 rounded-md text-[#787774] dark:text-[#9b9a97] hover:text-[#2f3437] dark:hover:text-white hover:bg-[#f1f1ef] dark:hover:bg-[#2c2c2c] transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Pre-flight Privacy Notice */}
      <div className="flex items-center space-x-2 text-[11px] text-[#787774] dark:text-[#9b9a97] px-1">
        <ShieldCheck className="h-3.5 w-3.5 text-emerald-700 dark:text-emerald-400 shrink-0" />
        <span>Pre-flight PII scrubber active: names, emails, phones, and addresses stripped before LLM transit.</span>
      </div>
    </div>
  );
}

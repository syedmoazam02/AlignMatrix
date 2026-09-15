import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";

export const metadata: Metadata = {
  title: "AlignMatrix — Enterprise Document Evaluation Platform",
  description:
    "Enterprise-grade, asynchronous document evaluation SaaS. Evidence-backed resume scorecard with zero-trust validation and deterministic scoring.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="flex flex-col min-h-screen bg-[#fbfbfa] dark:bg-[#191919] text-[#2f3437] dark:text-[#e6e6e6] font-sans antialiased transition-colors duration-200">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}

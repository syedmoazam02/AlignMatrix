export type EvaluationStatus = "queued" | "processing" | "completed" | "failed";

export type MatchStatus =
  | "Demonstrated"
  | "Partial Match"
  | "Missing"
  | "Unsupported"
  | "Needs Verification";

export interface RequirementEvaluation {
  requirement: string;
  status: MatchStatus;
  evidence_found?: string | null;
  action: string;
  priority?: "Critical" | "High" | "Preferred";
  qualification_reason?: string;
  missing_details?: string;
  truthful_improvement?: string;
  related_interview_question?: string;
}

export type MatchAssessment = "matched" | "partial" | "missing";

export type ConfidenceLevel = "high" | "medium" | "low" | "High" | "Medium" | "Low";

export type ImpactLevel = "high" | "medium" | "low";

export interface MatchEvidence {
  requirement: string;
  resume_excerpt?: string | null;
  assessment: MatchAssessment;
  confidence: ConfidenceLevel;
  explanation: string;
}

export interface GapEvidence {
  missing_requirement: string;
  impact: ImpactLevel;
  explanation: string;
}

export interface CategoryScore {
  score: number;
  rationale: string;
  evidence: MatchEvidence[];
}

export interface ScoreBreakdown {
  overall_score: number;
  metrics?: {
    strong?: number;
    partial?: number;
    missing?: number;
    unsupported?: number;
    [key: string]: number | undefined;
  };
  evidence_matrix?: RequirementEvaluation[];
  skills_match?: CategoryScore;
  experience_match?: CategoryScore;
  education_match?: CategoryScore;
  job_alignment?: CategoryScore;
  impact_and_achievements?: CategoryScore;
  identified_gaps?: GapEvidence[];
  strengths?: string[];
  recommendations?: string[];
}

export interface EvaluationJobCreated {
  evaluation_id: number;
  status: EvaluationStatus;
}

export interface EvaluationErrorResponse {
  code: string;
  message: string;
}

export interface EvaluationResponse {
  id: number;
  status: EvaluationStatus;
  score?: ScoreBreakdown | null;
  error?: EvaluationErrorResponse | null;
  created_at: string;
  completed_at?: string | null;
}

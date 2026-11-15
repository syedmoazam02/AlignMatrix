import { EvaluationJobCreated, EvaluationResponse } from "./types";

const BASE_URL = "/api/backend";

export async function submitEvaluation(
  jobDescription: string,
  resumeText: string
): Promise<EvaluationJobCreated> {
  const response = await fetch(`${BASE_URL}/evaluations/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
    },
    body: JSON.stringify({
      job_description: jobDescription,
      resume_text: resumeText,
    }),
  });

  if (!response.ok) {
    let errorDetail = "";
    try {
      const errJson = await response.json();
      if (Array.isArray(errJson.detail)) {
        errorDetail = errJson.detail.map((e: any) => e.msg || JSON.stringify(e)).join(", ");
      } else if (typeof errJson.detail === "string") {
        errorDetail = errJson.detail;
      } else if (errJson.message) {
        errorDetail = errJson.message;
      }
    } catch {
      errorDetail = `Request failed with HTTP status ${response.status}`;
    }
    throw new Error(errorDetail || `Submission failed (${response.status})`);
  }

  return response.json();
}

export async function pollEvaluation(
  evaluationId: number
): Promise<EvaluationResponse> {
  const response = await fetch(`${BASE_URL}/evaluations/${evaluationId}`, {
    method: "GET",
    headers: {
      "Accept": "application/json",
    },
    cache: "no-store",
  });

  if (!response.ok) {
    let errorDetail = "";
    try {
      const errJson = await response.json();
      errorDetail = errJson.detail || errJson.message;
    } catch {
      errorDetail = `Polling request failed with status ${response.status}`;
    }
    throw new Error(errorDetail || `Polling failed (${response.status})`);
  }

  return response.json();
}

export async function checkBackendHealth(): Promise<{ status: string; database: string }> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);
    const response = await fetch(`${BASE_URL}/health`, {
      method: "GET",
      cache: "no-store",
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (!response.ok) {
      return { status: "degraded", database: "disconnected" };
    }

    const data = await response.json().catch(() => ({}));
    return {
      status: data.status || "ok",
      database: data.database || "ok",
    };
  } catch {
    return { status: "offline", database: "disconnected" };
  }
}

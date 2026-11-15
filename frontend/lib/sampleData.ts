import { ScoreBreakdown } from "./types";

export const SAMPLE_RESUME_TEXT = `Alex Mercer
Senior Backend Software Engineer
San Francisco, CA • alex.mercer@email.com • github.com/alexmercer

SUMMARY
Senior Backend Software Engineer with 7+ years of experience designing and scaling distributed systems, asynchronous event-driven microservices, and high-throughput data processing pipelines. Proven track record leading architectures handling 12M+ monthly requests with 99.99% uptime.

EXPERIENCE
CloudScale Systems | Senior Backend Engineer
March 2021 – Present | San Francisco, CA
• Designed and maintained high-throughput asynchronous backend services using Python and FastAPI serving 12M+ monthly requests.
• Optimized complex PostgreSQL relational queries, introducing database partitioning and indexing that slashed p99 latency by 38%.
• Implemented Redis caching layers with semantic invalidation to reduce database load under peak load conditions.
• Containerized core services with Docker and streamlined automated CI/CD deployment pipelines on GitHub Actions.
• Mentored junior engineers and instituted rigorous Pydantic schema validation across all internal service APIs.

Apex Data Solutions | Backend Software Engineer
July 2018 – February 2021 | San Jose, CA
• Developed RESTful and asynchronous API endpoints in Python for real-time document analysis.
• Maintained PostgreSQL databases, authoring migration scripts and ensuring ACID compliance.
• Integrated Docker containers into local development and staging workflows.

SKILLS
• Languages & Frameworks: Python (FastAPI, AsyncIO, SQLAlchemy, Pydantic), SQL, TypeScript
• Databases & Caching: PostgreSQL, Redis, Database Optimization, Index Tuning
• DevOps & Cloud: Docker, Docker Compose, Git, GitHub Actions, Linux
• Architecture: Microservices, Asynchronous Event Loops, RESTful APIs, Zero-Trust Design

EDUCATION
University of California, Berkeley
B.S. in Computer Science | 2014 – 2018`;

export const SAMPLE_SCORECARD: ScoreBreakdown = {
  overall_score: 84,
  metrics: {
    strong: 14,
    partial: 4,
    missing: 2,
    unsupported: 1,
  },
  strengths: [
    "Extensive demonstrated expertise with asynchronous Python, FastAPI, and Pydantic architectures.",
    "Proven track record scaling PostgreSQL databases with indexing and partitioning (38% p99 latency reduction).",
    "Solid distributed systems mindset with semantic Redis caching and containerization practices.",
  ],
  recommendations: [
    "Detail hands-on experience or architectural approach with Kubernetes cluster orchestration.",
    "Clarify message broker usage (Kafka/RabbitMQ) for asynchronous queue processing.",
    "Highlight specific cloud provider deliverables (AWS ECS/RDS) to substantiate cloud claims.",
  ],
  skills_match: {
    score: 88,
    rationale:
      "Strong alignment across Python, FastAPI, relational database design, and containerization. Demonstrates senior architectural intuition.",
    evidence: [
      {
        requirement: "Python (FastAPI & Asynchronous Programming)",
        resume_excerpt:
          "Designed and maintained high-throughput asynchronous backend services using Python and FastAPI serving 12M+ monthly requests.",
        assessment: "matched",
        confidence: "high",
        explanation:
          "Direct evidence of production FastAPI microservices handling 12M+ requests.",
      },
      {
        requirement: "PostgreSQL Database Performance Tuning",
        resume_excerpt:
          "Optimized complex PostgreSQL relational queries, introducing database partitioning and indexing that slashed p99 latency by 38%.",
        assessment: "matched",
        confidence: "high",
        explanation:
          "Strong quantitative evidence showing database optimization and latency reduction.",
      },
      {
        requirement: "In-Memory Caching (Redis)",
        resume_excerpt:
          "Implemented Redis caching layers with semantic invalidation to reduce database load under peak load conditions.",
        assessment: "partial",
        confidence: "medium",
        explanation:
          "Mentions semantic cache invalidation, though cache hit ratios and eviction policies could be further specified.",
      },
      {
        requirement: "Containerization (Docker)",
        resume_excerpt:
          "Containerized core services with Docker and streamlined automated CI/CD deployment pipelines.",
        assessment: "matched",
        confidence: "high",
        explanation: "Verified Docker multi-stage containerization in production CI/CD.",
      },
    ],
  },
  experience_match: {
    score: 85,
    rationale:
      "7+ years of progressive engineering leadership handling high-throughput production workloads.",
    evidence: [
      {
        requirement: "High-Throughput Microservice Architecture",
        resume_excerpt: "serving 12M+ monthly requests with 99.99% uptime.",
        assessment: "matched",
        confidence: "high",
        explanation: "Verifiable production scale and SLA targets achieved.",
      },
      {
        requirement: "API Contract Validation & Type Safety",
        resume_excerpt:
          "instituted rigorous Pydantic schema validation across all internal service APIs.",
        assessment: "matched",
        confidence: "high",
        explanation:
          "Direct correlation with zero-trust AI schema enforcement standards.",
      },
    ],
  },
  education_match: {
    score: 90,
    rationale:
      "B.S. in Computer Science from UC Berkeley aligns with the academic requirements.",
    evidence: [
      {
        requirement: "Bachelor's Degree in Computer Science or equivalent",
        resume_excerpt: "University of California, Berkeley • B.S. in Computer Science",
        assessment: "matched",
        confidence: "high",
        explanation: "Exact degree match from an accredited institution.",
      },
    ],
  },
  job_alignment: {
    score: 82,
    rationale:
      "Candidate's background strongly mirrors the core requirements of high-throughput backend services.",
    evidence: [
      {
        requirement: "Data Pipeline & Async Workflows",
        resume_excerpt:
          "asynchronous event-driven microservices, and high-throughput data processing pipelines.",
        assessment: "matched",
        confidence: "high",
        explanation: "Demonstrated experience designing asynchronous processing flows.",
      },
    ],
  },
  impact_and_achievements: {
    score: 80,
    rationale:
      "Quantified metric improvements including 38% latency reduction and 99.99% uptime.",
    evidence: [
      {
        requirement: "Quantifiable Performance Engineering",
        resume_excerpt: "slashed p99 latency by 38%.",
        assessment: "matched",
        confidence: "high",
        explanation: "Direct quantifiable achievement on production infrastructure.",
      },
    ],
  },
  identified_gaps: [
    {
      missing_requirement: "Kubernetes / Container Orchestration",
      impact: "high",
      explanation:
        "Resume details Docker experience, but lacks mention of Kubernetes Pods, Ingress, or Helm charts for production cluster management.",
    },
    {
      missing_requirement: "Distributed Message Queues (Kafka / RabbitMQ)",
      impact: "medium",
      explanation:
        "Mention of background document workflows without citing specific distributed queue brokers.",
    },
  ],
  evidence_matrix: [
    {
      requirement: "Python (FastAPI / Asynchronous Architecture)",
      status: "Demonstrated",
      evidence_found:
        "Designed and maintained high-throughput asynchronous backend services using Python and FastAPI serving 12M+ monthly requests.",
      action: "No action needed. Highlight concurrency tools (e.g. uvloop) during technical interviews.",
      priority: "Critical",
      qualification_reason: "Direct citation confirms 7+ years of hands-on production microservice engineering with FastAPI.",
      missing_details: "None. Direct match with scale metrics.",
      truthful_improvement: "Highlight specific concurrency tools (e.g. uvloop, asyncio queues) to showcase senior depth.",
      related_interview_question: "How do you handle event loop blocking or CPU-heavy tasks in an asynchronous FastAPI architecture?",
    },
    {
      requirement: "PostgreSQL Query Optimization & Indexing",
      status: "Demonstrated",
      evidence_found:
        "Optimized complex PostgreSQL relational queries, introducing database partitioning and indexing that slashed p99 latency by 38%.",
      action: "Quantified metric provided. Ready for deep dive discussions.",
      priority: "Critical",
      qualification_reason: "Demonstrates relational data modeling, query profiling, and index strategies.",
      missing_details: "None. Direct match.",
      truthful_improvement: "Include pre- and post-optimization latency baselines.",
      related_interview_question: "How do you diagnose slow queries in PostgreSQL when EXPLAIN ANALYZE shows sequential table scans?",
    },
    {
      requirement: "Distributed Caching (Redis)",
      status: "Partial Match",
      evidence_found:
        "Implemented Redis caching layers with semantic invalidation to reduce database load under peak load conditions.",
      action: "Add cache hit ratio or eviction policy specifics if available.",
      priority: "High",
      qualification_reason: "Shows caching design, but lacks cache consistency and TTL details.",
      missing_details: "Cache hit ratio and eviction policy.",
      truthful_improvement: "Mention cache-aside pattern or Redis cluster topology.",
      related_interview_question: "How do you prevent cache stampedes (thundering herd problem) in high-traffic Redis setups?",
    },
    {
      requirement: "Kubernetes Cluster Management",
      status: "Missing",
      evidence_found: null,
      action: "Acknowledge gap honestly: highlight Docker container mastery and express readiness to learn K8s manifests.",
      priority: "Critical",
      qualification_reason: "No mention of Kubernetes or Helm charts found in resume.",
      missing_details: "Missing Kubernetes manifest authorship and cluster debugging.",
      truthful_improvement: "Deploy a personal project to k3s or Minikube and document it.",
      related_interview_question: "While your resume focuses on Docker, how would you approach debugging a CrashLoopBackOff in Kubernetes?",
    },
    {
      requirement: "Cloud Infrastructure (AWS ECS / RDS / Terraform)",
      status: "Unsupported",
      evidence_found: null,
      action: "Clarify which specific AWS cloud services were used in production.",
      priority: "Preferred",
      qualification_reason: "Listed in skills header without supporting deliverables in work experience.",
      missing_details: "No specific cloud infrastructure deliverables cited in project history.",
      truthful_improvement: "Tie AWS ECS or RDS directly to project bullet points.",
      related_interview_question: "What infrastructure-as-code or cloud deployment pipelines have you managed in production?",
    },
  ],
};

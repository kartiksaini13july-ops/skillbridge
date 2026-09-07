import { ParsedResume, ApiEndpointDoc } from '../types';

export const sampleResumes: Record<string, { label: string; role: string; rawText: string; parsed: ParsedResume }> = {
  software_engineer: {
    label: "Alex Morgan",
    role: "Staff Software Engineer",
    rawText: `Alex Morgan
San Francisco, CA • alex.morgan.dev@email.com • (415) 555-0192 • linkedin.com/in/alexmorgan-dev • github.com/alexmorgan

SUMMARY
Staff Software Engineer with 8+ years architecting distributed backend services, real-time streaming pipelines, and microservices in Go, Python, and TypeScript. Reduced system latency by 42% and supported 50M+ daily active users across AWS and GCP infrastructure. Passionate about developer tooling, API reliability, and mentoring engineering teams.

TECHNICAL SKILLS
• Programming: Go, TypeScript, Python, Rust, SQL, Java
• Cloud & Infrastructure: Kubernetes, Docker, AWS (ECS, S3, RDS, Lambda), GCP, Terraform, CI/CD, Kafka
• Databases & Storage: PostgreSQL, Redis, DynamoDB, Elasticsearch, Snowflake
• Frameworks & Tools: Express, gRPC, GraphQL, FastAPI, React, Next.js, Prometheus, Datadog

EXPERIENCE
Staff Backend Engineer | CloudScale Tech, San Francisco, CA | 2021 - Present
• Spearheaded the re-architecture of the core event ingestion pipeline using Go and Apache Kafka, processing 1.2B daily events with 99.99% uptime.
• Reduced p99 API latency from 240ms to 78ms through Redis caching layers and connection pooling optimizations.
• Led a cross-functional squad of 7 engineers delivering multi-region database failover, reducing disaster recovery RTO from 35 minutes to 4 minutes.
• Authored comprehensive RFCs and microservice architectural guidelines adopted by 40+ engineers across 6 teams.

Senior Software Engineer | Apex Data Systems, Mountain View, CA | 2018 - 2021
• Built real-time analytics dashboards using TypeScript, Node.js, and PostgreSQL, serving 15,000+ enterprise corporate clients.
• Automated infrastructure deployment using Terraform and GitHub Actions, cutting staging deployment cycles from 45 minutes to 6 minutes.
• Optimized complex SQL queries and index strategies, cutting database compute expenses by $180,000 annually.
• Mentored 5 junior and mid-level engineers, resulting in 3 internal promotions within 18 months.

Software Engineer | Nexus Interactive, Seattle, WA | 2016 - 2018
• Developed RESTful microservices in Python and FastAPI supporting mobile client applications with 2M+ active installs.
• Integrated Stripe payment gateways and fraud detection webhooks, handling $12M in annual recurring transactions.
• Increased automated unit and integration test coverage from 52% to 89% using PyTest and Docker containers.

EDUCATION
Bachelor of Science in Computer Science | University of Washington, Seattle, WA | 2012 - 2016
• GPA: 3.85 / 4.0 • Dean's List (6 semesters)

KEY PROJECTS
• OmniQueue: Open-source distributed task queue in Go with Redis broker; 2,400+ GitHub stars.
• LatencyRadar: Real-time distributed tracing visualizer with OpenTelemetry integrations.

CERTIFICATIONS
• AWS Certified Solutions Architect - Professional (2023)
• Certified Kubernetes Administrator (CKA, Linux Foundation - 2022)`,
    parsed: {
      personalInfo: {
        name: "Alex Morgan",
        title: "Staff Software Engineer",
        email: "alex.morgan.dev@email.com",
        phone: "(415) 555-0192",
        location: "San Francisco, CA",
        linkedin: "linkedin.com/in/alexmorgan-dev",
        github: "github.com/alexmorgan",
        website: "https://alexmorgan.dev"
      },
      summary: "Staff Software Engineer with 8+ years architecting distributed backend services, real-time streaming pipelines, and microservices in Go, Python, and TypeScript. Reduced system latency by 42% and supported 50M+ daily active users across AWS and GCP infrastructure. Passionate about developer tooling, API reliability, and mentoring engineering teams.",
      skills: {
        technical: ["Go", "TypeScript", "Python", "Rust", "SQL", "Distributed Systems", "Microservices", "RESTful APIs", "gRPC", "GraphQL"],
        tools: ["Kubernetes", "Docker", "AWS (ECS, S3, RDS, Lambda)", "GCP", "Terraform", "Kafka", "PostgreSQL", "Redis", "DynamoDB", "Datadog"],
        soft: ["Technical Leadership", "System Architecture Design", "Cross-Functional Mentorship", "RFC Writing", "Incident Management"],
        languages: ["English (Native)", "Spanish (Conversational)"]
      },
      experience: [
        {
          id: "exp-1",
          company: "CloudScale Tech",
          role: "Staff Backend Engineer",
          location: "San Francisco, CA",
          startDate: "Jan 2021",
          endDate: "Present",
          current: true,
          highlights: [
            "Spearheaded the re-architecture of the core event ingestion pipeline using Go and Apache Kafka, processing 1.2B daily events with 99.99% uptime.",
            "Reduced p99 API latency from 240ms to 78ms through Redis caching layers and connection pooling optimizations.",
            "Led a cross-functional squad of 7 engineers delivering multi-region database failover, reducing disaster recovery RTO from 35 minutes to 4 minutes.",
            "Authored comprehensive RFCs and microservice architectural guidelines adopted by 40+ engineers across 6 teams."
          ],
          keyMetrics: ["1.2B daily events", "99.99% uptime", "78ms p99 latency", "4 min RTO failover"]
        },
        {
          id: "exp-2",
          company: "Apex Data Systems",
          role: "Senior Software Engineer",
          location: "Mountain View, CA",
          startDate: "Mar 2018",
          endDate: "Dec 2020",
          current: false,
          highlights: [
            "Built real-time analytics dashboards using TypeScript, Node.js, and PostgreSQL, serving 15,000+ enterprise corporate clients.",
            "Automated infrastructure deployment using Terraform and GitHub Actions, cutting staging deployment cycles from 45 minutes to 6 minutes.",
            "Optimized complex SQL queries and index strategies, cutting database compute expenses by $180,000 annually.",
            "Mentored 5 junior and mid-level engineers, resulting in 3 internal promotions within 18 months."
          ],
          keyMetrics: ["15,000+ enterprise clients", "$180,000 cloud savings", "87% faster deployments"]
        },
        {
          id: "exp-3",
          company: "Nexus Interactive",
          role: "Software Engineer",
          location: "Seattle, WA",
          startDate: "Jun 2016",
          endDate: "Feb 2018",
          current: false,
          highlights: [
            "Developed RESTful microservices in Python and FastAPI supporting mobile client applications with 2M+ active installs.",
            "Integrated Stripe payment gateways and fraud detection webhooks, handling $12M in annual recurring transactions.",
            "Increased automated unit and integration test coverage from 52% to 89% using PyTest and Docker containers."
          ],
          keyMetrics: ["2M+ app users", "$12M transaction volume", "89% test coverage"]
        }
      ],
      education: [
        {
          id: "edu-1",
          institution: "University of Washington",
          degree: "Bachelor of Science",
          fieldOfStudy: "Computer Science",
          startDate: "2012",
          endDate: "2016",
          gpa: "3.85 / 4.0",
          honors: ["Dean's List (6 semesters)", "Graduated with Departmental Honors"]
        }
      ],
      projects: [
        {
          id: "proj-1",
          name: "OmniQueue",
          description: "High-throughput open-source distributed task queue built in Go with Redis backend broker.",
          technologies: ["Go", "Redis", "Docker", "gRPC"],
          link: "github.com/alexmorgan/omniqueue",
          highlights: ["2,400+ GitHub stars", "Used in production by 18+ startups"]
        },
        {
          id: "proj-2",
          name: "LatencyRadar",
          description: "Visual trace inspection tool leveraging OpenTelemetry protocol to locate network bottlenecks.",
          technologies: ["TypeScript", "React", "OpenTelemetry", "Go"],
          link: "github.com/alexmorgan/latency-radar"
        }
      ],
      certifications: [
        {
          id: "cert-1",
          name: "AWS Certified Solutions Architect - Professional",
          issuer: "Amazon Web Services",
          date: "2023",
          credentialId: "AWS-PSA-99412"
        },
        {
          id: "cert-2",
          name: "Certified Kubernetes Administrator (CKA)",
          issuer: "Cloud Native Computing Foundation",
          date: "2022",
          credentialId: "CKA-220019"
        }
      ]
    }
  },

  product_manager: {
    label: "Priya Sharma",
    role: "Lead Product Manager - AI & Platform",
    rawText: `Priya Sharma
New York, NY • priya.sharma.pm@email.com • (917) 555-8831 • linkedin.com/in/priyasharma-pm

SUMMARY
Results-driven Lead Product Manager with 7+ years of experience scaling AI/ML-powered SaaS products from 0 to 1 and driving $24M in Net New ARR. Experienced in LLM integrations, enterprise workflow automation, data platform roadmaps, and agile product strategy.

SKILLS
• Product Strategy: Product Roadmap, Go-To-Market (GTM), PRDs, Customer Discovery, OKRs, Pricing & Packaging
• AI & Data: LLM Evaluation, Agentic Workflows, Prompt Engineering, SQL, A/B Testing, Mixpanel, Amplitude
• Methodologies: Agile / Scrum, User Journey Mapping, Design Sprints, Wireframing (Figma)

EXPERIENCE
Lead Product Manager | Horizon AI Software, New York, NY | 2022 - Present
• Launched enterprise Generative AI co-pilot suite, driving $14.2M in annual recurring revenue in the first 12 months with 94% customer retention.
• Defined product requirements for RAG search platform, decreasing customer ticket resolution time by 38% across 450+ enterprise accounts.
• Spearheaded pricing packaging overhaul that lifted Average Revenue Per Account (ARPA) by 27%.

Senior Product Manager | Veloce Commerce, Boston, MA | 2019 - 2022
• Managed checkout and conversion optimization team; executed 30+ multivariable A/B tests yielding an incremental $9.8M in GMV.
• Partnered with data science team to ship automated personalization engine, boosting cart conversion by 14.5%.

EDUCATION
Master of Business Administration (MBA) | Columbia Business School, New York, NY | 2017 - 2019
B.S. in Industrial Engineering | Cornell University, Ithaca, NY | 2011 - 2015`,
    parsed: {
      personalInfo: {
        name: "Priya Sharma",
        title: "Lead Product Manager - AI & Platform",
        email: "priya.sharma.pm@email.com",
        phone: "(917) 555-8831",
        location: "New York, NY",
        linkedin: "linkedin.com/in/priyasharma-pm",
        website: "https://priyasharma.io"
      },
      summary: "Results-driven Lead Product Manager with 7+ years of experience scaling AI/ML-powered SaaS products from 0 to 1 and driving $24M in Net New ARR. Experienced in LLM integrations, enterprise workflow automation, data platform roadmaps, and agile product strategy.",
      skills: {
        technical: ["Product Roadmap", "Go-To-Market (GTM)", "PRD Authoring", "A/B Testing", "LLM Evaluation", "RAG Systems", "Data Modeling"],
        tools: ["Mixpanel", "Amplitude", "Jira", "Figma", "Looker", "SQL", "Tableau", "Segment", "Linear"],
        soft: ["Cross-Functional Alignment", "Executive Stakeholder Management", "Customer Discovery", "Team Leadership", "Strategic Vision"],
        languages: ["English (Native)", "Hindi (Fluent)"]
      },
      experience: [
        {
          id: "pm-1",
          company: "Horizon AI Software",
          role: "Lead Product Manager",
          location: "New York, NY",
          startDate: "Jan 2022",
          endDate: "Present",
          current: true,
          highlights: [
            "Launched enterprise Generative AI co-pilot suite, driving $14.2M in annual recurring revenue in the first 12 months with 94% customer retention.",
            "Defined product requirements for RAG search platform, decreasing customer ticket resolution time by 38% across 450+ enterprise accounts.",
            "Spearheaded pricing packaging overhaul that lifted Average Revenue Per Account (ARPA) by 27%."
          ],
          keyMetrics: ["$14.2M ARR driven", "94% retention rate", "38% faster ticket resolution", "+27% ARPA"]
        },
        {
          id: "pm-2",
          company: "Veloce Commerce",
          role: "Senior Product Manager",
          location: "Boston, MA",
          startDate: "Aug 2019",
          endDate: "Dec 2021",
          current: false,
          highlights: [
            "Managed checkout and conversion optimization team; executed 30+ multivariable A/B tests yielding an incremental $9.8M in GMV.",
            "Partnered with data science team to ship automated personalization engine, boosting cart conversion by 14.5%."
          ],
          keyMetrics: ["$9.8M GMV uplift", "+14.5% conversion lift", "30+ A/B experiments"]
        }
      ],
      education: [
        {
          id: "edu-pm-1",
          institution: "Columbia Business School",
          degree: "Master of Business Administration (MBA)",
          fieldOfStudy: "Product & Technology Strategy",
          startDate: "2017",
          endDate: "2019"
        },
        {
          id: "edu-pm-2",
          institution: "Cornell University",
          degree: "Bachelor of Science",
          fieldOfStudy: "Industrial Engineering",
          startDate: "2011",
          endDate: "2015"
        }
      ],
      projects: [
        {
          id: "proj-pm-1",
          name: "PromptMetrics Open Standard",
          description: "Benchmark evaluation framework for enterprise conversational AI accuracy and hallucination rates.",
          technologies: ["Python", "Streamlit", "LLM Benchmarking"]
        }
      ],
      certifications: [
        {
          id: "cert-pm-1",
          name: "Reforge Product Strategy Certificate",
          issuer: "Reforge",
          date: "2021"
        }
      ]
    }
  }
};

export const apiEndpointsList: ApiEndpointDoc[] = [
  {
    id: "skillbridge-analyze",
    name: "SkillBridge AI: Scorer, Learning Paths & Rewrites",
    method: "POST",
    path: "/api/analyze",
    summary: "Evaluates resume for specific target role, returns score, sub-scores, skill gaps with courses, and Google XYZ rewrites.",
    description: "Production endpoint used by the SkillBridge AI portal. Analyzes raw resume text against a target career track (e.g. Senior Full-Stack SDE) and produces ATS score, category ratings, recommended courses, and Google XYZ bullet point rewrites.",
    requestBodySchema: {
      resumeText: "string (raw resume text, markdown, or extracted content)",
      role: "string (target career track, e.g. 'Senior Full-Stack SDE', 'AI / ML Engineer')"
    },
    sampleRequestBody: {
      resumeText: "Alex Morgan\nSoftware Engineer | Full-Stack Developer\nalex.morgan@email.com\n\nEXPERIENCE:\nSoftware Developer | TechCorp Inc. (2023 - Present)\n- Worked on the backend API and made it faster.\n- Responsible for building the user dashboard in React.\n- Fixed bugs and helped test new features before launch.",
      role: "Senior Full-Stack SDE"
    },
    sampleResponse: {
      score: 78,
      match_level: "High Match",
      extracted_skills: ["React", "Node.js", "PostgreSQL", "JavaScript", "Express", "Stripe"],
      sub_scores: {
        ats_match: 84,
        tech_depth: 76,
        impact_metrics: 68,
        formatting: 90,
        tone_clarity: 82
      },
      skill_gaps: [
        {
          skill: "Docker & Kubernetes Containerization",
          priority: "high",
          description: "Essential for deploying and orchestrating full-stack services.",
          course: {
            platform: "freeCodeCamp",
            title: "Docker and Kubernetes Full Course",
            duration: "4 hours",
            free: true
          },
          capstone_title: "Containerized Microservices on AWS ECS",
          capstone_line: "Containerized multi-service Node.js app using Docker Compose and deployed with CI/CD automation."
        }
      ],
      bullet_rewrites: [
        {
          original: "Worked on the backend API and made it faster.",
          rewritten: "Engineered Node.js REST API endpoints with Redis caching, reducing p95 server latency by 42% across 250k daily active users.",
          issue: "Lacks quantifiable metrics, technical methodology, and proactive ownership (Google XYZ formula)."
        }
      ]
    }
  },
  {
    id: "parse-resume",
    name: "Parse Resume to Structured JSON",
    method: "POST",
    path: "/api/resume/parse",
    summary: "Extracts contact information, work history, skills, education, and projects from raw resume text or document.",
    description: "Accepts raw resume text or base64 document content and uses Gemini 3.8 to parse it into an ATS-standard normalized JSON schema.",
    requestBodySchema: {
      resumeText: "string (plain text of resume)",
      base64File: "string (optional base64 encoded document/pdf)",
      mimeType: "string (optional e.g. application/pdf, text/plain)"
    },
    sampleRequestBody: {
      resumeText: "Alex Morgan\nSan Francisco, CA • alex@example.com\nStaff Software Engineer with 8+ years building Go and TypeScript distributed systems at CloudScale Tech."
    },
    sampleResponse: {
      success: true,
      parsed: {
        personalInfo: {
          name: "Alex Morgan",
          title: "Staff Software Engineer",
          email: "alex@example.com",
          location: "San Francisco, CA"
        },
        summary: "Staff Software Engineer with 8+ years...",
        skills: {
          technical: ["Go", "TypeScript", "Distributed Systems"],
          tools: ["Kubernetes", "AWS", "Kafka"],
          soft: ["Leadership", "Mentorship"],
          languages: ["English"]
        },
        experience: [
          {
            company: "CloudScale Tech",
            role: "Staff Backend Engineer",
            startDate: "2021",
            endDate: "Present",
            highlights: ["Processed 1.2B daily events with 99.99% uptime."]
          }
        ]
      }
    }
  },
  {
    id: "analyze-resume",
    name: "Analyze Resume & ATS Scoring",
    method: "POST",
    path: "/api/resume/analyze",
    summary: "Computes ATS compatibility score (0-100), readability, metrics depth, strengths, and prioritized improvement tips.",
    description: "Performs deep lexical and semantic evaluation of candidate experience, quantification of metrics, action verbs, and ATS compliance.",
    requestBodySchema: {
      resume: "ParsedResume object OR raw resumeText string"
    },
    sampleRequestBody: {
      resume: {
        personalInfo: { name: "Alex Morgan", title: "Staff Software Engineer" },
        summary: "Staff Software Engineer with 8+ years experience..."
      }
    },
    sampleResponse: {
      success: true,
      analysis: {
        atsScore: 92,
        atsCategoryScores: {
          readability: 95,
          impactMetrics: 90,
          keywordOptimization: 92,
          formatting: 94,
          brevity: 88
        },
        seniorityLevel: "Staff/Principal",
        estimatedYearsExperience: 8,
        summaryReview: "Strong technical trajectory with consistent, quantified business results.",
        strengths: [
          "Demonstrates exceptional impact metrics (1.2B daily events, 42% latency reduction)",
          "Clean ATS-compliant structure with well-categorized skill keywords"
        ],
        improvements: [
          {
            issue: "Missing summary of patented technologies or patents",
            suggestion: "If applicable, mention patents or open-source governance roles.",
            priority: "low"
          }
        ],
        quantifiedMetricsFound: ["1.2B daily events", "99.99% uptime", "$180,000 savings"]
      }
    }
  },
  {
    id: "job-match",
    name: "Match Resume with Job Description",
    method: "POST",
    path: "/api/resume/job-match",
    summary: "Evaluates alignment against a job description, returning match percentage, missing keywords, and tailored revisions.",
    description: "Compares the resume's skills, qualifications, and scope against candidate requirements in the target job posting.",
    requestBodySchema: {
      resume: "ParsedResume object OR raw resume text",
      jobTitle: "string (e.g. 'Principal Systems Architect')",
      jobDescription: "string (full text of the job description)"
    },
    sampleRequestBody: {
      jobTitle: "Principal Distributed Systems Engineer",
      jobDescription: "Seeking a Principal Engineer with 7+ years building large-scale Go services, Kafka event streaming, and Kubernetes multi-cloud deployments.",
      resume: {
        personalInfo: { name: "Alex Morgan" }
      }
    },
    sampleResponse: {
      success: true,
      match: {
        matchPercentage: 94,
        roleFit: "Strong Fit",
        matchingSkills: ["Go", "Kafka", "Kubernetes", "Distributed Systems", "AWS"],
        missingSkills: ["Multi-cloud Azure experience"],
        tailoringSuggestions: [
          "Highlight your cross-region disaster recovery failover experience directly in the summary.",
          "Emphasize experience mentoring other senior engineers."
        ],
        interviewQuestions: [
          {
            question: "How did you design the Kafka event streaming pipeline to handle 1.2B daily events?",
            whyAsked: "Tests practical experience with partition rebalancing, backpressure, and exactly-once semantics.",
            sampleAnswerFramework: "Explain partition key strategies, consumer group sizing, and monitoring lag with Datadog."
          }
        ]
      }
    }
  },
  {
    id: "ask-resume",
    name: "Interactive AI Q&A on Resume",
    method: "POST",
    path: "/api/resume/ask",
    summary: "Asks conversational or recruiter-focused questions about candidate background, qualifications, or technical depth.",
    description: "Allows recruiters, hiring managers, or candidates to query the resume with natural language questions and get grounded answers.",
    requestBodySchema: {
      resume: "ParsedResume object OR raw resume text",
      question: "string (e.g. 'Summarize their leadership experience in 2 sentences')",
      chatHistory: "optional array of past conversation turns"
    },
    sampleRequestBody: {
      question: "What is their experience with high-throughput streaming systems?",
      resume: {
        personalInfo: { name: "Alex Morgan" }
      }
    },
    sampleResponse: {
      success: true,
      answer: "Alex has extensive experience with high-throughput streaming systems, notably architecting a Go and Apache Kafka ingestion pipeline at CloudScale Tech that processed 1.2B daily events with 99.99% uptime and reduced p99 latency to 78ms.",
      citations: ["CloudScale Tech (2021 - Present) - 1.2B daily events"]
    }
  },
  {
    id: "api-health",
    name: "API Health & Capability Status",
    method: "GET",
    path: "/api/health",
    summary: "Returns health status of the resume engine and Gemini model integration.",
    description: "Verifies the Express backend is running and Gemini AI client is initialized.",
    sampleResponse: {
      status: "ok",
      timestamp: "2026-09-06T23:00:00.000Z",
      service: "AI Resume Viewer Engine",
      model: "gemini-3.8-flash",
      endpointsAvailable: [
        "/api/resume/parse",
        "/api/resume/analyze",
        "/api/resume/job-match",
        "/api/resume/ask",
        "/api/docs"
      ]
    }
  }
];

import { ParsedResume, ResumeAnalysis, SkillRadarDimension, SkillGapItem } from '../types';

export function computeSkillRadarDimensions(
  resume: ParsedResume,
  analysis?: ResumeAnalysis | null
): {
  title: string;
  dimensions: SkillRadarDimension[];
  summary: {
    strongestDimension: string;
    criticalGapDimension: string;
    averageCandidateScore: number;
    averageBenchmark: number;
  };
} {
  const jobTitle = (resume.personalInfo?.title || 'Software Engineer').trim();
  const lowerTitle = jobTitle.toLowerCase();

  // Combine all candidate skills into lowercase set for fast matching
  const candidateSkillsSet = new Set<string>();
  const allSkillsList: string[] = [
    ...(resume.skills?.technical || []),
    ...(resume.skills?.tools || []),
    ...(resume.skills?.soft || []),
    ...(resume.skills?.languages || []),
  ];

  allSkillsList.forEach((s) => candidateSkillsSet.add(s.toLowerCase().trim()));

  // Check experience highlights text for keyword hints
  const experienceText = (resume.experience || [])
    .map((e) => `${e.role} ${e.company} ${e.highlights.join(' ')}`)
    .join(' ')
    .toLowerCase();

  const skillGaps: SkillGapItem[] = analysis?.skillGaps || [];

  // Helper to test if any keywords match candidate skills or experience
  const hasSkill = (keywords: string[]): boolean => {
    return keywords.some((kw) => {
      const lower = kw.toLowerCase();
      if (candidateSkillsSet.has(lower)) return true;
      for (const s of candidateSkillsSet) {
        if (s.includes(lower) || lower.includes(s)) return true;
      }
      return experienceText.includes(lower);
    });
  };

  const getMatchingSkills = (keywords: string[]): string[] => {
    const matched: string[] = [];
    allSkillsList.forEach((s) => {
      const lower = s.toLowerCase();
      if (keywords.some((kw) => lower.includes(kw.toLowerCase()) || kw.toLowerCase().includes(lower))) {
        if (!matched.includes(s)) matched.push(s);
      }
    });
    return matched;
  };

  // Helper to find gap targeting this axis
  const findGapForAxis = (keywords: string[]): SkillGapItem | undefined => {
    return skillGaps.find((g) =>
      keywords.some(
        (kw) =>
          g.skill.toLowerCase().includes(kw.toLowerCase()) ||
          g.description.toLowerCase().includes(kw.toLowerCase())
      )
    );
  };

  // Build archetype dimensions
  let rawDimensions: {
    axis: string;
    keywords: string[];
    benchmark: number;
    description: string;
  }[] = [];

  if (lowerTitle.includes('product') || lowerTitle.includes('pm') || lowerTitle.includes('program')) {
    // Product Archetype
    rawDimensions = [
      {
        axis: 'Product Strategy & Roadmap',
        keywords: ['strategy', 'roadmap', 'vision', 'okr', 'prioritization', 'kpi', 'market research'],
        benchmark: 90,
        description: 'Defining multi-quarter product vision, OKRs, and business trade-offs.',
      },
      {
        axis: 'User Discovery & UX Research',
        keywords: ['ux', 'user research', 'interviews', 'wireframe', 'figma', 'customer discovery', 'personas'],
        benchmark: 85,
        description: 'Customer empathy, qualitative usability testing, and UX design collaboration.',
      },
      {
        axis: 'Data Analytics & Experimentation',
        keywords: ['analytics', 'sql', 'a/b testing', 'funnel', 'mixpanel', 'amplitude', 'metrics', 'retention'],
        benchmark: 85,
        description: 'Hypothesis validation, metric instrumentation, cohort retention, and SQL queries.',
      },
      {
        axis: 'Technical Fluency & Architecture',
        keywords: ['api', 'architecture', 'engineering', 'backend', 'system design', 'technical feasibility'],
        benchmark: 75,
        description: 'Understanding technical constraints, API schemas, and partnering with engineering leads.',
      },
      {
        axis: 'Cross-Functional Leadership',
        keywords: ['leadership', 'stakeholders', 'alignment', 'communication', 'executive', 'mentorship'],
        benchmark: 90,
        description: 'Driving alignment between sales, marketing, engineering, and C-level executives.',
      },
      {
        axis: 'Agile Delivery & Execution',
        keywords: ['agile', 'scrum', 'sprint', 'jira', 'backlog', 'stories', 'delivery', 'kanban'],
        benchmark: 88,
        description: 'Sprint planning, backlog grooming, user story acceptance criteria, and launch velocity.',
      },
    ];
  } else if (lowerTitle.includes('data') || lowerTitle.includes('machine learning') || lowerTitle.includes('ai') || lowerTitle.includes('ml')) {
    // Data & AI Archetype
    rawDimensions = [
      {
        axis: 'Machine Learning & Models',
        keywords: ['pytorch', 'tensorflow', 'scikit-learn', 'deep learning', 'machine learning', 'nlp', 'llm', 'transformers'],
        benchmark: 90,
        description: 'Model architecture selection, training loops, hyperparameter tuning, and fine-tuning.',
      },
      {
        axis: 'Data Pipelines & ETL',
        keywords: ['airflow', 'etl', 'spark', 'kafka', 'pipelines', 'dbt', 'batch processing', 'streaming'],
        benchmark: 85,
        description: 'Automated data pipelines, real-time ingestion, and scalable data warehousing.',
      },
      {
        axis: 'Statistical Foundations',
        keywords: ['statistics', 'probability', 'hypothesis testing', 'experimentation', 'bayesian', 'linear algebra'],
        benchmark: 85,
        description: 'Mathematical grounding, causal inference, and rigor in evaluation.',
      },
      {
        axis: 'Databases & SQL Warehousing',
        keywords: ['sql', 'postgresql', 'snowflake', 'bigquery', 'nosql', 'data modeling'],
        benchmark: 88,
        description: 'Complex query optimization, dimensional modeling, and lakehouse storage.',
      },
      {
        axis: 'MLOps & Cloud Infrastructure',
        keywords: ['docker', 'kubernetes', 'mlops', 'aws', 'gcp', 'mlflow', 'serving', 'ci/cd'],
        benchmark: 80,
        description: 'Deploying model artifacts to production endpoints with latency SLAs.',
      },
      {
        axis: 'Insights & Business Storytelling',
        keywords: ['visualization', 'tableau', 'looker', 'power bi', 'communication', 'dashboards', 'executive'],
        benchmark: 80,
        description: 'Translating model outputs into actionable business decisions and clear dashboards.',
      },
    ];
  } else {
    // Software Engineer / Developer Archetype (Default)
    rawDimensions = [
      {
        axis: 'System Architecture & Scalability',
        keywords: ['system design', 'architecture', 'distributed systems', 'microservices', 'scalability', 'concurrency', 'high availability', 'caching'],
        benchmark: 88,
        description: 'Architecting resilient, distributed systems capable of handling production traffic scale.',
      },
      {
        axis: 'Cloud & Container DevOps',
        keywords: ['docker', 'kubernetes', 'aws', 'gcp', 'azure', 'ci/cd', 'terraform', 'devops', 'helm'],
        benchmark: 82,
        description: 'Container orchestration, CI/CD deployment pipelines, and modern cloud infrastructure.',
      },
      {
        axis: 'API & Backend Engineering',
        keywords: ['node.js', 'express', 'python', 'django', 'fastapi', 'java', 'go', 'rest', 'graphql', 'grpc', 'backend'],
        benchmark: 90,
        description: 'Designing performant server-side services, secure endpoints, and business logic.',
      },
      {
        axis: 'Frontend & User Interface',
        keywords: ['react', 'typescript', 'javascript', 'next.js', 'vue', 'tailwind', 'html', 'css', 'ui/ux', 'frontend', 'redux'],
        benchmark: 85,
        description: 'Crafting responsive, accessible, stateful web interfaces and fluid client experiences.',
      },
      {
        axis: 'Databases & Data Modeling',
        keywords: ['postgresql', 'mysql', 'mongodb', 'redis', 'sql', 'orm', 'indexing', 'schema', 'caching'],
        benchmark: 85,
        description: 'Database schema design, query indexing, data normalization, and caching tiers.',
      },
      {
        axis: 'Code Quality & Testing',
        keywords: ['jest', 'vitest', 'testing', 'unit tests', 'integration tests', 'cypress', 'security', 'code review', 'owasp'],
        benchmark: 82,
        description: 'Automated test suites, security hygiene, linting, and defensive coding standards.',
      },
      {
        axis: 'Agile & Team Collaboration',
        keywords: ['git', 'github', 'agile', 'scrum', 'jira', 'documentation', 'mentoring', 'collaboration'],
        benchmark: 85,
        description: 'Version control branch hygiene, peer review, agile ceremonies, and documentation.',
      },
    ];
  }

  // Calculate scores for each dimension
  const dimensions: SkillRadarDimension[] = rawDimensions.map((dim) => {
    const matchedSkills = getMatchingSkills(dim.keywords);
    const hasAnySkill = matchedSkills.length > 0 || hasSkill(dim.keywords);
    const gap = findGapForAxis(dim.keywords);

    // Baseline calculation based on matched skills count and experience
    let score = 50; // default base
    if (hasAnySkill) {
      score += Math.min(matchedSkills.length * 10, 35);
      // Check if mentioned in work experience
      if (dim.keywords.some((kw) => experienceText.includes(kw.toLowerCase()))) {
        score += 10;
      }
    } else {
      score = 42;
    }

    // Penalize if there is an identified skill gap in this dimension
    if (gap) {
      if (gap.priority === 'high') {
        score = Math.min(score, 62);
        score = Math.max(score - 20, 38);
      } else if (gap.priority === 'medium') {
        score = Math.min(score, 72);
        score = Math.max(score - 12, 45);
      } else {
        score = Math.max(score - 6, 55);
      }
    } else if (matchedSkills.length >= 2) {
      // Reward strong multi-skill alignment
      score = Math.min(score + 8, 96);
    }

    // Bound between 35 and 98
    score = Math.min(Math.max(Math.round(score), 35), 98);

    const courseUrl = gap?.course?.url || (gap ? `https://www.google.com/search?q=${encodeURIComponent(gap.course.title + ' ' + gap.course.platform)}` : undefined);

    return {
      axis: dim.axis,
      candidateScore: score,
      industryBenchmark: dim.benchmark,
      description: dim.description,
      relevantSkills: matchedSkills,
      addressedByGap: gap?.skill,
      courseTitle: gap?.course?.title,
      courseUrl: courseUrl,
    };
  });

  // Calculate summary metrics
  let strongestDimension = dimensions[0].axis;
  let maxDiff = -999;
  let criticalGapDimension = dimensions[0].axis;
  let minDiff = 999;
  let totalCand = 0;
  let totalBench = 0;

  dimensions.forEach((d) => {
    const diff = d.candidateScore - d.industryBenchmark;
    totalCand += d.candidateScore;
    totalBench += d.industryBenchmark;

    if (diff > maxDiff) {
      maxDiff = diff;
      strongestDimension = d.axis;
    }
    if (diff < minDiff) {
      minDiff = diff;
      criticalGapDimension = d.axis;
    }
  });

  return {
    title: jobTitle,
    dimensions,
    summary: {
      strongestDimension,
      criticalGapDimension,
      averageCandidateScore: Math.round(totalCand / dimensions.length),
      averageBenchmark: Math.round(totalBench / dimensions.length),
    },
  };
}

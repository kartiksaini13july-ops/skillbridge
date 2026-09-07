export interface PersonalInfo {
  name: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  website?: string;
  linkedin?: string;
  github?: string;
}

export interface ExperienceItem {
  id: string;
  company: string;
  role: string;
  location?: string;
  startDate: string;
  endDate: string;
  current: boolean;
  highlights: string[];
  keyMetrics?: string[];
}

export interface EducationItem {
  id: string;
  institution: string;
  degree: string;
  fieldOfStudy?: string;
  startDate?: string;
  endDate?: string;
  gpa?: string;
  honors?: string[];
}

export interface ProjectItem {
  id: string;
  name: string;
  description: string;
  technologies: string[];
  link?: string;
  highlights?: string[];
}

export interface CertificationItem {
  id: string;
  name: string;
  issuer: string;
  date?: string;
  credentialId?: string;
}

export interface SkillsCategorized {
  technical: string[];
  tools: string[];
  soft: string[];
  languages: string[];
}

export interface ParsedResume {
  personalInfo: PersonalInfo;
  summary: string;
  skills: SkillsCategorized;
  experience: ExperienceItem[];
  education: EducationItem[];
  projects: ProjectItem[];
  certifications: CertificationItem[];
}

export interface CourseRecommendation {
  platform: string; // 'Coursera' | 'freeCodeCamp' | 'Udemy' | 'edX' | 'YouTube'
  title: string;
  duration: string;
  free: boolean;
  url?: string;
}

export interface SkillGapItem {
  skill: string;
  priority: 'high' | 'medium' | 'low';
  description: string;
  course: CourseRecommendation;
  capstone_title?: string;
  capstone_line?: string;
}

export interface BulletRewriteItem {
  original: string;
  rewritten: string;
  issue: string;
}

export interface AtsImprovement {
  issue: string;
  suggestion: string;
  priority: 'high' | 'medium' | 'low';
}

export interface AtsCategoryScores {
  readability: number;
  impactMetrics: number;
  keywordOptimization: number;
  formatting: number;
  brevity: number;
}

export interface ResumeAnalysis {
  atsScore: number;
  atsCategoryScores: AtsCategoryScores;
  seniorityLevel: 'Entry-Level' | 'Mid-Level' | 'Senior' | 'Staff/Principal' | 'Executive';
  estimatedYearsExperience: number;
  summaryReview: string;
  strengths: string[];
  improvements: AtsImprovement[];
  quantifiedMetricsFound: string[];
  topKeywords: string[];
  skillGaps?: SkillGapItem[];
  bulletRewrites?: BulletRewriteItem[];
}

export interface InterviewPrepQuestion {
  question: string;
  whyAsked: string;
  sampleAnswerFramework: string;
}

export interface JobMatchResult {
  matchPercentage: number;
  roleFit: 'Strong Fit' | 'Moderate Fit' | 'Stretch Fit' | 'Weak Fit';
  matchingSkills: string[];
  missingSkills: string[];
  tailoringSuggestions: string[];
  interviewQuestions: InterviewPrepQuestion[];
}

export interface ApiEndpointParam {
  name: string;
  type: string;
  required: boolean;
  description: string;
}

export interface ApiEndpointDoc {
  id: string;
  name: string;
  method: 'GET' | 'POST';
  path: string;
  summary: string;
  description: string;
  requestBodySchema?: Record<string, any>;
  sampleRequestBody?: Record<string, any>;
  sampleResponse: Record<string, any>;
}

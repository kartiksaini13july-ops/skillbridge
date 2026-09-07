import React, { useState } from 'react';
import { 
  Target, 
  CheckCircle2, 
  XCircle, 
  Sparkles, 
  HelpCircle, 
  Lightbulb, 
  ArrowRight,
  Briefcase
} from 'lucide-react';
import { ParsedResume, JobMatchResult } from '../types';

interface JobMatcherPanelProps {
  resume: ParsedResume;
  onRunMatch: (jobTitle: string, jobDescription: string) => Promise<void>;
  matchResult: JobMatchResult | null;
  loading: boolean;
}

const PRESET_JOBS = [
  {
    title: "Principal Distributed Systems Engineer",
    company: "Stripe / Anthropic Tier",
    desc: `We are seeking a Principal Backend Engineer to architect next-generation real-time transaction and event streaming pipelines. 
Requirements:
- 7+ years building high-throughput distributed systems in Go, Rust, or Python
- Deep hands-on experience with Kafka, gRPC, and Redis at petabyte scale
- Proven track record leading multi-region cloud disaster recovery and 99.999% SLA services
- Strong experience mentoring senior engineers and driving architecture RFCs`
  },
  {
    title: "Director of Product - AI Solutions",
    company: "Enterprise SaaS Scaleup",
    desc: `Looking for a seasoned Product Leader to own our Generative AI co-pilot and enterprise workflow roadmap.
Requirements:
- 6+ years managing B2B SaaS products with direct P&L / ARR ownership ($10M+)
- Experience deploying LLM workflows, prompt evaluation frameworks, and RAG architectures
- Deep proficiency in A/B testing, user conversion funnels, and enterprise sales alignment
- Strong cross-functional leadership across engineering, design, and executive leadership`
  }
];

export const JobMatcherPanel: React.FC<JobMatcherPanelProps> = ({
  resume,
  onRunMatch,
  matchResult,
  loading,
}) => {
  const [jobTitle, setJobTitle] = useState(PRESET_JOBS[0].title);
  const [jobDescription, setJobDescription] = useState(PRESET_JOBS[0].desc);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!jobDescription.trim()) return;
    onRunMatch(jobTitle, jobDescription);
  };

  const handleApplyPreset = (preset: typeof PRESET_JOBS[0]) => {
    setJobTitle(preset.title);
    setJobDescription(preset.desc);
  };

  return (
    <div className="space-y-6">
      {/* Input Section */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Target className="h-5 w-5 text-emerald-600" />
              <span>Target Role & Job Description Matcher</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Evaluates candidate resume alignment, missing skills, and interview risk factors.
            </p>
          </div>

          {/* Presets */}
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-slate-400 font-medium">Presets:</span>
            {PRESET_JOBS.map((p, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleApplyPreset(p)}
                className="px-2.5 py-1 text-xs rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
              >
                {idx === 0 ? 'Staff Eng' : 'Product Lead'}
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Target Job Title
            </label>
            <input
              type="text"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              placeholder="e.g. Senior Machine Learning Engineer"
              className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Job Description / Requirements
            </label>
            <textarea
              rows={4}
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste job posting text, required skills, and responsibilities..."
              className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500 resize-y"
            ></textarea>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading || !jobDescription.trim()}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 text-white font-semibold text-xs shadow-xs hover:bg-emerald-700 disabled:opacity-50 transition-colors"
            >
              <Sparkles className="h-4 w-4" />
              <span>{loading ? 'Evaluating Match...' : 'Analyze Match with AI API'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Match Results Display */}
      {matchResult && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 sm:p-6 space-y-6">
          {/* Match Score & Fit */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-2xl bg-emerald-50 border-2 border-emerald-200 text-emerald-700 flex flex-col items-center justify-center font-extrabold shadow-xs">
                <span className="text-2xl leading-none">{matchResult.matchPercentage}%</span>
                <span className="text-[10px] uppercase font-bold tracking-wider mt-0.5">Match</span>
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-slate-900">Role Alignment:</h3>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                    {matchResult.roleFit}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Evaluated against candidate: <span className="font-semibold text-slate-700">{resume.personalInfo.name}</span>
                </p>
              </div>
            </div>
          </div>

          {/* Matching & Missing Skills */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Matching Skills */}
            <div className="p-4 rounded-xl bg-emerald-50/40 border border-emerald-100 space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800 uppercase tracking-wider">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                <span>Matching Skills & Keywords ({matchResult.matchingSkills?.length || 0})</span>
              </div>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {matchResult.matchingSkills?.map((skill, idx) => (
                  <span key={idx} className="px-2 py-0.5 rounded-md bg-white border border-emerald-200 text-emerald-900 text-xs font-medium">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Missing Skills */}
            <div className="p-4 rounded-xl bg-rose-50/40 border border-rose-100 space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-rose-800 uppercase tracking-wider">
                <XCircle className="h-4 w-4 text-rose-600" />
                <span>Skills Gap / Missing Keywords ({matchResult.missingSkills?.length || 0})</span>
              </div>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {matchResult.missingSkills?.length > 0 ? (
                  matchResult.missingSkills.map((skill, idx) => (
                    <span key={idx} className="px-2 py-0.5 rounded-md bg-white border border-rose-200 text-rose-900 text-xs font-medium">
                      {skill}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-slate-500 italic">No significant missing core skills identified!</span>
                )}
              </div>
            </div>
          </div>

          {/* Tailoring Recommendations */}
          {matchResult.tailoringSuggestions && matchResult.tailoringSuggestions.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Lightbulb className="h-4 w-4 text-amber-500" />
                <span>Strategic Tailoring Suggestions</span>
              </h4>
              <div className="space-y-2">
                {matchResult.tailoringSuggestions.map((sugg, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-700">
                    <ArrowRight className="h-3.5 w-3.5 text-indigo-600 shrink-0 mt-0.5" />
                    <span>{sugg}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recruiter Interview Questions */}
          {matchResult.interviewQuestions && matchResult.interviewQuestions.length > 0 && (
            <div className="space-y-3 pt-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <HelpCircle className="h-4 w-4 text-indigo-600" />
                <span>Anticipated Recruiter & Technical Interview Questions</span>
              </h4>

              <div className="space-y-3">
                {matchResult.interviewQuestions.map((iq, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-2">
                    <div className="font-bold text-slate-900 text-sm flex items-start gap-2">
                      <span className="text-indigo-600 font-mono">Q{idx + 1}.</span>
                      <span>{iq.question}</span>
                    </div>

                    <div className="text-slate-600 pl-6">
                      <span className="font-semibold text-slate-700">Why it's asked: </span>
                      {iq.whyAsked}
                    </div>

                    <div className="bg-white p-2.5 rounded-lg border border-slate-200 text-slate-700 ml-6">
                      <span className="font-semibold text-indigo-700 block mb-0.5">Answer Strategy Framework:</span>
                      {iq.sampleAnswerFramework}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

import React from 'react';
import { 
  ShieldCheck, 
  CheckCircle, 
  AlertTriangle, 
  TrendingUp, 
  RefreshCw, 
  Zap,
  Tag,
  GraduationCap,
  ExternalLink,
  BookOpen,
  Clock,
  Rocket,
  Copy,
  Check
} from 'lucide-react';
import { ResumeAnalysis } from '../types';

interface AtsAuditPanelProps {
  analysis: ResumeAnalysis | null;
  loading: boolean;
  onRefreshAnalysis: () => void;
  onOpenGaps?: () => void;
}

export const AtsAuditPanel: React.FC<AtsAuditPanelProps> = ({
  analysis,
  loading,
  onRefreshAnalysis,
  onOpenGaps,
}) => {
  const [copiedIndex, setCopiedIndex] = React.useState<number | null>(null);

  if (!analysis) {
    return (
      <div className="bg-white rounded-2xl p-8 border border-slate-200 text-center">
        <GraduationCap className="h-10 w-10 text-slate-300 mx-auto mb-2" />
        <p className="text-sm font-semibold text-slate-700">No ATS audit data available</p>
        <p className="text-xs text-slate-500 mb-4">Run an AI audit to identify ATS compatibility, skill gaps, and recommended courses.</p>
        <button
          onClick={onRefreshAnalysis}
          disabled={loading}
          className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-semibold hover:bg-indigo-700 disabled:opacity-50 transition-colors shadow-xs"
        >
          {loading ? 'Analyzing...' : 'Run Full ATS & Skill Gap Audit'}
        </button>
      </div>
    );
  }

  const { 
    atsScore, 
    atsCategoryScores, 
    seniorityLevel, 
    estimatedYearsExperience, 
    strengths, 
    improvements, 
    quantifiedMetricsFound, 
    topKeywords, 
    summaryReview,
    skillGaps,
    bulletRewrites
  } = analysis;

  const handleCopy = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-emerald-600 bg-emerald-50 border-emerald-200';
    if (score >= 70) return 'text-amber-600 bg-amber-50 border-amber-200';
    return 'text-rose-600 bg-rose-50 border-rose-200';
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'high':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-700 border border-rose-200 uppercase tracking-wide">High Priority Gap</span>;
      case 'medium':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-700 border border-amber-200 uppercase tracking-wide">Medium Priority</span>;
      default:
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-700 border border-blue-200 uppercase tracking-wide">Growth Area</span>;
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 sm:p-6 space-y-6">
      {/* Header & Overall Score */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div className="flex items-center gap-3">
          <div className={`h-16 w-16 rounded-2xl border-2 flex flex-col items-center justify-center font-extrabold shadow-xs ${getScoreColor(atsScore)}`}>
            <span className="text-2xl leading-none">{atsScore}</span>
            <span className="text-[10px] uppercase font-bold tracking-wider mt-0.5 opacity-80">Score</span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-slate-900">ATS Readiness & Career Report</h2>
              <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                {seniorityLevel} (~{estimatedYearsExperience} yrs)
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Audited against Fortune 500 ATS algorithms (Workday, Greenhouse, Lever) & Industry Role Benchmarks
            </p>
          </div>
        </div>

        <button
          onClick={onRefreshAnalysis}
          disabled={loading}
          className="flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>{loading ? 'Analyzing...' : 'Re-Run Audit'}</span>
        </button>
      </div>

      {/* Review Summary */}
      {summaryReview && (
        <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100 text-xs leading-relaxed text-slate-700 flex items-start gap-2.5">
          <ShieldCheck className="h-4 w-4 text-indigo-600 shrink-0 mt-0.5" />
          <span>{summaryReview}</span>
        </div>
      )}

      {/* Category Progress Bars */}
      {atsCategoryScores && (
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
            <TrendingUp className="h-3.5 w-3.5 text-indigo-600" />
            <span>Core Evaluation Dimensions</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
            <div className="space-y-1.5 p-3 rounded-xl bg-slate-50 border border-slate-100">
              <div className="flex justify-between font-medium text-slate-700">
                <span>Readability & Structure</span>
                <span className="font-bold">{atsCategoryScores.readability}%</span>
              </div>
              <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                <div className="h-full bg-indigo-600 rounded-full transition-all" style={{ width: `${atsCategoryScores.readability}%` }}></div>
              </div>
            </div>

            <div className="space-y-1.5 p-3 rounded-xl bg-slate-50 border border-slate-100">
              <div className="flex justify-between font-medium text-slate-700">
                <span>Impact & Quantified Metrics</span>
                <span className="font-bold">{atsCategoryScores.impactMetrics}%</span>
              </div>
              <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                <div className="h-full bg-amber-500 rounded-full transition-all" style={{ width: `${atsCategoryScores.impactMetrics}%` }}></div>
              </div>
            </div>

            <div className="space-y-1.5 p-3 rounded-xl bg-slate-50 border border-slate-100">
              <div className="flex justify-between font-medium text-slate-700">
                <span>Keyword Categorization</span>
                <span className="font-bold">{atsCategoryScores.keywordOptimization}%</span>
              </div>
              <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full transition-all" style={{ width: `${atsCategoryScores.keywordOptimization}%` }}></div>
              </div>
            </div>

            <div className="space-y-1.5 p-3 rounded-xl bg-slate-50 border border-slate-100">
              <div className="flex justify-between font-medium text-slate-700">
                <span>ATS Section Formatting</span>
                <span className="font-bold">{atsCategoryScores.formatting}%</span>
              </div>
              <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 rounded-full transition-all" style={{ width: `${atsCategoryScores.formatting}%` }}></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 🚀 CRITICAL SKILL GAPS & RECOMMENDED COURSES HE/SHE CAN DO               */}
      {/* ========================================================================= */}
      {skillGaps && skillGaps.length > 0 && (
        <div className="rounded-2xl border-2 border-indigo-200/80 bg-gradient-to-b from-indigo-50/40 to-slate-50/50 p-4 sm:p-5 space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold shadow-xs">
                <GraduationCap className="h-4 w-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <span>Skill Gaps in Resume & Courses He Can Do</span>
                  <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-indigo-100 text-indigo-800 border border-indigo-200">
                    {skillGaps.length} Gaps Identified
                  </span>
                </h3>
                <p className="text-xs text-slate-500">
                  Targeted courses and portfolio projects to close resume gaps and qualify for higher-tier roles.
                </p>
              </div>
            </div>

            {onOpenGaps && (
              <button
                onClick={onOpenGaps}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold transition-colors shadow-xs"
              >
                <span>View D3 Skill Radar Chart</span>
                <ExternalLink className="h-3 w-3" />
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 gap-4">
            {skillGaps.map((gap, i) => {
              const courseUrl = gap.course.url || `https://www.google.com/search?q=${encodeURIComponent(gap.course.title + ' ' + gap.course.platform)}`;
              return (
                <div 
                  key={i} 
                  className="bg-white rounded-xl border border-slate-200 shadow-xs p-4 space-y-3 transition-all hover:border-indigo-300"
                >
                  {/* Skill Gap Header */}
                  <div className="flex items-start justify-between gap-2 flex-wrap">
                    <div className="flex items-center gap-2">
                      <span className="h-6 w-6 rounded-lg bg-slate-900 text-white text-xs font-bold flex items-center justify-center">
                        {i + 1}
                      </span>
                      <h4 className="font-bold text-slate-900 text-sm">{gap.skill}</h4>
                    </div>
                    {getPriorityBadge(gap.priority)}
                  </div>

                  {/* Why this is missing / Impact */}
                  <p className="text-xs text-slate-600 leading-relaxed pl-8">
                    {gap.description}
                  </p>

                  {/* Recommended Course Box */}
                  <div className="ml-8 bg-indigo-50/50 rounded-xl p-3 border border-indigo-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-100 text-indigo-700 uppercase tracking-wide">
                          {gap.course.platform}
                        </span>
                        {gap.course.free ? (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 uppercase">
                            100% Free
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-200/80 text-slate-700">
                            Paid / Certificate
                          </span>
                        )}
                        <span className="flex items-center gap-1 text-[11px] text-slate-500">
                          <Clock className="h-3 w-3" />
                          <span>{gap.course.duration}</span>
                        </span>
                      </div>
                      <div className="text-xs font-bold text-slate-900">
                        {gap.course.title}
                      </div>
                    </div>

                    <a
                      href={courseUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="shrink-0 inline-flex items-center justify-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold transition-colors shadow-xs"
                    >
                      <BookOpen className="h-3.5 w-3.5" />
                      <span>Take Course</span>
                      <ExternalLink className="h-3 w-3 ml-0.5" />
                    </a>
                  </div>

                  {/* Capstone Project Blueprint */}
                  {gap.capstone_title && (
                    <div className="ml-8 bg-slate-50 rounded-xl p-3 border border-slate-200 text-xs space-y-1.5">
                      <div className="flex items-center gap-1.5 text-indigo-700 font-bold text-[11px] uppercase tracking-wide">
                        <Rocket className="h-3.5 w-3.5 text-indigo-600" />
                        <span>Recommended Portfolio Project to Bridge Gap</span>
                      </div>
                      <div className="font-semibold text-slate-900">
                        {gap.capstone_title}
                      </div>
                      {gap.capstone_line && (
                        <div className="relative group bg-white p-2.5 rounded-lg border border-slate-200 font-mono text-[11.5px] text-slate-700 flex items-start justify-between gap-2">
                          <span>"{gap.capstone_line}"</span>
                          <button
                            onClick={() => handleCopy(gap.capstone_line || '', i)}
                            className="shrink-0 p-1 text-slate-400 hover:text-slate-700 rounded transition-colors"
                            title="Copy Google XYZ resume bullet"
                          >
                            {copiedIndex === i ? (
                              <Check className="h-3.5 w-3.5 text-emerald-600" />
                            ) : (
                              <Copy className="h-3.5 w-3.5" />
                            )}
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Google XYZ Rewrites (if present) */}
      {bulletRewrites && bulletRewrites.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Zap className="h-3.5 w-3.5 text-amber-500" />
            <span>Google XYZ Bullet Point Optimizations ({bulletRewrites.length})</span>
          </h3>
          <div className="space-y-2.5">
            {bulletRewrites.map((b, i) => (
              <div key={i} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-2">
                <div className="text-rose-700 line-through opacity-80">
                  <span className="font-semibold">Before:</span> "{b.original}"
                </div>
                <div className="text-emerald-800 font-medium bg-emerald-50/80 p-2 rounded-lg border border-emerald-200">
                  <span className="font-bold text-emerald-900">Google XYZ Formula:</span> "{b.rewritten}"
                </div>
                <div className="text-[11px] text-slate-500">
                  <span className="font-semibold text-slate-700">Issue:</span> {b.issue}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quantified Metrics Highlight */}
      {quantifiedMetricsFound && quantifiedMetricsFound.length > 0 && (
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2.5 flex items-center gap-1.5">
            <Zap className="h-3.5 w-3.5 text-amber-500" />
            <span>Extracted Quantified Metrics ({quantifiedMetricsFound.length})</span>
          </h3>
          <div className="flex flex-wrap gap-1.5">
            {quantifiedMetricsFound.map((m, i) => (
              <span key={i} className="px-2.5 py-1 rounded-lg bg-amber-50 text-amber-900 border border-amber-200 text-xs font-medium">
                {m}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Top Keywords */}
      {topKeywords && topKeywords.length > 0 && (
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2.5 flex items-center gap-1.5">
            <Tag className="h-3.5 w-3.5 text-slate-500" />
            <span>Primary Indexed Keywords</span>
          </h3>
          <div className="flex flex-wrap gap-1.5">
            {topKeywords.map((kw, i) => (
              <span key={i} className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-xs">
                {kw}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Strengths and Improvements */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
        {/* Strengths */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
            <CheckCircle className="h-4 w-4 text-emerald-600" />
            <span>Identified Strengths</span>
          </h3>
          <ul className="space-y-2">
            {strengths.map((str, i) => (
              <li key={i} className="flex items-start gap-2 text-xs text-slate-700 bg-emerald-50/40 p-2.5 rounded-xl border border-emerald-100">
                <span className="text-emerald-600 font-bold">•</span>
                <span>{str}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Actionable Improvements */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
            <AlertTriangle className="h-4 w-4 text-amber-500" />
            <span>Optimization Recommendations</span>
          </h3>
          <div className="space-y-2.5">
            {improvements.map((imp, i) => (
              <div key={i} className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-900">{imp.issue}</span>
                  {getPriorityBadge(imp.priority)}
                </div>
                <p className="text-slate-600 leading-relaxed">{imp.suggestion}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

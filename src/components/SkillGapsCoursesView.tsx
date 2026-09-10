import React, { useState, useMemo } from 'react';
import { 
  GraduationCap, 
  BookOpen, 
  ExternalLink, 
  Rocket, 
  Copy, 
  Check, 
  Clock, 
  AlertTriangle, 
  Sparkles, 
  Filter,
  CheckCircle2,
  RefreshCw,
  FileText,
  Target,
  ArrowRight
} from 'lucide-react';
import { ParsedResume, ResumeAnalysis, SkillGapItem, SkillRadarDimension } from '../types';
import { SkillRadarChart } from './SkillRadarChart';
import { computeSkillRadarDimensions } from '../utils/radarBenchmark';

interface SkillGapsCoursesViewProps {
  resume: ParsedResume;
  analysis: ResumeAnalysis | null;
  loading: boolean;
  onRefreshAnalysis: () => void;
  onNavigateToResume?: () => void;
  onNavigateToMatcher?: () => void;
}

export const SkillGapsCoursesView: React.FC<SkillGapsCoursesViewProps> = ({
  resume,
  analysis,
  loading,
  onRefreshAnalysis,
  onNavigateToResume,
  onNavigateToMatcher,
}) => {
  const [filterPriority, setFilterPriority] = useState<'all' | 'high' | 'free'>('all');
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [highlightedSkill, setHighlightedSkill] = useState<string | null>(null);

  // Compute Radar Chart Dimensions comparing candidate skills vs industry benchmark
  const radarData = useMemo(() => {
    return computeSkillRadarDimensions(resume, analysis);
  }, [resume, analysis]);

  const skillGaps: SkillGapItem[] = analysis?.skillGaps || [];

  const filteredGaps = useMemo(() => {
    return skillGaps.filter((gap) => {
      if (filterPriority === 'high') return gap.priority === 'high';
      if (filterPriority === 'free') return gap.course?.free === true;
      return true;
    });
  }, [skillGaps, filterPriority]);

  const handleCopyBullet = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'high':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10.5px] font-bold bg-rose-100 text-rose-700 border border-rose-200 uppercase tracking-wide flex items-center gap-1">
            <AlertTriangle className="h-3 w-3" />
            <span>High Priority Gap</span>
          </span>
        );
      case 'medium':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10.5px] font-bold bg-amber-100 text-amber-700 border border-amber-200 uppercase tracking-wide">
            Medium Priority
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10.5px] font-bold bg-blue-100 text-blue-700 border border-blue-200 uppercase tracking-wide">
            Growth Opportunity
          </span>
        );
    }
  };

  const handleRadarDimensionSelect = (dim: SkillRadarDimension) => {
    if (dim.addressedByGap) {
      setHighlightedSkill(dim.addressedByGap);
      // Smooth scroll to gaps section
      const el = document.getElementById(`gap-card-${dim.addressedByGap.replace(/\s+/g, '-').toLowerCase()}`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. D3.js RADAR CHART HERO: Candidate vs Industry Standards */}
      <SkillRadarChart
        dimensions={radarData.dimensions}
        jobTitle={radarData.title}
        summary={radarData.summary}
        onSelectDimension={handleRadarDimensionSelect}
      />

      {/* 2. SKILL GAPS & CURATED COURSES SECTION */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-5 sm:p-6 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold shadow-xs">
              <GraduationCap className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900">
                  Curated Courses & Capstone Projects
                </h3>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-800 border border-indigo-200">
                  {skillGaps.length} Gaps Detected
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Bridge the competency deficit identified in the radar chart to reach top 10% industry readiness.
              </p>
            </div>
          </div>

          {/* Quick Filters */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl border border-slate-200 text-xs font-semibold self-start sm:self-auto">
            <button
              onClick={() => setFilterPriority('all')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                filterPriority === 'all'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All Gaps ({skillGaps.length})
            </button>
            <button
              onClick={() => setFilterPriority('high')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                filterPriority === 'high'
                  ? 'bg-white text-rose-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              High Priority
            </button>
            <button
              onClick={() => setFilterPriority('free')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                filterPriority === 'free'
                  ? 'bg-white text-emerald-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              100% Free Courses
            </button>
          </div>
        </div>

        {/* Course Cards Grid */}
        {filteredGaps.length === 0 ? (
          <div className="text-center py-10 border border-dashed border-slate-200 rounded-xl p-6">
            <CheckCircle2 className="h-8 w-8 text-emerald-500 mx-auto mb-2" />
            <p className="text-sm font-semibold text-slate-700">No skill gaps matching this filter</p>
            <p className="text-xs text-slate-400 mt-1">Switch filter back to "All Gaps" to see other opportunities.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {filteredGaps.map((gap, i) => {
              const courseUrl =
                gap.course?.url ||
                `https://www.google.com/search?q=${encodeURIComponent(
                  (gap.course?.title || gap.skill) + ' ' + (gap.course?.platform || 'course')
                )}`;

              const cardId = `gap-card-${gap.skill.replace(/\s+/g, '-').toLowerCase()}`;
              const isHighlighted = highlightedSkill === gap.skill;

              return (
                <div
                  id={cardId}
                  key={i}
                  className={`bg-white rounded-xl border p-4 sm:p-5 space-y-3.5 transition-all ${
                    isHighlighted
                      ? 'border-indigo-500 ring-2 ring-indigo-200 shadow-md bg-indigo-50/10'
                      : 'border-slate-200/90 shadow-2xs hover:border-indigo-300'
                  }`}
                >
                  {/* Skill Gap Header */}
                  <div className="flex items-start justify-between gap-2 flex-wrap">
                    <div className="flex items-center gap-2.5">
                      <span className="h-6 w-6 rounded-lg bg-slate-900 text-white text-xs font-bold flex items-center justify-center">
                        {i + 1}
                      </span>
                      <h4 className="font-bold text-slate-900 text-sm sm:text-base">
                        {gap.skill}
                      </h4>
                    </div>
                    {getPriorityBadge(gap.priority)}
                  </div>

                  {/* Why this is missing / Impact on Hiring */}
                  <p className="text-xs text-slate-600 leading-relaxed pl-8">
                    {gap.description}
                  </p>

                  {/* Course Recommendation Box */}
                  <div className="ml-8 bg-indigo-50/60 rounded-xl p-3.5 border border-indigo-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-100 text-indigo-700 uppercase tracking-wide">
                          {gap.course?.platform || 'Online Course'}
                        </span>
                        {gap.course?.free ? (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 uppercase">
                            100% Free
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-200/80 text-slate-700">
                            Certificate / Paid
                          </span>
                        )}
                        <span className="flex items-center gap-1 text-[11px] text-slate-500 font-medium">
                          <Clock className="h-3 w-3" />
                          <span>{gap.course?.duration || '4-6 weeks'}</span>
                        </span>
                      </div>
                      <div className="text-xs sm:text-sm font-bold text-slate-900">
                        {gap.course?.title}
                      </div>
                    </div>

                    <a
                      href={courseUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="shrink-0 inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold transition-colors shadow-xs"
                    >
                      <BookOpen className="h-3.5 w-3.5" />
                      <span>Take Course</span>
                      <ExternalLink className="h-3 w-3 ml-0.5" />
                    </a>
                  </div>

                  {/* Capstone Project Blueprint & Resume Bullet */}
                  {gap.capstone_title && (
                    <div className="ml-8 bg-slate-50 rounded-xl p-3.5 border border-slate-200 text-xs space-y-2">
                      <div className="flex items-center gap-1.5 text-indigo-700 font-bold text-[11px] uppercase tracking-wide">
                        <Rocket className="h-3.5 w-3.5 text-indigo-600" />
                        <span>Recommended Portfolio Project to Bridge Gap</span>
                      </div>
                      <div className="font-semibold text-slate-900">
                        {gap.capstone_title}
                      </div>
                      {gap.capstone_line && (
                        <div>
                          <span className="text-[10px] font-semibold text-slate-400 block mb-1">
                            Copyable Portfolio Resume Bullet:
                          </span>
                          <div className="relative group bg-white p-2.5 rounded-lg border border-slate-200 font-mono text-[11.5px] text-slate-700 flex items-start justify-between gap-2">
                            <span>"{gap.capstone_line}"</span>
                            <button
                              onClick={() => handleCopyBullet(gap.capstone_line || '', i)}
                              className="shrink-0 p-1 text-slate-400 hover:text-slate-700 rounded transition-colors"
                              title="Copy bullet point"
                            >
                              {copiedIndex === i ? (
                                <Check className="h-3.5 w-3.5 text-emerald-600" />
                              ) : (
                                <Copy className="h-3.5 w-3.5" />
                              )}
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Quick Navigation Footer */}
      <div className="bg-slate-100 p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-slate-600">
          <Sparkles className="h-4 w-4 text-indigo-600" />
          <span>Need to compare with a specific job description?</span>
        </div>
        <div className="flex items-center gap-2">
          {onNavigateToResume && (
            <button
              onClick={onNavigateToResume}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 font-semibold hover:bg-slate-50 transition-colors shadow-xs"
            >
              <FileText className="h-3.5 w-3.5 text-slate-500" />
              <span>View Resume Layout</span>
            </button>
          )}
          {onNavigateToMatcher && (
            <button
              onClick={onNavigateToMatcher}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition-colors shadow-xs"
            >
              <Target className="h-3.5 w-3.5 text-white" />
              <span>Test Job Matcher</span>
              <ArrowRight className="h-3 w-3 ml-0.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

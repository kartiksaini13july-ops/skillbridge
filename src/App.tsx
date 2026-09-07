import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { ResumeViewer } from './components/ResumeViewer';
import { AtsAuditPanel } from './components/AtsAuditPanel';
import { JobMatcherPanel } from './components/JobMatcherPanel';
import { ApiExplorer } from './components/ApiExplorer';
import { AiChatDrawer } from './components/AiChatDrawer';
import { UploadModal } from './components/UploadModal';
import { sampleResumes } from './data/sampleResumes';
import { ParsedResume, ResumeAnalysis, JobMatchResult } from './types';
import { ShieldCheck, MessageSquare, Terminal, Target, ArrowRight, ExternalLink, RefreshCw, Zap } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'skillbridge' | 'viewer' | 'api' | 'matcher'>('skillbridge');
  const [selectedSampleKey, setSelectedSampleKey] = useState<string>('software_engineer');
  const [currentResume, setCurrentResume] = useState<ParsedResume>(sampleResumes.software_engineer.parsed);
  const [analysis, setAnalysis] = useState<ResumeAnalysis | null>(null);
  const [matchResult, setMatchResult] = useState<JobMatchResult | null>(null);
  const [apiHealthy, setApiHealthy] = useState<boolean | null>(null);
  const [loadingAnalysis, setLoadingAnalysis] = useState<boolean>(false);
  const [loadingMatch, setLoadingMatch] = useState<boolean>(false);
  const [iframeKey, setIframeKey] = useState<number>(0);

  const [isUploadOpen, setIsUploadOpen] = useState<boolean>(false);
  const [isChatOpen, setIsChatOpen] = useState<boolean>(false);
  const [viewerSubView, setViewerSubView] = useState<'resume' | 'audit' | 'gaps'>('resume');

  // Check API health on mount
  useEffect(() => {
    fetch('/api/health')
      .then((res) => res.json())
      .then((data) => {
        setApiHealthy(data.status === 'ok');
      })
      .catch(() => {
        setApiHealthy(false);
      });
  }, []);

  // Run ATS analysis whenever resume changes
  const runAtsAnalysis = async (resumeToAnalyze: ParsedResume) => {
    setLoadingAnalysis(true);
    try {
      const res = await fetch('/api/resume/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resume: resumeToAnalyze }),
      });
      const data = await res.json();
      if (data.analysis) {
        setAnalysis(data.analysis);
      }
    } catch (err) {
      console.error('Failed to analyze resume:', err);
    } finally {
      setLoadingAnalysis(false);
    }
  };

  useEffect(() => {
    runAtsAnalysis(currentResume);
  }, [currentResume]);

  const handleSelectSample = (key: string) => {
    if (sampleResumes[key]) {
      setSelectedSampleKey(key);
      setCurrentResume(sampleResumes[key].parsed);
      setMatchResult(null);
    }
  };

  const handleParsedSuccess = (parsed: ParsedResume) => {
    setSelectedSampleKey('custom');
    setCurrentResume(parsed);
    setMatchResult(null);
    setActiveTab('viewer');
  };

  const handleRunMatch = async (jobTitle: string, jobDescription: string) => {
    setLoadingMatch(true);
    try {
      const res = await fetch('/api/resume/job-match', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resume: currentResume,
          jobTitle: jobTitle,
          jobDescription: jobDescription,
        }),
      });
      const data = await res.json();
      if (data.match) {
        setMatchResult(data.match);
      }
    } catch (err) {
      console.error('Job match request failed:', err);
    } finally {
      setLoadingMatch(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans selection:bg-indigo-100 selection:text-indigo-900">
      {/* Navigation Header */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        selectedSampleKey={selectedSampleKey}
        onSelectSample={handleSelectSample}
        onOpenUpload={() => setIsUploadOpen(true)}
        apiHealthy={apiHealthy}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Tab 0: SkillBridge AI Live Website (User's Website Connected to API) */}
        {activeTab === 'skillbridge' && (
          <div className="space-y-4">
            <div className="bg-slate-900 text-slate-100 rounded-2xl p-4 sm:p-5 border border-slate-800 shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 flex items-center justify-center font-bold">
                  <Zap className="h-5 w-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-sm font-bold text-white tracking-tight">SkillBridge AI Website</h2>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800">
                      POST /api/analyze linked
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">
                    Live resume scorer, Google XYZ bullet rewrites, and student & company portals connected to your backend API.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => setIframeKey((k) => k + 1)}
                  className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
                  title="Reload website frame"
                >
                  <RefreshCw className="h-3.5 w-3.5" />
                  <span>Reload</span>
                </button>
                <a
                  href="/skillbridge"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 text-xs font-semibold px-3.5 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-slate-950 transition-colors font-mono font-bold shadow-xs"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  <span>Open Full Tab ↗</span>
                </a>
              </div>
            </div>

            {/* Embedded Live Website Frame */}
            <div className="w-full bg-[#040914] rounded-2xl border border-cyan-900/40 shadow-xl overflow-hidden" style={{ minHeight: '820px' }}>
              <iframe
                key={iframeKey}
                src="/skillbridge"
                title="SkillBridge AI Portal"
                className="w-full border-0"
                style={{ height: '900px', minHeight: '820px' }}
              />
            </div>
          </div>
        )}

        {/* Tab 1: Resume Viewer Mode */}
        {activeTab === 'viewer' && (
          <div className="space-y-4">
            {/* Sub-view toggle (Resume Document vs Skill Gaps vs ATS Audit) */}
            <div className="flex items-center justify-between gap-2 border-b border-slate-200 pb-3 flex-wrap">
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  onClick={() => setViewerSubView('resume')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    viewerSubView === 'resume'
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  Document Layout
                </button>

                <button
                  onClick={() => setViewerSubView('gaps')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    viewerSubView === 'gaps'
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  <span className="h-2 w-2 rounded-full bg-amber-500"></span>
                  <span>Skill Gaps & Courses</span>
                  <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                    viewerSubView === 'gaps' ? 'bg-indigo-700 text-indigo-100' : 'bg-indigo-50 text-indigo-700'
                  }`}>
                    {analysis?.skillGaps?.length ?? 3}
                  </span>
                </button>

                <button
                  onClick={() => setViewerSubView('audit')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    viewerSubView === 'audit'
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  <ShieldCheck className="h-3.5 w-3.5" />
                  <span>ATS Score Audit ({analysis?.atsScore ?? 88}/100)</span>
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveTab('matcher')}
                  className="hidden md:flex items-center gap-1 text-xs text-slate-600 hover:text-indigo-600 font-medium transition-colors"
                >
                  <span>Check Job Match</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            {/* Sub-view Content */}
            {viewerSubView === 'resume' ? (
              <ResumeViewer
                resume={currentResume}
                atsScore={analysis?.atsScore}
                skillGaps={analysis?.skillGaps}
                onOpenAudit={() => setViewerSubView('audit')}
                onOpenChat={() => setIsChatOpen(true)}
              />
            ) : (
              <AtsAuditPanel
                analysis={analysis}
                loading={loadingAnalysis}
                onRefreshAnalysis={() => runAtsAnalysis(currentResume)}
              />
            )}
          </div>
        )}

        {/* Tab 2: Job Description Matcher Mode */}
        {activeTab === 'matcher' && (
          <JobMatcherPanel
            resume={currentResume}
            onRunMatch={handleRunMatch}
            matchResult={matchResult}
            loading={loadingMatch}
          />
        )}

        {/* Tab 3: API Explorer & Docs Mode */}
        {activeTab === 'api' && (
          <ApiExplorer currentResume={currentResume} />
        )}
      </main>

      {/* Floating AI Assistant Chat Button (in Viewer Mode) */}
      {activeTab === 'viewer' && !isChatOpen && (
        <button
          onClick={() => setIsChatOpen(true)}
          className="fixed bottom-6 right-6 z-40 flex items-center gap-2 px-4 py-3 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-300 font-semibold text-xs transition-all hover:scale-105 active:scale-95"
        >
          <MessageSquare className="h-4 w-4" />
          <span>Ask AI About Candidate</span>
        </button>
      )}

      {/* AI Chat Slide-over Drawer */}
      <AiChatDrawer
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        resume={currentResume}
      />

      {/* Upload & Parse Modal */}
      <UploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onParsedSuccess={handleParsedSuccess}
      />

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-4 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-800">SkillBridge & ResumeLens Engine</span>
            <span>•</span>
            <span>Connected API for Resume Scoring & ATS Parsing</span>
          </div>

          <div className="flex items-center gap-4">
            <a
              href="/skillbridge"
              target="_blank"
              rel="noreferrer"
              className="hover:text-indigo-600 transition-colors flex items-center gap-1 font-mono"
            >
              <Zap className="h-3 w-3 text-cyan-600" />
              <span>/skillbridge</span>
            </a>
            <span>•</span>
            <button
              onClick={() => setActiveTab('api')}
              className="hover:text-indigo-600 transition-colors flex items-center gap-1 font-mono"
            >
              <Terminal className="h-3 w-3" />
              <span>/api/docs</span>
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}

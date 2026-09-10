import React from 'react';
import { 
  FileText, 
  Terminal, 
  Target, 
  UploadCloud, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle,
  ExternalLink,
  Zap
} from 'lucide-react';

interface NavbarProps {
  activeTab: 'skillbridge' | 'viewer' | 'api' | 'matcher';
  setActiveTab: (tab: 'skillbridge' | 'viewer' | 'api' | 'matcher') => void;
  selectedSampleKey: string;
  onSelectSample: (key: string) => void;
  onOpenUpload: () => void;
  apiHealthy: boolean | null;
  customCandidateName?: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  selectedSampleKey,
  onSelectSample,
  onOpenUpload,
  apiHealthy,
  customCandidateName,
}) => {
  return (
    <header id="app-header" className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-200 font-bold">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-900 text-lg tracking-tight">SkillBridge & ResumeLens</span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                API Connected
              </span>
            </div>
            <p className="text-xs text-slate-500 hidden sm:block">AI ATS Scorer, Learning Paths & REST API Engine</p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav id="nav-tabs" className="flex items-center p-1 bg-slate-100 rounded-xl border border-slate-200 overflow-x-auto max-w-full">
          <button
            id="tab-skillbridge-btn"
            onClick={() => setActiveTab('skillbridge')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'skillbridge'
                ? 'bg-slate-900 text-cyan-300 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Zap className="h-3.5 w-3.5 text-cyan-400" />
            <span>SkillBridge AI Portal</span>
          </button>

          <button
            id="tab-viewer-btn"
            onClick={() => setActiveTab('viewer')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'viewer'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileText className="h-3.5 w-3.5 text-indigo-600" />
            <span>Resume Viewer</span>
          </button>

          <button
            id="tab-matcher-btn"
            onClick={() => setActiveTab('matcher')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'matcher'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Target className="h-3.5 w-3.5 text-emerald-600" />
            <span>Job Matcher</span>
          </button>

          <button
            id="tab-api-btn"
            onClick={() => setActiveTab('api')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'api'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Terminal className="h-3.5 w-3.5 text-amber-600" />
            <span>API & Docs</span>
          </button>
        </nav>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <a
            href="/skillbridge"
            target="_blank"
            rel="noreferrer"
            className="hidden md:flex items-center gap-1 text-xs text-indigo-600 hover:text-indigo-800 font-medium px-2.5 py-1.5 rounded-lg border border-indigo-200 bg-indigo-50 hover:bg-indigo-100 transition-colors"
            title="Open SkillBridge website in full new tab"
          >
            <span>Open Website ↗</span>
          </a>

          {/* Quick Sample Selector */}
          <div className="relative">
            <select
              id="sample-resume-select"
              value={selectedSampleKey}
              onChange={(e) => onSelectSample(e.target.value)}
              className="text-xs bg-white text-slate-700 font-medium border border-slate-200 rounded-lg px-2.5 py-1.5 pr-6 shadow-xs hover:border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 cursor-pointer"
            >
              <option value="software_engineer">Alex Morgan (SDE)</option>
              <option value="product_manager">Priya Sharma (PM)</option>
              {selectedSampleKey === 'custom' && (
                <option value="custom">
                  {customCandidateName ? `${customCandidateName} (Uploaded)` : 'Custom Upload'}
                </option>
              )}
            </select>
          </div>

          {/* Upload Button */}
          <button
            id="upload-resume-btn"
            onClick={onOpenUpload}
            className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 shadow-xs transition-colors"
          >
            <UploadCloud className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Upload</span>
          </button>
        </div>
      </div>
    </header>
  );
};

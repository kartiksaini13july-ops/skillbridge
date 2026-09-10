import React, { useState } from 'react';
import { 
  X, 
  UploadCloud, 
  FileText, 
  Sparkles, 
  AlertCircle, 
  Check,
  FileCode
} from 'lucide-react';
import { ParsedResume } from '../types';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onParsedSuccess: (parsed: ParsedResume) => void;
}

export const UploadModal: React.FC<UploadModalProps> = ({
  isOpen,
  onClose,
  onParsedSuccess,
}) => {
  const [activeMode, setActiveMode] = useState<'upload' | 'paste'>('upload');
  const [pastedText, setPastedText] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [candidateNameInput, setCandidateNameInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const deriveNameFromFilename = (filename: string) => {
    const base = filename.replace(/\.[^/.]+$/, '');
    const cleaned = base
      .replace(/[-_.]+/g, ' ')
      .replace(/\b(resume|cv|curriculum|vitae|updated|latest|draft|final|official|new|202\d|201\d|v\d+)\b/gi, '')
      .trim();
    if (cleaned.length >= 2) {
      return cleaned
        .split(/\s+/)
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
        .join(' ');
    }
    return '';
  };

  const handleFileSelection = (file: File) => {
    setSelectedFile(file);
    setError(null);
    if (!candidateNameInput) {
      const derived = deriveNameFromFilename(file.name);
      if (derived) {
        setCandidateNameInput(derived);
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelection(e.target.files[0]);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelection(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = async () => {
    setError(null);
    setLoading(true);

    try {
      let payload: any = {};

      if (candidateNameInput.trim()) {
        payload.candidateName = candidateNameInput.trim();
      }

      if (activeMode === 'paste') {
        if (!pastedText.trim()) {
          setError('Please paste resume text before submitting.');
          setLoading(false);
          return;
        }
        payload.resumeText = pastedText;
      } else {
        if (!selectedFile) {
          setError('Please select a resume file (.pdf, .txt, .md, .docx).');
          setLoading(false);
          return;
        }

        payload.fileName = selectedFile.name;

        // If plain text or markdown or json
        if (selectedFile.type.includes('text') || selectedFile.name.endsWith('.txt') || selectedFile.name.endsWith('.md')) {
          const text = await selectedFile.text();
          payload.resumeText = text;
        } else {
          // Read base64 safely using browser FileReader
          const base64Data = await new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => {
              const res = reader.result as string;
              const cleanBase64 = res.includes(',') ? res.split(',')[1] : res;
              resolve(cleanBase64);
            };
            reader.onerror = () => reject(new Error('Failed to read resume file'));
            reader.readAsDataURL(selectedFile);
          });

          payload.base64File = base64Data;
          payload.mimeType = selectedFile.name.toLowerCase().endsWith('.pdf')
            ? 'application/pdf'
            : (selectedFile.type || 'application/pdf');
        }
      }

      const res = await fetch('/api/resume/parse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (!res.ok || !data.parsed) {
        throw new Error(data.error || 'Unable to parse resume');
      }

      onParsedSuccess(data.parsed);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to parse resume with AI.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white w-full max-w-xl rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-xs">
              <UploadCloud className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Parse Resume with AI API</h3>
              <p className="text-xs text-slate-500">Extracts structured ATS JSON schema using Gemini</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4">
          {/* Mode Switcher */}
          <div className="flex p-1 bg-slate-100 rounded-xl border border-slate-200 text-xs font-semibold">
            <button
              onClick={() => setActiveMode('upload')}
              className={`flex-1 py-1.5 rounded-lg transition-all ${
                activeMode === 'upload' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
              }`}
            >
              Upload Document (PDF / TXT / MD)
            </button>
            <button
              onClick={() => setActiveMode('paste')}
              className={`flex-1 py-1.5 rounded-lg transition-all ${
                activeMode === 'paste' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
              }`}
            >
              Paste Resume Text
            </button>
          </div>

          {activeMode === 'upload' ? (
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              className="border-2 border-dashed border-slate-200 rounded-2xl p-8 text-center hover:border-indigo-400 transition-colors bg-slate-50/50"
            >
              <div className="mx-auto h-12 w-12 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center mb-3">
                <FileText className="h-6 w-6" />
              </div>
              <div className="text-sm font-semibold text-slate-800">
                {selectedFile ? selectedFile.name : 'Choose a resume file or drag & drop'}
              </div>
              <p className="text-xs text-slate-400 mt-1 mb-4">
                Supported formats: PDF, TXT, DOCX, Markdown (up to 10MB)
              </p>
              <label className="cursor-pointer inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-semibold hover:bg-indigo-700 transition-colors shadow-xs">
                <span>Browse Local Files</span>
                <input
                  type="file"
                  accept=".pdf,.txt,.md,.doc,.docx"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            </div>
          ) : (
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Paste Raw Resume Text
              </label>
              <textarea
                rows={9}
                value={pastedText}
                onChange={(e) => setPastedText(e.target.value)}
                placeholder="Paste candidate resume text with contact details, work history, and skills..."
                className="w-full text-xs font-mono p-3 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              ></textarea>
            </div>
          )}

          {/* Candidate Name Input */}
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80">
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Candidate Name <span className="font-normal text-slate-400">(Auto-detected by AI, or enter manually)</span>:
            </label>
            <input
              type="text"
              value={candidateNameInput}
              onChange={(e) => setCandidateNameInput(e.target.value)}
              placeholder="e.g. Kartik Saini"
              className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 bg-white text-slate-900 placeholder:text-slate-400 font-medium"
            />
          </div>

          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center gap-2">
              <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
              <span>{error}</span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-2.5">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-xs font-semibold hover:bg-indigo-700 disabled:opacity-50 transition-colors shadow-xs"
          >
            <Sparkles className="h-4 w-4" />
            <span>{loading ? 'Processing with AI...' : 'Parse & View Resume'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

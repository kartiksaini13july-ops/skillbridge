import React, { useState } from 'react';
import { 
  Terminal, 
  Play, 
  Copy, 
  Check, 
  Code, 
  Clock, 
  Layers, 
  ExternalLink,
  BookOpen,
  Send
} from 'lucide-react';
import { apiEndpointsList } from '../data/sampleResumes';
import { ApiEndpointDoc, ParsedResume } from '../types';

interface ApiExplorerProps {
  currentResume: ParsedResume;
}

export const ApiExplorer: React.FC<ApiExplorerProps> = ({ currentResume }) => {
  const [selectedEndpoint, setSelectedEndpoint] = useState<ApiEndpointDoc>(apiEndpointsList[0]);
  const [requestBodyInput, setRequestBodyInput] = useState<string>(
    JSON.stringify(apiEndpointsList[0].sampleRequestBody || {}, null, 2)
  );
  const [responseOutput, setResponseOutput] = useState<any>(apiEndpointsList[0].sampleResponse);
  const [httpStatus, setHttpStatus] = useState<number | null>(200);
  const [latencyMs, setLatencyMs] = useState<number | null>(142);
  const [loading, setLoading] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [activeCodeTab, setActiveCodeTab] = useState<'curl' | 'javascript' | 'python'>('curl');

  const handleSelectEndpoint = (endpoint: ApiEndpointDoc) => {
    setSelectedEndpoint(endpoint);
    let initialBody = endpoint.sampleRequestBody;
    if (endpoint.id === 'analyze-resume' || endpoint.id === 'ask-resume') {
      initialBody = {
        ...endpoint.sampleRequestBody,
        resume: currentResume
      };
    }
    setRequestBodyInput(initialBody ? JSON.stringify(initialBody, null, 2) : '');
    setResponseOutput(endpoint.sampleResponse);
    setHttpStatus(200);
    setLatencyMs(null);
  };

  const handleExecuteRequest = async () => {
    setLoading(true);
    const startTime = performance.now();

    try {
      let options: RequestInit = {
        method: selectedEndpoint.method,
        headers: { 'Content-Type': 'application/json' },
      };

      if (selectedEndpoint.method === 'POST' && requestBodyInput.trim()) {
        options.body = requestBodyInput;
      }

      const res = await fetch(selectedEndpoint.path, options);
      const endTime = performance.now();
      const elapsed = Math.round(endTime - startTime);

      setHttpStatus(res.status);
      setLatencyMs(elapsed);

      const json = await res.json();
      setResponseOutput(json);
    } catch (err: any) {
      const endTime = performance.now();
      setHttpStatus(500);
      setLatencyMs(Math.round(endTime - startTime));
      setResponseOutput({ error: 'Failed to connect to endpoint', message: err.message });
    } finally {
      setLoading(false);
    }
  };

  const generateCurl = () => {
    const origin = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000';
    if (selectedEndpoint.method === 'GET') {
      return `curl -X GET "${origin}${selectedEndpoint.path}" \\
  -H "Accept: application/json"`;
    }
    return `curl -X POST "${origin}${selectedEndpoint.path}" \\
  -H "Content-Type: application/json" \\
  -d '${requestBodyInput.replace(/'/g, "\\'")}'`;
  };

  const generateJs = () => {
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    if (selectedEndpoint.method === 'GET') {
      return `const response = await fetch("${origin}${selectedEndpoint.path}");
const data = await response.json();
console.log(data);`;
    }
    return `const response = await fetch("${origin}${selectedEndpoint.path}", {
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify(${requestBodyInput.trim() || '{}'})
});

const data = await response.json();
console.log(data);`;
  };

  const generatePython = () => {
    const origin = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000';
    if (selectedEndpoint.method === 'GET') {
      return `import requests

response = requests.get("${origin}${selectedEndpoint.path}")
print(response.json())`;
    }
    return `import requests

payload = ${requestBodyInput.trim() || '{}'}

response = requests.post(
    "${origin}${selectedEndpoint.path}",
    json=payload,
    headers={"Content-Type": "application/json"}
)

print(response.json())`;
  };

  const getCodeSnippet = () => {
    switch (activeCodeTab) {
      case 'curl':
        return generateCurl();
      case 'javascript':
        return generateJs();
      case 'python':
        return generatePython();
    }
  };

  const handleCopySnippet = () => {
    navigator.clipboard.writeText(getCodeSnippet());
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Terminal className="h-5 w-5 text-indigo-600" />
              <h2 className="text-lg font-bold text-slate-900">AI Resume Viewer & Parser REST API</h2>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                v1.0.0 Active
              </span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed max-w-2xl">
              Interact with our production endpoints to parse raw resumes, compute deep ATS scores, match candidates to job specifications, and run conversational intelligence over candidate profiles.
            </p>
          </div>

          <a
            href="/api/docs"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors shrink-0"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            <span>OpenAPI Spec (JSON)</span>
          </a>
        </div>

        {/* Endpoints Quick Selector */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2 mt-5">
          {apiEndpointsList.map((ep) => {
            const isSelected = selectedEndpoint.id === ep.id;
            return (
              <button
                key={ep.id}
                onClick={() => handleSelectEndpoint(ep)}
                className={`text-left p-3 rounded-xl border text-xs transition-all flex flex-col justify-between gap-2 ${
                  isSelected
                    ? 'border-indigo-600 bg-indigo-50/50 shadow-xs ring-1 ring-indigo-600'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div>
                  <div className="flex items-center gap-1.5 mb-1 font-mono font-bold">
                    <span
                      className={`text-[9px] px-1.5 py-0.5 rounded font-extrabold ${
                        ep.method === 'POST' ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {ep.method}
                    </span>
                    <span className="truncate text-slate-900 text-[11px]">{ep.path}</span>
                  </div>
                  <div className="text-[11px] font-medium text-slate-700 line-clamp-1">{ep.name}</div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Endpoint Live Console & Request Builder */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Request Builder */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5">
            <div className="flex items-center justify-between gap-2 mb-3">
              <div className="flex items-center gap-2">
                <span
                  className={`text-xs px-2 py-0.5 rounded font-mono font-extrabold ${
                    selectedEndpoint.method === 'POST'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-blue-100 text-blue-800'
                  }`}
                >
                  {selectedEndpoint.method}
                </span>
                <span className="font-mono text-xs font-bold text-slate-900">{selectedEndpoint.path}</span>
              </div>

              <button
                onClick={handleExecuteRequest}
                disabled={loading}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-700 disabled:opacity-50 transition-colors shadow-xs"
              >
                {loading ? <Clock className="h-3.5 w-3.5 animate-spin" /> : <Play className="h-3.5 w-3.5 fill-current" />}
                <span>{loading ? 'Sending...' : 'Send Request'}</span>
              </button>
            </div>

            <p className="text-xs text-slate-600 mb-4">{selectedEndpoint.description}</p>

            {/* Request Body JSON Editor */}
            {selectedEndpoint.method === 'POST' && (
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-slate-700">JSON Request Body</label>
                  <button
                    onClick={() => {
                      if (selectedEndpoint.id === 'analyze-resume' || selectedEndpoint.id === 'ask-resume') {
                        setRequestBodyInput(JSON.stringify({ ...selectedEndpoint.sampleRequestBody, resume: currentResume }, null, 2));
                      } else {
                        setRequestBodyInput(JSON.stringify(selectedEndpoint.sampleRequestBody || {}, null, 2));
                      }
                    }}
                    className="text-[11px] text-indigo-600 hover:underline"
                  >
                    Reset with Current Resume
                  </button>
                </div>
                <textarea
                  rows={13}
                  value={requestBodyInput}
                  onChange={(e) => setRequestBodyInput(e.target.value)}
                  className="w-full font-mono text-xs p-3.5 rounded-xl border border-slate-200 bg-slate-900 text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 selection:bg-indigo-800"
                  spellCheck={false}
                ></textarea>
              </div>
            )}
          </div>

          {/* Code Snippets Box */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Code className="h-4 w-4 text-slate-600" />
                <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">Client Integration Code</span>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex p-0.5 bg-slate-100 rounded-lg text-[11px] font-medium text-slate-600">
                  <button
                    onClick={() => setActiveCodeTab('curl')}
                    className={`px-2 py-0.5 rounded-md ${activeCodeTab === 'curl' ? 'bg-white text-slate-900 font-bold shadow-xs' : ''}`}
                  >
                    cURL
                  </button>
                  <button
                    onClick={() => setActiveCodeTab('javascript')}
                    className={`px-2 py-0.5 rounded-md ${activeCodeTab === 'javascript' ? 'bg-white text-slate-900 font-bold shadow-xs' : ''}`}
                  >
                    TypeScript
                  </button>
                  <button
                    onClick={() => setActiveCodeTab('python')}
                    className={`px-2 py-0.5 rounded-md ${activeCodeTab === 'python' ? 'bg-white text-slate-900 font-bold shadow-xs' : ''}`}
                  >
                    Python
                  </button>
                </div>

                <button
                  onClick={handleCopySnippet}
                  className="p-1.5 rounded-md bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors"
                  title="Copy snippet"
                >
                  {copiedCode ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                </button>
              </div>
            </div>

            <pre className="p-3.5 rounded-xl bg-slate-950 text-slate-100 text-[11px] font-mono overflow-x-auto">
              <code>{getCodeSnippet()}</code>
            </pre>
          </div>
        </div>

        {/* Right Column: Live Response Inspector */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 h-full flex flex-col">
            <div className="flex items-center justify-between gap-2 mb-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">Live Response Payload</span>
                {httpStatus && (
                  <span
                    className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                      httpStatus >= 200 && httpStatus < 300
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-rose-50 text-rose-700 border border-rose-200'
                    }`}
                  >
                    {httpStatus} {httpStatus === 200 ? 'OK' : 'Error'}
                  </span>
                )}
                {latencyMs !== null && (
                  <span className="text-[10px] font-mono text-slate-400">
                    {latencyMs}ms
                  </span>
                )}
              </div>

              <button
                onClick={() => navigator.clipboard.writeText(JSON.stringify(responseOutput, null, 2))}
                className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-900"
              >
                <Copy className="h-3.5 w-3.5" />
                <span>Copy</span>
              </button>
            </div>

            <div className="flex-1 bg-slate-950 rounded-xl p-3.5 overflow-auto max-h-[600px]">
              <pre className="font-mono text-xs text-emerald-400">
                <code>{JSON.stringify(responseOutput, null, 2)}</code>
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

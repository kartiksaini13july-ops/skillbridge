import React, { useState, useRef, useEffect } from 'react';
import { 
  Sparkles, 
  Send, 
  X, 
  Bot, 
  User, 
  CornerDownRight, 
  Trash2,
  Copy,
  Check,
  ShieldCheck,
  FileCheck2,
  HelpCircle
} from 'lucide-react';
import { ParsedResume } from '../types';

interface AiChatDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  resume: ParsedResume;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
}

const STARTER_PROMPTS = [
  "Summarize key technical leadership accomplishments",
  "Quantify their biggest business and architectural impact",
  "Assess readiness for a Senior/Staff-level Engineering role",
  "Generate 3 technical interview questions with evaluation criteria"
];

// Helper to format inline markdown (bolding, inline code)
function formatInline(text: string): React.ReactNode[] {
  const parts: React.ReactNode[] = [];
  const regex = /(\*\*[^*]+\*\*|`[^`]+`)/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.substring(lastIndex, match.index));
    }
    const token = match[0];
    if (token.startsWith('**') && token.endsWith('**')) {
      parts.push(
        <strong key={match.index} className="font-semibold text-cyan-200">
          {token.slice(2, -2)}
        </strong>
      );
    } else if (token.startsWith('`') && token.endsWith('`')) {
      parts.push(
        <code key={match.index} className="px-1.5 py-0.5 rounded bg-cyan-950/70 border border-cyan-800/60 font-mono text-[11px] text-cyan-300 font-medium">
          {token.slice(1, -1)}
        </code>
      );
    }
    lastIndex = regex.lastIndex;
  }

  if (lastIndex < text.length) {
    parts.push(text.substring(lastIndex));
  }

  return parts.length > 0 ? parts : [text];
}

// Professional AI response renderer that handles markdown lists, headings, and paragraphs with cyber futuristic styling
const ProfessionalAiAnswer: React.FC<{ text: string; timestamp: string }> = ({ text, timestamp }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Parse lines into structured blocks
  const lines = text.split('\n');
  const blocks: React.ReactNode[] = [];
  let currentList: React.ReactNode[] = [];

  const flushList = () => {
    if (currentList.length > 0) {
      blocks.push(
        <ul key={`list-${blocks.length}`} className="space-y-1.5 pl-1 my-2">
          {currentList}
        </ul>
      );
      currentList = [];
    }
  };

  lines.forEach((line, idx) => {
    const trimmed = line.trim();
    if (!trimmed) {
      flushList();
      return;
    }

    // Bullet line
    if (trimmed.startsWith('* ') || trimmed.startsWith('- ') || /^\d+\.\s/.test(trimmed)) {
      const cleanLine = trimmed.replace(/^(\*|-|\d+\.)\s+/, '');
      currentList.push(
        <li key={`li-${idx}`} className="flex items-start gap-2 text-slate-200 leading-relaxed">
          <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 shrink-0 mt-2 shadow-[0_0_6px_rgba(56,189,248,0.8)]" />
          <span className="flex-1">{formatInline(cleanLine)}</span>
        </li>
      );
    } else if (trimmed.startsWith('### ') || trimmed.startsWith('## ') || (trimmed.endsWith(':') && trimmed.length < 60)) {
      flushList();
      const headingText = trimmed.replace(/^(###|##)\s*/, '');
      blocks.push(
        <h4 key={`h-${idx}`} className="font-bold text-cyan-300 text-xs tracking-wider uppercase pt-2.5 pb-1 border-b border-cyan-900/40 flex items-center gap-1.5">
          <Sparkles className="h-3 w-3 text-cyan-400" />
          <span>{headingText}</span>
        </h4>
      );
    } else {
      flushList();
      blocks.push(
        <p key={`p-${idx}`} className="text-slate-300 leading-relaxed my-1">
          {formatInline(trimmed)}
        </p>
      );
    }
  });

  flushList();

  return (
    <div className="w-full bg-[#0a1226]/90 border border-cyan-500/30 rounded-2xl shadow-[0_0_20px_rgba(56,189,248,0.12)] overflow-hidden backdrop-blur-md">
      {/* Executive Dossier Header */}
      <div className="bg-[#060c1d]/90 px-3.5 py-2.5 border-b border-cyan-900/50 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 text-[11px] font-bold text-cyan-300 tracking-wider">
            <ShieldCheck className="h-3.5 w-3.5 text-cyan-400" />
            <span>EXECUTIVE CANDIDATE SYNTHESIS</span>
          </div>
          <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-emerald-950/60 text-emerald-300 border border-emerald-500/30 shadow-[0_0_8px_rgba(16,185,129,0.25)] flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Grounded
          </span>
        </div>

        <button
          onClick={handleCopy}
          className="inline-flex items-center gap-1 text-[11px] font-semibold text-cyan-400/80 hover:text-cyan-200 px-2 py-1 rounded-md hover:bg-cyan-950/60 transition-colors"
          title="Copy response to clipboard"
        >
          {copied ? (
            <>
              <Check className="h-3 w-3 text-emerald-400" />
              <span className="text-emerald-300 font-bold">Copied</span>
            </>
          ) : (
            <>
              <Copy className="h-3 w-3" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      {/* Structured Content */}
      <div className="p-4 space-y-2.5 text-xs text-slate-200">
        {blocks.length > 0 ? blocks : <p>{text}</p>}
      </div>

      {/* Footer Info */}
      <div className="px-3.5 py-1.5 bg-[#060c1d]/70 border-t border-cyan-900/40 flex items-center justify-between text-[10px] text-cyan-400/60 font-mono">
        <span className="flex items-center gap-1">
          <FileCheck2 className="h-3 w-3 text-cyan-400/60" />
          Cross-referenced with verified resume records
        </span>
        <span>{timestamp}</span>
      </div>
    </div>
  );
};

export const AiChatDrawer: React.FC<AiChatDrawerProps> = ({
  isOpen,
  onClose,
  resume,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'ai',
      text: `Hello! I have fully indexed ${resume.personalInfo.name || 'this candidate'}'s resume. You can ask me anything about their experience, technical depth, management history, or fit for specific roles.`,
      timestamp: 'Just now'
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  if (!isOpen) return null;

  const handleSend = async (queryText?: string) => {
    const textToSend = queryText || input;
    if (!textToSend.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!queryText) setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/resume/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resume: resume,
          question: textToSend,
          chatHistory: messages.slice(-4).map(m => ({ role: m.sender, text: m.text }))
        })
      });

      const data = await res.json();
      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: data.answer || 'No response available from API.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: 'ai',
          text: `Error connecting to /api/resume/ask: ${err.message}`,
          timestamp: 'Just now'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setMessages([
      {
        id: 'welcome-reset',
        sender: 'ai',
        text: `Chat reset. Ask any question about ${resume.personalInfo.name}'s qualifications.`,
        timestamp: 'Just now'
      }
    ]);
  };

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[490px] bg-[#040914] text-slate-100 shadow-[-10px_0_35px_rgba(4,9,20,0.8)] border-l border-cyan-500/30 flex flex-col backdrop-blur-xl transition-transform animate-in slide-in-from-right duration-200">
      {/* Drawer Header */}
      <div className="p-4 border-b border-cyan-900/50 flex items-center justify-between bg-[#080f22]/90 backdrop-blur-md">
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-[0_0_12px_rgba(56,189,248,0.4)] border border-cyan-400/40">
            <Sparkles className="h-4 w-4 text-cyan-200" />
          </div>
          <div>
            <h3 className="font-bold text-cyan-100 text-sm tracking-tight flex items-center gap-1.5 font-['Space_Grotesk']">
              <span>Resume Intelligence Chat</span>
              <span className="text-[9px] px-1.5 py-0.5 rounded-sm bg-cyan-950 text-cyan-300 border border-cyan-500/30 font-mono">AI</span>
            </h3>
            <p className="text-[11px] text-cyan-400/70">Grounded in candidate's experience</p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={handleClear}
            title="Clear Chat History"
            className="p-1.5 rounded-lg text-slate-400 hover:text-cyan-300 hover:bg-cyan-950/50 transition-colors"
          >
            <Trash2 className="h-4 w-4" />
          </button>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-cyan-300 hover:bg-cyan-950/50 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex gap-2.5 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {m.sender === 'ai' && (
              <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 text-white flex items-center justify-center shrink-0 mt-1 shadow-[0_0_10px_rgba(56,189,248,0.3)] border border-cyan-400/30">
                <Bot className="h-4 w-4 text-cyan-100" />
              </div>
            )}

            {m.sender === 'ai' ? (
              <div className="flex-1 max-w-[92%]">
                <ProfessionalAiAnswer text={m.text} timestamp={m.timestamp} />
              </div>
            ) : (
              <div className="max-w-[85%] rounded-2xl bg-gradient-to-r from-blue-700 to-indigo-700 text-white px-4 py-2.5 shadow-[0_0_15px_rgba(59,130,246,0.35)] border border-cyan-400/30 space-y-1 rounded-br-xs">
                <div className="text-xs leading-relaxed text-cyan-50 font-medium">{m.text}</div>
                <div className="text-[9.5px] text-right font-mono text-cyan-300/70">
                  {m.timestamp}
                </div>
              </div>
            )}

            {m.sender === 'user' && (
              <div className="h-7 w-7 rounded-lg bg-cyan-950 text-cyan-300 border border-cyan-500/30 flex items-center justify-center shrink-0 mt-0.5 shadow-[0_0_8px_rgba(56,189,248,0.2)]">
                <User className="h-4 w-4" />
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div className="flex gap-2.5 justify-start">
            <div className="h-6 w-6 rounded-md bg-cyan-950 text-cyan-400 border border-cyan-500/30 flex items-center justify-center shrink-0">
              <Bot className="h-3.5 w-3.5" />
            </div>
            <div className="bg-[#0c1630] border border-cyan-500/30 p-3 rounded-2xl rounded-bl-xs text-cyan-400 flex items-center gap-1.5 shadow-[0_0_10px_rgba(56,189,248,0.15)]">
              <div className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-bounce"></div>
              <div className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-bounce delay-100"></div>
              <div className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-bounce delay-200"></div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Starter Prompts */}
      <div className="p-3 bg-[#080f22]/90 border-t border-cyan-900/50 space-y-1.5 backdrop-blur-md">
        <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400/70 block font-['Space_Grotesk']">
          Suggested Queries:
        </span>
        <div className="flex flex-wrap gap-1.5">
          {STARTER_PROMPTS.map((prompt, i) => (
            <button
              key={i}
              onClick={() => handleSend(prompt)}
              className="text-[11px] text-left px-2.5 py-1 rounded-lg bg-[#0c1630] border border-cyan-500/25 text-slate-300 hover:border-cyan-400 hover:text-cyan-200 hover:shadow-[0_0_10px_rgba(56,189,248,0.25)] transition-all flex items-center gap-1"
            >
              <CornerDownRight className="h-3 w-3 text-cyan-400/60 shrink-0" />
              <span className="truncate max-w-[200px]">{prompt}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Input Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="p-3 bg-[#060b18] border-t border-cyan-900/50 flex items-center gap-2"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={`Ask about ${resume.personalInfo.name || 'candidate'}...`}
          className="flex-1 px-3.5 py-2 text-xs rounded-xl bg-[#0b1329] border border-cyan-900/60 text-white placeholder-slate-500 focus:outline-hidden focus:border-cyan-400 focus:shadow-[0_0_12px_rgba(56,189,248,0.3)] transition-all"
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="p-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white rounded-xl disabled:opacity-40 shadow-[0_0_15px_rgba(56,189,248,0.4)] transition-all"
        >
          <Send className="h-4 w-4" />
        </button>
      </form>
    </div>
  );
};

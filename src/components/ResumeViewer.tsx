import React from 'react';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Linkedin, 
  Github, 
  Globe, 
  Briefcase, 
  GraduationCap, 
  Code2, 
  Award, 
  FolderGit2, 
  Copy, 
  Check, 
  Download, 
  Sparkles,
  Zap,
  BookOpen,
  Clock,
  ExternalLink,
  Rocket
} from 'lucide-react';
import { ParsedResume, SkillGapItem } from '../types';

interface ResumeViewerProps {
  resume: ParsedResume;
  onOpenAudit: () => void;
  onOpenChat: () => void;
  atsScore?: number;
  skillGaps?: SkillGapItem[];
}

export const ResumeViewer: React.FC<ResumeViewerProps> = ({
  resume,
  onOpenAudit,
  onOpenChat,
  atsScore = 88,
  skillGaps = [],
}) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(resume, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  const { personalInfo, summary, skills, experience, education, projects, certifications } = resume;

  return (
    <div className="flex flex-col gap-4">
      {/* Top Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-3">
          <div 
            onClick={onOpenAudit}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold cursor-pointer hover:bg-emerald-100 transition-colors"
            title="Click to view ATS Score Breakdown"
          >
            <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></div>
            <span>ATS Score: {atsScore}/100</span>
            <span className="text-[10px] text-emerald-600 font-mono">(Audit)</span>
          </div>

          <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-500 font-medium">
            <span>{experience?.length || 0} Roles</span>
            <span>•</span>
            <span>{(skills?.technical?.length || 0) + (skills?.tools?.length || 0)} Skills</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenChat}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200 text-xs font-medium transition-colors"
          >
            <Sparkles className="h-3.5 w-3.5 text-indigo-600" />
            <span>Ask AI About Candidate</span>
          </button>

          <button
            onClick={handleCopyJson}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 text-xs font-medium transition-colors"
            title="Copy normalized JSON"
          >
            {copied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
            <span className="hidden sm:inline">{copied ? 'Copied' : 'Copy JSON'}</span>
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 text-xs font-medium transition-colors"
          >
            <Download className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Print / Save PDF</span>
          </button>
        </div>
      </div>

      {/* Styled Resume Paper Layout */}
      <div 
        id="resume-document" 
        className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 sm:p-10 font-sans text-slate-800 transition-all"
      >
        {/* Header / Personal Info */}
        <div className="border-b border-slate-100 pb-6 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 mb-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-950 tracking-tight">
              {personalInfo.name || 'Candidate Name'}
            </h1>
            <span className="text-sm font-semibold text-indigo-600 tracking-wide uppercase">
              {personalInfo.title}
            </span>
          </div>

          {/* Contact Details & Links */}
          <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-xs text-slate-600 pt-1">
            {personalInfo.email && (
              <a href={`mailto:${personalInfo.email}`} className="flex items-center gap-1.5 hover:text-indigo-600 transition-colors">
                <Mail className="h-3.5 w-3.5 text-slate-400" />
                <span>{personalInfo.email}</span>
              </a>
            )}
            {personalInfo.phone && (
              <span className="flex items-center gap-1.5">
                <Phone className="h-3.5 w-3.5 text-slate-400" />
                <span>{personalInfo.phone}</span>
              </span>
            )}
            {personalInfo.location && (
              <span className="flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5 text-slate-400" />
                <span>{personalInfo.location}</span>
              </span>
            )}
            {personalInfo.linkedin && (
              <span className="flex items-center gap-1.5 text-indigo-600 hover:underline">
                <Linkedin className="h-3.5 w-3.5" />
                <span>{personalInfo.linkedin}</span>
              </span>
            )}
            {personalInfo.github && (
              <span className="flex items-center gap-1.5 text-slate-700 hover:underline">
                <Github className="h-3.5 w-3.5" />
                <span>{personalInfo.github}</span>
              </span>
            )}
            {personalInfo.website && (
              <a href={personalInfo.website} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-slate-700 hover:underline">
                <Globe className="h-3.5 w-3.5" />
                <span>{personalInfo.website}</span>
              </a>
            )}
          </div>
        </div>

        {/* Summary Section */}
        {summary && (
          <section className="mb-7">
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-2">
              <span>Professional Summary</span>
            </h2>
            <p className="text-sm leading-relaxed text-slate-700 bg-slate-50/70 p-3.5 rounded-xl border border-slate-100">
              {summary}
            </p>
          </section>
        )}

        {/* Skills Section */}
        {skills && (
          <section className="mb-8">
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
              <Code2 className="h-4 w-4 text-indigo-600" />
              <span>Competencies & Technical Proficiencies</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              {skills.technical && skills.technical.length > 0 && (
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="font-semibold text-slate-800 block mb-1.5">Core Engineering & Technical</span>
                  <div className="flex flex-wrap gap-1.5">
                    {skills.technical.map((skill, i) => (
                      <span key={i} className="px-2 py-0.5 rounded-md bg-white text-slate-800 border border-slate-200 font-medium">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {skills.tools && skills.tools.length > 0 && (
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="font-semibold text-slate-800 block mb-1.5">Platforms, Cloud & Tooling</span>
                  <div className="flex flex-wrap gap-1.5">
                    {skills.tools.map((tool, i) => (
                      <span key={i} className="px-2 py-0.5 rounded-md bg-white text-slate-800 border border-slate-200 font-medium">
                        {tool}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {skills.soft && skills.soft.length > 0 && (
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="font-semibold text-slate-800 block mb-1.5">Leadership & Methodology</span>
                  <div className="flex flex-wrap gap-1.5">
                    {skills.soft.map((item, i) => (
                      <span key={i} className="px-2 py-0.5 rounded-md bg-white text-slate-700 border border-slate-200">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {skills.languages && skills.languages.length > 0 && (
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="font-semibold text-slate-800 block mb-1.5">Languages</span>
                  <div className="flex flex-wrap gap-1.5">
                    {skills.languages.map((lang, i) => (
                      <span key={i} className="px-2 py-0.5 rounded-md bg-white text-slate-700 border border-slate-200">
                        {lang}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </section>
        )}

        {/* Career Skill Gaps & Recommended Courses Section */}
        {skillGaps && skillGaps.length > 0 && (
          <section className="mb-8 rounded-2xl border border-indigo-200 bg-gradient-to-br from-indigo-50/60 via-purple-50/20 to-white p-5 sm:p-6 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pb-3 border-b border-indigo-100">
              <div className="flex items-center gap-2.5">
                <div className="h-8 w-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold shadow-xs">
                  <GraduationCap className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <span>Career Skill Gaps & Recommended Courses</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-100 text-indigo-700 border border-indigo-200">
                      {skillGaps.length} Gaps Found
                    </span>
                  </h3>
                  <p className="text-xs text-slate-500">
                    High-demand capabilities missing from this candidate's resume and courses to bridge them.
                  </p>
                </div>
              </div>

              <button
                onClick={onOpenAudit}
                className="self-start sm:self-auto inline-flex items-center gap-1 text-xs font-semibold text-indigo-700 hover:text-indigo-900 bg-indigo-100/80 hover:bg-indigo-200/80 px-3 py-1.5 rounded-lg transition-colors"
              >
                <span>Full ATS & Gap Audit</span>
                <span aria-hidden="true">→</span>
              </button>
            </div>

            <div className="grid grid-cols-1 gap-3.5">
              {skillGaps.map((gap, i) => {
                const courseUrl = gap.course.url || `https://www.google.com/search?q=${encodeURIComponent(gap.course.title + ' ' + gap.course.platform)}`;
                return (
                  <div key={i} className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-xs space-y-2.5">
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <div className="flex items-center gap-2">
                        <span className="h-5 w-5 rounded-full bg-slate-900 text-white text-[11px] font-bold flex items-center justify-center">
                          {i + 1}
                        </span>
                        <h4 className="font-bold text-slate-900 text-xs sm:text-sm">{gap.skill}</h4>
                      </div>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                        gap.priority === 'high' 
                          ? 'bg-rose-100 text-rose-700 border border-rose-200' 
                          : 'bg-amber-100 text-amber-700 border border-amber-200'
                      }`}>
                        {gap.priority === 'high' ? 'High Priority Gap' : 'Medium Priority'}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed pl-7">
                      {gap.description}
                    </p>

                    <div className="ml-7 bg-slate-50 rounded-xl p-3 border border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-indigo-100 text-indigo-800 uppercase">
                            {gap.course.platform}
                          </span>
                          {gap.course.free ? (
                            <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-emerald-100 text-emerald-800 uppercase">
                              100% Free
                            </span>
                          ) : (
                            <span className="px-1.5 py-0.5 rounded text-[9px] font-semibold bg-slate-200 text-slate-700 uppercase">
                              Paid / Cert
                            </span>
                          )}
                          <span className="flex items-center gap-1 text-[11px] text-slate-500">
                            <Clock className="h-3 w-3" />
                            <span>{gap.course.duration}</span>
                          </span>
                        </div>
                        <div className="font-bold text-slate-900 pt-0.5">
                          {gap.course.title}
                        </div>
                      </div>

                      <a
                        href={courseUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="shrink-0 inline-flex items-center justify-center gap-1 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold transition-colors"
                      >
                        <BookOpen className="h-3 w-3" />
                        <span>Find Course</span>
                        <ExternalLink className="h-3 w-3 ml-0.5" />
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Experience Section */}
        {experience && experience.length > 0 && (
          <section className="mb-8">
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
              <Briefcase className="h-4 w-4 text-indigo-600" />
              <span>Professional Experience</span>
            </h2>

            <div className="space-y-6">
              {experience.map((exp, idx) => (
                <div key={exp.id || idx} className="relative pl-5 border-l-2 border-slate-200 pb-2 last:pb-0">
                  {/* Timeline Dot */}
                  <div className="absolute -left-[7px] top-1.5 h-3 w-3 rounded-full bg-indigo-600 ring-4 ring-white"></div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1">
                    <div>
                      <span className="font-bold text-slate-900 text-base">{exp.role}</span>
                      <span className="text-slate-500 font-medium ml-2">@ {exp.company}</span>
                    </div>
                    <div className="text-xs font-medium text-slate-500">
                      <span>{exp.startDate} – {exp.current ? 'Present' : exp.endDate}</span>
                      {exp.location && <span className="ml-2 text-slate-400">({exp.location})</span>}
                    </div>
                  </div>

                  {/* Highlights Bullets */}
                  <ul className="mt-2 space-y-1.5 text-xs text-slate-700 list-disc list-outside ml-3.5">
                    {exp.highlights.map((bullet, bIdx) => (
                      <li key={bIdx} className="leading-relaxed">
                        {bullet}
                      </li>
                    ))}
                  </ul>

                  {/* Highlighted Metrics Chips */}
                  {exp.keyMetrics && exp.keyMetrics.length > 0 && (
                    <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
                      <span className="text-[10px] font-semibold text-slate-400 flex items-center gap-1">
                        <Zap className="h-3 w-3 text-amber-500" />
                        Key Impact:
                      </span>
                      {exp.keyMetrics.map((metric, mIdx) => (
                        <span 
                          key={mIdx}
                          className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200 text-[11px] font-medium"
                        >
                          {metric}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Education Section */}
        {education && education.length > 0 && (
          <section className="mb-8">
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
              <GraduationCap className="h-4 w-4 text-indigo-600" />
              <span>Education</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {education.map((edu, idx) => (
                <div key={edu.id || idx} className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="font-bold text-slate-900 text-sm">{edu.institution}</div>
                  <div className="text-xs text-slate-600 font-medium">
                    {edu.degree} {edu.fieldOfStudy ? `in ${edu.fieldOfStudy}` : ''}
                  </div>
                  <div className="text-[11px] text-slate-400 mt-1">
                    {edu.startDate} – {edu.endDate} {edu.gpa ? `• GPA: ${edu.gpa}` : ''}
                  </div>
                  {edu.honors && edu.honors.length > 0 && (
                    <div className="mt-1.5 flex flex-wrap gap-1">
                      {edu.honors.map((honor, hIdx) => (
                        <span key={hIdx} className="text-[10px] bg-white px-1.5 py-0.5 rounded border border-slate-200 text-slate-600">
                          {honor}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Projects and Certifications */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projects && projects.length > 0 && (
            <section>
              <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                <FolderGit2 className="h-4 w-4 text-indigo-600" />
                <span>Featured Projects</span>
              </h2>
              <div className="space-y-2.5">
                {projects.map((proj, pIdx) => (
                  <div key={proj.id || pIdx} className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                    <div className="flex items-center justify-between font-bold text-slate-900">
                      <span>{proj.name}</span>
                      {proj.link && (
                        <span className="text-[10px] text-indigo-600 font-normal font-mono">{proj.link}</span>
                      )}
                    </div>
                    <p className="text-slate-600 mt-1">{proj.description}</p>
                    {proj.technologies && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {proj.technologies.map((t, tIdx) => (
                          <span key={tIdx} className="text-[10px] px-1.5 py-0.2 bg-white text-slate-700 rounded border border-slate-200">
                            {t}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {certifications && certifications.length > 0 && (
            <section>
              <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                <Award className="h-4 w-4 text-indigo-600" />
                <span>Certifications</span>
              </h2>
              <div className="space-y-2">
                {certifications.map((cert, cIdx) => (
                  <div key={cert.id || cIdx} className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                    <div className="font-bold text-slate-900">{cert.name}</div>
                    <div className="text-slate-500 mt-0.5">
                      {cert.issuer} {cert.date ? `(${cert.date})` : ''}
                    </div>
                    {cert.credentialId && (
                      <div className="text-[10px] text-slate-400 font-mono mt-1">ID: {cert.credentialId}</div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
};

import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { 
  Sparkles, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle2, 
  ExternalLink, 
  BookOpen, 
  HelpCircle,
  BarChart3,
  Award
} from 'lucide-react';
import { SkillRadarDimension } from '../types';

interface SkillRadarChartProps {
  dimensions: SkillRadarDimension[];
  jobTitle: string;
  summary: {
    strongestDimension: string;
    criticalGapDimension: string;
    averageCandidateScore: number;
    averageBenchmark: number;
  };
  onSelectDimension?: (dimension: SkillRadarDimension) => void;
}

export const SkillRadarChart: React.FC<SkillRadarChartProps> = ({
  dimensions,
  jobTitle,
  summary,
  onSelectDimension,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [activeDimension, setActiveDimension] = useState<SkillRadarDimension | null>(null);
  const [showBenchmarkOnly, setShowBenchmarkOnly] = useState(false);
  const [containerWidth, setContainerWidth] = useState<number>(540);

  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.contentRect.width > 0) {
          setContainerWidth(Math.round(entry.contentRect.width));
        }
      }
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!svgRef.current || !containerRef.current || dimensions.length === 0) return;

    const width = Math.min(Math.max(containerWidth, 320), 620);
    const height = Math.min(Math.max(width * 0.76, 360), 480);
    const margin = { 
      top: 36, 
      right: width < 420 ? 45 : 70, 
      bottom: 36, 
      left: width < 420 ? 45 : 70 
    };

    const radius = Math.min(
      width - margin.left - margin.right,
      height - margin.top - margin.bottom
    ) / 2;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    svg
      .attr('viewBox', `0 0 ${width} ${height}`)
      .attr('width', '100%')
      .attr('height', height);

    const g = svg
      .append('g')
      .attr('transform', `translate(${width / 2}, ${height / 2})`);

    const totalAxes = dimensions.length;
    const angleSlice = (Math.PI * 2) / totalAxes;
    const rScale = d3.scaleLinear().domain([0, 100]).range([0, radius]);

    // Background circular concentric grid levels
    const levels = [20, 40, 60, 80, 100];
    const gridG = g.append('g').attr('class', 'grid-levels');

    levels.forEach((lvl) => {
      const r = rScale(lvl);

      // Web polygon points for each level
      const points: [number, number][] = dimensions.map((_, i) => [
        r * Math.cos(angleSlice * i - Math.PI / 2),
        r * Math.sin(angleSlice * i - Math.PI / 2),
      ]);

      const polygonPath = d3.line<[number, number]>()
        .x((d) => d[0])
        .y((d) => d[1])
        .curve(d3.curveLinearClosed);

      gridG
        .append('path')
        .attr('d', polygonPath(points))
        .attr('fill', lvl % 40 === 0 ? '#f8fafc' : 'none')
        .attr('fill-opacity', 0.6)
        .attr('stroke', '#e2e8f0')
        .attr('stroke-width', 1)
        .attr('stroke-dasharray', lvl === 100 ? 'none' : '2,2');

      // Level percentage labels along the vertical axis
      gridG
        .append('text')
        .attr('x', 6)
        .attr('y', -r + 4)
        .attr('font-size', '9px')
        .attr('font-weight', '600')
        .attr('fill', '#94a3b8')
        .text(`${lvl}%`);
    });

    // Radial axis lines and labels
    const axisG = g.append('g').attr('class', 'axes');

    dimensions.forEach((dim, i) => {
      const angle = angleSlice * i - Math.PI / 2;
      const x = radius * Math.cos(angle);
      const y = radius * Math.sin(angle);

      // Spoke line
      axisG
        .append('line')
        .attr('x1', 0)
        .attr('y1', 0)
        .attr('x2', x)
        .attr('y2', y)
        .attr('stroke', '#cbd5e1')
        .attr('stroke-width', 1.2);

      // Axis label placement
      const labelOffset = radius + 22;
      const labelX = labelOffset * Math.cos(angle);
      const labelY = labelOffset * Math.sin(angle);

      const textAnchor =
        Math.abs(Math.cos(angle)) < 0.2
          ? 'middle'
          : Math.cos(angle) > 0
          ? 'start'
          : 'end';

      const labelGroup = axisG
        .append('g')
        .attr('class', 'axis-label-group cursor-pointer')
        .on('click', () => {
          setActiveDimension(dim);
          if (onSelectDimension) onSelectDimension(dim);
        })
        .on('mouseenter', () => setActiveDimension(dim));

      // Label text
      const words = dim.axis.split(' ');
      const text = labelGroup
        .append('text')
        .attr('x', labelX)
        .attr('y', labelY)
        .attr('text-anchor', textAnchor)
        .attr('font-size', width < 480 ? '10px' : '11px')
        .attr('font-weight', activeDimension?.axis === dim.axis ? '700' : '600')
        .attr('fill', activeDimension?.axis === dim.axis ? '#4338ca' : '#334155');

      if (words.length > 2) {
        text
          .append('tspan')
          .attr('x', labelX)
          .attr('dy', '-0.4em')
          .text(words.slice(0, 2).join(' '));
        text
          .append('tspan')
          .attr('x', labelX)
          .attr('dy', '1.1em')
          .text(words.slice(2).join(' '));
      } else {
        text.text(dim.axis);
      }
    });

    // Generator for radar polygon
    const radarLine = d3.line<{ score: number; i: number }>()
      .x((d) => rScale(d.score) * Math.cos(angleSlice * d.i - Math.PI / 2))
      .y((d) => rScale(d.score) * Math.sin(angleSlice * d.i - Math.PI / 2))
      .curve(d3.curveLinearClosed);

    // 1. Industry Benchmark Area (Reference target)
    const benchmarkData = dimensions.map((d, i) => ({ score: d.industryBenchmark, i }));
    const benchG = g.append('g').attr('class', 'benchmark-layer');

    benchG
      .append('path')
      .datum(benchmarkData)
      .attr('d', radarLine)
      .attr('fill', '#64748b')
      .attr('fill-opacity', 0.08)
      .attr('stroke', '#64748b')
      .attr('stroke-width', 2)
      .attr('stroke-dasharray', '5 4');

    // Benchmark point dots
    benchG
      .selectAll<SVGCircleElement, { score: number; i: number }>('.bench-dot')
      .data(benchmarkData)
      .enter()
      .append('circle')
      .attr('class', 'bench-dot')
      .attr('cx', (d: { score: number; i: number }) => rScale(d.score) * Math.cos(angleSlice * d.i - Math.PI / 2))
      .attr('cy', (d: { score: number; i: number }) => rScale(d.score) * Math.sin(angleSlice * d.i - Math.PI / 2))
      .attr('r', 3)
      .attr('fill', '#94a3b8')
      .attr('stroke', '#ffffff')
      .attr('stroke-width', 1);

    // 2. Candidate Skill Profile Area
    if (!showBenchmarkOnly) {
      const candidateData = dimensions.map((d, i) => ({ score: d.candidateScore, i }));
      const candG = g.append('g').attr('class', 'candidate-layer');

      candG
        .append('path')
        .datum(candidateData)
        .attr('d', radarLine)
        .attr('fill', '#4f46e5')
        .attr('fill-opacity', 0.26)
        .attr('stroke', '#4338ca')
        .attr('stroke-width', 2.8);

      // Interactive circles for candidate vertices
      const dots = candG
        .selectAll<SVGGElement, SkillRadarDimension>('.cand-dot')
        .data(dimensions)
        .enter()
        .append('g')
        .attr('class', 'cand-dot-group cursor-pointer')
        .on('mouseenter', (_, d: SkillRadarDimension) => setActiveDimension(d))
        .on('click', (_, d: SkillRadarDimension) => {
          setActiveDimension(d);
          if (onSelectDimension) onSelectDimension(d);
        });

      dots
        .append('circle')
        .attr('cx', (d: SkillRadarDimension, i: number) => rScale(d.candidateScore) * Math.cos(angleSlice * i - Math.PI / 2))
        .attr('cy', (d: SkillRadarDimension, i: number) => rScale(d.candidateScore) * Math.sin(angleSlice * i - Math.PI / 2))
        .attr('r', (d: SkillRadarDimension) => (activeDimension?.axis === d.axis ? 7 : 5))
        .attr('fill', (d: SkillRadarDimension) =>
          d.candidateScore >= d.industryBenchmark ? '#10b981' : '#4f46e5'
        )
        .attr('stroke', '#ffffff')
        .attr('stroke-width', 2.2)
        .attr('filter', 'drop-shadow(0 1px 2px rgba(0,0,0,0.2))');
    }
  }, [dimensions, activeDimension, showBenchmarkOnly, containerWidth, onSelectDimension]);

  // Set default active dimension on load
  useEffect(() => {
    if (dimensions.length > 0 && !activeDimension) {
      // Default to critical gap or first dimension
      const gapDim = dimensions.find((d) => d.axis === summary.criticalGapDimension);
      setActiveDimension(gapDim || dimensions[0]);
    }
  }, [dimensions, summary.criticalGapDimension, activeDimension]);

  const selectedDim = activeDimension || dimensions[0];
  const diffScore = selectedDim
    ? selectedDim.candidateScore - selectedDim.industryBenchmark
    : 0;

  return (
    <div id="skill-radar-container" className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
      {/* Header Banner */}
      <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-gradient-to-r from-slate-50 via-indigo-50/20 to-white">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-indigo-600 text-white shadow-xs">
              <BarChart3 className="h-4 w-4" />
            </span>
            <h3 className="font-bold text-slate-900 text-base tracking-tight">
              Skill Proficiency Radar vs. Industry Benchmark
            </h3>
            <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-800 border border-indigo-200">
              {jobTitle}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Visual comparison of candidate competency across {dimensions.length} core technical domains evaluated against senior industry expectations.
          </p>
        </div>

        {/* Legend & Toggle Controls */}
        <div className="flex items-center gap-3 self-start sm:self-auto text-xs">
          <div className="flex items-center gap-1.5 font-medium text-slate-700">
            <span className="h-2.5 w-6 rounded-sm bg-indigo-600 inline-block"></span>
            <span>Candidate ({summary.averageCandidateScore}%)</span>
          </div>
          <div className="flex items-center gap-1.5 font-medium text-slate-500">
            <span className="h-2.5 w-6 rounded-sm border-2 border-dashed border-slate-500 bg-slate-200 inline-block"></span>
            <span>Benchmark ({summary.averageBenchmark}%)</span>
          </div>
        </div>
      </div>

      {/* Main Interactive Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 divide-y lg:divide-y-0 lg:divide-x divide-slate-100">
        {/* D3 Radar Visualization Stage */}
        <div className="lg:col-span-7 p-4 sm:p-6 flex flex-col items-center justify-center relative min-h-[380px]" ref={containerRef}>
          <svg ref={svgRef} className="w-full h-auto max-w-[540px] drop-shadow-xs"></svg>
          
          <div className="text-[11px] text-slate-400 mt-2 flex items-center gap-1.5">
            <HelpCircle className="h-3.5 w-3.5 text-slate-400" />
            <span>Click or hover any axis vertex to inspect gaps & tailored course recommendations.</span>
          </div>
        </div>

        {/* Dimension Inspection Sidebar / Drilldown */}
        <div className="lg:col-span-5 p-4 sm:p-6 bg-slate-50/60 flex flex-col justify-between space-y-4">
          {selectedDim && (
            <div className="space-y-4">
              <div className="flex items-start justify-between gap-2 border-b border-slate-200/80 pb-3">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Competency Domain
                  </span>
                  <h4 className="text-base font-bold text-slate-900">{selectedDim.axis}</h4>
                </div>
                <span
                  className={`px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1 shrink-0 ${
                    diffScore >= 0
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                      : diffScore >= -12
                      ? 'bg-amber-100 text-amber-800 border border-amber-200'
                      : 'bg-rose-100 text-rose-800 border border-rose-200'
                  }`}
                >
                  {diffScore >= 0 ? (
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                  ) : (
                    <AlertTriangle className="h-3.5 w-3.5 text-rose-600" />
                  )}
                  <span>
                    {diffScore >= 0 ? `+${diffScore}% Aligned` : `${diffScore}% Gap`}
                  </span>
                </span>
              </div>

              {/* Score Comparative Meter */}
              <div className="space-y-2 bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-indigo-700">Candidate Proficiency</span>
                  <span className="font-bold text-slate-900">{selectedDim.candidateScore}%</span>
                </div>
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-indigo-600 rounded-full transition-all duration-500" 
                    style={{ width: `${selectedDim.candidateScore}%` }}
                  ></div>
                </div>

                <div className="flex items-center justify-between text-xs pt-1">
                  <span className="text-slate-500 font-medium">Industry Benchmark Standard</span>
                  <span className="font-semibold text-slate-600">{selectedDim.industryBenchmark}%</span>
                </div>
                <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-slate-400 rounded-full transition-all duration-500" 
                    style={{ width: `${selectedDim.industryBenchmark}%` }}
                  ></div>
                </div>
              </div>

              {/* Context Description */}
              <div className="text-xs text-slate-600 leading-relaxed">
                {selectedDim.description}
              </div>

              {/* Relevant Skills found in resume */}
              {selectedDim.relevantSkills && selectedDim.relevantSkills.length > 0 && (
                <div>
                  <span className="text-[11px] font-bold text-slate-500 block mb-1.5">
                    Skills Detected in Resume:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedDim.relevantSkills.map((s, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-indigo-50 text-indigo-700 border border-indigo-200"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Recommended Action / Course if Gap exists */}
              {diffScore < 0 && selectedDim.courseTitle && (
                <div className="p-3.5 rounded-xl bg-amber-50/80 border border-amber-200/90 text-xs space-y-2">
                  <div className="flex items-center gap-1.5 text-amber-900 font-bold text-[11px] uppercase tracking-wide">
                    <Sparkles className="h-3.5 w-3.5 text-amber-600" />
                    <span>Recommended Course to Bridge This Gap</span>
                  </div>
                  <div className="font-semibold text-slate-900">
                    {selectedDim.courseTitle}
                  </div>
                  {selectedDim.courseUrl && (
                    <a
                      href={selectedDim.courseUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-indigo-700 font-semibold hover:text-indigo-900 text-xs pt-0.5 transition-colors"
                    >
                      <BookOpen className="h-3.5 w-3.5" />
                      <span>Start Learning Course</span>
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Quick Domain Pill Switchers */}
          <div className="pt-2 border-t border-slate-200/80">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
              Jump to Competency
            </span>
            <div className="flex flex-wrap gap-1">
              {dimensions.map((d) => (
                <button
                  key={d.axis}
                  onClick={() => {
                    setActiveDimension(d);
                    if (onSelectDimension) onSelectDimension(d);
                  }}
                  className={`px-2 py-1 rounded-lg text-[11px] font-semibold transition-all ${
                    selectedDim?.axis === d.axis
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'bg-white text-slate-600 hover:bg-slate-200/80 border border-slate-200'
                  }`}
                >
                  {d.axis.split(' ')[0]}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Footer Highlights: Strongest Pillar vs Critical Gap */}
      <div className="p-3.5 sm:p-4 bg-slate-50 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
        <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-white border border-emerald-200 shadow-2xs">
          <div className="h-7 w-7 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
            <Award className="h-4 w-4" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 block">
              Top Strength Area
            </span>
            <span className="font-bold text-slate-900">{summary.strongestDimension}</span>
          </div>
        </div>

        <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-white border border-rose-200 shadow-2xs">
          <div className="h-7 w-7 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center shrink-0">
            <AlertTriangle className="h-4 w-4" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-rose-700 block">
              Highest Priority Skill Gap
            </span>
            <span className="font-bold text-slate-900">{summary.criticalGapDimension}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import {
  FiTrendingUp,
  FiActivity,
  FiCalendar,
  FiAlertTriangle
} from 'react-icons/fi';

export function TrendsView({ trendsData }) {
  const [selectedMetric, setSelectedMetric] = useState('frictionRate');
  const { timeSeries } = trendsData;

  const metricConfigs = {
    frictionRate: { label: 'Friction Rate', unit: '%', color: '#f59e0b', maxVal: 100, isPositiveBad: true },
    abandonmentRate: { label: 'Abandonment Rate', unit: '%', color: '#ef4444', maxVal: 50, isPositiveBad: true },
    conversionRate: { label: 'Conversion Rate', unit: '%', color: '#10b981', maxVal: 6, isPositiveBad: false },
    avgTaskTime: { label: 'Average Task Time', unit: 's', color: '#818cf8', maxVal: 180, isPositiveBad: true },
    errorRate: { label: 'Error Rate', unit: '%', color: '#ec4899', maxVal: 15, isPositiveBad: true },
    rageClicks: { label: 'Rage Clicks', unit: '', color: '#f97316', maxVal: 1800, isPositiveBad: true }
  };

  const currentConfig = metricConfigs[selectedMetric];

  // Calculate SVG chart points
  const chartHeight = 220;
  const chartWidth = 800;
  const paddingX = 40;
  const paddingY = 30;

  const getPoints = () => {
    const points = timeSeries.map((d, index) => {
      const val = d[selectedMetric];
      const x = paddingX + (index / (timeSeries.length - 1)) * (chartWidth - paddingX * 2);
      const y = chartHeight - paddingY - (val / currentConfig.maxVal) * (chartHeight - paddingY * 2);
      return { x, y, val, date: d.date, eventTag: d.eventTag };
    });
    return points;
  };

  const points = getPoints();
  const pathD = points.reduce((acc, p, i) => `${acc} ${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`, '');
  const areaD = `${pathD} L ${points[points.length - 1].x} ${chartHeight - paddingY} L ${points[0].x} ${chartHeight - paddingY} Z`;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl font-bold text-white tracking-tight flex items-center space-x-2">
              <FiTrendingUp className="text-indigo-400" />
              <span>Behavioral Friction & Conversion Trends</span>
            </h1>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              14-Day Timeline
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Tracking longitudinal behavioral friction shifts correlated against code deployments and Fixzy interventions.
          </p>
        </div>

        <div className="flex items-center space-x-2 text-xs font-mono text-slate-400">
          <FiCalendar className="w-3.5 h-3.5 text-indigo-400" />
          <span>Last 14 Consecutive Days</span>
        </div>
      </div>

      {/* Metric Selector Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
        {Object.entries(metricConfigs).map(([key, config]) => {
          const isSelected = selectedMetric === key;
          const latestValue = timeSeries[timeSeries.length - 1][key];
          return (
            <button
              key={key}
              onClick={() => setSelectedMetric(key)}
              className={`p-3 rounded-xl border text-left transition-all ${
                isSelected
                  ? 'bg-slate-800/90 border-indigo-500 text-white shadow-sm'
                  : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
              }`}
            >
              <div className="text-[11px] uppercase tracking-wider font-semibold truncate text-slate-400">{config.label}</div>
              <div className="text-lg font-bold font-mono text-white mt-1">
                {latestValue}{config.unit}
              </div>
              <div className="text-[10px] text-slate-500 font-mono mt-0.5">Current Day 14</div>
            </button>
          );
        })}
      </div>

      {/* Interactive Time-Series SVG Chart */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-4 border-b border-slate-800">
          <div>
            <h2 className="text-base font-bold text-white flex items-center space-x-2">
              <span className="w-3 h-3 rounded-full" style={{ backgroundColor: currentConfig.color }}></span>
              <span>{currentConfig.label} Trajectory ({currentConfig.unit || 'Count'})</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Notice the friction spike on Day 4 (Tax API deployment) and resolution on Day 9 (Fixzy EXP-104 live)
            </p>
          </div>

          <div className="flex items-center space-x-3 text-xs font-mono">
            <span className="flex items-center space-x-1 text-slate-400">
              <span className="w-2 h-2 rounded-full bg-rose-500"></span>
              <span>Deployment Spike</span>
            </span>
            <span className="flex items-center space-x-1 text-slate-400">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span>Intervention Rollout</span>
            </span>
          </div>
        </div>

        {/* SVG Container */}
        <div className="w-full overflow-x-auto">
          <div className="min-w-[760px]">
            <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-64 overflow-visible">
              <defs>
                <linearGradient id="metricGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={currentConfig.color} stopOpacity="0.3" />
                  <stop offset="100%" stopColor={currentConfig.color} stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Grid Lines */}
              {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => {
                const y = paddingY + ratio * (chartHeight - paddingY * 2);
                const val = Math.round(currentConfig.maxVal * (1 - ratio));
                return (
                  <g key={i}>
                    <line x1={paddingX} y1={y} x2={chartWidth - paddingX} y2={y} stroke="#1e293b" strokeDasharray="3 3" />
                    <text x={paddingX - 8} y={y + 3} textAnchor="end" fill="#64748b" fontSize="10" fontFamily="monospace">
                      {val}{currentConfig.unit}
                    </text>
                  </g>
                );
              })}

              {/* Area Fill */}
              <path d={areaD} fill="url(#metricGradient)" />

              {/* Trend Line */}
              <path d={pathD} fill="none" stroke={currentConfig.color} strokeWidth="2.5" strokeLinecap="round" />

              {/* Data Points and Event Tags */}
              {points.map((p, i) => (
                <g key={i} className="group">
                  <circle
                    cx={p.x}
                    cy={p.y}
                    r={p.eventTag ? 5 : 3.5}
                    fill={p.eventTag ? '#ffffff' : currentConfig.color}
                    stroke="#0B0F19"
                    strokeWidth="2"
                    className="transition-all hover:r-6 cursor-pointer"
                  />
                  
                  {/* Event Tag Pin */}
                  {p.eventTag && (
                    <g transform={`translate(${p.x}, ${p.y - 12})`}>
                      <rect x="-60" y="-22" width="120" height="18" rx="4" fill="#1e1b4b" stroke="#6366f1" strokeWidth="1" />
                      <text x="0" y="-10" textAnchor="middle" fill="#c7d2fe" fontSize="9" fontWeight="bold" fontFamily="sans-serif">
                        {p.eventTag}
                      </text>
                    </g>
                  )}

                  {/* Day Label on bottom */}
                  <text x={p.x} y={chartHeight - 10} textAnchor="middle" fill="#64748b" fontSize="10" fontFamily="monospace">
                    D{i + 1}
                  </text>
                </g>
              ))}
            </svg>
          </div>
        </div>
      </div>

      {/* Historical Correlation Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 text-xs space-y-2">
          <div className="flex items-center space-x-2 text-rose-400 font-bold">
            <FiAlertTriangle className="w-4 h-4" />
            <span>Incident Correlation: Day 4 Spike</span>
          </div>
          <p className="text-slate-300 leading-relaxed">
            Deployment of Tax API v2 on Day 4 triggered an immediate <strong>+30% friction jump</strong> and <strong>3.6x surge in rage clicks</strong> due to address field clearing bugs.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 text-xs space-y-2">
          <div className="flex items-center space-x-2 text-emerald-400 font-bold">
            <FiActivity className="w-4 h-4" />
            <span>Resolution Proof: Day 9 EXP-104 Rollout</span>
          </div>
          <p className="text-slate-300 leading-relaxed">
            Fixzy intervention experiment went live on Day 9. Within 48 hours, the friction score plummeted from <strong>68 to 34</strong>, recovering <strong>+18.4% completed checkouts</strong>.
          </p>
        </div>
      </div>
    </div>
  );
}

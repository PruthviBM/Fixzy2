import React, { useState } from 'react';
import { SeverityBadge, FrictionScoreBadge, StatusPill } from '../common/StatusBadge';
import {
  FiFilter,
  FiSearch,
  FiCpu
} from 'react-icons/fi';

export function FrictionIssuesView({ issues, onSelectIssue, onNavigateTab }) {
  const [selectedSeverity, setSelectedSeverity] = useState('All');
  const [selectedType, setSelectedType] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeModalIssue, setActiveModalIssue] = useState(null);

  const issueTypes = [
    'All',
    'Rage clicks',
    'Validation errors',
    'Excessive retries',
    'Backtracking',
    'Repeated clicks',
    'Long hesitation',
    'Dead clicks',
    'Abandoned journeys'
  ];

  const filteredIssues = issues.filter((issue) => {
    const matchesSeverity = selectedSeverity === 'All' || issue.severity.toLowerCase() === selectedSeverity.toLowerCase();
    const matchesType = selectedType === 'All' || issue.type.toLowerCase() === selectedType.toLowerCase();
    const matchesSearch =
      issue.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      issue.evidence.toLowerCase().includes(searchQuery.toLowerCase()) ||
      issue.element.toLowerCase().includes(searchQuery.toLowerCase()) ||
      issue.page.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSeverity && matchesType && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl font-bold text-white tracking-tight">Friction Issues Catalog</h1>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30">
              {filteredIssues.length} Detected
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Automated behavioral anomaly clustering identifies high-friction stumbling blocks across journeys.
          </p>
        </div>

        <div className="flex items-center space-x-2 text-xs">
          <span className="text-slate-400">Sort by:</span>
          <span className="font-mono text-indigo-400 bg-slate-900 px-2.5 py-1.5 rounded-lg border border-slate-800">
            Friction Score (Desc)
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="glass-panel p-4 rounded-xl border border-slate-800 space-y-3">
        <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
          {/* Search Input */}
          <div className="relative w-full md:w-80">
            <FiSearch className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by element, page, or evidence..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 font-sans"
            />
          </div>

          {/* Severity Filter Pills */}
          <div className="flex items-center space-x-1.5 overflow-x-auto w-full md:w-auto">
            <span className="text-xs text-slate-400 mr-2 flex items-center">
              <FiFilter className="w-3 h-3 mr-1" /> Severity:
            </span>
            {['All', 'Critical', 'High', 'Medium'].map((sev) => (
              <button
                key={sev}
                onClick={() => setSelectedSeverity(sev)}
                className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${
                  selectedSeverity === sev
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-slate-900 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                {sev}
              </button>
            ))}
          </div>
        </div>

        {/* Issue Type Filter Pills */}
        <div className="pt-2 border-t border-slate-800/60 flex items-center space-x-2 overflow-x-auto text-xs py-1">
          <span className="text-slate-500 font-mono text-[11px] shrink-0">PATTERN:</span>
          {issueTypes.map((type) => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={`px-2.5 py-1 rounded-md text-[11px] font-medium shrink-0 transition-all ${
                selectedType === type
                  ? 'bg-slate-700 text-white font-semibold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Friction Issues List */}
      <div className="grid grid-cols-1 gap-4">
        {filteredIssues.map((issue) => (
          <div
            key={issue.id}
            className="glass-panel p-5 rounded-xl border border-slate-800 hover:border-slate-700 transition-all duration-200"
          >
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              
              {/* Left Column: ID, Type, Title, Location */}
              <div className="space-y-1.5 max-w-2xl">
                <div className="flex items-center space-x-2.5">
                  <span className="font-mono text-xs text-slate-500 font-semibold">{issue.id}</span>
                  <span className="px-2 py-0.5 rounded text-xs font-semibold bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                    {issue.type}
                  </span>
                  <SeverityBadge severity={issue.severity} />
                  <StatusPill status={issue.status} />
                  <span className="text-[11px] text-slate-400 font-mono hidden sm:inline">
                    • Detected {issue.detectedAgo}
                  </span>
                </div>

                <h3 className="text-base font-bold text-white tracking-tight">
                  {issue.title}
                </h3>

                <div className="flex items-center space-x-3 text-xs font-mono text-slate-400">
                  <span>Page: <strong className="text-slate-200">{issue.page}</strong></span>
                  <span className="text-slate-600">|</span>
                  <span>Target: <code className="text-indigo-300 bg-slate-900 px-1 py-0.5 rounded">{issue.element}</code></span>
                </div>

                {/* Behavioral Evidence Statement */}
                <div className="mt-2.5 p-3 rounded-lg bg-slate-900/90 border border-slate-800/80 text-xs">
                  <span className="text-slate-400 font-semibold uppercase text-[10px] tracking-wider block mb-0.5">
                    Behavioral Evidence Signal:
                  </span>
                  <p className="text-slate-300 leading-relaxed font-sans">
                    {issue.evidence}
                  </p>
                </div>
              </div>

              {/* Right Column: Score, Users, Business Impact & Action */}
              <div className="flex flex-row lg:flex-col items-center lg:items-end justify-between lg:justify-center gap-3 shrink-0 pt-3 lg:pt-0 border-t lg:border-t-0 border-slate-800">
                <div className="flex items-center space-x-4 lg:space-x-0 lg:space-y-2 lg:flex-col lg:items-end">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-slate-400">Friction Score:</span>
                    <FrictionScoreBadge score={issue.frictionScore} />
                  </div>
                  
                  <div className="text-xs font-mono text-slate-300">
                    <strong className="text-white">{issue.affectedUsers.toLocaleString()}</strong> users blocked
                  </div>

                  {issue.impactValue && <div className="text-[11px] font-mono text-amber-400">
                    Est. {issue.impactValue}
                  </div>}
                </div>

                <div className="flex items-center space-x-2 mt-2">
                  <button
                    onClick={() => setActiveModalIssue(issue)}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-colors"
                  >
                    Telemetry Details
                  </button>
                  <button
                    onClick={() => {
                      onSelectIssue(issue);
                      onNavigateTab('diagnosis');
                    }}
                    className="px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center space-x-1.5 shadow-sm transition-all"
                  >
                    <FiCpu className="w-3.5 h-3.5" />
                    <span>AI Diagnosis</span>
                  </button>
                </div>
              </div>

            </div>
          </div>
        ))}
        {filteredIssues.length === 0 && (
          <div className="glass-panel p-10 rounded-xl border border-slate-800 text-center">
            <h2 className="text-lg font-semibold text-white">No friction issues detected yet.</h2>
            <p className="mt-2 text-sm text-slate-400">Connect your website or upload behavioral data to begin analysis.</p>
          </div>
        )}
      </div>

      {/* Telemetry Detail Inspection Modal */}
      {activeModalIssue && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0F1626] border border-slate-800 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center space-x-2">
                <span className="font-mono text-xs text-indigo-400">{activeModalIssue.id}</span>
                <span className="font-bold text-white text-sm">{activeModalIssue.title}</span>
              </div>
              <button
                onClick={() => setActiveModalIssue(null)}
                className="text-slate-400 hover:text-white text-sm font-mono"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-900 rounded-lg border border-slate-800 space-y-1">
                <span className="text-slate-400 uppercase font-mono text-[10px]">Granular Telemetry Metrics</span>
                <div className="grid grid-cols-3 gap-2 pt-2">
                  {Object.entries(activeModalIssue.metrics || {}).map(([key, val]) => (
                    <div key={key} className="bg-slate-950 p-2 rounded border border-slate-800/80">
                      <div className="text-[10px] text-slate-500 uppercase">{key}</div>
                      <div className="text-xs font-mono font-bold text-white mt-0.5">{val}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <span className="text-slate-400 uppercase font-mono text-[10px]">Behavioral Evidence Proof</span>
                <p className="text-slate-200 mt-1 leading-relaxed bg-slate-900/60 p-3 rounded-lg border border-slate-800">
                  {activeModalIssue.evidence}
                </p>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 flex justify-end space-x-2">
              <button
                onClick={() => setActiveModalIssue(null)}
                className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 text-xs"
              >
                Close
              </button>
              <button
                onClick={() => {
                  onSelectIssue(activeModalIssue);
                  setActiveModalIssue(null);
                  onNavigateTab('diagnosis');
                }}
                className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center space-x-2"
              >
                <FiCpu className="w-4 h-4" />
                <span>Launch Full AI Diagnosis</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

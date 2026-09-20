import React, { useState } from 'react';
import {
  FiUserCheck,
  FiInfo
} from 'react-icons/fi';

export function HumanVsAgentView({ agentData }) {
  const [filterType, setFilterType] = useState('All');
  const { classificationSummary, disclaimer, signalFactors, sampleSessions } = agentData;

  const filteredSessions = sampleSessions.filter((s) => {
    if (filterType === 'All') return true;
    return s.classification.toLowerCase().includes(filterType.toLowerCase());
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl font-bold text-white tracking-tight flex items-center space-x-2">
              <FiUserCheck className="text-indigo-400" />
              <span>Human vs AI-Agent Activity</span>
            </h1>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
              Kinetic Analysis
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Separating organic user friction from headless AI scrapers and automated agents using behavioral kinetics.
          </p>
        </div>

        <div className="flex items-center space-x-2 text-xs font-mono">
          <span className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300">
            Engine: <span className="text-indigo-400 font-semibold">Micro-Jitter & Kinematic Dynamics</span>
          </span>
        </div>
      </div>

      {/* Critical Probabilistic Disclaimer Banner (As explicitly required) */}
      <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-500/30 flex items-start space-x-3 text-xs">
        <FiInfo className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
        <div className="text-slate-300 leading-relaxed">
          <strong className="text-amber-300 font-semibold">Probabilistic Analysis Disclaimer: </strong>
          {disclaimer} Fixzy models physical user variance and mechanical bot signatures to avoid polluting product UX metrics with automated scrapers.
        </div>
      </div>

      {/* Summary Distribution Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Likely Human */}
        <div className="glass-panel p-5 rounded-xl border border-emerald-500/30 bg-emerald-950/10">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span className="font-semibold uppercase tracking-wider text-emerald-400">Likely Human</span>
            <span className="font-mono text-emerald-400">{classificationSummary.likelyHuman.percentage}%</span>
          </div>
          <div className="text-2xl font-bold font-mono text-white">
            {classificationSummary.likelyHuman.count.toLocaleString()}
          </div>
          <div className="mt-2 text-xs text-slate-400">
            Organic Bézier cursor curvature, variable typing cadences, hesitation dwell pauses.
          </div>
        </div>

        {/* Likely AI Agent */}
        <div className="glass-panel p-5 rounded-xl border border-purple-500/30 bg-purple-950/10">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span className="font-semibold uppercase tracking-wider text-purple-400">Likely AI Agent / Bot</span>
            <span className="font-mono text-purple-400">{classificationSummary.likelyAiAgent.percentage}%</span>
          </div>
          <div className="text-2xl font-bold font-mono text-white">
            {classificationSummary.likelyAiAgent.count.toLocaleString()}
          </div>
          <div className="mt-2 text-xs text-slate-400">
            Isochronous event intervals, linear coordinate teleports, zero hover dwell before submission.
          </div>
        </div>

        {/* Uncertain Hybrid */}
        <div className="glass-panel p-5 rounded-xl border border-slate-700 bg-slate-900/60">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span className="font-semibold uppercase tracking-wider text-slate-300">Uncertain / Hybrid</span>
            <span className="font-mono text-slate-400">{classificationSummary.uncertainHybrid.percentage}%</span>
          </div>
          <div className="text-2xl font-bold font-mono text-white">
            {classificationSummary.uncertainHybrid.count.toLocaleString()}
          </div>
          <div className="mt-2 text-xs text-slate-400">
            Mixed telemetry (e.g. browser autofill extensions, accessibility screen readers, hybrid proxies).
          </div>
        </div>
      </div>

      {/* Behavioral Signal Factors */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800">
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-300 font-mono mb-4">
          Kinematic Signal Weights & Detection Physics
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {signalFactors.map((factor, idx) => (
            <div key={idx} className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-white text-sm">{factor.signal}</span>
                <span className="font-mono text-indigo-400 font-semibold">{factor.weight}</span>
              </div>
              <div className="space-y-1.5 pt-1">
                <div className="p-2 rounded bg-emerald-950/20 border border-emerald-500/20 text-slate-300">
                  <strong className="text-emerald-400">Human Pattern:</strong> {factor.humanPattern}
                </div>
                <div className="p-2 rounded bg-purple-950/20 border border-purple-500/20 text-slate-300">
                  <strong className="text-purple-400">AI Agent Pattern:</strong> {factor.agentPattern}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Real-time Session Inspector Stream */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-4 border-b border-slate-800">
          <div>
            <h2 className="text-sm font-bold text-white">Live Classified Sessions Telemetry Stream</h2>
            <p className="text-xs text-slate-400 mt-0.5">Real-time classification with kinematic evidence</p>
          </div>

          <div className="flex items-center space-x-2 text-xs">
            <span className="text-slate-400">Filter:</span>
            {['All', 'Human', 'Agent'].map((f) => (
              <button
                key={f}
                onClick={() => setFilterType(f)}
                className={`px-3 py-1 rounded-md transition-all ${
                  filterType === f
                    ? 'bg-indigo-600 text-white font-medium'
                    : 'bg-slate-900 text-slate-400 hover:text-white'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          {filteredSessions.map((session) => {
            const isAgent = session.classification.toLowerCase().includes('agent');
            return (
              <div
                key={session.sessionId}
                className={`p-4 rounded-xl border text-xs transition-all ${
                  isAgent ? 'bg-purple-950/15 border-purple-500/30' : 'bg-emerald-950/15 border-emerald-500/30'
                }`}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 pb-2 mb-2 border-b border-slate-800/80">
                  <div className="flex items-center space-x-3">
                    <span className="font-mono text-slate-400 font-bold">{session.sessionId}</span>
                    <span className={`px-2.5 py-0.5 rounded-full font-bold font-mono text-[11px] ${
                      isAgent ? 'bg-purple-500/20 text-purple-300' : 'bg-emerald-500/20 text-emerald-300'
                    }`}>
                      {session.classification} ({session.confidence}% Probabilistic Confidence)
                    </span>
                    <span className="text-slate-500 font-mono text-[11px]">• {session.timestamp}</span>
                  </div>

                  <div className="font-mono text-slate-400 text-[11px]">
                    {session.device}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <span className="text-slate-400 font-semibold block mb-0.5">Behavioral Proof:</span>
                    <p className="text-slate-200">{session.evidence}</p>
                  </div>
                  <div className="shrink-0 flex items-center space-x-1.5">
                    {session.indicators.map((ind, i) => (
                      <span key={i} className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-[10px] font-mono text-slate-300">
                        {ind}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

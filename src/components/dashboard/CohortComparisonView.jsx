import React from 'react';
import {
  FiGitPullRequest,
  FiCheckCircle,
  FiXCircle,
  FiArrowRight
} from 'react-icons/fi';

function BackendCohortView({ cohortData, onNavigateTab }) {
  if (!cohortData) {
    return (
      <div className="glass-panel p-10 rounded-2xl border border-slate-800 text-center">
        <h2 className="text-lg font-semibold text-white">No cohort data available yet.</h2>
        <p className="mt-2 text-sm text-slate-400">Connect your website or upload behavioral data to begin comparing user journeys.</p>
      </div>
    );
  }

  const { summary, metrics } = cohortData;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl font-bold text-white tracking-tight flex items-center space-x-2">
              <FiGitPullRequest className="text-indigo-400" />
              <span>Successful vs Struggling Cohort Comparison</span>
            </h1>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">AWS Behavioral Data</span>
          </div>
          <p className="text-xs text-slate-400 mt-1">Comparing real successful and struggling user sessions.</p>
        </div>
        <button
          onClick={() => onNavigateTab('diagnosis')}
          className="px-3.5 py-1.5 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 text-xs font-semibold flex items-center space-x-1.5 transition-colors"
        >
          <span>See AI Diagnosis</span>
          <FiArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-5 rounded-2xl bg-emerald-950/15 border border-emerald-500/30 relative">
          <div className="flex items-center space-x-2 mb-3"><FiCheckCircle className="w-5 h-5 text-emerald-400" /><h2 className="text-lg font-bold text-white">Successful Sessions</h2></div>
          <div className="text-2xl font-mono font-extrabold text-emerald-400">{summary.successfulSessions ?? '--'} <span className="text-xs text-slate-400 font-sans font-normal">sessions completed</span></div>
        </div>
        <div className="p-5 rounded-2xl bg-rose-950/15 border border-rose-500/30 relative">
          <div className="flex items-center space-x-2 mb-3"><FiXCircle className="w-5 h-5 text-rose-400" /><h2 className="text-lg font-bold text-white">Struggling Sessions</h2></div>
          <div className="text-2xl font-mono font-extrabold text-rose-400">{summary.strugglingSessions ?? '--'} <span className="text-xs text-slate-400 font-sans font-normal">sessions stalled</span></div>
        </div>
      </div>

      <div className="glass-panel p-6 rounded-2xl border border-slate-800">
        <div className="pb-4 mb-4 border-b border-slate-800"><h2 className="text-sm font-bold uppercase tracking-wider text-slate-300 font-mono">Granular Behavioral Disparity Breakdown</h2></div>
        <div className="space-y-4">
          {metrics.map((metric) => (
            <div key={metric.name} className="p-4 rounded-xl bg-slate-900/70 border border-slate-800/80">
              <div className="text-sm font-bold text-white">{metric.name}</div>
              <div className="text-xs text-slate-400 mb-3">{metric.description}</div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                <div className="p-3 rounded-lg bg-emerald-950/20 border border-emerald-500/20 flex items-center justify-between"><span className="text-xs font-medium text-emerald-300">Successful Cohort:</span><span className="text-xs font-mono font-bold text-white">{metric.successful}</span></div>
                <div className="p-3 rounded-lg bg-rose-950/20 border border-rose-500/20 flex items-center justify-between"><span className="text-xs font-medium text-rose-300">Struggling Cohort:</span><span className="text-xs font-mono font-bold text-rose-300">{metric.struggling}</span></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function CohortComparisonView({ cohortData, backendCohort, isDemoMode = true, onNavigateTab }) {
  if (!isDemoMode) return <BackendCohortView cohortData={backendCohort} onNavigateTab={onNavigateTab} />;

  const { summary, metrics } = cohortData;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl font-bold text-white tracking-tight flex items-center space-x-2">
              <FiGitPullRequest className="text-indigo-400" />
              <span>Successful vs Struggling Cohort Comparison</span>
            </h1>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              Comparative Behavioral Telemetry
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Contrasting user sessions that smoothly achieved conversion against those encountering high cognitive friction and abandonment.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => onNavigateTab('diagnosis')}
            className="px-3.5 py-1.5 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 text-xs font-semibold flex items-center space-x-1.5 transition-colors"
          >
            <span>See AI Diagnosis</span>
            <FiArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Cohort Profile Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Successful Cohort Card */}
        <div className="p-5 rounded-2xl bg-emerald-950/15 border border-emerald-500/30 relative">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <FiCheckCircle className="w-5 h-5 text-emerald-400" />
              <h2 className="text-lg font-bold text-white">Successful Sessions</h2>
            </div>
            <span className="text-xs font-mono px-2.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
              68.0% of traffic
            </span>
          </div>
          <div className="text-2xl font-mono font-extrabold text-emerald-400">
            {summary.successfulSessions.toLocaleString()} <span className="text-xs text-slate-400 font-sans font-normal">sessions completed</span>
          </div>
          <p className="text-xs text-slate-300 mt-2 leading-relaxed">
            Characterized by direct forward flow, low hesitation pauses, minimal form retries, and high-cadence progression straight through to order confirmation.
          </p>
        </div>

        {/* Struggling Cohort Card */}
        <div className="p-5 rounded-2xl bg-rose-950/15 border border-rose-500/30 relative">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <FiXCircle className="w-5 h-5 text-rose-400" />
              <h2 className="text-lg font-bold text-white">Struggling Sessions</h2>
            </div>
            <span className="text-xs font-mono px-2.5 py-0.5 rounded bg-rose-500/20 text-rose-300 font-bold border border-rose-500/30">
              32.0% of traffic
            </span>
          </div>
          <div className="text-2xl font-mono font-extrabold text-rose-400">
            {summary.strugglingSessions.toLocaleString()} <span className="text-xs text-slate-400 font-sans font-normal">sessions stalled</span>
          </div>
          <p className="text-xs text-slate-300 mt-2 leading-relaxed">
            Characterized by excessive form validation re-renders, cursor jitter, step loops, high backtracking rates, and repetitive rage clicks before exit.
          </p>
        </div>
      </div>

      {/* Deep Side-by-Side Comparison Matrix */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800">
        <div className="pb-4 mb-4 border-b border-slate-800 flex items-center justify-between">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-300 font-mono">
            Granular Behavioral Disparity Breakdown
          </h2>
          <span className="text-xs text-slate-400 font-mono">Sample: Last 48,290 Ingested Sessions</span>
        </div>

        <div className="space-y-4">
          {metrics.map((m, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl bg-slate-900/70 border border-slate-800/80 hover:border-slate-700 transition-colors"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-3">
                <div>
                  <div className="text-sm font-bold text-white">{m.name}</div>
                  <div className="text-xs text-slate-400">{m.description}</div>
                </div>
                <div className="text-xs font-mono px-2.5 py-1 rounded bg-rose-500/15 text-rose-300 border border-rose-500/25 w-fit">
                  Disparity Delta: <strong>{m.delta}</strong>
                </div>
              </div>

              {/* Side by side metric bars */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                {/* Successful */}
                <div className="p-3 rounded-lg bg-emerald-950/20 border border-emerald-500/20 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <FiCheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-xs font-medium text-emerald-300">Successful Cohort:</span>
                  </div>
                  <span className="text-xs font-mono font-bold text-white">{m.successful}</span>
                </div>

                {/* Struggling */}
                <div className="p-3 rounded-lg bg-rose-950/20 border border-rose-500/20 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <FiXCircle className="w-3.5 h-3.5 text-rose-400" />
                    <span className="text-xs font-medium text-rose-300">Struggling Cohort:</span>
                  </div>
                  <span className="text-xs font-mono font-bold text-rose-300">{m.struggling}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

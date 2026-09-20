import React, { useState } from 'react';
import {
  FiZap,
  FiPlusCircle
} from 'react-icons/fi';

export function ExperimentsView({ experimentsData, onNavigateTab }) {
  const { experiments } = experimentsData;
  const [activeTabFilter, setActiveTabFilter] = useState('All');

  const filteredExperiments = experiments.filter((e) => {
    if (activeTabFilter === 'All') return true;
    return e.status.toLowerCase() === activeTabFilter.toLowerCase();
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl font-bold text-white tracking-tight flex items-center space-x-2">
              <FiZap className="text-indigo-400" />
              <span>Test the Fix</span>
            </h1>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
              Validate & Measure
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Try a recommended fix and measure whether it improves the experience.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => onNavigateTab('diagnosis')}
            className="px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center space-x-1.5 shadow-sm transition-all"
          >
            <FiPlusCircle className="w-4 h-4" />
            <span>Start a Test</span>
          </button>
        </div>
      </div>

      {/* THE DIAGNOSTIC LOOP (As required by prompt) */}
      <div className="glass-panel p-6 rounded-2xl border border-light-border dark:border-dark-border">
        <div className="pb-3 mb-4 border-b border-slate-800">
          <span className="text-xs font-mono uppercase text-indigo-400 font-bold">From problem to fix</span>
          <h2 className="text-lg font-bold text-white mt-0.5">
            Problem → Recommended Fix → Test the Fix → Measure the Result
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Stage 1 */}
          <div className="p-4 rounded-xl bg-light-surfaceAlt dark:bg-dark-surfaceAlt border border-light-border dark:border-dark-border relative">
            <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-2">
              <span className="text-rose-400 font-bold">STAGE 1</span>
              <span>DETECT</span>
            </div>
            <h3 className="text-sm font-bold text-white mb-1">Problem Detected</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Anomaly detection flags 3.7 shipping visits and 61% validation errors on checkout step.
            </p>
          </div>

          {/* Stage 2 */}
          <div className="p-4 rounded-xl bg-light-surfaceAlt dark:bg-dark-surfaceAlt border border-light-border dark:border-dark-border relative">
            <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-2">
              <span className="text-indigo-400 font-bold">STAGE 2</span>
              <span>DIAGNOSE</span>
            </div>
            <h3 className="text-sm font-bold text-white mb-1">Recommended Fix</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              AI prescribes client form state retention across 422 tax calculation retries with inline guidance.
            </p>
          </div>

          {/* Stage 3 */}
          <div className="p-4 rounded-xl bg-light-surfaceAlt dark:bg-dark-surfaceAlt border border-light-border dark:border-dark-border relative">
            <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-2">
              <span className="text-purple-400 font-bold">STAGE 3</span>
              <span>EXPERIMENT</span>
            </div>
            <h3 className="text-sm font-bold text-white mb-1">Test the Fix</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              A/B test deployed via feature flag (50% control sync reload vs 50% variant state cache).
            </p>
          </div>

          {/* Stage 4 */}
          <div className="p-4 rounded-xl bg-light-surfaceAlt dark:bg-dark-surfaceAlt border border-light-border dark:border-dark-border relative">
            <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-2">
              <span className="text-emerald-400 font-bold">STAGE 4</span>
              <span>VALIDATE</span>
            </div>
            <h3 className="text-sm font-bold text-white mb-1">Measure Outcome</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Telemetry confirms +18.4% completion rate increase and -34 pts friction score drop.
            </p>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2 text-xs">
          <span className="text-slate-400 mr-1">Status:</span>
          {['All', 'Active', 'Completed', 'Queued'].map((status) => (
            <button
              key={status}
              onClick={() => setActiveTabFilter(status)}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                activeTabFilter === status
                  ? 'bg-indigo-600 text-white font-semibold shadow-sm'
                  : 'bg-slate-900 text-slate-400 hover:text-white'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
        <span className="text-xs text-slate-400 font-mono">
          Showing {filteredExperiments.length} experiments
        </span>
      </div>

      {/* Example Experiment Cards */}
      <div className="grid grid-cols-1 gap-4">
        {filteredExperiments.map((exp) => {
          const isActive = exp.status.toLowerCase() === 'active';
          const isCompleted = exp.status.toLowerCase() === 'completed';

          return (
            <div
              key={exp.id}
              className={`glass-panel p-6 rounded-2xl border transition-all duration-200 ${
                isActive
                  ? 'border-indigo-500/40 shadow-glow'
                  : isCompleted
                  ? 'border-emerald-500/30'
                  : 'border-slate-800'
              }`}
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
                <div>
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="font-mono text-xs text-indigo-400 font-bold">{exp.id}</span>
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold font-mono ${
                      isActive ? 'bg-indigo-500/20 text-indigo-300' :
                      isCompleted ? 'bg-emerald-500/20 text-emerald-300' :
                      'bg-slate-800 text-slate-300'
                    }`}>
                      {exp.status.toUpperCase()}
                    </span>
                    <span className="text-xs text-slate-400">• {exp.variantDistribution}</span>
                  </div>

                  <h3 className="text-base font-bold text-white tracking-tight">
                    {exp.title}
                  </h3>

                  <div className="text-xs font-mono text-slate-400 mt-0.5">
                    Linked Issue: <span className="text-slate-200">{exp.linkedIssue}</span>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="bg-slate-900/90 px-4 py-2 rounded-xl border border-slate-800 text-right">
                    <span className="text-[10px] text-slate-400 uppercase font-mono block">Measured Lift</span>
                    <span className="text-sm font-bold font-mono text-emerald-400">{exp.currentLift}</span>
                  </div>

                  <div className="bg-slate-900/90 px-4 py-2 rounded-xl border border-slate-800 text-right">
                    <span className="text-[10px] text-slate-400 uppercase font-mono block">Friction Reduction</span>
                    <span className="text-sm font-bold font-mono text-indigo-300">{exp.frictionReduction}</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-1 lg:grid-cols-3 gap-4 items-center text-xs">
                <div className="lg:col-span-2">
                  <span className="text-slate-400 font-semibold block mb-0.5">Hypothesis:</span>
                  <p className="text-slate-200 leading-relaxed">{exp.hypothesis}</p>
                </div>

                <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
                  <div className="flex items-center justify-between text-[11px] mb-1">
                    <span className="text-slate-400">Statistical Significance:</span>
                    <span className="font-mono text-emerald-400 font-bold">{exp.confidence}</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 rounded-full"
                      style={{ width: `${exp.sampleProgress}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-1">
                    <span>Traffic Sampled: {exp.sampleProgress}%</span>
                    <span>{exp.outcome}</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

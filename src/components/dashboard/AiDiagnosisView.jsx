import React, { useState } from 'react';
import { SeverityBadge } from '../common/StatusBadge';
import {
  FiCpu,
  FiCheckCircle,
  FiAlertTriangle,
  FiArrowRight,
  FiZap,
  FiClock,
  FiRepeat,
  FiTarget,
  FiCheck
} from 'react-icons/fi';

export function AiDiagnosisView({ diagnosisCases, backendDiagnosis, isDemoMode = true, diagnosisError, onNavigateTab }) {
  const [selectedCaseId, setSelectedCaseId] = useState('DIAG-CHECKOUT');
  const [experimentLaunched, setExperimentLaunched] = useState(false);

  if (!isDemoMode && diagnosisError) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-2 pb-2 border-b border-slate-800">
          <FiCpu className="text-indigo-400" />
          <h1 className="text-2xl font-bold text-white tracking-tight">AI Diagnosis</h1>
        </div>
        <div className="glass-panel p-10 rounded-2xl border border-slate-800 text-center text-slate-400">
          We could not load the diagnosis right now. Please try again later.
        </div>
      </div>
    );
  }

  const currentCase = isDemoMode
    ? diagnosisCases.find((c) => c.id === selectedCaseId) || diagnosisCases[0]
    : backendDiagnosis;

  if (!currentCase) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-2 pb-2 border-b border-slate-800">
          <FiCpu className="text-indigo-400" />
          <h1 className="text-2xl font-bold text-white tracking-tight">AI Diagnosis</h1>
        </div>
        <div className="glass-panel p-10 rounded-2xl border border-slate-800 text-center text-slate-400">
          <h2 className="text-lg font-semibold text-white">AI diagnosis is not available yet.</h2>
          <p className="mt-2 text-sm text-slate-400">Collect behavioral data to generate a root-cause diagnosis.</p>
        </div>
      </div>
    );
  }

  const ev = isDemoMode ? currentCase.behavioralEvidence : null;
  const confidence = currentCase.isBackendData ? currentCase.confidence : `${currentCase.confidence}%`;

  return (
    <div className="space-y-6">
      {/* View Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl font-bold text-white tracking-tight flex items-center space-x-2">
              <FiCpu className="text-indigo-400" />
              <span>AI Diagnosis</span>
            </h1>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              Evidence-Grounded
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            See what users did, why this may be happening, and what to fix next.
          </p>
        </div>

        {/* Case Switcher */}
        {isDemoMode && <div className="flex items-center space-x-2">
          <span className="text-xs text-slate-400 font-mono">Case:</span>
          <select
            value={selectedCaseId}
            onChange={(e) => setSelectedCaseId(e.target.value)}
            className="bg-slate-900 border border-slate-800 text-slate-200 text-xs rounded-lg px-3 py-1.5 focus:outline-none focus:border-indigo-500 font-medium"
          >
            {diagnosisCases.map((c) => (
              <option key={c.id} value={c.id}>
                {c.issueName} ({c.confidence}% Conf)
              </option>
            ))}
          </select>
        </div>}
      </div>

      {/* Main Issue Highlight Card */}
      <div className="glass-panel p-6 rounded-2xl border border-indigo-500/30 shadow-glow relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
          <div>
            <div className="flex items-center space-x-2 mb-1">
              {isDemoMode && <>
                <span className="font-mono text-xs text-indigo-400 font-bold">{currentCase.id}</span>
                <SeverityBadge severity={currentCase.severity} />
                <span className="text-xs font-mono text-slate-400">• {currentCase.location}</span>
              </>}
            </div>
            <h2 className="text-xl font-extrabold text-white tracking-tight">
              {currentCase.issueName}
            </h2>
          </div>

          <div className="flex items-center space-x-4">
            {/* Confidence Gauge */}
            <div className="bg-slate-900/90 px-4 py-2 rounded-xl border border-slate-800 text-right">
              <span className="text-[10px] text-slate-400 uppercase font-mono block">AI Confidence</span>
              <div className="flex items-center space-x-1.5 justify-end">
                <span className="text-xl font-bold font-mono text-emerald-400">{confidence}</span>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              </div>
            </div>

            {/* Impact Metric */}
            <div className="bg-slate-900/90 px-4 py-2 rounded-xl border border-slate-800 text-right">
              <span className="text-[10px] text-slate-400 uppercase font-mono block">Financial & User Impact</span>
              <span className="text-xs font-bold font-mono text-amber-400">{currentCase.impact}</span>
            </div>
          </div>
        </div>

        {/* Explain the sample diagnosis in plain language */}
        <div className="mt-4 flex items-center space-x-2 text-xs text-indigo-300 bg-indigo-500/10 px-3 py-2 rounded-lg border border-indigo-500/20">
          <FiTarget className="w-4 h-4 shrink-0 text-indigo-400" />
            <span>
            <strong>{isDemoMode ? 'Sample analysis:' : 'Backend diagnosis:'}</strong> {isDemoMode ? 'This example compares successful and struggling users to show where the experience may be getting in their way.' : 'This diagnosis is based on the current AWS behavioral records.'}
          </span>
        </div>
      </div>

      {/* What users did */}
      {isDemoMode && <div className="glass-panel p-6 rounded-2xl border border-slate-800">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 font-mono">
              What users did: Successful vs Struggling Users
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              The differences between users who completed the task and users who struggled
            </p>
          </div>
          <button
            onClick={() => onNavigateTab('cohorts')}
            className="text-xs text-indigo-400 hover:text-indigo-300 font-medium flex items-center space-x-1"
          >
            <span>Full Cohort Matrix</span>
            <FiArrowRight className="w-3 h-3" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* 1. Average Task Time */}
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
              <span className="font-semibold flex items-center space-x-1.5">
                <FiClock className="text-indigo-400" />
                <span>Average Task Time</span>
              </span>
              <span className="text-rose-400 font-mono font-bold">{ev.taskTime.delta}</span>
            </div>
            <div className="space-y-2 mt-3 text-xs">
              <div className="flex items-center justify-between p-2 rounded bg-emerald-950/20 border border-emerald-500/20">
                <span className="text-emerald-300">Successful users:</span>
                <span className="font-mono font-bold text-white">{ev.taskTime.successful}</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded bg-rose-950/20 border border-rose-500/20">
                <span className="text-rose-300">Struggling users:</span>
                <span className="font-mono font-bold text-rose-300">{ev.taskTime.struggling}</span>
              </div>
            </div>
          </div>

          {/* 2. Step Loop / Page Visits */}
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
              <span className="font-semibold flex items-center space-x-1.5">
                <FiRepeat className="text-indigo-400" />
                <span>Shipping-Page Visits</span>
              </span>
              <span className="text-rose-400 font-mono font-bold">{ev.shippingVisits.delta}</span>
            </div>
            <div className="space-y-2 mt-3 text-xs">
              <div className="flex items-center justify-between p-2 rounded bg-emerald-950/20 border border-emerald-500/20">
                <span className="text-emerald-300">Successful users:</span>
                <span className="font-mono font-bold text-white">{ev.shippingVisits.successful}</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded bg-rose-950/20 border border-rose-500/20">
                <span className="text-rose-300">Struggling users:</span>
                <span className="font-mono font-bold text-rose-300">{ev.shippingVisits.struggling}</span>
              </div>
            </div>
          </div>

          {/* 3. Validation Errors */}
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
              <span className="font-semibold flex items-center space-x-1.5">
                <FiAlertTriangle className="text-indigo-400" />
                <span>Validation Errors</span>
              </span>
              <span className="text-rose-400 font-mono font-bold">{ev.validationErrors.delta}</span>
            </div>
            <div className="space-y-2 mt-3 text-xs">
              <div className="flex items-center justify-between p-2 rounded bg-emerald-950/20 border border-emerald-500/20">
                <span className="text-emerald-300">Successful users:</span>
                <span className="font-mono font-bold text-white">{ev.validationErrors.successful}</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded bg-rose-950/20 border border-rose-500/20">
                <span className="text-rose-300">Struggling users:</span>
                <span className="font-mono font-bold text-rose-300">{ev.validationErrors.struggling}</span>
              </div>
            </div>
          </div>
        </div>
      </div>}

      {/* Likely Root-Cause & Supporting Proof */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Likely Root-Cause Hypothesis */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center space-x-2 text-xs font-mono text-indigo-400 mb-2 font-semibold uppercase">
              <FiTarget className="w-4 h-4" />
              <span>Why this may be happening</span>
            </div>
            <h3 className="text-base font-bold text-white mb-3">
              {currentCase.isBackendData ? 'Root Cause' : 'Silent State Reset on Async Failure'}
            </h3>
            <p className="text-sm text-slate-200 leading-relaxed bg-[#0B101E] p-4 rounded-xl border border-indigo-900/40">
              {currentCase.likelyRootCause}
            </p>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-800/80">
            <div className="text-xs font-semibold text-slate-400 uppercase font-mono mb-2">
              {currentCase.isBackendData ? 'Evidence:' : 'What users did:'}
            </div>
            <ul className="space-y-2 text-xs text-slate-300">
              {currentCase.supportingEvidenceBullets.map((bullet, idx) => (
                <li key={idx} className="flex items-start space-x-2">
                  <span className="text-indigo-400 font-mono font-bold shrink-0">•</span>
                  <span>{bullet}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Recommended Fix */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center space-x-2 text-xs font-mono text-emerald-400 mb-2 font-semibold uppercase">
              <FiCheckCircle className="w-4 h-4" />
              <span>{currentCase.isBackendData ? 'Recommended Fix' : 'Recommended Engineering & UX Fix'}</span>
            </div>
            <h3 className="text-base font-bold text-white mb-3">
              {currentCase.isBackendData ? currentCase.issueName : 'Client Form State Preservation & Inline Guidance'}
            </h3>
            <div className="bg-[#0B101E] p-4 rounded-xl border border-emerald-900/30 text-xs text-slate-200 leading-relaxed whitespace-pre-line font-mono">
              {currentCase.recommendedFix}
            </div>
          </div>

          {!currentCase.isBackendData && <div className="mt-4 pt-4 border-t border-slate-800/80">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">Implementation Complexity:</span>
              <span className="font-mono text-emerald-400 font-bold">Low (1 frontend component state patch)</span>
            </div>
            <div className="flex items-center justify-between text-xs mt-1">
              <span className="text-slate-400">Target Recovery:</span>
              <span className="font-mono text-white font-bold">~45% of stalled checkout carts</span>
            </div>
          </div>}
        </div>
      </div>

      {/* Suggested Validation Experiment Card */}
      {currentCase.suggestedExperiment && (
        <div className="glass-panel p-6 rounded-2xl border border-purple-500/30 bg-purple-950/10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-purple-500/20">
            <div>
              <div className="flex items-center space-x-2 text-xs font-mono text-purple-300">
                <FiZap className="text-purple-400" />
                <span>{isDemoMode ? `SUGGESTED VALIDATION EXPERIMENT: ${currentCase.suggestedExperiment.id}` : 'SUGGESTED VALIDATION EXPERIMENT'}</span>
              </div>
              <h3 className="text-lg font-bold text-white mt-1">
                {isDemoMode ? currentCase.suggestedExperiment.name : currentCase.suggestedExperiment}
              </h3>
            </div>
            <button
              onClick={() => setExperimentLaunched(true)}
              disabled={experimentLaunched}
              className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center space-x-2 transition-all ${
                experimentLaunched
                  ? 'bg-emerald-600 text-white cursor-default'
                  : 'bg-purple-600 hover:bg-purple-500 text-white shadow-glow'
              }`}
            >
              {experimentLaunched ? (
                <>
                  <FiCheck className="w-4 h-4" />
                  <span>Experiment Enqueued</span>
                </>
              ) : (
                <>
                  <FiZap className="w-4 h-4" />
                  <span>Launch Validation Experiment</span>
                </>
              )}
            </button>
          </div>

          {isDemoMode && <div className="mt-4 grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
            <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-800">
              <div className="text-slate-500 uppercase text-[10px] font-mono">Primary Metric</div>
              <div className="font-bold text-white mt-1">{currentCase.suggestedExperiment.primaryMetric}</div>
            </div>

            <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-800">
              <div className="text-slate-500 uppercase text-[10px] font-mono">Target Lift</div>
              <div className="font-bold text-emerald-400 font-mono text-sm mt-0.5">{currentCase.suggestedExperiment.targetLift}</div>
            </div>

            <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-800">
              <div className="text-slate-500 uppercase text-[10px] font-mono">Sample Size</div>
              <div className="font-bold text-white mt-1">{currentCase.suggestedExperiment.sampleSizeNeeded}</div>
            </div>

            <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-800">
              <div className="text-slate-500 uppercase text-[10px] font-mono">Duration</div>
              <div className="font-bold text-white mt-1">{currentCase.suggestedExperiment.estimatedDuration}</div>
            </div>
          </div>}

          {isDemoMode && <div className="mt-4 pt-3 border-t border-purple-500/20 text-xs text-slate-300">
            <span className="font-semibold text-white">Hypothesis:</span> {currentCase.suggestedExperiment.hypothesis}
          </div>}
        </div>
      )}
    </div>
  );
}

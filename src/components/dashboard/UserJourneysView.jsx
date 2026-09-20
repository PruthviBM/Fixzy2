import React, { useState } from 'react';
import { FrictionScoreBadge } from '../common/StatusBadge';
import {
  FiMap,
  FiArrowRight,
  FiAlertTriangle,
  FiClock,
  FiUsers,
  FiCpu,
  FiTrendingDown
} from 'react-icons/fi';

function formatDuration(seconds) {
  if (seconds === undefined || seconds === null || seconds === '') return '--';
  const numericSeconds = Number(seconds);
  if (!Number.isFinite(numericSeconds)) return '--';
  if (numericSeconds < 60) return `${numericSeconds}s`;
  return `${Math.floor(numericSeconds / 60)}m ${numericSeconds % 60}s`;
}

function SessionMetric({ label, value }) {
  return (
    <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-800">
      <div className="text-[10px] text-slate-500 uppercase font-mono">{label}</div>
      <div className="font-bold text-white mt-1">{value ?? '--'}</div>
    </div>
  );
}

function BackendSessionsView({ sessions }) {
  if (sessions.length === 0) {
    return (
      <div className="glass-panel p-10 rounded-2xl border border-slate-800 text-center">
        <h2 className="text-lg font-semibold text-white">No user journeys available yet.</h2>
        <p className="mt-2 text-sm text-slate-400">Connect your website or upload behavioral data to begin collecting sessions.</p>
      </div>
    );
  }

  const successfulSessions = sessions.filter((session) => session.successful);
  const strugglingSessions = sessions.filter((session) => session.struggling);
  const unclassifiedSessions = sessions.filter((session) => !session.successful && !session.struggling);

  return (
    <div className="space-y-6">
      {[
        ['Successful Journeys', successfulSessions, 'text-emerald-400'],
        ['Struggling Journeys', strugglingSessions, 'text-rose-400'],
        ['Unclassified Journeys', unclassifiedSessions, 'text-slate-400'],
      ].map(([label, groupedSessions, labelColor]) => (
        <section key={label}>
          <div className="flex items-center space-x-2 mb-3">
            <h2 className={`text-sm font-bold uppercase tracking-wider font-mono ${labelColor}`}>{label}</h2>
            <span className="text-xs text-slate-500 font-mono">{groupedSessions.length} sessions</span>
          </div>
          {groupedSessions.length === 0 ? (
            <div className="glass-panel p-6 rounded-xl border border-slate-800 text-sm text-slate-500">
              No sessions in this group.
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {groupedSessions.map((session, index) => (
                <div key={`${session.session_id || 'session'}-${index}`} className="glass-panel p-5 rounded-xl border border-slate-800">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="font-mono text-xs text-indigo-400 font-bold">{session.session_id || 'Unknown session'}</span>
                        <span className={`px-2 py-0.5 rounded text-xs font-semibold border ${session.successful ? 'text-emerald-300 bg-emerald-500/10 border-emerald-500/20' : 'text-rose-300 bg-rose-500/10 border-rose-500/20'}`}>
                          {session.successful ? 'Successful' : session.struggling ? 'Struggling' : 'Unclassified'}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400">User ID: <span className="text-slate-200 font-mono">{session.user_id || '--'}</span></p>
                    </div>
                    <div className="flex items-center space-x-2 text-xs text-slate-400">
                      <span>Duration</span>
                      <span className="font-mono font-bold text-white">{formatDuration(session.duration_seconds)}</span>
                      <span className="text-slate-600">|</span>
                      <span>Friction</span>
                      <FrictionScoreBadge score={session.friction_score} />
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 text-xs">
                    <SessionMetric label="Errors" value={session.errors} />
                    <SessionMetric label="Retries" value={session.retries} />
                    <SessionMetric label="Rage clicks" value={session.rage_clicks} />
                    <SessionMetric label="Backtracking" value={session.backtracking} />
                    <SessionMetric label="Dead clicks" value={session.dead_clicks} />
                    <SessionMetric label="Page revisits" value={session.page_revisits} />
                    <SessionMetric label="Purchase" value={session.purchase_completed ? 'Completed' : 'Not completed'} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      ))}
    </div>
  );
}

export function UserJourneysView({ journeySteps, sessions = [], isDemoMode = true, onNavigateTab }) {
  const [selectedStepId, setSelectedStepId] = useState('step-6'); // Default to Shipping (critical friction)

  if (!isDemoMode) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-2xl font-bold text-white tracking-tight flex items-center space-x-2">
                <FiMap className="text-indigo-400" />
                <span>User Journey Sessions</span>
              </h1>
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                AWS Behavioral Data
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">Review successful and struggling journeys from your real behavioral sessions.</p>
          </div>
        </div>
        <BackendSessionsView sessions={sessions} />
      </div>
    );
  }

  const selectedStep = journeySteps.find((s) => s.id === selectedStepId) || journeySteps[5];

  const getStepStatusStyle = (status) => {
    switch (status) {
      case 'critical':
        return {
          bg: 'bg-rose-950/40 border-rose-500/50 text-rose-300',
          dot: 'bg-rose-500 animate-ping',
          line: 'from-rose-500 to-rose-600',
          tag: 'CRITICAL FRICTION'
        };
      case 'warning':
        return {
          bg: 'bg-orange-950/30 border-orange-500/40 text-orange-300',
          dot: 'bg-orange-400',
          line: 'from-orange-500 to-orange-600',
          tag: 'WARNING'
        };
      case 'mild':
        return {
          bg: 'bg-amber-950/20 border-amber-500/30 text-amber-300',
          dot: 'bg-amber-400',
          line: 'from-amber-500 to-amber-600',
          tag: 'MILD HESITATION'
        };
      default:
        return {
          bg: 'bg-emerald-950/20 border-emerald-500/30 text-emerald-300',
          dot: 'bg-emerald-400',
          line: 'from-emerald-500 to-emerald-600',
          tag: 'SMOOTH FLOW'
        };
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl font-bold text-white tracking-tight flex items-center space-x-2">
              <FiMap className="text-indigo-400" />
              <span>User Journey Friction Map</span>
            </h1>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              End-to-End Funnel
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Visualizing visitor progression and isolating exact steps where cognitive friction, errors, and abandonment occur.
          </p>
        </div>

        <div className="flex items-center space-x-3 text-xs font-mono">
          <span className="flex items-center space-x-1.5 text-rose-400">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
            <span>Hotspots: Shipping & Payment</span>
          </span>
        </div>
      </div>

      {/* Interactive Visual Journey Pipeline */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 overflow-x-auto">
        <div className="min-w-[840px] pb-4">
          <div className="flex items-center justify-between text-xs text-slate-400 font-mono mb-4">
            <span>START: User Acquisition</span>
            <span>FINAL: Order Confirmation</span>
          </div>

          {/* Node Flow Track */}
          <div className="flex items-center justify-between relative">
            {journeySteps.map((step, index) => {
              const isSelected = selectedStep.id === step.id;
              const styles = getStepStatusStyle(step.status);
              const isLast = index === journeySteps.length - 1;

              return (
                <React.Fragment key={step.id}>
                  {/* Step Node Card */}
                  <div
                    onClick={() => setSelectedStepId(step.id)}
                    className={`cursor-pointer flex flex-col items-center group transition-all duration-200 z-10`}
                  >
                    <div
                      className={`w-28 p-3 rounded-xl border text-center transition-all ${
                        isSelected
                          ? 'border-indigo-400 bg-indigo-600/20 shadow-glow scale-105'
                          : `${styles.bg} hover:border-slate-600`
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] font-mono text-slate-400">0{index + 1}</span>
                        <span className={`w-2 h-2 rounded-full ${styles.dot}`}></span>
                      </div>
                      
                      <div className="font-bold text-xs text-white truncate">{step.name}</div>
                      
                      <div className="mt-2 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] font-mono">
                        <span className="text-slate-400">{step.visitors}% flow</span>
                        <span className={step.status === 'critical' ? 'text-rose-400 font-bold' : 'text-slate-400'}>
                          {step.dropoff} drop
                        </span>
                      </div>
                    </div>

                    <div className="mt-2">
                      <FrictionScoreBadge score={step.frictionScore} />
                    </div>
                  </div>

                  {/* Flow Arrow Link */}
                  {!isLast && (
                    <div className="flex-1 px-1 flex items-center justify-center relative">
                      <div className="w-full h-0.5 bg-slate-800">
                        {step.status === 'critical' && (
                          <div className="h-full bg-rose-500/80 animate-pulse"></div>
                        )}
                      </div>
                      <FiArrowRight className={`w-3.5 h-3.5 absolute ${
                        step.status === 'critical' ? 'text-rose-400 animate-pulse' : 'text-slate-600'
                      }`} />
                    </div>
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>
      </div>

      {/* Detailed Step Inspector Card */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center space-x-2 mb-1">
              <span className="text-xs font-mono text-indigo-400 uppercase font-bold">Step Inspection:</span>
              <span className="text-lg font-bold text-white">{selectedStep.name}</span>
              <span className="text-xs font-mono text-slate-400">({selectedStep.path})</span>
              <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${getStepStatusStyle(selectedStep.status).bg}`}>
                {getStepStatusStyle(selectedStep.status).tag}
              </span>
            </div>
            <p className="text-xs text-slate-300">
              Primary behavioral symptom: <strong className={selectedStep.status === 'critical' ? 'text-rose-300' : 'text-slate-200'}>{selectedStep.frictionSymptom}</strong>
            </p>
          </div>

          <div className="flex items-center space-x-2">
            {selectedStep.status === 'critical' && (
              <button
                onClick={() => onNavigateTab('diagnosis')}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center space-x-2 shadow-glow transition-all"
              >
                <FiCpu className="w-4 h-4" />
                <span>See why this may be happening</span>
              </button>
            )}
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800">
            <div className="flex items-center space-x-2 text-slate-400 text-xs mb-1">
              <FiUsers className="w-3.5 h-3.5 text-indigo-400" />
              <span>Retention at Step</span>
            </div>
            <div className="text-2xl font-bold font-mono text-white">{selectedStep.visitors}%</div>
            <div className="text-[11px] text-slate-400 mt-1">of initial cohort reaches here</div>
          </div>

          <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800">
            <div className="flex items-center space-x-2 text-slate-400 text-xs mb-1">
              <FiTrendingDown className="w-3.5 h-3.5 text-rose-400" />
              <span>Step Drop-off Rate</span>
            </div>
            <div className={`text-2xl font-bold font-mono ${selectedStep.status === 'critical' ? 'text-rose-400' : 'text-white'}`}>
              {selectedStep.dropoff}
            </div>
            <div className="text-[11px] text-slate-400 mt-1">abandon before next step</div>
          </div>

          <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800">
            <div className="flex items-center space-x-2 text-slate-400 text-xs mb-1">
              <FiClock className="w-3.5 h-3.5 text-indigo-400" />
              <span>Average Dwell Time</span>
            </div>
            <div className="text-2xl font-bold font-mono text-white">{selectedStep.avgTime}</div>
            <div className="text-[11px] text-slate-400 mt-1">duration spent on page</div>
          </div>

          <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800">
            <div className="flex items-center space-x-2 text-slate-400 text-xs mb-1">
              <FiAlertTriangle className="w-3.5 h-3.5 text-amber-400" />
              <span>Friction Score</span>
            </div>
            <div className="text-2xl font-bold font-mono text-orange-400">{selectedStep.frictionScore}/100</div>
            <div className="text-[11px] text-slate-400 mt-1">composite UX friction severity</div>
          </div>
        </div>
      </div>
    </div>
  );
}

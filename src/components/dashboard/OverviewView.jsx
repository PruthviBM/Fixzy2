import React from 'react';
import { MetricCard } from '../common/MetricCard';
import { SeverityBadge, FrictionScoreBadge } from '../common/StatusBadge';
import {
  FiAlertTriangle,
  FiClock,
  FiXCircle,
  FiZap,
  FiUsers,
  FiActivity,
  FiCpu,
  FiArrowRight
} from 'react-icons/fi';

export function OverviewView({ metrics, issues, hasData = true, onNavigateTab, onSelectIssue }) {
  const score = hasData ? metrics.overallFrictionScore : 0;

  const getScoreColor = (s) => {
    if (s >= 80) return { bg: 'bg-rose-500', text: 'text-rose-400', border: 'border-rose-500/30' };
    if (s >= 60) return { bg: 'bg-orange-500', text: 'text-orange-400', border: 'border-orange-500/30' };
    if (s >= 40) return { bg: 'bg-amber-500', text: 'text-amber-400', border: 'border-amber-500/30' };
    return { bg: 'bg-emerald-500', text: 'text-emerald-400', border: 'border-emerald-500/30' };
  };

  const scoreTheme = getScoreColor(score);

  return (
    <div className="space-y-6">
      {/* Top Banner / Headline */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-bold text-light-text dark:text-dark-text tracking-tight">Overview</h1>
          <p className="text-xs text-slate-400 mt-1">
            See where users struggle and which parts of the experience need attention.
          </p>
        </div>
        <div className="flex items-center space-x-2 text-xs font-mono">
          <span className="px-3 py-1.5 rounded-lg bg-light-surface dark:bg-dark-surface border border-light-border dark:border-dark-border text-light-textMuted dark:text-dark-textMuted">
            Window: <span className="text-indigo-400 font-semibold">Last 24 Hours</span>
          </span>
          <button
            onClick={() => onNavigateTab('diagnosis')}
            disabled={!hasData}
            className="px-3 py-1.5 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 flex items-center space-x-1.5 transition-colors font-medium"
          >
            <FiCpu className="w-3.5 h-3.5" />
            <span>Why this may be happening</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {/* 1. Overall Friction Score */}
        <div className={`p-4 rounded-xl border ${scoreTheme.border} bg-light-surface dark:bg-dark-surface relative overflow-hidden flex flex-col justify-between`}>
          <div>
            <div className="flex items-center justify-between text-xs text-slate-400 uppercase font-medium">
              <span>Friction Score</span>
              <span className="w-2 h-2 rounded-full bg-orange-400 animate-ping"></span>
            </div>
            <div className="mt-2 flex items-baseline space-x-2">
              <span className={`text-3xl font-extrabold font-mono ${hasData && metrics.overallFrictionScore !== null ? scoreTheme.text : 'text-slate-500'}`}>{hasData && metrics.overallFrictionScore !== null ? score : '--'}</span>
              {hasData && <span className="text-xs text-slate-500 font-mono">/ 100</span>}
            </div>
          </div>
          <div className="mt-3 text-[11px] text-slate-400 flex items-center justify-between border-t border-slate-800/80 pt-2">
            <span>Status:</span>
            <span className={`font-semibold ${hasData ? scoreTheme.text : 'text-slate-500'}`}>{hasData ? metrics.frictionStatus : 'No data yet'}</span>
          </div>
        </div>

        {/* 2. Abandonment Rate */}
        <MetricCard
          title="Abandonment"
          value={hasData && metrics.abandonmentRate != null ? `${metrics.abandonmentRate}%` : '--'}
          change={hasData && metrics.abandonmentRateChange != null ? `${metrics.abandonmentRateChange}%` : ''}
          isPositiveGood={false}
          subtitle={hasData ? 'Funnel Exit' : 'No data yet'}
          icon={FiXCircle}
        />

        {/* 3. Average Task Time */}
        <MetricCard
          title="Avg Task Time"
          value={hasData && metrics.avgTaskTime != null ? metrics.avgTaskTime : '--'}
          change={hasData ? metrics.avgTaskTimeChange : ''}
          isPositiveGood={false}
          subtitle={hasData ? (metrics.isDemoData ? 'Struggling: 74s' : 'Average session') : 'No data yet'}
          icon={FiClock}
        />

        {/* 4. Error Rate */}
        <MetricCard
          title={hasData && metrics.errorRate == null ? 'Errors' : 'Error Rate'}
          value={hasData && metrics.errorRate == null ? (metrics.errorCount == null ? '--' : metrics.errorCount.toLocaleString()) : hasData ? `${metrics.errorRate}%` : '--'}
          change={hasData ? metrics.errorRateChange : ''}
          isPositiveGood={false}
          subtitle={hasData ? (metrics.errorRate == null ? 'Total errors' : 'Form & API') : 'No data yet'}
          icon={FiAlertTriangle}
        />

        {/* 5. Rage Clicks */}
        <MetricCard
          title="Rage Clicks"
          value={hasData && metrics.rageClicks != null ? metrics.rageClicks.toLocaleString() : '--'}
          change={hasData ? metrics.rageClicksChange : ''}
          isPositiveGood={false}
          subtitle={hasData ? 'Rapid Clustered' : 'No data yet'}
          icon={FiZap}
        />

        {/* 6. Sessions Analyzed */}
        <MetricCard
          title="Sessions"
          value={hasData && metrics.sessionsAnalyzed != null ? metrics.sessionsAnalyzed.toLocaleString() : '--'}
          change={hasData ? metrics.sessionsAnalyzedChange : ''}
          isPositiveGood={true}
          subtitle={hasData ? (metrics.isDemoData ? 'Ingested Live' : 'Recorded sessions') : 'No data yet'}
          icon={FiUsers}
        />
      </div>

      {/* Visual Charts: Behavioral Distribution & Funnel Drop-off */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Behavioral Health Breakdown */}
        <div className="glass-panel p-5 rounded-xl border border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-white flex items-center space-x-2">
              <FiActivity className="text-indigo-400" />
              <span>User Activity</span>
            </h2>
            {hasData && <span className="text-[11px] font-mono text-slate-400">{metrics.sessionsAnalyzed.toLocaleString()} sessions</span>}
          </div>

          {hasData ? (
            <>
              <div className="space-y-4">
                {metrics.healthDistribution.map((item) => (
                  <div key={item.label}>
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className="text-slate-300 font-medium flex items-center space-x-2">
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }}></span>
                        <span>{item.label}</span>
                      </span>
                      <span className="font-mono text-slate-400">
                        <strong className="text-white">{item.percentage}%</strong> ({item.count.toLocaleString()})
                      </span>
                    </div>
                    <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full rounded-full transition-all duration-500" style={{ width: `${item.percentage}%`, backgroundColor: item.color }}></div>
                    </div>
                  </div>
                ))}
              </div>
              {metrics.isDemoData && <div className="mt-5 p-3 rounded-lg bg-slate-900/80 border border-slate-800/80 text-xs text-slate-400 leading-relaxed">
                <strong className="text-rose-400">18% Severe Obstacles</strong> represent users experiencing repetitive rage clicks, silent form wiping, or loop backtracking.
              </div>}
            </>
          ) : (
            <div className="py-8 text-center text-sm text-slate-400">
              <p className="font-semibold text-slate-300">No data yet</p>
              <p className="mt-2">Your Fixzy insights will appear here once data is available.</p>
            </div>
          )}
        </div>

        {/* Funnel Stage Friction Summary */}
        <div className="lg:col-span-2 glass-panel p-5 rounded-xl border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-sm font-bold text-white">Funnel Stage Progression & Bottlenecks</h2>
                <p className="text-xs text-slate-400 mt-0.5">Where users progress vs where friction concentrates</p>
              </div>
              <button
                onClick={() => onNavigateTab('journeys')}
                className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center space-x-1 font-medium"
              >
                <span>Full Journey Map</span>
                <FiArrowRight className="w-3 h-3" />
              </button>
            </div>

            {hasData && metrics.funnelSummary.length > 0 ? <div className="space-y-3">
              {metrics.funnelSummary.map((stage) => {
                const isCritical = stage.friction === 'Critical';
                const isHigh = stage.friction === 'High';
                return (
                  <div
                    key={stage.stage}
                    className={`p-3 rounded-lg border transition-all ${
                      isCritical
                        ? 'bg-rose-950/15 border-rose-500/30'
                        : isHigh
                        ? 'bg-orange-950/15 border-orange-500/30'
                        : 'bg-slate-900/60 border-slate-800'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center space-x-3">
                        <span className="font-semibold text-white">{stage.stage}</span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase font-bold ${
                          isCritical ? 'bg-rose-500/20 text-rose-300' :
                          isHigh ? 'bg-orange-500/20 text-orange-300' :
                          'bg-slate-800 text-slate-400'
                        }`}>
                          {stage.friction} Friction
                        </span>
                      </div>
                      <div className="flex items-center space-x-4 font-mono text-xs">
                        <span className="text-slate-400">
                          Pass-Through: <strong className="text-white">{stage.completion}</strong>
                        </span>
                        <span className={isCritical || isHigh ? 'text-rose-400 font-bold' : 'text-slate-400'}>
                          Drop-Off: {stage.drop}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div> : <div className="py-10 text-center text-sm text-slate-400"><p className="font-semibold text-slate-300">No data yet</p><p className="mt-2">Upload a dataset or connect your website to start analyzing user behavior.</p></div>}
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
            {hasData && metrics.isDemoData ? <>
              <span>Primary Obstacle: <strong className="text-rose-400">Payment & Shipping Step (42% conversion stall)</strong></span>
              <button onClick={() => onNavigateTab('diagnosis')} className="text-xs text-indigo-400 hover:underline font-semibold">Inspect Root Cause Hypothesis →</button>
            </> : <span>{hasData ? 'Your real behavioral records are ready for deeper analysis.' : 'Your Fixzy insights will appear here once data is available.'}</span>}
          </div>
        </div>
      </div>

      {/* Recent High-Impact Friction Issues Feed */}
      <div className="glass-panel p-5 rounded-xl border border-slate-800">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-sm font-bold text-white">High-Impact Friction Issues</h2>
            <p className="text-xs text-slate-400 mt-0.5">Top behavioral obstacles impacting active conversion</p>
          </div>
          {hasData && metrics.isDemoData && <button
            onClick={() => onNavigateTab('issues')}
            className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center space-x-1 font-semibold"
          >
            <span>View All 8 Issues</span>
            <FiArrowRight className="w-3.5 h-3.5" />
          </button>}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-mono uppercase text-[10px]">
                <th className="pb-3 font-semibold">Issue / Pattern</th>
                <th className="pb-3 font-semibold">Location</th>
                <th className="pb-3 font-semibold">Friction Score</th>
                <th className="pb-3 font-semibold">Affected Users</th>
                <th className="pb-3 font-semibold">Severity</th>
                <th className="pb-3 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {hasData && metrics.isDemoData ? issues.slice(0, 4).map((issue) => (
                <tr key={issue.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 font-medium text-white">
                    <div className="flex items-center space-x-2">
                      <span className="font-mono text-[10px] text-slate-500">{issue.id}</span>
                      <span className="font-bold">{issue.title}</span>
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5 max-w-md truncate">
                      {issue.evidence}
                    </div>
                  </td>
                  <td className="py-3 font-mono text-slate-300">
                    {issue.page}
                  </td>
                  <td className="py-3">
                    <FrictionScoreBadge score={issue.frictionScore} />
                  </td>
                  <td className="py-3 font-mono text-slate-300">
                    {issue.affectedUsers.toLocaleString()} users
                  </td>
                  <td className="py-3">
                    <SeverityBadge severity={issue.severity} />
                  </td>
                  <td className="py-3 text-right">
                    <button
                      onClick={() => {
                        onSelectIssue(issue);
                        onNavigateTab('diagnosis');
                      }}
                      className="px-2.5 py-1 rounded bg-indigo-600/20 hover:bg-indigo-600/40 text-indigo-300 font-medium text-xs border border-indigo-500/30 transition-colors"
                    >
                      AI Diagnose
                    </button>
                  </td>
                </tr>
              )) : <tr><td colSpan="6" className="py-10 text-center text-sm text-slate-400"><p className="font-semibold text-slate-300">No data yet</p><p className="mt-2">Upload a dataset or connect your website to start finding friction.</p></td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

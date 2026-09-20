import React from 'react';

export function SeverityBadge({ severity }) {
  const getStyles = () => {
    switch (severity?.toLowerCase()) {
      case 'critical':
        return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
      case 'high':
        return 'bg-orange-500/10 text-orange-400 border-orange-500/20';
      case 'medium':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case 'low':
      case 'smooth':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      default:
        return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
    }
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getStyles()}`}>
      <span className="w-1.5 h-1.5 rounded-full mr-1.5 bg-current opacity-80"></span>
      {severity}
    </span>
  );
}

export function FrictionScoreBadge({ score }) {
  const hasScore = score !== undefined && score !== null;
  const getColor = () => {
    if (score >= 80) return 'text-rose-400 bg-rose-500/10 border-rose-500/20';
    if (score >= 60) return 'text-orange-400 bg-orange-500/10 border-orange-500/20';
    if (score >= 40) return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
    return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-mono font-bold border ${getColor()}`}>
      {hasScore ? `${score}/100` : '--'}
    </span>
  );
}

export function StatusPill({ status }) {
  const getStyle = () => {
    switch (status?.toLowerCase()) {
      case 'active':
      case 'investigating':
        return 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20 animate-pulse';
      case 'in progress':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'completed':
      case 'winner adopted':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'triaged':
      case 'backlog':
        return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
      default:
        return 'bg-slate-500/10 text-slate-300 border-slate-500/20';
    }
  };

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${getStyle()}`}>
      {status}
    </span>
  );
}

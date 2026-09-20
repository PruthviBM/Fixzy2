import React from 'react';

export function MetricCard({ title, value, change, isPositiveGood = true, subtitle, icon: Icon, badge }) {
  const isChangePositive = change && change.startsWith('+');
  
  // In friction analytics:
  // e.g. lower abandonment is good (isPositiveGood = false for abandonment)
  let changeColor = 'text-slate-400';
  if (change) {
    if (isPositiveGood) {
      changeColor = isChangePositive ? 'text-emerald-400' : 'text-rose-400';
    } else {
      changeColor = isChangePositive ? 'text-rose-400' : 'text-emerald-400';
    }
  }

  return (
    <div className="glass-panel p-5 rounded-xl border border-slate-800/80 hover:border-slate-700/80 transition-all duration-200">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-medium uppercase tracking-wider text-slate-400">{title}</span>
        {Icon && (
          <div className="p-2 rounded-lg bg-slate-800/60 text-indigo-400">
            <Icon className="w-4 h-4" />
          </div>
        )}
      </div>

      <div className="flex items-baseline space-x-3">
        <span className="text-2xl font-bold font-mono tracking-tight text-white">{value}</span>
        {badge && (
          <span className="text-xs px-2 py-0.5 rounded font-medium bg-slate-800 text-slate-300 border border-slate-700">
            {badge}
          </span>
        )}
      </div>

      <div className="mt-2 flex items-center justify-between text-xs">
        {change && (
          <span className={`font-mono font-medium flex items-center ${changeColor}`}>
            {change} vs last period
          </span>
        )}
        {subtitle && <span className="text-slate-400 ml-auto">{subtitle}</span>}
      </div>
    </div>
  );
}

import React from 'react';
import { FiDatabase, FiArrowRight } from 'react-icons/fi';
import { useAppState } from '../../context/AppContext';

// Reusable empty state for any dashboard view that needs data
export function EmptyState({
  title = 'No behavioral data yet',
  description = 'Connect your website or upload a dataset to start analyzing user friction.',
  showActions = true,
}) {
  const { openModal } = useAppState();

  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 text-center max-w-lg mx-auto">
      {/* Icon */}
      <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-5">
        <FiDatabase className="w-6 h-6 text-slate-400 dark:text-slate-500" />
      </div>

      <h2 className="text-xl font-bold text-light-text dark:text-dark-text mb-2">{title}</h2>
      <p className="text-sm text-light-textMuted dark:text-dark-textMuted mb-8 leading-relaxed">{description}</p>

      {showActions && (
        <>
          <div className="flex flex-col sm:flex-row gap-3 mb-8">
            <button
              onClick={() => openModal('connect-website')}
              className="px-5 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm flex items-center justify-center space-x-2 shadow-sm transition-all"
            >
              <span>Connect Website</span>
              <FiArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => openModal('upload-dataset')}
              className="px-5 py-2.5 rounded-lg bg-light-surface dark:bg-dark-surfaceAlt text-light-text dark:text-dark-text font-semibold text-sm border border-light-border dark:border-dark-border shadow-sm hover:bg-light-surfaceAlt dark:hover:bg-dark-border transition-all"
            >
              Upload Dataset
            </button>
          </div>

        </>
      )}
    </div>
  );
}

// Small banner for demo mode shown at the top of all analysis views
export function DemoBanner({ onExitDemo, onConnectReal }) {
  return (
    <div className="mb-4 flex items-center justify-between px-4 py-2.5 rounded-xl bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-700/40 text-xs">
      <div className="flex items-center space-x-2">
        <span className="px-2 py-0.5 rounded font-bold text-[10px] bg-purple-200 dark:bg-purple-700 text-purple-800 dark:text-purple-200 uppercase tracking-wide demo-badge">
          DEMO / SAMPLE DATA
        </span>
        <span className="text-purple-700 dark:text-purple-300 font-medium">
          Showing example checkout funnel data. This is not your real product analytics.
        </span>
      </div>
      <div className="flex items-center space-x-2 ml-4 shrink-0">
        <button
          onClick={onConnectReal}
          className="px-3 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-[11px] transition-colors"
        >
          Connect Real Website
        </button>
        <button
          onClick={onExitDemo}
          className="px-3 py-1 rounded-lg text-purple-700 dark:text-purple-300 hover:bg-purple-100 dark:hover:bg-purple-900/30 font-medium text-[11px] transition-colors"
        >
          Exit Demo
        </button>
      </div>
    </div>
  );
}

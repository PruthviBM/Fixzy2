import React from 'react';
import { useAppState } from '../../context/AppContext';
import {
  FiPieChart, FiDatabase, FiAlertTriangle,
  FiMap, FiCpu, FiZap, FiLock, FiChevronRight,
  FiLayers, FiSlash
} from 'react-icons/fi';

export function Sidebar({ activeTab, setActiveTab }) {
  const { dataSource, openModal } = useAppState();
  const hasData = dataSource !== 'none';
  const isDemo = dataSource === 'demo';

  const navGroups = [
    {
      label: 'MAIN',
      items: [
        {
          id: 'overview',
          label: 'Overview',
          icon: FiPieChart,
          alwaysEnabled: true,
        },
        {
          id: 'sources',
          label: 'Data Sources',
          icon: FiDatabase,
          alwaysEnabled: true,
          badge: hasData ? null : 'Setup',
          badgeColor: 'bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-700',
        },
      ]
    },
    {
      label: 'ANALYSIS',
      items: [
        {
          id: 'issues',
          label: 'Problems',
          icon: FiAlertTriangle,
          requiresData: true,
          badge: hasData ? '8' : null,
          badgeColor: 'bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-700',
        },
        {
          id: 'journeys',
          label: 'User Journeys',
          icon: FiMap,
          requiresData: true,
        },
        {
          id: 'diagnosis',
          label: 'AI Diagnosis',
          icon: FiCpu,
          requiresData: true,
          badge: hasData ? 'AI' : null,
          badgeColor: 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 border-indigo-200 dark:border-indigo-700',
        },
        {
          id: 'cohorts',
          label: 'Cohort Compare',
          icon: FiLayers,
          requiresData: true,
        },
        {
          id: 'agents',
          label: 'Human vs AI-Agent Activity',
          icon: FiSlash,
          requiresData: true,
        },
        {
          id: 'trends',
          label: 'Trends',
          icon: FiZap,
          requiresData: true,
        },
        {
          id: 'experiments',
          label: 'Test the Fix',
          icon: FiZap,
          requiresData: true,
        },
      ]
    },
    {
      label: 'SETTINGS',
      items: [
        { id: 'privacy', label: 'Privacy & Masking', icon: FiLock, alwaysEnabled: true },
      ]
    }
  ];

  const handleTabClick = (item) => {
    if (item.requiresData && !hasData) {
      openModal('connect-website');
      return;
    }
    setActiveTab(item.id);
  };

  return (
    <aside className="w-60 flex flex-col shrink-0 min-h-[calc(100vh-3.5rem)] bg-light-surface dark:bg-dark-bg border-r border-light-border dark:border-dark-border">
      
      {/* Source context banner */}
      {hasData && (
        <div className={`mx-3 mt-3 px-3 py-2 rounded-lg border text-xs ${
          isDemo
            ? 'bg-purple-50 dark:bg-purple-900/15 border-purple-200 dark:border-purple-700/40 text-purple-700 dark:text-purple-300'
            : dataSource === 'live'
            ? 'bg-emerald-50 dark:bg-emerald-900/15 border-emerald-200 dark:border-emerald-700/40 text-emerald-700 dark:text-emerald-400'
            : 'bg-indigo-50 dark:bg-indigo-900/15 border-indigo-200 dark:border-indigo-700/40 text-indigo-700 dark:text-indigo-400'
        }`}>
          <div className="flex items-center justify-between mb-0.5">
            <span className="font-semibold uppercase tracking-wider text-[10px]">
              {isDemo ? '⚡ DEMO MODE' : dataSource === 'live' ? '● LIVE' : '● UPLOADED'}
            </span>
          </div>
          <span className="leading-tight block">
              {isDemo ? 'You are viewing sample data' : dataSource === 'live' ? 'Real-time stream active' : 'Uploaded session data'}
          </span>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-5 overflow-y-auto">
        {navGroups.map((group) => (
          <div key={group.label}>
            <div className="px-2 mb-1.5 text-[10px] font-bold uppercase tracking-widest text-light-textSubtle dark:text-dark-textSubtle">
              {group.label}
            </div>
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                const isLocked = item.requiresData && !hasData;

                return (
                  <button
                    key={item.id}
                    onClick={() => handleTabClick(item)}
                    className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs font-medium transition-all group ${
                      isLocked
                        ? 'opacity-40 cursor-pointer hover:opacity-60'
                        : isActive
                        ? 'bg-indigo-50 dark:bg-indigo-900/25 text-indigo-700 dark:text-indigo-300 font-semibold'
                        : 'text-light-textMuted dark:text-dark-textMuted hover:bg-light-surfaceAlt dark:hover:bg-dark-surfaceAlt hover:text-light-text dark:hover:text-dark-text'
                    }`}
                  >
                    <div className="flex items-center space-x-2.5">
                      <Icon className={`w-3.5 h-3.5 ${
                        isActive ? 'text-indigo-600 dark:text-indigo-400' : ''
                      }`} />
                      <span className="truncate">{item.label}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      {isLocked && (
                        <span className="text-[9px] font-mono text-light-textSubtle dark:text-dark-textSubtle border border-light-border dark:border-dark-borderStrong px-1 rounded">
                          connect
                        </span>
                      )}
                      {item.badge && !isLocked && (
                        <span className={`text-[10px] px-1.5 py-0.5 rounded border font-mono ${item.badgeColor}`}>
                          {item.badge}
                        </span>
                      )}
                      {isActive && !isLocked && (
                        <FiChevronRight className="w-3 h-3 text-indigo-400" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-3 border-t border-light-border dark:border-dark-border">
        <div className="p-2.5 rounded-lg bg-light-surfaceAlt dark:bg-dark-surfaceAlt border border-light-border dark:border-dark-border text-xs text-light-textMuted dark:text-dark-textMuted">
          <div className="flex items-center space-x-2 mb-1">
            <FiCpu className="w-3 h-3 text-indigo-500" />
            <span className="font-semibold text-light-text dark:text-dark-text">Fixzy Diagnosis Engine</span>
          </div>
          <p className="text-[11px] leading-relaxed">
            {hasData ? 'Behavioral analysis active.' : 'Connect a data source to activate analysis.'}
          </p>
        </div>
      </div>
    </aside>
  );
}

import React, { useState } from 'react';
import { useTheme } from '../../context/AppContext';
import { useAppState } from '../../context/AppContext';
import { useAuth } from '../../auth/AuthContext';
import { API_BASE_URL } from '../../services/api';
import {
  FiZap, FiSun, FiMoon, FiSettings, FiUser, FiWifi,
  FiUpload, FiX, FiClock, FiHelpCircle, FiLogOut
} from 'react-icons/fi';

// ===== DATA SOURCE STATUS BADGE =====
function DataSourceBadge({ source, meta, onDisconnect, openModal }) {
  if (source === 'none') {
    return (
      <div className="flex items-center space-x-2">
        <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700/40 text-xs text-amber-700 dark:text-amber-400">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
          <span className="font-medium">Not connected</span>
        </div>
        <button
          onClick={() => openModal('connect-website')}
          className="px-2.5 py-1.5 text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg transition-colors"
        >
          Connect →
        </button>
      </div>
    );
  }
  if (source === 'demo') {
    return (
      <div className="flex items-center space-x-2">
        <div className="demo-badge flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-700/40 text-xs text-purple-700 dark:text-purple-300">
          <span className="w-1.5 h-1.5 rounded-full bg-purple-400"></span>
          <span className="font-semibold">Demo Data</span>
        </div>
        <button
          onClick={onDisconnect}
          className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 rounded transition-colors"
          title="Exit Demo"
        >
          <FiX className="w-3.5 h-3.5" />
        </button>
      </div>
    );
  }
  if (source === 'live') {
    return (
      <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-700/40 text-xs text-emerald-700 dark:text-emerald-400">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
        <FiWifi className="w-3 h-3" />
        <span className="font-medium">Live Website</span>
        {meta?.domain && <span className="text-emerald-500/70 dark:text-emerald-500/60 font-mono">{meta.domain}</span>}
      </div>
    );
  }
  if (source === 'upload') {
    return (
      <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-700/40 text-xs text-indigo-700 dark:text-indigo-400">
        <span className="w-1.5 h-1.5 rounded-full bg-indigo-400"></span>
        <FiUpload className="w-3 h-3" />
        <span className="font-medium">Uploaded Dataset</span>
        {meta?.filename && <span className="text-indigo-400/70 font-mono truncate max-w-[120px]">{meta.filename}</span>}
      </div>
    );
  }
  return null;
}

// ===== MAIN NAVBAR =====
export function Navbar({ isDashboard, setIsDashboard }) {
  const { appliedMode, toggleTheme } = useTheme();
  const { dataSource, dataSourceMeta, disconnectSource, openModal } = useAppState();
  const { user, signOut } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isAwsConfigured = Boolean(API_BASE_URL);

  const goTo = (path) => {
    window.history.pushState({}, '', path);
    window.dispatchEvent(new PopStateEvent('popstate'));
    setIsMenuOpen(false);
  };

  const handleLogout = () => {
    signOut();
    window.history.replaceState({}, '', '/login');
    window.dispatchEvent(new PopStateEvent('popstate'));
  };

  return (
    <header className="sticky top-0 z-50 border-b border-light-border dark:border-dark-border bg-light-surface/90 dark:bg-dark-bg/90 backdrop-blur-md">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-14">

          {/* Brand */}
          <button
            onClick={() => setIsDashboard(false)}
            className="flex items-center space-x-2.5 hover:opacity-80 transition-opacity"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-600 to-indigo-400 flex items-center justify-center shadow-sm">
              <FiZap className="w-4 h-4 text-white" />
            </div>
            <span className="text-base font-bold tracking-tight text-light-text dark:text-dark-text font-mono">
              Fixzy
            </span>
          </button>

          {/* Center: Data Source Status */}
          <div className="hidden md:flex items-center space-x-2">
            <span className="text-xs text-light-textMuted dark:text-dark-textMuted font-medium">Data Source:</span>
            <DataSourceBadge
              source={dataSource}
              meta={dataSourceMeta}
              onDisconnect={disconnectSource}
              openModal={openModal}
            />
          </div>

          {/* Right: Theme Toggle + Profile */}
          <div className="flex items-center space-x-2">
            {/* AWS indicator (compact) */}
            {isAwsConfigured && dataSource === 'live' && (
              <div className="hidden lg:flex items-center space-x-1 text-[11px] font-mono text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 px-2 py-1 rounded border border-emerald-200 dark:border-emerald-700/40">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>AWS Gateway</span>
              </div>
            )}

            {/* Dashboard / Tour Switcher */}
            <div className="hidden sm:flex items-center bg-light-surfaceAlt dark:bg-dark-surfaceAlt rounded-lg p-0.5 border border-light-border dark:border-dark-border">
              <button
                onClick={() => setIsDashboard(false)}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                  !isDashboard
                    ? 'bg-white dark:bg-dark-surface text-light-text dark:text-dark-text shadow-sm'
                    : 'text-light-textMuted dark:text-dark-textMuted hover:text-light-text dark:hover:text-dark-text'
                }`}
              >
                Home
              </button>
              <button
                onClick={() => setIsDashboard(true)}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                  isDashboard
                    ? 'bg-white dark:bg-dark-surface text-light-text dark:text-dark-text shadow-sm'
                    : 'text-light-textMuted dark:text-dark-textMuted hover:text-light-text dark:hover:text-dark-text'
                }`}
              >
                Dashboard
              </button>
            </div>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-light-textMuted dark:text-dark-textMuted hover:bg-light-surfaceAlt dark:hover:bg-dark-surfaceAlt hover:text-light-text dark:hover:text-dark-text transition-all"
              title={`Switch to ${appliedMode === 'light' ? 'dark' : 'light'} mode`}
            >
              {appliedMode === 'light' ? (
                <FiMoon className="w-4 h-4" />
              ) : (
                <FiSun className="w-4 h-4" />
              )}
            </button>

            {/* Settings */}
            <button
              onClick={() => openModal('settings')}
              className="p-2 rounded-lg text-light-textMuted dark:text-dark-textMuted hover:bg-light-surfaceAlt dark:hover:bg-dark-surfaceAlt hover:text-light-text dark:hover:text-dark-text transition-all"
              title="Settings"
            >
              <FiSettings className="w-4 h-4" />
            </button>

            {/* Avatar */}
            <div className="relative">
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} aria-expanded={isMenuOpen} aria-label="Open profile menu" className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center text-indigo-600 dark:text-indigo-400 hover:ring-2 hover:ring-indigo-300 dark:hover:ring-indigo-600 transition-all">
                {user?.fullName ? <span className="text-xs font-bold">{user.fullName[0]}</span> : <FiUser className="w-4 h-4" />}
              </button>
              {isMenuOpen && (
                <div className="absolute right-0 top-11 z-50 w-56 rounded-xl border border-light-border dark:border-dark-border bg-light-surface dark:bg-dark-surface shadow-xl p-2">
                  <div className="px-3 py-2 border-b border-light-border dark:border-dark-border mb-1"><p className="text-sm font-semibold text-light-text dark:text-dark-text truncate">{user?.fullName}</p><p className="text-xs text-light-textMuted dark:text-dark-textMuted truncate">{user?.email}</p></div>
                  <MenuItem icon={FiUser} label="Profile" onClick={() => goTo('/profile')} />
                  <MenuItem icon={FiSettings} label="Account Settings" onClick={() => goTo('/settings')} />
                  <MenuItem icon={FiClock} label="Activity History" onClick={() => goTo('/activity')} />
                  <MenuItem icon={appliedMode === 'light' ? FiMoon : FiSun} label={`Theme: ${appliedMode === 'light' ? 'Dark' : 'Light'}`} onClick={() => { toggleTheme(); setIsMenuOpen(false); }} />
                  <MenuItem icon={FiHelpCircle} label="Help" onClick={() => window.open('mailto:support@fixzy.ai', '_blank')} />
                  <div className="my-1 border-t border-light-border dark:border-dark-border" />
                  <MenuItem icon={FiLogOut} label="Logout" danger onClick={handleLogout} />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile data source row */}
      <div className="md:hidden flex items-center justify-between px-4 pb-2 border-t border-light-border dark:border-dark-border pt-2">
        <span className="text-xs text-light-textMuted dark:text-dark-textMuted">Data Source:</span>
        <DataSourceBadge
          source={dataSource}
          meta={dataSourceMeta}
          onDisconnect={disconnectSource}
          openModal={openModal}
        />
      </div>
    </header>
  );
}

function MenuItem({ icon: Icon, label, onClick, danger = false }) {
  return <button onClick={onClick} className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-left ${danger ? 'text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30' : 'text-light-text dark:text-dark-text hover:bg-light-surfaceAlt dark:hover:bg-dark-surfaceAlt'}`}><Icon className="w-4 h-4" />{label}</button>;
}

import React, { createContext, useContext, useState, useEffect } from 'react';

// ===== THEME CONTEXT =====
const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('fixzy_theme') || 'system';
  });

  // Derived: actual applied mode (light or dark)
  const [appliedMode, setAppliedMode] = useState('light');

  useEffect(() => {
    const applyTheme = (t) => {
      let mode;
      if (t === 'system') {
        mode = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      } else {
        mode = t;
      }
      setAppliedMode(mode);
      if (mode === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    };

    applyTheme(theme);
    localStorage.setItem('fixzy_theme', theme);

    // Listen for system changes if in system mode
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = () => { if (theme === 'system') applyTheme('system'); };
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => {
      if (prev === 'system') return appliedMode === 'light' ? 'dark' : 'light';
      return prev === 'light' ? 'dark' : 'light';
    });
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, appliedMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}

// ===== APP STATE CONTEXT =====
// dataSource: 'none' | 'demo' | 'live' | 'upload'
const AppStateContext = createContext(null);

export function AppStateProvider({ children }) {
  const [dataSource, setDataSource] = useState('none');
  // Metadata for the active source
  const [dataSourceMeta, setDataSourceMeta] = useState(null);
  // Active modal: null | 'connect-website' | 'upload-dataset' | 'interactive-demo' | 'settings'
  const [activeModal, setActiveModal] = useState(null);

  const connectLive = (meta) => {
    setDataSourceMeta(meta);
    setDataSource('live');
    setActiveModal(null);
  };

  const connectUpload = (meta) => {
    setDataSourceMeta(meta);
    setDataSource('upload');
    setActiveModal(null);
  };

  const enterDemo = () => {
    setDataSource('demo');
    setDataSourceMeta({ label: 'Sample Checkout Journey', sessions: 2 });
    setActiveModal(null);
  };

  const disconnectSource = () => {
    setDataSource('none');
    setDataSourceMeta(null);
  };

  const openModal = (name) => {
    if (dataSource === 'demo' && (name === 'connect-website' || name === 'upload-dataset')) {
      setDataSource('none');
      setDataSourceMeta(null);
      window.history.replaceState({}, '', '/login');
      window.dispatchEvent(new PopStateEvent('popstate'));
      return;
    }
    setActiveModal(name);
  };
  const closeModal = () => setActiveModal(null);

  return (
    <AppStateContext.Provider value={{
      dataSource,
      dataSourceMeta,
      activeModal,
      connectLive,
      connectUpload,
      enterDemo,
      disconnectSource,
      openModal,
      closeModal,
    }}>
      {children}
    </AppStateContext.Provider>
  );
}

export function useAppState() {
  return useContext(AppStateContext);
}

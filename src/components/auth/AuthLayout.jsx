import React from 'react';
import { FiActivity, FiArrowLeft, FiZap } from 'react-icons/fi';

export function AuthLayout({ children, onBack }) {
  return (
    <main className="min-h-screen bg-[#0B0F19] text-white flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(99,102,241,0.2),transparent_35%),radial-gradient(circle_at_90%_80%,rgba(16,185,129,0.12),transparent_30%)]" />
      <div className="relative w-full max-w-5xl grid lg:grid-cols-[0.9fr_1.1fr] gap-10 items-center">
        <section className="hidden lg:block px-8">
          <div className="flex items-center gap-2.5 mb-10">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center shadow-glow"><FiZap /></div>
            <span className="font-bold text-xl tracking-tight">Fixzy</span>
          </div>
          <p className="text-xs uppercase tracking-[0.24em] text-indigo-300 mb-5">Behavioral intelligence for product teams</p>
          <h1 className="text-5xl font-extrabold leading-[1.08] tracking-tight">Find the Friction.<br /><span className="text-indigo-300">Fix the Experience.</span></h1>
          <p className="mt-6 text-slate-400 max-w-md leading-relaxed">See where users struggle, understand why it happens, and turn evidence into a better product experience.</p>
          <div className="mt-10 flex items-center gap-3 text-sm text-slate-400"><FiActivity className="text-emerald-400" /> Your workspace, ready when you are.</div>
        </section>
        <section className="bg-white dark:bg-dark-surface rounded-2xl border border-slate-200 dark:border-dark-border shadow-2xl p-6 sm:p-9 text-light-text dark:text-dark-text">
          {onBack && <button onClick={onBack} className="mb-5 flex items-center gap-2 text-sm text-light-textMuted dark:text-dark-textMuted hover:text-light-text dark:hover:text-dark-text"><FiArrowLeft /> Back to home</button>}
          {children}
        </section>
      </div>
    </main>
  );
}

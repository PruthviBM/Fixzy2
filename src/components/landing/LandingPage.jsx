import React from 'react';
import { motion } from 'framer-motion';
import { FiArrowRight, FiCheckCircle, FiCompass, FiTarget, FiTrendingUp } from 'react-icons/fi';

export function LandingPage({ onOpenDashboard }) {
  const benefits = [
    { icon: FiCompass, title: 'Behavioral Insights', description: 'Detect meaningful friction from clicks, errors, retries, hesitation, navigation, and other user behavior.' },
    { icon: FiTarget, title: 'Root-Cause Analysis', description: 'Understand why users may be struggling by comparing successful and struggling journeys.' },
    { icon: FiCheckCircle, title: 'Actionable Recommendations', description: 'Get clear recommendations for what to change instead of only seeing where users drop off.' },
    { icon: FiTrendingUp, title: 'Measure the Impact', description: 'Test improvements and track whether the user experience actually gets better.' }
  ];

  return (
    <div className="min-h-screen bg-[#0B0F19] text-slate-100 selection:bg-indigo-500 selection:text-white">
      <section className="relative pt-20 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-medium mb-8">
          <span className="w-2 h-2 rounded-full bg-indigo-400" />
          <span>Behavioral intelligence for digital products</span>
        </motion.div>
        <motion.h1 initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }} className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white max-w-5xl mx-auto leading-tight">
          Find the Friction. <br /><span className="gradient-text">Fix the Experience.</span>
        </motion.h1>
        <motion.p initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }} className="mt-6 text-lg text-slate-300 max-w-3xl mx-auto leading-relaxed">
          Fixzy is an AI-powered behavioral diagnosis layer for digital products. It observes real user interactions, detects meaningful friction, compares successful and struggling journeys, explains likely root causes, and recommends what teams should fix next.
        </motion.p>
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }} className="mt-10">
          <button onClick={onOpenDashboard} className="px-8 py-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-base inline-flex items-center space-x-3 shadow-glow transition-all hover:scale-[1.02]">
            <span>Get started</span><FiArrowRight className="w-5 h-5" />
          </button>
        </motion.div>
      </section>

      <section className="py-20 bg-[#080C15] border-y border-slate-800/80">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center max-w-3xl mx-auto mb-12">
            <p className="text-xs uppercase tracking-widest font-mono text-indigo-400 mb-3">WHY FIXZY IS DIFFERENT</p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">Behavioral root-cause analysis</h2>
            <p className="mt-4 text-slate-400 leading-relaxed">Fixzy looks beyond surface-level metrics to understand what users actually did, identify where they struggled, and explain why the friction may be happening.</p>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="grid md:grid-cols-2 gap-4">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
              <p className="text-xs uppercase tracking-widest text-indigo-400 font-semibold mb-3">Example diagnosis</p>
              <h3 className="text-xl font-bold text-white">Users are spending significantly longer in the checkout flow before abandoning.</h3>
              <p className="mt-5 text-xs uppercase tracking-widest text-slate-500 font-semibold">What users did</p>
              <p className="mt-2 text-sm text-slate-300 leading-relaxed">The journey shows extra hesitation and repeated attempts before users leave.</p>
            </div>
            <div className="rounded-2xl border border-indigo-500/30 bg-indigo-950/20 p-6">
              <p className="text-xs uppercase tracking-widest text-indigo-400 font-semibold mb-3">Likely cause</p>
              <h3 className="text-xl font-bold text-white">Checkout friction may be creating hesitation or uncertainty.</h3>
              <p className="mt-5 text-xs uppercase tracking-widest text-slate-500 font-semibold">What Fixzy gives you</p>
              <p className="mt-2 text-sm text-slate-300 leading-relaxed">A clear direction for what to investigate and improve next.</p>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center max-w-3xl mx-auto mb-12">
          <p className="text-xs uppercase tracking-widest font-mono text-indigo-400 mb-3">WHAT FIXZY GIVES YOU</p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">From user behavior to actionable fixes</h2>
          <p className="mt-4 text-slate-400 leading-relaxed">Fixzy turns behavioral signals into clear insights, root-cause explanations, and practical improvements.</p>
        </motion.div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {benefits.map(({ icon: Icon, title, description }, index) => (
            <motion.div key={title} initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: index * 0.06 }} className="rounded-xl border border-slate-800 bg-slate-900/50 p-5">
              <div className="w-10 h-10 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mb-4"><Icon className="w-5 h-5 text-indigo-400" /></div>
              <h3 className="text-base font-bold text-white mb-2">{title}</h3>
              <p className="text-sm text-slate-400 leading-relaxed">{description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="py-16 bg-gradient-to-b from-[#0B0F19] to-[#0d1424] border-t border-slate-800">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-extrabold text-white mb-4">Ready to Find the Friction in Your Product?</h2>
          <p className="text-slate-400 text-sm max-w-xl mx-auto mb-8">Understand user behavior, discover why users struggle, and find what to fix next.</p>
          <button onClick={onOpenDashboard} className="px-8 py-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-base inline-flex items-center space-x-3 shadow-glow transition-all hover:scale-[1.02]">
            <span>Get started</span><FiArrowRight className="w-5 h-5" />
          </button>
        </div>
      </section>

      <footer className="border-t border-slate-800 px-4 py-6 text-center text-xs text-slate-500">Fixzy · Behavioral intelligence for better digital products</footer>
    </div>
  );
}

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiArrowRight, FiClock, FiAlertTriangle, FiRefreshCw, FiCheckCircle, FiZap } from 'react-icons/fi';
import { useAppState } from '../../context/AppContext';

// ===== DEMO DATA — clearly isolated, never sent to AWS =====
const DEMO_JOURNEYS = [
  {
    id: 'successful',
    label: 'Successful User',
    color: 'emerald',
    steps: [
      { name: 'Landing Page', time: '2s', status: 'ok' },
      { name: 'Product Selection', time: '8s', status: 'ok' },
      { name: 'Checkout', time: '5s', status: 'ok' },
      { name: 'Payment', time: '3s', status: 'ok', outcome: 'Purchased ✓' },
    ],
    totalTime: '18 seconds',
    outcome: 'success',
  },
  {
    id: 'struggling',
    label: 'Struggling User',
    color: 'rose',
    steps: [
      { name: 'Landing Page', time: '3s', status: 'ok' },
      { name: 'Product Selection', time: '9s', status: 'ok' },
      { name: 'Checkout', time: '22s', status: 'error', note: 'Validation error — retried 3x' },
      { name: 'Back to Product', time: '8s', status: 'warn', note: 'Went back (backtracking)' },
      { name: 'Checkout (again)', time: '18s', status: 'error', note: 'Another validation error' },
      { name: 'Abandoned', time: '14s', status: 'abandon', outcome: 'Left the site ✗' },
    ],
    totalTime: '74 seconds',
    outcome: 'abandoned',
  },
];

const DEMO_DIAGNOSIS = {
  problem: 'Users are struggling during checkout.',
  observations: [
    'Repeated form validation errors (61% error rate)',
    'Multiple retries (avg 3.7 attempts vs 1.0 for successful users)',
    'Significantly longer task time (74s vs 18s)',
    'High backtracking rate (users navigated back to product page)',
  ],
  recommendation: 'Improve inline validation and error messaging so users understand what is wrong before submitting.',
  experiment: 'Test real-time field validation (show errors as user types, not just on submit).',
};

function StepNode({ step, index }) {
  const colors = {
    ok: 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-700 text-emerald-700 dark:text-emerald-300',
    error: 'bg-rose-50 dark:bg-rose-900/20 border-rose-200 dark:border-rose-700 text-rose-700 dark:text-rose-300',
    warn: 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-700 text-amber-700 dark:text-amber-300',
    abandon: 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-600 text-slate-500 dark:text-slate-400',
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.12 }}
      className="flex items-start space-x-3"
    >
      <div className="flex flex-col items-center">
        <div className={`w-7 h-7 rounded-full border-2 flex items-center justify-center text-[10px] font-bold ${colors[step.status]}`}>
          {index + 1}
        </div>
        {index < 10 && <div className="w-0.5 h-5 bg-light-border dark:bg-dark-border mt-0.5"></div>}
      </div>
      <div className="flex-1 pb-4">
        <div className="flex items-center space-x-2">
          <span className="text-sm font-semibold text-light-text dark:text-dark-text">{step.name}</span>
          <span className="text-xs font-mono text-light-textMuted dark:text-dark-textMuted bg-light-surfaceAlt dark:bg-dark-surfaceAlt px-1.5 py-0.5 rounded border border-light-border dark:border-dark-border">{step.time}</span>
        </div>
        {step.note && (
          <p className="text-xs text-light-textMuted dark:text-dark-textMuted mt-0.5">{step.note}</p>
        )}
        {step.outcome && (
          <span className={`inline-block mt-1 text-xs font-semibold px-2 py-0.5 rounded ${colors[step.status]}`}>
            {step.outcome}
          </span>
        )}
      </div>
    </motion.div>
  );
}

export function InteractiveDemoModal() {
  const { closeModal, enterDemo } = useAppState();
  const [phase, setPhase] = useState('intro'); // intro | journey | diagnosis

  const handleStartDemo = () => setPhase('journey');
  const handleSeeDiagnosis = () => setPhase('diagnosis');
  const handleExploreDemo = () => {
    enterDemo();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.97 }}
        className="bg-light-surface dark:bg-dark-surface rounded-2xl border border-light-border dark:border-dark-border shadow-2xl max-w-3xl w-full max-h-[85vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-light-border dark:border-dark-border">
          <div>
            <div className="flex items-center space-x-2 mb-0.5">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-700 demo-badge">
                DEMO / SAMPLE DATA
              </span>
            </div>
            <h2 className="text-lg font-bold text-light-text dark:text-dark-text">See how Fixzy works</h2>
            <p className="text-xs text-light-textMuted dark:text-dark-textMuted">Interactive Demo — Sample Checkout Funnel</p>
          </div>
          <button
            onClick={closeModal}
            className="p-2 rounded-lg hover:bg-light-surfaceAlt dark:hover:bg-dark-surfaceAlt text-light-textMuted dark:text-dark-textMuted transition-colors"
          >
            <FiX className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5">
          <AnimatePresence mode="wait">
            {/* ===== INTRO PHASE ===== */}
            {phase === 'intro' && (
              <motion.div
                key="intro"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-5"
              >
                <p className="text-sm text-light-text dark:text-dark-text leading-relaxed">
                  This demo walks you through a real scenario where Fixzy detects a friction problem
                  in a checkout funnel, compares two types of users, and produces an actionable diagnosis.
                </p>

                <div className="p-4 rounded-xl bg-light-surfaceAlt dark:bg-dark-surfaceAlt border border-light-border dark:border-dark-border">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-light-textMuted dark:text-dark-textMuted mb-3">
                    Sample Journey: E-Commerce Checkout
                  </h3>
                  <div className="flex items-center space-x-2 flex-wrap gap-y-2 text-sm">
                    {['Landing Page', 'Product Selection', 'Checkout', 'Payment'].map((step, i, arr) => (
                      <React.Fragment key={step}>
                        <span className="font-medium text-light-text dark:text-dark-text">{step}</span>
                        {i < arr.length - 1 && <FiArrowRight className="w-3.5 h-3.5 text-light-textSubtle dark:text-dark-textSubtle" />}
                      </React.Fragment>
                    ))}
                  </div>
                </div>

                <button
                  onClick={handleStartDemo}
                  className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm flex items-center justify-center space-x-2 transition-colors shadow-sm"
                >
                  <FiZap className="w-4 h-4" />
                  <span>Try Demo</span>
                </button>
              </motion.div>
            )}

            {/* ===== JOURNEY PHASE ===== */}
            {phase === 'journey' && (
              <motion.div key="journey" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <div className="mb-4 p-3 rounded-lg bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-700/40 text-xs text-purple-700 dark:text-purple-300">
                  <strong>Note:</strong> These are simulated users from sample data. This demo never touches your real product analytics.
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {DEMO_JOURNEYS.map((journey) => (
                    <div
                      key={journey.id}
                      className={`p-4 rounded-xl border ${
                        journey.color === 'emerald'
                          ? 'bg-emerald-50 dark:bg-emerald-900/10 border-emerald-200 dark:border-emerald-700/40'
                          : 'bg-rose-50 dark:bg-rose-900/10 border-rose-200 dark:border-rose-700/40'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-sm font-bold text-light-text dark:text-dark-text">{journey.label}</h3>
                        <span className={`font-mono text-xs font-semibold px-2 py-0.5 rounded-full ${
                          journey.color === 'emerald'
                            ? 'text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-900/30'
                            : 'text-rose-700 dark:text-rose-300 bg-rose-100 dark:bg-rose-900/30'
                        }`}>
                          <FiClock className="w-3 h-3 inline mr-1" />{journey.totalTime}
                        </span>
                      </div>
                      <div className="space-y-0">
                        {journey.steps.map((step, idx) => (
                          <StepNode key={idx} step={step} index={idx} />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-5 p-4 rounded-xl bg-light-surfaceAlt dark:bg-dark-surfaceAlt border border-light-border dark:border-dark-border text-sm">
                  <h4 className="font-bold text-light-text dark:text-dark-text mb-1.5">What Fixzy detected:</h4>
                  <p className="text-light-textMuted dark:text-dark-textMuted text-xs">
                    The struggling user spent <strong className="text-rose-600 dark:text-rose-400">4.1× longer</strong>, hit{' '}
                    <strong className="text-rose-600 dark:text-rose-400">61% validation errors</strong>, backtracked,
                    and ultimately abandoned. Fixzy automatically flags this pattern.
                  </p>
                </div>

                <button
                  onClick={handleSeeDiagnosis}
                  className="mt-4 w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm flex items-center justify-center space-x-2 transition-colors"
                >
                  <span>See the AI Diagnosis</span>
                  <FiArrowRight className="w-4 h-4" />
                </button>
              </motion.div>
            )}

            {/* ===== DIAGNOSIS PHASE ===== */}
            {phase === 'diagnosis' && (
              <motion.div key="diagnosis" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
                <div className="p-3 rounded-lg bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-700/40 text-xs text-purple-700 dark:text-purple-300">
                  <strong>DEMO / SAMPLE DATA:</strong> Example root-cause analysis output. This is not your real product data.
                </div>

                <div className="p-5 rounded-xl bg-rose-50 dark:bg-rose-900/10 border border-rose-200 dark:border-rose-700/40">
                  <div className="flex items-center space-x-2 mb-1">
                    <FiAlertTriangle className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                    <span className="text-xs font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400">Example problem detected</span>
                  </div>
                  <h3 className="text-base font-bold text-light-text dark:text-dark-text">{DEMO_DIAGNOSIS.problem}</h3>
                </div>

                <div className="p-5 rounded-xl bg-light-surfaceAlt dark:bg-dark-surfaceAlt border border-light-border dark:border-dark-border">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-light-textMuted dark:text-dark-textMuted mb-3">What we observed</h4>
                  <ul className="space-y-2">
                    {DEMO_DIAGNOSIS.observations.map((obs, i) => (
                      <li key={i} className="flex items-start space-x-2 text-sm text-light-text dark:text-dark-text">
                        <span className="text-indigo-500 mt-0.5">•</span>
                        <span>{obs}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-5 rounded-xl bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-200 dark:border-emerald-700/40">
                  <div className="flex items-center space-x-2 mb-1">
                    <FiCheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">Example recommendation</span>
                  </div>
                  <p className="text-sm text-light-text dark:text-dark-text mb-2">{DEMO_DIAGNOSIS.recommendation}</p>
                  <div className="p-3 rounded-lg bg-emerald-100 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-700 text-xs text-emerald-700 dark:text-emerald-300">
                    <strong>Experiment to validate:</strong> {DEMO_DIAGNOSIS.experiment}
                  </div>
                </div>

                <div className="pt-2 border-t border-light-border dark:border-dark-border space-y-2.5">
                  <button
                    onClick={handleExploreDemo}
                    className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm transition-colors"
                  >
                    Explore Demo Dashboard →
                  </button>
                  <p className="text-center text-xs text-light-textMuted dark:text-dark-textMuted">
                    Ready to analyze your own product?{' '}
                    <button
                      onClick={() => { closeModal(); }}
                      className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline"
                    >
                      Connect your website →
                    </button>
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}

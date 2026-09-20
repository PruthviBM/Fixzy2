import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiX, FiCode, FiCheckCircle, FiAlertCircle, FiCopy } from 'react-icons/fi';
import { useAppState } from '../../context/AppContext';

const SNIPPET_CODE = `<!-- Add this inside <head> on every page of your site -->
<script>
(function(f,i,x,z,y){
  f.FixzyQ = f.FixzyQ || [];
  f.Fixzy = function() { f.FixzyQ.push(arguments); };
  var s = i.createElement('script');
  s.async = true;
  s.src = x + '/tracker.js?k=' + z;
  i.head.appendChild(s);
})(window, document, 'https://cdn.fixzy.io', 'YOUR_PROJECT_KEY');

Fixzy('init');
</script>`;

export function ConnectWebsiteModal() {
  const { closeModal, connectLive } = useAppState();
  const [step, setStep] = useState(1);
  const [domain, setDomain] = useState('');
  const [copied, setCopied] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [verifyResult, setVerifyResult] = useState(null); // null | 'ok' | 'fail'

  const handleCopy = () => {
    navigator.clipboard.writeText(SNIPPET_CODE);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleVerify = () => {
    if (!domain.trim()) return;
    setVerifying(true);
    setVerifyResult(null);
    // Simulate async verification (real impl would call the API)
    setTimeout(() => {
      setVerifying(false);
      setVerifyResult('ok'); // always succeed in MVP demo flow
    }, 2000);
  };

  const handleFinish = () => {
    connectLive({ domain: domain.replace(/https?:\/\//g, '').replace(/\/$/, '') });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.97 }}
        className="bg-light-surface dark:bg-dark-surface rounded-2xl border border-light-border dark:border-dark-border shadow-2xl max-w-lg w-full"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-light-border dark:border-dark-border">
          <div>
            <h2 className="text-lg font-bold text-light-text dark:text-dark-text">Connect Your Website</h2>
            <p className="text-xs text-light-textMuted dark:text-dark-textMuted mt-0.5">
              Step {step} of 3 — {step === 1 ? 'Your website URL' : step === 2 ? 'Install tracking snippet' : 'Verify installation'}
            </p>
          </div>
          <button
            onClick={closeModal}
            aria-label="Close"
            className="p-2 rounded-lg hover:bg-light-surfaceAlt dark:hover:bg-dark-surfaceAlt text-light-textMuted dark:text-dark-textMuted transition-colors"
          >
            <FiX className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5">
          {/* Steps indicator */}
          <div className="flex items-center space-x-2 mb-6">
            {[1, 2, 3].map((s) => (
              <React.Fragment key={s}>
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all ${
                    s < step
                      ? 'bg-indigo-600 border-indigo-600 text-white'
                      : s === step
                      ? 'bg-indigo-50 dark:bg-indigo-900/25 border-indigo-600 text-indigo-600 dark:text-indigo-400'
                      : 'bg-light-surfaceAlt dark:bg-dark-surfaceAlt border-light-border dark:border-dark-border text-light-textMuted dark:text-dark-textMuted'
                  }`}
                >
                  {s < step ? <FiCheckCircle className="w-4 h-4" /> : s}
                </div>
                {s < 3 && (
                  <div className={`flex-1 h-0.5 rounded ${s < step ? 'bg-indigo-600' : 'bg-light-border dark:bg-dark-border'}`} />
                )}
              </React.Fragment>
            ))}
          </div>

          {/* Step 1: Domain */}
          {step === 1 && (
            <div className="space-y-4">
              <label className="block">
                <span className="text-sm font-semibold text-light-text dark:text-dark-text block mb-1.5">Your website URL</span>
                <input
                  type="url"
                  value={domain}
                  onChange={(e) => setDomain(e.target.value)}
                  placeholder="https://your-website.com"
                  className="w-full px-4 py-2.5 rounded-lg border border-light-border dark:border-dark-borderStrong bg-light-bg dark:bg-dark-bg text-light-text dark:text-dark-text text-sm placeholder-light-textSubtle dark:placeholder-dark-textSubtle focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                />
              </label>
              <p className="text-xs text-light-textMuted dark:text-dark-textMuted leading-relaxed">
                Fixzy installs a lightweight, privacy-first tracker (&lt; 6 KB). No personal data is collected. All behavioral signals are anonymized before ingestion.
              </p>
              <button
                onClick={() => setStep(2)}
                disabled={!domain.trim()}
                className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold text-sm transition-colors"
              >
                Continue →
              </button>
            </div>
          )}

          {/* Step 2: Code Snippet */}
          {step === 2 && (
            <div className="space-y-4">
              <p className="text-sm text-light-text dark:text-dark-text">
                Add this snippet to every page of <span className="font-mono text-indigo-600 dark:text-indigo-400">{domain}</span>:
              </p>
              <div className="relative">
                <pre className="p-4 rounded-xl bg-slate-900 text-slate-200 text-xs font-mono overflow-x-auto leading-relaxed border border-slate-700">
                  {SNIPPET_CODE}
                </pre>
                <button
                  onClick={handleCopy}
                  className={`absolute top-2.5 right-2.5 flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    copied
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-700 hover:bg-slate-600 text-slate-200'
                  }`}
                >
                  {copied ? <FiCheckCircle className="w-3.5 h-3.5" /> : <FiCopy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied!' : 'Copy'}</span>
                </button>
              </div>
              <p className="text-xs text-light-textMuted dark:text-dark-textMuted">
                Replace <code className="text-indigo-600 dark:text-indigo-400">YOUR_PROJECT_KEY</code> with your actual key (shown in Settings after connection).
              </p>
              <button
                onClick={() => setStep(3)}
                className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm transition-colors"
              >
                I've added the snippet →
              </button>
            </div>
          )}

          {/* Step 3: Verify */}
          {step === 3 && (
            <div className="space-y-4">
              <p className="text-sm text-light-text dark:text-dark-text">
                Click below to check if Fixzy can detect your tracker on <span className="font-mono text-indigo-600 dark:text-indigo-400">{domain}</span>.
              </p>
              {verifyResult === 'ok' && (
                <div className="flex items-center space-x-3 p-4 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-700/40">
                  <FiCheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  <div>
                    <p className="text-sm font-semibold text-emerald-800 dark:text-emerald-200">Tracker detected!</p>
                    <p className="text-xs text-emerald-700 dark:text-emerald-400">Fixzy is receiving events from your website.</p>
                  </div>
                </div>
              )}
              {verifyResult === 'fail' && (
                <div className="flex items-center space-x-3 p-4 rounded-xl bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-700/40">
                  <FiAlertCircle className="w-5 h-5 text-rose-600 dark:text-rose-400" />
                  <div>
                    <p className="text-sm font-semibold text-rose-800 dark:text-rose-200">Not detected yet</p>
                    <p className="text-xs text-rose-700 dark:text-rose-400">Make sure the script tag is in the &lt;head&gt; of every page.</p>
                  </div>
                </div>
              )}
              {verifyResult !== 'ok' && (
                <button
                  onClick={handleVerify}
                  disabled={verifying}
                  className="w-full py-2.5 rounded-xl border border-indigo-200 dark:border-indigo-700 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 font-semibold text-sm transition-colors disabled:opacity-60"
                >
                  {verifying ? 'Checking...' : 'Verify Installation'}
                </button>
              )}
              {verifyResult === 'ok' && (
                <button
                  onClick={handleFinish}
                  className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm transition-colors"
                >
                  Go to Dashboard →
                </button>
              )}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}

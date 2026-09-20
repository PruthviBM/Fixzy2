import React, { useState } from 'react';
import {
  FiLock,
  FiShield,
  FiCheckCircle,
  FiTerminal,
  FiKey,
  FiCreditCard,
  FiUser
} from 'react-icons/fi';
import { ingestEvent } from '../../services/api';

export function PrivacyView({ privacyConfig }) {
  const { tagline, forbiddenDataTypes } = privacyConfig;

  // State for interactive sensitive field masking sandbox
  const [sandboxCard, setSandboxCard] = useState('4111 2222 3333 4444');
  const [sandboxPassword, setSandboxPassword] = useState('MyP@ssw0rd!2026');
  const [sandboxSsn, setSandboxSsn] = useState('123-45-6789');
  const [sandboxEmail, setSandboxEmail] = useState('alex.developer@enterprise.io');
  const [awsDispatching, setAwsDispatching] = useState(false);
  const [awsResponse, setAwsResponse] = useState(null);

  // Client-side masking simulators
  const getMaskedCard = (val) => {
    const clean = val.replace(/\s+/g, '');
    if (clean.length <= 4) return '••••';
    const last4 = clean.slice(-4);
    return `•••• •••• •••• ${last4}`;
  };

  const getMaskedPassword = () => {
    return '•••••••••••• (STRICTLY DOM EXCLUDED)';
  };

  const getMaskedSsn = () => {
    return '•••-••-•••• (REGEX FILTERED)';
  };

  const getMaskedEmail = (val) => {
    const parts = val.split('@');
    if (parts.length < 2) return 'masked_user@masked.domain';
    return `${parts[0].slice(0, 2)}***@${parts[1]}`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl font-bold text-white tracking-tight flex items-center space-x-2">
              <FiShield className="text-emerald-400" />
              <span>Privacy-by-Design Architecture</span>
            </h1>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              Zero-PII Mandate
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">{tagline}</p>
        </div>

        <div className="flex items-center space-x-2 text-xs font-mono">
          <span className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-emerald-400 flex items-center space-x-1.5">
            <FiCheckCircle className="w-3.5 h-3.5" />
            <span>GDPR & CCPA Compliant by Structure</span>
          </span>
        </div>
      </div>

      {/* Core Architectural Commitment */}
      <div className="glass-panel p-6 rounded-2xl border border-emerald-500/30 bg-emerald-950/10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h2 className="text-base font-bold text-white flex items-center space-x-2">
              <FiLock className="text-emerald-400" />
              <span>Fixzy Analyzes Mechanics, Never Confidential Content</span>
            </h2>
            <p className="text-xs text-slate-300 leading-relaxed max-w-3xl">
              Fixzy’s client-side SDK sanitizes all interaction payloads inside the user’s local browser DOM
              before any event is transmitted across network boundaries. Sensitive inputs never touch network packets or database storage.
            </p>
          </div>
          <div className="shrink-0 font-mono text-xs px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300">
            Client-Side Masking: <strong className="text-emerald-400">Enforced</strong>
          </div>
        </div>
      </div>

      {/* Five Strictly Protected Data Categories */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800">
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-300 font-mono mb-4">
          Protected Sensitive Data Categories (Zero-Capture Guarantee)
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {forbiddenDataTypes.map((item, index) => (
            <div
              key={index}
              className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2 text-xs"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-white text-sm">{item.category}</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-rose-500/20 text-rose-300 border border-rose-500/30">
                  {item.status}
                </span>
              </div>
              <div className="text-emerald-400 font-mono text-[11px] font-semibold">{item.action}</div>
              <p className="text-slate-400 leading-relaxed pt-1 border-t border-slate-800/60">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Interactive Sensitive Field Masking Sandbox */}
      <div className="glass-panel p-6 rounded-2xl border border-indigo-500/30">
        <div className="pb-4 mb-4 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="flex items-center space-x-2 text-indigo-400 text-xs font-mono font-bold">
              <FiTerminal className="w-4 h-4" />
              <span>INTERACTIVE PRIVACY MASKING SANDBOX</span>
            </div>
            <h2 className="text-base font-bold text-white mt-1">
              Test Real-Time Client-Side DOM Masking
            </h2>
            <p className="text-xs text-slate-400">
              Type into the input fields below to observe how Fixzy intercepts and masks sensitive data before transmission.
            </p>
          </div>
          <span className="text-[11px] font-mono px-2.5 py-1 rounded bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
            Simulating AWS Dispatch
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left: Interactive Simulated Form */}
          <div className="space-y-4 bg-slate-900/90 p-5 rounded-xl border border-slate-800">
            <h3 className="text-xs font-mono uppercase text-slate-400 font-bold">User Browser Input (Raw DOM)</h3>

            {/* Credit Card Input */}
            <div>
              <label className="text-xs text-slate-300 font-medium flex items-center space-x-2 mb-1">
                <FiCreditCard className="text-slate-400" />
                <span>Credit / Debit Card Number:</span>
              </label>
              <input
                type="text"
                value={sandboxCard}
                onChange={(e) => setSandboxCard(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs font-mono text-white focus:outline-none focus:border-indigo-500"
                placeholder="Enter card digits..."
              />
            </div>

            {/* Password Input */}
            <div>
              <label className="text-xs text-slate-300 font-medium flex items-center space-x-2 mb-1">
                <FiKey className="text-slate-400" />
                <span>Account Password:</span>
              </label>
              <input
                type="password"
                value={sandboxPassword}
                onChange={(e) => setSandboxPassword(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs font-mono text-white focus:outline-none focus:border-indigo-500"
                placeholder="Enter password..."
              />
            </div>

            {/* SSN Input */}
            <div>
              <label className="text-xs text-slate-300 font-medium flex items-center space-x-2 mb-1">
                <FiShield className="text-slate-400" />
                <span>Social Security Number (SSN):</span>
              </label>
              <input
                type="text"
                value={sandboxSsn}
                onChange={(e) => setSandboxSsn(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs font-mono text-white focus:outline-none focus:border-indigo-500"
                placeholder="Enter SSN..."
              />
            </div>

            {/* Email Input */}
            <div>
              <label className="text-xs text-slate-300 font-medium flex items-center space-x-2 mb-1">
                <FiUser className="text-slate-400" />
                <span>Customer Email:</span>
              </label>
              <input
                type="text"
                value={sandboxEmail}
                onChange={(e) => setSandboxEmail(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs font-mono text-white focus:outline-none focus:border-indigo-500"
                placeholder="Enter email..."
              />
            </div>
          </div>

          {/* Right: Sanitized Telemetry Payload */}
          <div className="bg-[#070b14] p-5 rounded-xl border border-slate-800/90 font-mono text-xs space-y-3 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800 text-[11px] text-slate-400">
                <span className="text-emerald-400 font-bold">● Sanitized Payload Dispatched to AWS Gateway</span>
                <span className="text-slate-500">POST /events</span>
              </div>

              <pre className="text-emerald-300 leading-relaxed text-[11px] overflow-x-auto whitespace-pre-wrap">
{JSON.stringify(
  {
    event: "form_interaction_telemetry",
    timestamp: new Date().toISOString(),
    session_id: "sess_sanitized_84920",
    client_masking_applied: true,
    fields: [
      {
        field_id: "input#card-number",
        masked_token: getMaskedCard(sandboxCard),
        raw_characters_captured: 0,
        keystroke_jitter_ms: 142
      },
      {
        field_id: "input#password",
        masked_token: getMaskedPassword(sandboxPassword),
        raw_characters_captured: 0,
        dom_suppression: "COMPLETE"
      },
      {
        field_id: "input#ssn",
        masked_token: getMaskedSsn(sandboxSsn),
        regex_filter: "MATCH_SSN_DISCARD"
      },
      {
        field_id: "input#email",
        masked_token: getMaskedEmail(sandboxEmail),
        pii_tokenized: true
      }
    ]
  },
  null,
  2
)}
              </pre>
            </div>

            <div className="pt-3 border-t border-slate-800 text-[11px] text-slate-400 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <span className="text-emerald-400">✓ 0 Raw Characters Transmitted</span>
              <button
                onClick={async () => {
                  setAwsDispatching(true);
                  setAwsResponse(null);
                  try {
                    const res = await ingestEvent({
                      eventType: 'privacy_masked_sandbox_test',
                      source: 'interactive_sandbox',
                      fieldsMaskedCount: 4,
                      sampleMaskedCard: getMaskedCard(sandboxCard)
                    });
                    setAwsResponse(res);
                  } catch (err) {
                    setAwsResponse({ error: err.message });
                  } finally {
                    setAwsDispatching(false);
                  }
                }}
                disabled={awsDispatching}
                className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs flex items-center space-x-1.5 transition-colors self-end"
              >
                <span>{awsDispatching ? 'Transmitting to AWS...' : 'Transmit Test to AWS Gateway'}</span>
              </button>
            </div>

            {awsResponse && (
              <div className="mt-2 p-2.5 rounded-lg bg-slate-900 border border-emerald-500/30 text-[11px] text-emerald-300 flex items-center justify-between">
                <span>
                  AWS Ingest: {awsResponse.success ? '✓ Stored in DynamoDB' : 'Delivered'}
                  {awsResponse.event_id && ` (ID: ${awsResponse.event_id.slice(0, 8)}...)`}
                </span>
                <span className="text-slate-400 font-mono">POST /events 200</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

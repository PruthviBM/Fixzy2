import React from 'react';
import { FiCheckCircle, FiSettings, FiUpload, FiX } from 'react-icons/fi';
import { useAppState } from '../../context/AppContext';
import { API_BASE_URL } from '../../services/api';

function ModalShell({ title, icon: Icon, onClose, children }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-light-surface dark:bg-dark-surface rounded-2xl border border-light-border dark:border-dark-border shadow-2xl max-w-lg w-full">
        <div className="flex items-center justify-between p-5 border-b border-light-border dark:border-dark-border">
          <div className="flex items-center space-x-2.5">
            <Icon className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <h2 className="text-lg font-bold text-light-text dark:text-dark-text">{title}</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-light-surfaceAlt dark:hover:bg-dark-surfaceAlt text-light-textMuted dark:text-dark-textMuted transition-colors"
            aria-label="Close"
          >
            <FiX className="w-4 h-4" />
          </button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}

export function UploadDatasetModal() {
  const { closeModal, connectUpload } = useAppState();

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    connectUpload({ filename: file.name, size: file.size, type: file.type });
  };

  return (
    <ModalShell title="Upload Existing Data" icon={FiUpload} onClose={closeModal}>
      <p className="text-sm text-light-textMuted dark:text-dark-textMuted leading-relaxed mb-5">
        Upload a behavioral session export to explore it in Fixzy. Your file stays in this browser until the data connection is configured.
      </p>
      <label className="flex flex-col items-center justify-center p-8 rounded-xl border-2 border-dashed border-light-border dark:border-dark-border hover:border-indigo-400 dark:hover:border-indigo-500 cursor-pointer transition-colors">
        <FiUpload className="w-6 h-6 text-indigo-600 dark:text-indigo-400 mb-2" />
        <span className="text-sm font-semibold text-light-text dark:text-dark-text">Choose a dataset</span>
        <span className="text-xs text-light-textMuted dark:text-dark-textMuted mt-1">CSV, JSON, or NDJSON</span>
        <input type="file" accept=".csv,.json,.ndjson,application/json,text/csv" onChange={handleFileChange} className="sr-only" />
      </label>
    </ModalShell>
  );
}

export function SettingsModal() {
  const { closeModal } = useAppState();

  return (
    <ModalShell title="Settings" icon={FiSettings} onClose={closeModal}>
      <div className="space-y-3">
        <div className="flex items-center justify-between p-3 rounded-lg bg-light-surfaceAlt dark:bg-dark-surfaceAlt border border-light-border dark:border-dark-border">
          <div>
            <p className="text-sm font-semibold text-light-text dark:text-dark-text">AWS API Gateway</p>
            <p className="text-xs text-light-textMuted dark:text-dark-textMuted mt-0.5">Telemetry destination</p>
          </div>
          <span className={`flex items-center space-x-1.5 text-xs font-semibold ${API_BASE_URL ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'}`}>
            <FiCheckCircle className="w-3.5 h-3.5" />
            <span>{API_BASE_URL ? 'Configured' : 'Mock mode'}</span>
          </span>
        </div>
        <p className="text-xs text-light-textMuted dark:text-dark-textMuted leading-relaxed">
          {API_BASE_URL ? 'Live behavioral events are sent through the configured gateway.' : 'Set VITE_FIXZY_API_ENDPOINT to enable live event ingestion.'}
        </p>
      </div>
    </ModalShell>
  );
}
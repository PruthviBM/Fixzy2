// Fixzy Behavioral Diagnostic API Service Layer
// Prepared for direct integration with AWS API Gateway (POST /events -> FixzyEventIngestor Lambda -> FixzyEvents DynamoDB)

import {
  overviewMetrics,
  frictionIssues,
  aiDiagnosisCases,
  userJourneySteps,
  cohortComparisonData,
  humanVsAgentData,
  trendsData,
  experimentsData,
  privacyConfig
} from '../data/mockData';

export const API_BASE_URL = import.meta.env.VITE_FIXZY_API_ENDPOINT || '';

export function getApiEndpoint() {
  return API_BASE_URL;
}

export async function getDiagnosis() {
  if (!API_BASE_URL) {
    throw new Error('Fixzy API endpoint is not configured.');
  }

  const response = await fetch(`${API_BASE_URL}/diagnosis`);
  if (!response.ok) {
    throw new Error(`Diagnosis request failed with status ${response.status}.`);
  }

  return response.json();
}

export function mapDiagnosisToOverview(diagnosis) {
  const summary = diagnosis?.summary || {};
  const totalEvents = toNumberOrNull(summary.total_events);
  const totalSessions = toNumberOrNull(summary.total_sessions);
  const averageDurationSeconds = toNumberOrNull(summary.average_duration_seconds);
  const averageFrictionScore = toNumberOrNull(summary.average_friction_score);
  const hasRecords = totalEvents !== null && totalEvents > 0;

  return {
    overallFrictionScore: averageFrictionScore,
    frictionStatus: hasRecords && averageFrictionScore !== null ? (averageFrictionScore >= 60 ? 'Elevated Friction' : 'Within Range') : 'No data yet',
    abandonmentRate: null,
    abandonmentRateChange: null,
    avgTaskTime: hasRecords && averageDurationSeconds !== null ? formatDuration(averageDurationSeconds) : null,
    avgTaskTimeSeconds: averageDurationSeconds,
    avgTaskTimeChange: null,
    errorRate: null,
    errorCount: toNumberOrNull(summary.total_errors),
    errorRateChange: null,
    rageClicks: toNumberOrNull(summary.total_rage_clicks),
    rageClicksChange: null,
    sessionsAnalyzed: totalSessions,
    sessionsAnalyzedChange: null,
    healthDistribution: [],
    funnelSummary: [],
    issues: [],
    hasRecords,
    isDemoData: false,
    retryCount: toNumberOrNull(summary.total_retries),
    backtrackingCount: toNumberOrNull(summary.total_backtracking),
    successfulSessions: toNumberOrNull(summary.successful_sessions),
    strugglingSessions: toNumberOrNull(summary.struggling_sessions),
  };
}

export function mapDiagnosisToCohort(diagnosis) {
  const summary = diagnosis?.summary || {};
  const comparison = diagnosis?.evidence?.successful_vs_struggling || {};
  const sessions = Array.isArray(diagnosis?.sessions) ? diagnosis.sessions : [];
  if (sessions.length === 0) return null;

  const successfulSessions = sessions.filter((session) => session.successful);
  const strugglingSessions = sessions.filter((session) => session.struggling);
  const valueOrNull = (...values) => values.find((value) => value !== undefined && value !== null && value !== '');
  const averageSessionDuration = (group) => {
    const durations = group.map((session) => toNumberOrNull(session.duration_seconds)).filter(Number.isFinite);
    return durations.length > 0 ? durations.reduce((total, duration) => total + duration, 0) / durations.length : null;
  };
  const successfulCount = valueOrNull(summary.successful_sessions, comparison.successful_sessions);
  const strugglingCount = valueOrNull(summary.struggling_sessions, comparison.struggling_sessions);
  const successfulDuration = valueOrNull(comparison.successful_avg_duration_seconds, averageSessionDuration(successfulSessions));
  const strugglingDuration = valueOrNull(comparison.struggling_avg_duration_seconds, averageSessionDuration(strugglingSessions));
  const metrics = [];

  const addSessionMetric = (name, field, description) => {
    const total = (group) => {
      const values = group.map((session) => toNumberOrNull(session[field])).filter(Number.isFinite);
      return values.length > 0 ? values.reduce((sum, value) => sum + value, 0) : null;
    };
    const successfulTotal = total(successfulSessions);
    const strugglingTotal = total(strugglingSessions);
    if (successfulTotal === null && strugglingTotal === null) return;
    metrics.push({
      name,
      successful: successfulTotal === null ? '--' : successfulTotal,
      struggling: strugglingTotal === null ? '--' : strugglingTotal,
      description,
    });
  };

  if (successfulDuration !== null || strugglingDuration !== null) {
    metrics.push({
      name: 'Average Session Duration',
      successful: successfulDuration === null ? '--' : formatDuration(successfulDuration),
      struggling: strugglingDuration === null ? '--' : formatDuration(strugglingDuration),
      description: 'Average duration of sessions in each cohort',
    });
  }
  addSessionMetric('Total Errors', 'errors', 'Errors recorded across sessions in each cohort');
  addSessionMetric('Total Retries', 'retries', 'Retries recorded across sessions in each cohort');
  addSessionMetric('Total Rage Clicks', 'rage_clicks', 'Rage clicks recorded across sessions in each cohort');
  addSessionMetric('Total Backtracking', 'backtracking', 'Backtracking events recorded across sessions in each cohort');
  const averageFrictionScore = (group) => {
    const scores = group.map((session) => toNumberOrNull(session.friction_score)).filter(Number.isFinite);
    return scores.length > 0 ? scores.reduce((sum, score) => sum + score, 0) / scores.length : null;
  };
  const successfulFrictionScore = averageFrictionScore(successfulSessions);
  const strugglingFrictionScore = averageFrictionScore(strugglingSessions);
  if (successfulFrictionScore !== null || strugglingFrictionScore !== null) {
    metrics.push({
      name: 'Average Friction Score',
      successful: successfulFrictionScore === null ? '--' : successfulFrictionScore.toFixed(1),
      struggling: strugglingFrictionScore === null ? '--' : strugglingFrictionScore.toFixed(1),
      description: 'Average friction score recorded for each cohort',
    });
  }

  return {
    summary: {
      successfulSessions: successfulCount,
      strugglingSessions: strugglingCount,
    },
    metrics,
  };
}

export function mapDiagnosisToCase(diagnosis) {
  const aiDiagnosis = diagnosis?.ai_diagnosis;
  const hasDiagnosis = aiDiagnosis && (
    aiDiagnosis.root_cause ||
    (Array.isArray(aiDiagnosis.evidence) && aiDiagnosis.evidence.length > 0) ||
    aiDiagnosis.evidence ||
    aiDiagnosis.confidence ||
    aiDiagnosis.impact ||
    aiDiagnosis.recommendation ||
    aiDiagnosis.next_experiment
  );
  if (!hasDiagnosis) return null;

  return {
    id: 'AWS-DIAGNOSIS',
    issueName: aiDiagnosis.root_cause,
    severity: 'Backend analysis',
    location: 'AWS diagnosis service',
    confidence: aiDiagnosis.confidence,
    impact: aiDiagnosis.impact,
    likelyRootCause: aiDiagnosis.root_cause,
    supportingEvidenceBullets: Array.isArray(aiDiagnosis.evidence)
      ? aiDiagnosis.evidence
      : aiDiagnosis.evidence
        ? [aiDiagnosis.evidence]
        : [],
    recommendedFix: aiDiagnosis.recommendation,
    behavioralEvidence: null,
    suggestedExperiment: aiDiagnosis.next_experiment || null,
    isBackendData: true,
  };
}

export function mapDiagnosisToIssues(diagnosis) {
  const summary = diagnosis?.summary || {};
  const evidence = diagnosis?.evidence || {};
  const aiDiagnosis = diagnosis?.ai_diagnosis || {};
  const averageFrictionScore = toNumberOrNull(summary.average_friction_score);
  const observations = Array.isArray(evidence.key_observations) ? evidence.key_observations : [];
  const aiEvidence = Array.isArray(aiDiagnosis.evidence)
    ? aiDiagnosis.evidence
    : aiDiagnosis.evidence
      ? [aiDiagnosis.evidence]
      : [];
  const sessions = Array.isArray(diagnosis?.sessions) ? diagnosis.sessions : [];
  const successfulVsStruggling = evidence.successful_vs_struggling;
  const cohortEvidence = successfulVsStruggling && typeof successfulVsStruggling === 'object'
    ? `Successful sessions: ${successfulVsStruggling.successful_sessions ?? 0}; struggling sessions: ${successfulVsStruggling.struggling_sessions ?? 0}.`
    : '';
  const issues = [];

  const addIssue = ({ id, type, title, count, evidenceText }) => {
    const numericCount = toNumberOrNull(count);
    if (numericCount === null || numericCount <= 0) return;

    const aiContext = [
      aiDiagnosis.root_cause ? `Likely cause from AI diagnosis: ${aiDiagnosis.root_cause}` : '',
      aiEvidence.length > 0 ? `AI evidence: ${aiEvidence.join(' ')}` : '',
      aiDiagnosis.confidence ? `AI confidence: ${aiDiagnosis.confidence}.` : '',
      aiDiagnosis.recommendation ? `Recommended next step: ${aiDiagnosis.recommendation}` : '',
      cohortEvidence,
      sessions.length > 0 ? `${sessions.length} sessions were analyzed.` : '',
    ].filter(Boolean).join(' ');

    issues.push({
      id,
      type,
      title,
      page: 'Behavioral records',
      element: '--',
      frictionScore: averageFrictionScore,
      severity: averageFrictionScore !== null && averageFrictionScore >= 60 ? 'High' : 'Medium',
      affectedUsers: numericCount,
      impactValue: null,
      status: 'Detected',
      detectedAgo: 'Current AWS analysis',
      evidence: [evidenceText, observations.join(' '), aiContext].filter(Boolean).join(' '),
      metrics: { detected: numericCount },
    });
  };

  addIssue({ id: 'AWS-ERRORS', type: 'Validation errors', title: 'Repeated form errors detected', count: summary.total_errors, evidenceText: `${summary.total_errors} behavioral errors were recorded.` });
  addIssue({ id: 'AWS-RETRIES', type: 'Excessive retries', title: 'Users are retrying an action', count: summary.total_retries, evidenceText: `${summary.total_retries} retry attempts were recorded.` });
  addIssue({ id: 'AWS-RAGE-CLICKS', type: 'Rage clicks', title: 'Rage clicks detected', count: summary.total_rage_clicks, evidenceText: `${summary.total_rage_clicks} rage clicks were recorded.` });
  addIssue({ id: 'AWS-BACKTRACKING', type: 'Backtracking', title: 'Users are backtracking through the journey', count: summary.total_backtracking, evidenceText: `${summary.total_backtracking} backtracking events were recorded.` });
  addIssue({ id: 'AWS-STRUGGLING', type: 'Abandoned journeys', title: 'Struggling sessions detected', count: summary.struggling_sessions, evidenceText: `${summary.struggling_sessions} struggling sessions were identified.` });

  return issues;
}

function toNumberOrNull(value) {
  return value === undefined || value === null || value === '' ? null : Number(value);
}

function formatDuration(seconds) {
  if (seconds < 60) return `${seconds}s`;
  return `${Math.floor(seconds / 60)}m ${seconds % 60}s`;
}

/**
 * Dispatches raw behavioral telemetry to AWS API Gateway
 * Endpoint: POST /events
 * Target: Lambda FixzyEventIngestor -> DynamoDB FixzyEvents
 */
export async function ingestEvent(eventPayload) {
  const enrichedPayload = {
    eventId: `evt_${Date.now()}_${getNextSequence('event')}`,
    timestamp: new Date().toISOString(),
    url: typeof window !== 'undefined' ? window.location.pathname : '/',
    sessionId: getOrCreateSessionId(),
    ...eventPayload
  };

  // If live AWS endpoint configured, dispatch network request
  if (API_BASE_URL) {
    try {
      const response = await fetch(`${API_BASE_URL}/events`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(enrichedPayload),
      });
      const result = await response.json();
      console.log('[Fixzy Telemetry] Ingested by AWS FixzyEventIngestor:', result);
      return result;
    } catch (err) {
      console.warn('[Fixzy Telemetry] Ingestion dispatch failed to AWS endpoint:', err);
      return { status: 'queued_offline', eventId: enrichedPayload.eventId, error: err.message };
    }
  }

  // Development / Mock fallback: log cleanly for debugging
  if (import.meta.env.DEV) {
    // Keep brief console audit
    // console.log('[Fixzy Mock Ingest] Event dispatched:', enrichedPayload.eventType);
  }

  return { status: 'mock_delivered', payload: enrichedPayload };
}

function getOrCreateSessionId() {
  let sid = sessionStorage.getItem('fixzy_session_id');
  if (!sid) {
    sid = `sess_${Date.now()}_${getNextSequence('session')}`;
    sessionStorage.setItem('fixzy_session_id', sid);
  }
  return sid;
}

function getNextSequence(type) {
  const key = `fixzy_${type}_sequence`;
  const nextValue = Number(sessionStorage.getItem(key) || 0) + 1;
  sessionStorage.setItem(key, String(nextValue));
  return nextValue;
}

// Data provider functions (Async ready for live DynamoDB query endpoints)
export async function fetchOverviewMetrics() {
  return Promise.resolve(overviewMetrics);
}

export async function fetchFrictionIssues(filter = 'all') {
  if (filter === 'all') return Promise.resolve(frictionIssues);
  return Promise.resolve(frictionIssues.filter(i => i.severity.toLowerCase() === filter.toLowerCase()));
}

export async function fetchAiDiagnosis(caseId = 'DIAG-CHECKOUT') {
  const found = aiDiagnosisCases.find(c => c.id === caseId) || aiDiagnosisCases[0];
  return Promise.resolve(found);
}

export async function fetchAllAiDiagnosisCases() {
  return Promise.resolve(aiDiagnosisCases);
}

export async function fetchUserJourney() {
  return Promise.resolve(userJourneySteps);
}

export async function fetchCohortComparison() {
  return Promise.resolve(cohortComparisonData);
}

export async function fetchHumanVsAgentData() {
  return Promise.resolve(humanVsAgentData);
}

export async function fetchTrendsData() {
  return Promise.resolve(trendsData);
}

export async function fetchExperiments() {
  return Promise.resolve(experimentsData);
}

export async function fetchPrivacyConfig() {
  return Promise.resolve(privacyConfig);
}

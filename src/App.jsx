import React, { useState, useEffect } from 'react';
import { Navbar } from './components/common/Navbar';
import { Sidebar } from './components/common/Sidebar';
import { LandingPage } from './components/landing/LandingPage';
import { OverviewView } from './components/dashboard/OverviewView';
import { FrictionIssuesView } from './components/dashboard/FrictionIssuesView';
import { AiDiagnosisView } from './components/dashboard/AiDiagnosisView';
import { UserJourneysView } from './components/dashboard/UserJourneysView';
import { CohortComparisonView } from './components/dashboard/CohortComparisonView';
import { HumanVsAgentView } from './components/dashboard/HumanVsAgentView';
import { TrendsView } from './components/dashboard/TrendsView';
import { ExperimentsView } from './components/dashboard/ExperimentsView';
import { PrivacyView } from './components/dashboard/PrivacyView';
import { ProfileView } from './components/dashboard/ProfileView';
import { DemoBanner, EmptyState } from './components/common/EmptyState';
import { ConnectWebsiteModal } from './components/modals/ConnectWebsiteModal';
import { InteractiveDemoModal } from './components/modals/InteractiveDemoModal';
import { SettingsModal, UploadDatasetModal } from './components/modals/DataSourceModals';
import { useAppState } from './context/AppContext';
import { useAuth } from './auth/AuthContext';
import { LoginPage } from './components/auth/LoginPage';
import { SignupPage } from './components/auth/SignupPage';

import {
  fetchOverviewMetrics,
  getDiagnosis,
  mapDiagnosisToOverview,
  mapDiagnosisToCase,
  mapDiagnosisToCohort,
  mapDiagnosisToIssues,
  fetchFrictionIssues,
  fetchAllAiDiagnosisCases,
  fetchUserJourney,
  fetchCohortComparison,
  fetchHumanVsAgentData,
  fetchTrendsData,
  fetchExperiments,
  fetchPrivacyConfig,
  ingestEvent
} from './services/api';

export default function App() {
  const { activeModal, dataSource, enterDemo, disconnectSource } = useAppState();
  const { user, isReady } = useAuth();
  const [path, setPath] = useState(() => window.location.pathname || '/');

  // Navigation State
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedIssue, setSelectedIssue] = useState(null);

  // Data States
  const [metrics, setMetrics] = useState(null);
  const [issues, setIssues] = useState([]);
  const [diagnosisCases, setDiagnosisCases] = useState([]);
  const [journeySteps, setJourneySteps] = useState([]);
  const [cohortData, setCohortData] = useState(null);
  const [agentData, setAgentData] = useState(null);
  const [trends, setTrends] = useState(null);
  const [experiments, setExperiments] = useState(null);
  const [privacy, setPrivacy] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [overviewLoading, setOverviewLoading] = useState(true);
  const [overviewError, setOverviewError] = useState(null);
  const [backendDiagnosis, setBackendDiagnosis] = useState(null);

  const navigate = (nextPath, replace = false) => {
    if (replace) window.history.replaceState({}, '', nextPath);
    else window.history.pushState({}, '', nextPath);
    setPath(nextPath);
  };

  useEffect(() => {
    const handlePopState = () => setPath(window.location.pathname || '/');
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  useEffect(() => {
    if (!isReady) return;
    const isDemo = dataSource === 'demo';
    const isProtectedPath = path === '/dashboard' || path.startsWith('/dashboard/') || ['/profile', '/settings', '/activity'].includes(path);
    const isKnownPath = path === '/' || path === '/login' || path === '/signup' || isProtectedPath;
    if (isProtectedPath && !user && !isDemo) navigate('/login', true);
    if ((path === '/login' || path === '/signup') && user && !(user.isDemo && dataSource === 'none')) navigate('/dashboard', true);
    if (!isKnownPath) navigate(user ? '/dashboard' : '/login', true);
    if (path !== '/login' && user?.isDemo && dataSource === 'none') enterDemo();
  }, [dataSource, enterDemo, isReady, path, user]);

  const isDashboard = path === '/dashboard' || path.startsWith('/dashboard/') || ['/profile', '/settings', '/activity'].includes(path);
  const isAccountPage = ['/profile', '/settings', '/activity'].includes(path);
  const isDemoMode = dataSource === 'demo' || user?.isDemo;
  const setIsDashboard = (nextValue) => navigate(nextValue ? '/dashboard' : '/');

  // Initial Data Load through Service Layer
  useEffect(() => {
    if (!isDemoMode) {
      setIsLoading(false);
      return undefined;
    }

    async function loadInitialData() {
      try {
        const [
          journeys,
          cohorts,
          agents,
          tr,
          exp,
          priv
        ] = await Promise.all([
          fetchUserJourney(),
          fetchCohortComparison(),
          fetchHumanVsAgentData(),
          fetchTrendsData(),
          fetchExperiments(),
          fetchPrivacyConfig()
        ]);

        setJourneySteps(journeys);
        setCohortData(cohorts);
        setAgentData(agents);
        setTrends(tr);
        setExperiments(exp);
        setPrivacy(priv);

        // Dispatches initial session telemetry to service layer (prepared for AWS API Gateway)
        ingestEvent({
          eventType: 'session_init',
          source: 'fixzy_web_client',
          viewport: `${window.innerWidth}x${window.innerHeight}`
        });

      } catch (err) {
        console.error('Failed to load Fixzy initial diagnostic data:', err);
      } finally {
        setIsLoading(false);
      }
    }

    loadInitialData();
    return undefined;
  }, [isDemoMode]);

  useEffect(() => {
    const isDashboardPath = path === '/dashboard' || path.startsWith('/dashboard/');
    if (!isDashboardPath) {
      setOverviewLoading(false);
      return undefined;
    }

    let cancelled = false;
    setOverviewError(null);
    setOverviewLoading(true);

    if (isDemoMode) {
      fetchAllAiDiagnosisCases().then(setDiagnosisCases);
      fetchFrictionIssues().then(setIssues);
      fetchOverviewMetrics().then((demoMetrics) => {
        if (!cancelled) {
          setMetrics({ ...demoMetrics, hasRecords: true, isDemoData: true });
          setOverviewLoading(false);
        }
      });
      return () => { cancelled = true; };
    }

    getDiagnosis()
      .then((backendData) => {
        console.log('FIXZY BACKEND DATA:', backendData);
        if (!cancelled) {
          setBackendDiagnosis(backendData);
          setMetrics(mapDiagnosisToOverview(backendData));
          setIssues(mapDiagnosisToIssues(backendData));
        }
      })
      .catch((error) => {
        if (!cancelled) {
          setMetrics(null);
          setOverviewError(error.message || 'We could not load your behavioral records.');
        }
      })
      .finally(() => {
        if (!cancelled) setOverviewLoading(false);
      });

    return () => { cancelled = true; };
  }, [dataSource, isDemoMode, path]);

  if (!isReady) return null;
  if (path === '/login') return <LoginPage navigate={navigate} />;
  if (path === '/signup') return <SignupPage navigate={navigate} />;
  if (!user && dataSource !== 'demo' && path !== '/') return null;

  const handleSelectIssue = (issue) => {
    setSelectedIssue(issue);
    setActiveTab('diagnosis');
  };

  const handleNavigateTab = (tabId) => {
    setActiveTab(tabId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-light-bg dark:bg-dark-bg text-light-text dark:text-dark-text flex flex-col font-sans">
      {/* Global Navbar */}
      <Navbar
        isDashboard={isDashboard}
        setIsDashboard={setIsDashboard}
      />

      {/* Main View Area */}
      {!isDashboard ? (
        // Public SaaS Landing Page
        <LandingPage onOpenDashboard={() => navigate('/login')} />
      ) : isAccountPage ? (
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
          <ProfileView navigate={navigate} />
        </main>
      ) : (
        // Full Dashboard Experience
        <div className="flex-1 flex overflow-hidden">
          {/* Persistent Sidebar */}
          <Sidebar activeTab={activeTab} setActiveTab={handleNavigateTab} />

          {/* Main Dashboard Content Area */}
          <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
            {isDemoMode && <DemoBanner onConnectReal={() => navigate('/login', true)} onExitDemo={() => { disconnectSource(); navigate('/'); }} />}
            {isLoading || overviewLoading ? (
              <div className="h-96 flex items-center justify-center space-x-3 text-sm text-indigo-400 font-mono">
                <div className="w-5 h-5 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                <span>Initializing Fixzy Diagnostic Layer...</span>
              </div>
            ) : (
              <>
                {activeTab === 'overview' && overviewError && (
                  <EmptyState
                    title="Insights unavailable"
                    description="We could not load behavioral records right now. Please try again later."
                    showActions={false}
                  />
                )}

                {activeTab === 'overview' && !overviewError && metrics && (
                  <OverviewView
                    metrics={metrics}
                    issues={metrics.isDemoData ? issues : metrics.issues}
                    hasData={Boolean(metrics.hasRecords)}
                    onNavigateTab={handleNavigateTab}
                    onSelectIssue={handleSelectIssue}
                  />
                )}

                {activeTab === 'issues' && (
                  overviewError && dataSource !== 'demo' && !user?.isDemo ? (
                    <EmptyState
                      title="Friction issues unavailable"
                      description="We could not load behavioral records right now. Please try again later."
                      showActions={false}
                    />
                  ) : (
                    <FrictionIssuesView
                      issues={issues}
                      onSelectIssue={handleSelectIssue}
                      onNavigateTab={handleNavigateTab}
                    />
                  )
                )}

                {activeTab === 'diagnosis' && (
                  (isDemoMode ? diagnosisCases.length > 0 : !overviewLoading) &&
                  (
                  <AiDiagnosisView
                    diagnosisCases={isDemoMode ? diagnosisCases : []}
                    backendDiagnosis={backendDiagnosis ? mapDiagnosisToCase(backendDiagnosis) : null}
                    isDemoMode={isDemoMode}
                    diagnosisError={overviewError}
                    selectedIssue={selectedIssue}
                    onNavigateTab={handleNavigateTab}
                  />
                  )
                )}

                {activeTab === 'journeys' && (
                  overviewError && !isDemoMode ? (
                    <EmptyState
                      title="User journeys unavailable"
                      description="We could not load behavioral sessions right now. Please try again later."
                      showActions={false}
                    />
                  ) : (
                    (isDemoMode ? journeySteps.length > 0 : !overviewLoading) && (
                      <UserJourneysView
                        journeySteps={isDemoMode ? journeySteps : []}
                        sessions={isDemoMode ? [] : (backendDiagnosis?.sessions || [])}
                        isDemoMode={isDemoMode}
                        onNavigateTab={handleNavigateTab}
                      />
                    )
                  )
                )}

                {activeTab === 'cohorts' && (
                  overviewError && !isDemoMode ? (
                    <EmptyState
                      title="Cohort data unavailable"
                      description="We could not load behavioral sessions right now. Please try again later."
                      showActions={false}
                    />
                  ) : (
                    (isDemoMode ? cohortData : !overviewLoading) && (
                      <CohortComparisonView
                        cohortData={cohortData}
                        backendCohort={backendDiagnosis ? mapDiagnosisToCohort(backendDiagnosis) : null}
                        isDemoMode={isDemoMode}
                        onNavigateTab={handleNavigateTab}
                      />
                    )
                  )
                )}

                {activeTab === 'agents' && (isDemoMode && agentData ? (
                  <HumanVsAgentView agentData={agentData} />
                ) : !isDemoMode ? (
                  <EmptyState title="Human vs AI data unavailable" description="This analysis requires backend data that is not available yet." showActions={false} />
                ) : null)}

                {activeTab === 'trends' && (isDemoMode && trends ? (
                  <TrendsView trendsData={trends} />
                ) : !isDemoMode ? (
                  <EmptyState title="Trend data unavailable" description="Historical trend data is not available from the backend yet." showActions={false} />
                ) : null)}

                {activeTab === 'experiments' && (isDemoMode && experiments ? (
                  <ExperimentsView
                    experimentsData={experiments}
                    onNavigateTab={handleNavigateTab}
                  />
                ) : !isDemoMode ? (
                  <EmptyState title="Experiment data unavailable" description="Experiment results are not available from the backend yet." showActions={false} />
                ) : null)}

                {activeTab === 'privacy' && (isDemoMode && privacy ? (
                  <PrivacyView privacyConfig={privacy} />
                ) : !isDemoMode ? (
                  <EmptyState title="Privacy data unavailable" description="Privacy configuration is not available from the backend yet." showActions={false} />
                ) : null)}

                {activeTab === 'sources' && (
                  <EmptyState
                    title="Choose a data source"
                    description="Connect your website or upload a dataset to activate Fixzy's behavioral analysis."
                  />
                )}

              </>
            )}
          </main>
        </div>
      )}

      {activeModal === 'connect-website' && <ConnectWebsiteModal />}
      {activeModal === 'interactive-demo' && <InteractiveDemoModal />}
      {activeModal === 'upload-dataset' && <UploadDatasetModal />}
      {activeModal === 'settings' && <SettingsModal />}
    </div>
  );
}

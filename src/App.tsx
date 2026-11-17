import React, { useState, useEffect, Suspense, lazy } from 'react';
import { AccessibilityProvider } from './context/AccessibilityContext';
import { Header } from './components/Header';
import { ThermalInversionAlert } from './components/ThermalInversionAlert';
import { AqiDashboard } from './components/AqiDashboard';
import { AirQualityData } from './types';
import { apiClient } from './services/apiClient';
import { ShieldCheck } from 'lucide-react';

// Dynamic route code-splitting for optimal First Contentful Paint (FCP)
const RoutinePlanner = lazy(() => import('./components/RoutinePlanner').then(m => ({ default: m.RoutinePlanner })));
const IndoorAirLab = lazy(() => import('./components/IndoorAirLab').then(m => ({ default: m.IndoorAirLab })));
const ImpactCalculator = lazy(() => import('./components/ImpactCalculator').then(m => ({ default: m.ImpactCalculator })));
const GenAiAssistant = lazy(() => import('./components/GenAiAssistant').then(m => ({ default: m.GenAiAssistant })));
const CommunitySmogWatch = lazy(() => import('./components/CommunitySmogWatch').then(m => ({ default: m.CommunitySmogWatch })));

const ComponentSkeleton: React.FC = () => (
  <div className="rounded-2xl p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 animate-pulse space-y-4">
    <div className="h-6 w-1/3 bg-slate-200 dark:bg-slate-800 rounded"></div>
    <div className="h-4 w-2/3 bg-slate-100 dark:bg-slate-800/60 rounded"></div>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
      <div className="h-28 bg-slate-100 dark:bg-slate-800 rounded-xl"></div>
      <div className="h-28 bg-slate-100 dark:bg-slate-800 rounded-xl"></div>
      <div className="h-28 bg-slate-100 dark:bg-slate-800 rounded-xl"></div>
    </div>
  </div>
);

export const AppContent: React.FC = () => {
  const [currentCity, setCurrentCity] = useState<string>('delhi');
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [aqiData, setAqiData] = useState<AirQualityData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchAqi = async (city: string) => {
    setLoading(true);
    try {
      const data = await apiClient.getAirQuality(city);
      setAqiData(data);
    } catch (err) {
      console.error('Failed to load telemetry', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAqi(currentCity);
  }, [currentCity]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      {/* Sticky Header with Navigation & Accessibility Controls */}
      <Header
        currentCity={currentCity}
        onCityChange={city => {
          setCurrentCity(city);
          fetchAqi(city);
        }}
        aqiData={aqiData}
        activeTab={activeTab}
        onTabChange={tab => setActiveTab(tab)}
      />

      {/* Main Content Area */}
      <main id="main-content" className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Winter Thermal Inversion Urgent Alert Strip */}
        {aqiData && aqiData.thermalInversion.active && (
          <ThermalInversionAlert
            inversion={aqiData.thermalInversion}
            safeWindow={aqiData.safeVentilationWindow}
            worstWindow={aqiData.worstExposureWindow}
            onNavigateToRoutine={() => setActiveTab('routine')}
          />
        )}

        {/* Dynamic Tab Views with Suspense */}
        {loading && !aqiData ? (
          <div className="py-24 flex flex-col items-center justify-center space-y-3">
            <div className="w-10 h-10 border-4 border-cyan-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-sm font-semibold text-slate-500">
              Initializing SmogGuard Atmospheric Telemetry...
            </p>
          </div>
        ) : (
          <Suspense fallback={<ComponentSkeleton />}>
            {activeTab === 'dashboard' && aqiData && (
              <AqiDashboard
                data={aqiData}
                onNavigateToHacks={() => setActiveTab('hacks')}
              />
            )}

            {activeTab === 'routine' && (
              <RoutinePlanner currentCity={currentCity} />
            )}

            {activeTab === 'hacks' && (
              <IndoorAirLab />
            )}

            {activeTab === 'impact' && (
              <ImpactCalculator currentCity={currentCity} />
            )}

            {activeTab === 'assistant' && (
              <GenAiAssistant
                currentCity={currentCity}
                onNavigateTab={tab => setActiveTab(tab)}
              />
            )}

            {activeTab === 'community' && (
              <CommunitySmogWatch />
            )}
          </Suspense>
        )}
      </main>

      {/* Accessible Footer */}
      <footer className="mt-auto border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-6 text-xs text-slate-500 dark:text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-cyan-600 dark:text-cyan-400" aria-hidden="true" />
            <span>
              SmogGuard AI • Built for <strong>Urban Air Quality & Severe Winter Smog Protection</strong>
            </span>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <span>Calibrated to EPA AQI & WHO Guidelines</span>
            <span>•</span>
            <span>WCAG 2.1 AA Compliant</span>
            <span>•</span>
            <span>Zero-Data-Leak Privacy Architecture</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <AccessibilityProvider>
      <AppContent />
    </AccessibilityProvider>
  );
};

export default App;

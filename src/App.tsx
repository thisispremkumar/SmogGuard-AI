import React, { useState, useEffect } from 'react';
import { AccessibilityProvider } from './context/AccessibilityContext';
import { Header } from './components/Header';
import { ThermalInversionAlert } from './components/ThermalInversionAlert';
import { AqiDashboard } from './components/AqiDashboard';
import { RoutinePlanner } from './components/RoutinePlanner';
import { IndoorAirLab } from './components/IndoorAirLab';
import { ImpactCalculator } from './components/ImpactCalculator';
import { GenAiAssistant } from './components/GenAiAssistant';
import { CommunitySmogWatch } from './components/CommunitySmogWatch';
import { AirQualityData } from './types';
import { ShieldCheck, HeartHandshake, CloudLightning, Info } from 'lucide-react';

export const AppContent: React.FC = () => {
  const [currentCity, setCurrentCity] = useState<string>('delhi');
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [aqiData, setAqiData] = useState<AirQualityData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAqi = async (city: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/aqi?city=${encodeURIComponent(city)}`);
      const data = await res.json();
      if (data.status === 'success') {
        setAqiData(data.data);
      } else {
        setError(data.message || 'Failed to fetch air quality');
      }
    } catch (err) {
      setError('Unable to load telemetry. Checking connection...');
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

        {/* Dynamic Tab Views */}
        {loading && !aqiData ? (
          <div className="py-24 flex flex-col items-center justify-center space-y-3">
            <div className="w-10 h-10 border-4 border-cyan-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-sm font-semibold text-slate-500">
              Initializing SmogGuard Atmospheric Telemetry...
            </p>
          </div>
        ) : (
          <>
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
          </>
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


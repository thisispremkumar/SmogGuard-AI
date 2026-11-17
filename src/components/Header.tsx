import React from 'react';
import { CloudFog, Eye, Type, Bell, MapPin, Sparkles, Home, Calendar, Wrench, BarChart3, MessageSquare, Users } from 'lucide-react';
import { useAccessibility } from '../context/AccessibilityContext';
import { AirQualityData } from '../types';
import { getAqiBadgeInfo } from '../utils/aqiHelpers';

interface HeaderProps {
  currentCity: string;
  onCityChange: (city: string) => void;
  aqiData: AirQualityData | null;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const CITIES = [
  { slug: 'delhi', label: 'New Delhi, India' },
  { slug: 'salt-lake-city', label: 'Salt Lake City, USA' },
  { slug: 'krakow', label: 'Krakow, Poland' },
  { slug: 'beijing', label: 'Beijing, China' },
  { slug: 'milan', label: 'Milan, Italy' },
  { slug: 'london', label: 'London, UK' },
  { slug: 'lahore', label: 'Lahore, Pakistan' },
];

export const Header: React.FC<HeaderProps> = ({
  currentCity,
  onCityChange,
  aqiData,
  activeTab,
  onTabChange,
}) => {
  const { highContrast, toggleHighContrast, textScale, setTextScale, announceToScreenReader } = useAccessibility();

  const badgeInfo = aqiData ? getAqiBadgeInfo(aqiData.aqi, highContrast) : null;

  const handleCitySelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newCity = e.target.value;
    onCityChange(newCity);
    announceToScreenReader(`Switched city to ${newCity}`);
  };

  const navItems = [
    { id: 'dashboard', label: 'Smog Dashboard', icon: Home },
    { id: 'routine', label: 'Routine Planner', icon: Calendar },
    { id: 'hacks', label: 'Indoor Air Lab', icon: Wrench },
    { id: 'impact', label: 'Impact Simulator', icon: BarChart3 },
    { id: 'assistant', label: 'AI Advisory', icon: Sparkles },
    { id: 'community', label: 'Smog Watch', icon: Users },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo & Branding */}
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-tr from-cyan-600 to-sky-500 text-white shadow-md shadow-cyan-500/20">
              <CloudFog className="w-6 h-6" aria-hidden="true" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xl tracking-tight text-slate-900 dark:text-white">
                  SmogGuard<span className="text-cyan-600 dark:text-cyan-400">AI</span>
                </span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-cyan-100 text-cyan-800 dark:bg-cyan-900/60 dark:text-cyan-200 font-semibold uppercase tracking-wider">
                  Winter Defense
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 hidden sm:block">
                GenAI Urban Smog & Inversion Protection for Families
              </p>
            </div>
          </div>

          {/* Location Selector & Real-Time AQI Capsule */}
          <div className="flex items-center gap-3">
            <div className="relative flex items-center">
              <MapPin className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" aria-hidden="true" />
              <label htmlFor="city-select" className="sr-only">Select City Location</label>
              <select
                id="city-select"
                value={currentCity}
                onChange={handleCitySelect}
                className="pl-9 pr-8 py-1.5 text-sm font-medium bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-lg border border-slate-300 dark:border-slate-700 focus:ring-2 focus:ring-cyan-500 cursor-pointer"
              >
                {CITIES.map(c => (
                  <option key={c.slug} value={c.slug}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>

            {/* AQI Quick Pill */}
            {badgeInfo && aqiData && (
              <div
                className={`hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold ${badgeInfo.badgeClass}`}
                role="status"
                aria-label={badgeInfo.ariaLabel}
              >
                <span className="w-2.5 h-2.5 rounded-full bg-current animate-pulse"></span>
                <span>AQI {aqiData.aqi}</span>
                <span className="opacity-80">({badgeInfo.category})</span>
              </div>
            )}

            {/* Accessibility Controls */}
            <div className="flex items-center gap-1 border-l border-slate-200 dark:border-slate-700 pl-2">
              <button
                onClick={toggleHighContrast}
                className={`p-2 rounded-lg text-sm transition-colors ${
                  highContrast
                    ? 'bg-amber-400 text-black font-bold ring-2 ring-amber-500'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
                aria-label={`Toggle high contrast mode. Currently ${highContrast ? 'On' : 'Off'}`}
                title="Toggle High Contrast (WCAG AA)"
              >
                <Eye className="w-4 h-4" />
                <span className="sr-only">Toggle High Contrast</span>
              </button>

              <button
                onClick={() => {
                  const nextScale = textScale === 'normal' ? 'large' : textScale === 'large' ? 'extra-large' : 'normal';
                  setTextScale(nextScale);
                  announceToScreenReader(`Text size set to ${nextScale}`);
                }}
                className={`p-2 rounded-lg text-sm transition-colors ${
                  textScale !== 'normal'
                    ? 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-200 font-bold'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
                aria-label={`Text size is ${textScale}. Click to cycle size.`}
                title="Cycle Text Scale (Normal, Large, Extra Large)"
              >
                <Type className="w-4 h-4" />
                <span className="sr-only">Text Size: {textScale}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav
          className="flex space-x-1 sm:space-x-2 overflow-x-auto py-2 no-scrollbar"
          aria-label="Application sections"
        >
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onTabChange(item.id);
                  announceToScreenReader(`Switched to ${item.label}`);
                }}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-cyan-600 text-white shadow-sm font-semibold'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                }`}
                aria-current={isActive ? 'page' : undefined}
              >
                <Icon className="w-4 h-4" aria-hidden="true" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};


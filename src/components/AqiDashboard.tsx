import React from 'react';
import { Wind, Droplets, Thermometer, ShieldAlert, CheckCircle, AlertTriangle, AlertCircle, Clock, Info } from 'lucide-react';
import { AirQualityData } from '../types';
import { getAqiBadgeInfo } from '../utils/aqiHelpers';
import { useAccessibility } from '../context/AccessibilityContext';

interface AqiDashboardProps {
  data: AirQualityData;
  onNavigateToHacks: () => void;
}

export const AqiDashboard: React.FC<AqiDashboardProps> = ({ data, onNavigateToHacks }) => {
  const { highContrast } = useAccessibility();
  const badge = getAqiBadgeInfo(data.aqi, highContrast);

  const getPollutantStatus = (val: number, standard: number) => {
    const ratio = val / standard;
    if (ratio <= 1.0) return { label: 'Within WHO Safe Limit', color: 'text-emerald-600 dark:text-emerald-400' };
    if (ratio <= 2.5) return { label: `${ratio.toFixed(1)}x WHO Limit`, color: 'text-amber-600 dark:text-amber-400' };
    return { label: `${ratio.toFixed(1)}x WHO Limit (Hazardous)`, color: 'text-rose-600 dark:text-rose-400 font-bold' };
  };

  return (
    <div className="space-y-6">
      {/* Top Banner: Hero AQI Gauge & Meteorological Context */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main AQI Meter */}
        <div className={`lg:col-span-2 rounded-2xl p-6 border shadow-sm transition-all ${badge.bgLightClass}`}>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Real-Time Atmospheric Monitor
                </span>
                <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
                {data.city}, {data.country}
              </h1>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Primary Contaminant: <span className="font-semibold text-slate-900 dark:text-slate-100">{data.primaryPollutant}</span>
              </p>
            </div>

            {/* Big Badge Indicator */}
            <div className={`px-5 py-3 rounded-2xl border-2 flex flex-col items-center justify-center shrink-0 ${badge.badgeClass}`}>
              <span className="text-xs font-semibold uppercase tracking-wider opacity-90">US AQI INDEX</span>
              <span className="text-4xl sm:text-5xl font-black">{data.aqi}</span>
              <span className="text-sm font-bold mt-0.5">{badge.category}</span>
            </div>
          </div>

          {/* Environmental Health Context Warning */}
          <div className="mt-6 pt-5 border-t border-slate-200/60 dark:border-slate-800/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="text-sm text-slate-700 dark:text-slate-300">
              <strong>Health Advisory: </strong>
              {data.aqi > 200
                ? 'Severe pulmonary stress conditions. Healthy adults experience throat irritation; asthmatics and children face acute bronchospasm risks.'
                : data.aqi > 100
                ? 'Sensitive groups should avoid prolonged outdoor exertion. Wear an N95 mask during morning transit.'
                : 'Air quality is satisfactory. Routine activities can proceed without special precautions.'}
            </div>

            <button
              onClick={onNavigateToHacks}
              className="text-xs font-bold text-cyan-600 dark:text-cyan-400 hover:underline shrink-0 flex items-center gap-1"
            >
              <span>Explore DIY Indoor Protections</span>
              <span>→</span>
            </button>
          </div>
        </div>

        {/* Local Winter Meteorology & Inversion Factors */}
        <div className="rounded-2xl p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Winter Stagnation Factors
            </h2>
            <div className="mt-4 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5 text-slate-600 dark:text-slate-300">
                  <Thermometer className="w-4 h-4 text-sky-500" aria-hidden="true" />
                  <span className="text-sm">Surface Temp</span>
                </div>
                <span className="text-base font-bold text-slate-900 dark:text-white">{data.temperature}°C</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5 text-slate-600 dark:text-slate-300">
                  <Droplets className="w-4 h-4 text-cyan-500" aria-hidden="true" />
                  <span className="text-sm">Relative Humidity</span>
                </div>
                <span className="text-base font-bold text-slate-900 dark:text-white">{data.humidity}%</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5 text-slate-600 dark:text-slate-300">
                  <Wind className="w-4 h-4 text-teal-500" aria-hidden="true" />
                  <span className="text-sm">Ground Wind Speed</span>
                </div>
                <span className="text-base font-bold text-slate-900 dark:text-white">{data.windSpeed} km/h (Calm)</span>
              </div>
            </div>
          </div>

          <div className="mt-4 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 text-xs text-slate-600 dark:text-slate-400">
            <strong>Stagnation Risk: </strong>
            Low ground wind (&lt; 5 km/h) prevents atmospheric dispersion, keeping smog bottled inside the city.
          </div>
        </div>
      </div>

      {/* Pollutant Breakdown Cards */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            Comprehensive Pollutant Breakdown
          </h2>
          <span className="text-xs text-slate-500 dark:text-slate-400">
            Benchmarked against World Health Organization (WHO) air quality guidelines
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {/* PM2.5 */}
          <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">PM2.5 (Fine)</span>
            <div className="mt-1 text-2xl font-black text-slate-900 dark:text-white">
              {data.pollutants.pm25} <span className="text-xs font-normal text-slate-500">µg/m³</span>
            </div>
            <p className={`text-xs mt-1 ${getPollutantStatus(data.pollutants.pm25, 15).color}`}>
              {getPollutantStatus(data.pollutants.pm25, 15).label}
            </p>
          </div>

          {/* PM10 */}
          <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">PM10 (Coarse)</span>
            <div className="mt-1 text-2xl font-black text-slate-900 dark:text-white">
              {data.pollutants.pm10} <span className="text-xs font-normal text-slate-500">µg/m³</span>
            </div>
            <p className={`text-xs mt-1 ${getPollutantStatus(data.pollutants.pm10, 45).color}`}>
              {getPollutantStatus(data.pollutants.pm10, 45).label}
            </p>
          </div>

          {/* NO2 */}
          <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">NO₂ (Nitrogen)</span>
            <div className="mt-1 text-2xl font-black text-slate-900 dark:text-white">
              {data.pollutants.no2} <span className="text-xs font-normal text-slate-500">µg/m³</span>
            </div>
            <p className={`text-xs mt-1 ${getPollutantStatus(data.pollutants.no2, 25).color}`}>
              {getPollutantStatus(data.pollutants.no2, 25).label}
            </p>
          </div>

          {/* SO2 */}
          <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">SO₂ (Sulfur)</span>
            <div className="mt-1 text-2xl font-black text-slate-900 dark:text-white">
              {data.pollutants.so2} <span className="text-xs font-normal text-slate-500">µg/m³</span>
            </div>
            <p className={`text-xs mt-1 ${getPollutantStatus(data.pollutants.so2, 40).color}`}>
              {getPollutantStatus(data.pollutants.so2, 40).label}
            </p>
          </div>

          {/* CO */}
          <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">CO (Carbon Monoxide)</span>
            <div className="mt-1 text-2xl font-black text-slate-900 dark:text-white">
              {data.pollutants.co} <span className="text-xs font-normal text-slate-500">mg/m³</span>
            </div>
            <p className="text-xs mt-1 text-emerald-600 dark:text-emerald-400">
              Within Safe Limits
            </p>
          </div>

          {/* Ozone */}
          <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">O₃ (Ozone)</span>
            <div className="mt-1 text-2xl font-black text-slate-900 dark:text-white">
              {data.pollutants.o3} <span className="text-xs font-normal text-slate-500">µg/m³</span>
            </div>
            <p className="text-xs mt-1 text-emerald-600 dark:text-emerald-400">
              Low (Winter suppressed)
            </p>
          </div>
        </div>
      </div>

      {/* 24-Hour Diurnal Smog & Inversion Curve */}
      <div className="rounded-2xl p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              24-Hour Winter Smog & Inversion Forecast
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Notice how ground inversion peaks at 07:00, then solar convection dilutes PM2.5 between 13:00 and 15:30.
            </p>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-emerald-500"></span>
              <span className="text-slate-600 dark:text-slate-400">Golden Window (Safe Air)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-rose-500"></span>
              <span className="text-slate-600 dark:text-slate-400">Inversion Trap (Hazard)</span>
            </div>
          </div>
        </div>

        {/* Visual Bar Graph */}
        <div className="overflow-x-auto pb-2">
          <div className="min-w-[680px] h-44 flex items-end gap-1.5 pt-6 border-b border-slate-200 dark:border-slate-800">
            {data.forecastHourly.map(pt => {
              const maxPm = 350;
              const heightPct = Math.min(100, Math.max(12, Math.round((pt.pm25 / maxPm) * 100)));
              const isGolden = pt.hour >= 13 && pt.hour <= 15;
              const isMorningPeak = pt.hour >= 6 && pt.hour <= 9;

              let barColor = 'bg-cyan-500 dark:bg-cyan-600';
              if (isGolden) barColor = 'bg-emerald-500 dark:bg-emerald-400 ring-2 ring-emerald-300';
              else if (isMorningPeak || pt.aqi > 250) barColor = 'bg-rose-500 dark:bg-rose-600';

              return (
                <div key={pt.hour} className="flex-1 flex flex-col items-center h-full justify-end group relative">
                  {/* Tooltip on hover/focus */}
                  <div className="opacity-0 group-hover:opacity-100 group-focus:opacity-100 transition-opacity absolute -top-12 z-20 bg-slate-900 text-white text-[11px] rounded px-2 py-1 pointer-events-none whitespace-nowrap shadow-md">
                    {pt.time}: PM2.5 {pt.pm25} µg/m³ (AQI {pt.aqi})
                  </div>

                  {/* The Bar */}
                  <div
                    tabIndex={0}
                    role="img"
                    aria-label={`${pt.time}: PM2.5 ${pt.pm25} micrograms per cubic meter, AQI ${pt.aqi}`}
                    style={{ height: `${heightPct}%` }}
                    className={`w-full rounded-t-md transition-all hover:brightness-110 focus:ring-2 focus:ring-cyan-400 ${barColor}`}
                  ></div>

                  {/* Hour Label */}
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 mt-2 font-mono">
                    {pt.hour % 3 === 0 ? pt.time : ''}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};


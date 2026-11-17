import React, { useState, useEffect } from 'react';
import { BarChart3, Heart, TreePine, Car, Flame, ShieldCheck, Sparkles, HelpCircle } from 'lucide-react';
import { ImpactCalculation } from '../types';

interface ImpactCalculatorProps {
  currentCity: string;
}

export const ImpactCalculator: React.FC<ImpactCalculatorProps> = ({ currentCity }) => {
  const [carpoolDays, setCarpoolDays] = useState<number>(3);
  const [heatingTempDrop, setHeatingTempDrop] = useState<number>(1.5);
  const [diyFilterActive, setDiyFilterActive] = useState<boolean>(true);
  const [transitShift, setTransitShift] = useState<boolean>(false);
  const [impact, setImpact] = useState<ImpactCalculation | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const calculate = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/impact/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          carpoolDaysPerWeek: carpoolDays,
          heatingTempDropDegC: heatingTempDrop,
          diyFilterActive,
          transitShift,
        }),
      });
      const data = await res.json();
      if (data.status === 'success') {
        setImpact(data.data);
      }
    } catch (err) {
      console.error('Impact calculation failed', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    calculate();
  }, [carpoolDays, heatingTempDrop, diyFilterActive, transitShift]);

  return (
    <div className="space-y-6">
      {/* Intro Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
          Direct Impact & Health Consequence Simulator
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
          Adjust your family's daily lifestyle variables below to observe the mathematical, clinical, and environmental consequences on your lungs and your neighborhood's inversion layer.
        </p>
      </div>

      {/* Simulator Control Grid */}
      <section
        aria-labelledby="controls-heading"
        className="rounded-2xl p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm"
      >
        <h2 id="controls-heading" className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-4">
          Household Lifestyle Action Sliders
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Carpooling slider */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-bold">
              <label htmlFor="carpool-slider" className="text-slate-700 dark:text-slate-300">
                Carpooling / Ride-sharing
              </label>
              <span className="text-cyan-600 dark:text-cyan-400 font-mono">{carpoolDays} days/week</span>
            </div>
            <input
              id="carpool-slider"
              type="range"
              min="0"
              max="5"
              step="1"
              value={carpoolDays}
              onChange={e => setCarpoolDays(Number(e.target.value))}
              className="w-full accent-cyan-600 cursor-pointer"
            />
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Cuts cold engine starts and idling tailpipe emissions.
            </p>
          </div>

          {/* Heating setback slider */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-bold">
              <label htmlFor="thermostat-slider" className="text-slate-700 dark:text-slate-300">
                Thermostat Setback
              </label>
              <span className="text-amber-600 dark:text-amber-400 font-mono">-{heatingTempDrop}°C (67°F)</span>
            </div>
            <input
              id="thermostat-slider"
              type="range"
              min="0"
              max="3"
              step="0.5"
              value={heatingTempDrop}
              onChange={e => setHeatingTempDrop(Number(e.target.value))}
              className="w-full accent-amber-500 cursor-pointer"
            />
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Each 1°C saves ~7% of heating fuel & combustion particulates.
            </p>
          </div>

          {/* DIY Filter Toggle */}
          <div className="space-y-2">
            <span className="block text-xs font-bold text-slate-700 dark:text-slate-300">
              Continuous Indoor Air Cleaning
            </span>
            <label className="flex items-center gap-2 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 cursor-pointer bg-slate-50 dark:bg-slate-800/40">
              <input
                type="checkbox"
                checked={diyFilterActive}
                onChange={e => setDiyFilterActive(e.target.checked)}
                className="w-4 h-4 rounded text-cyan-600 focus:ring-cyan-500"
              />
              <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                Running DIY Corsi-Rosenthal / HEPA Box
              </span>
            </label>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Filters ~90% of PM2.5 in living spaces.
            </p>
          </div>

          {/* Transit Shift Toggle */}
          <div className="space-y-2">
            <span className="block text-xs font-bold text-slate-700 dark:text-slate-300">
              Full Transit Shift
            </span>
            <label className="flex items-center gap-2 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 cursor-pointer bg-slate-50 dark:bg-slate-800/40">
              <input
                type="checkbox"
                checked={transitShift}
                onChange={e => setTransitShift(e.target.checked)}
                className="w-4 h-4 rounded text-cyan-600 focus:ring-cyan-500"
              />
              <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                Shift to Electric Metro / Bus
              </span>
            </label>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Zero individual tailpipe emissions.
            </p>
          </div>
        </div>
      </section>

      {/* Impact Calculation Results */}
      {impact && (
        <div className="space-y-6">
          {/* Plain English Impact Narrative */}
          <div className="rounded-2xl p-5 bg-gradient-to-r from-emerald-600 to-teal-700 text-white shadow-md">
            <div className="flex items-start gap-3">
              <Sparkles className="w-6 h-6 text-emerald-200 shrink-0 mt-0.5" aria-hidden="true" />
              <div>
                <span className="text-xs font-bold uppercase tracking-wider opacity-90">
                  Direct Impact Synthesis
                </span>
                <p className="mt-1 text-sm font-medium leading-relaxed">
                  {impact.narrativeExplanation}
                </p>
              </div>
            </div>
          </div>

          {/* Two-Column Comparison: Personal Health vs Community Benefit */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Personal Family Health Protection */}
            <div className="rounded-2xl p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 font-bold text-base border-b border-slate-200 dark:border-slate-800 pb-3">
                <Heart className="w-5 h-5" aria-hidden="true" />
                <span>Personal & Family Pulmonary Protection</span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800">
                  <span className="text-xs text-slate-500">Inhaled PM2.5 Prevented</span>
                  <div className="text-2xl font-black text-slate-900 dark:text-white mt-0.5">
                    {impact.personalImpact.pm25InhaledDosageReductionUg} <span className="text-xs font-normal text-slate-500">µg/day</span>
                  </div>
                  <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                    -{impact.personalImpact.pm25PercentReduction}% Personal Exposure
                  </span>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800">
                  <span className="text-xs text-slate-500">Indoor Concentration</span>
                  <div className="text-2xl font-black text-slate-900 dark:text-white mt-0.5">
                    {impact.personalImpact.indoorConcentrationEstimate} <span className="text-xs font-normal text-slate-500">µg/m³</span>
                  </div>
                  <span className="text-xs font-semibold text-slate-500">
                    {impact.personalImpact.indoorConcentrationEstimate <= 15 ? '✓ Meets WHO limit' : 'Filtered microclimate'}
                  </span>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                <strong>Clinical Risk Assessment: </strong>
                {impact.personalImpact.acuteRespiratoryRiskReduction}
              </div>
            </div>

            {/* Community Environmental Contribution */}
            <div className="rounded-2xl p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold text-base border-b border-slate-200 dark:border-slate-800 pb-3">
                <TreePine className="w-5 h-5" aria-hidden="true" />
                <span>Community & Inversion Layer Relief</span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800">
                  <span className="text-xs text-slate-500">Weekly CO₂ Avoided</span>
                  <div className="text-2xl font-black text-slate-900 dark:text-white mt-0.5">
                    {impact.communityImpact.co2AvoidedWeeklyKg} <span className="text-xs font-normal text-slate-500">kg CO2e</span>
                  </div>
                  <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                    ={impact.communityImpact.communityTreeDaysEquivalent} Tree-Days of Carbon
                  </span>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800">
                  <span className="text-xs text-slate-500">Toxic PM2.5 Prevented</span>
                  <div className="text-2xl font-black text-slate-900 dark:text-white mt-0.5">
                    {impact.communityImpact.pm25AvoidedWeeklyGrams} <span className="text-xs font-normal text-slate-500">grams/wk</span>
                  </div>
                  <span className="text-xs font-semibold text-slate-500">
                    Kept out of neighborhood inversion
                  </span>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                <strong>Neighborhood Ripple Effect: </strong>
                Your commute and heating adjustments eliminate the equivalent of <strong>{impact.communityImpact.equivalentCarKmSaved} kilometers</strong> of single-occupancy vehicle driving every week.
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};


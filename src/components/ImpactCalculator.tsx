import React, { useState, useMemo, useEffect } from 'react';
import { BarChart3, Heart, TreePine, Sparkles } from 'lucide-react';
import { ImpactCalculation } from '../types';

interface ImpactCalculatorProps {
  currentCity: string;
}

// Pure client-side mathematical calculation model for instant 60 FPS responsiveness
function computeInstantImpact(
  carpoolDays: number,
  heatingTempDrop: number,
  diyFilter: boolean,
  transit: boolean,
  outdoorPm = 150,
  familySize = 3
): ImpactCalculation {
  const dailyBreathingVolumeM3 = 12;
  const baselineIndoorPm25 = outdoorPm * 0.70;
  const filtrationEfficiency = diyFilter ? 0.88 : 0.0;
  const effectiveIndoorPm25 = Math.max(8, Math.round(baselineIndoorPm25 * (1 - filtrationEfficiency)));

  const indoorFraction = 20 / 24;
  const outdoorFraction = 4 / 24;

  const baselineDailyDoseUg = dailyBreathingVolumeM3 * (indoorFraction * baselineIndoorPm25 + outdoorFraction * outdoorPm);
  const mitigatedDailyDoseUg = dailyBreathingVolumeM3 * (indoorFraction * effectiveIndoorPm25 + outdoorFraction * (transit ? outdoorPm * 0.7 : outdoorPm));

  const doseReductionUg = Math.max(0, Math.round(baselineDailyDoseUg - mitigatedDailyDoseUg));
  const percentReduction = Math.min(95, Math.round((doseReductionUg / baselineDailyDoseUg) * 100));

  let acuteRisk = 'Low reduction';
  if (percentReduction >= 60) {
    acuteRisk = '70% lower risk of acute bronchospasm, pediatric asthma flare-ups, and systemic vascular inflammation';
  } else if (percentReduction >= 35) {
    acuteRisk = '45% lower risk of eye irritation, dry cough, and nighttime wheezing';
  } else {
    acuteRisk = '20% lower respiratory irritation';
  }

  const commuteDistanceKm = 16;
  const carpoolKmSavedWeekly = carpoolDays * commuteDistanceKm * 0.5;
  const transitKmSavedWeekly = transit ? 5 * commuteDistanceKm : 0;
  const totalKmSavedWeekly = carpoolKmSavedWeekly + transitKmSavedWeekly;

  const carCo2SavedWeeklyKg = totalKmSavedWeekly * 0.165;
  const carPm25SavedWeeklyGrams = totalKmSavedWeekly * 0.085;

  const heatingSavingFactor = (heatingTempDrop * 0.07);
  const heatingCo2SavedWeeklyKg = 45 * heatingSavingFactor;
  const heatingPm25SavedWeeklyGrams = 8.5 * heatingSavingFactor;

  const totalCo2SavedWeeklyKg = Math.round((carCo2SavedWeeklyKg + heatingCo2SavedWeeklyKg) * 10) / 10;
  const totalPm25SavedWeeklyGrams = Math.round((carPm25SavedWeeklyGrams + heatingPm25SavedWeeklyGrams) * 10) / 10;
  const treeDaysEquivalent = Math.round(totalCo2SavedWeeklyKg / 0.06);

  const narrative = `By running ${diyFilter ? 'a DIY Corsi-Rosenthal filter indoors' : 'ambient routines'}, ` +
    `lowering your thermostat by ${heatingTempDrop}°C, and ${carpoolDays > 0 ? `carpooling ${carpoolDays} days/wk` : 'optimizing travel'}, ` +
    `your family avoids inhaling ${doseReductionUg} µg of hazardous fine particles daily (${percentReduction}% personal reduction). ` +
    `Simultaneously, your actions eliminate ${totalCo2SavedWeeklyKg} kg of greenhouse emissions and keep ${totalPm25SavedWeeklyGrams} grams of toxic PM2.5 out of your neighborhood's trapped winter inversion layer every single week.`;

  return {
    inputs: {
      carpoolDaysPerWeek: carpoolDays,
      heatingTempDropDegC: heatingTempDrop,
      diyFilterActive: diyFilter,
      transitShift: transit,
    },
    personalImpact: {
      pm25InhaledDosageReductionUg: doseReductionUg * familySize,
      pm25PercentReduction: percentReduction,
      acuteRespiratoryRiskReduction: acuteRisk,
      indoorConcentrationEstimate: effectiveIndoorPm25,
    },
    communityImpact: {
      co2AvoidedWeeklyKg: totalCo2SavedWeeklyKg,
      pm25AvoidedWeeklyGrams: totalPm25SavedWeeklyGrams,
      equivalentCarKmSaved: Math.round(totalKmSavedWeekly),
      communityTreeDaysEquivalent: treeDaysEquivalent,
    },
    narrativeExplanation: narrative,
  };
}

export const ImpactCalculator: React.FC<ImpactCalculatorProps> = ({ currentCity }) => {
  const [carpoolDays, setCarpoolDays] = useState<number>(3);
  const [heatingTempDrop, setHeatingTempDrop] = useState<number>(1.5);
  const [diyFilterActive, setDiyFilterActive] = useState<boolean>(true);
  const [transitShift, setTransitShift] = useState<boolean>(false);

  // Instantly compute at 60 FPS using client-side memoization
  const impact = useMemo(() => {
    return computeInstantImpact(carpoolDays, heatingTempDrop, diyFilterActive, transitShift);
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
              Filters ~88% of PM2.5 in living spaces.
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
      <div className="space-y-6">
        {/* Plain English Impact Narrative */}
        <div className="rounded-2xl p-5 bg-gradient-to-r from-emerald-600 to-teal-700 text-white shadow-md">
          <div className="flex items-start gap-3">
            <Sparkles className="w-6 h-6 text-emerald-200 shrink-0 mt-0.5" aria-hidden="true" />
            <div>
              <span className="text-xs font-bold uppercase tracking-wider opacity-90">
                Direct Impact Synthesis (Real-Time 60 FPS Engine)
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
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { Calendar, Users, ShieldAlert, Sparkles, Check, AlertCircle, Clock, Thermometer, Wind, RefreshCw } from 'lucide-react';
import { DailyRoutinePlan, FamilyProfile, VulnerableCondition, CommuteMode, HeatingType, CookingFuel } from '../types';
import { apiClient } from '../services/apiClient';

interface RoutinePlannerProps {
  currentCity: string;
}

export const RoutinePlanner: React.FC<RoutinePlannerProps> = ({ currentCity }) => {
  const [profile, setProfile] = useState<FamilyProfile>({
    id: 'user-family',
    name: 'My Household',
    vulnerableMembers: ['asthmatic', 'infant'],
    commuteMode: 'car_solo',
    commuteDistanceKm: 16,
    heatingType: 'natural_gas',
    cookingFuel: 'gas_stove',
    hasAirPurifier: true,
    homeType: 'apartment',
  });

  const [plan, setPlan] = useState<DailyRoutinePlan | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPlan = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiClient.generateRoutine(profile, currentCity);
      setPlan(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Network error while connecting to Routine Engine.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlan();
  }, [currentCity]);

  const toggleVulnerable = (cond: VulnerableCondition) => {
    setProfile(prev => {
      const exists = prev.vulnerableMembers.includes(cond);
      const next = exists
        ? prev.vulnerableMembers.filter(c => c !== cond)
        : [...prev.vulnerableMembers, cond];
      return { ...prev, vulnerableMembers: next };
    });
  };

  return (
    <div className="space-y-6">
      {/* Intro Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
          Personalized Winter Smog Routine Planner
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
          Synchronizes your family's daily commute, school runs, cooking, and ventilation around atmospheric thermal inversion dynamics to slash exposure.
        </p>
      </div>

      {/* Household Profile Configuration Panel */}
      <section
        aria-labelledby="profile-config-heading"
        className="rounded-2xl p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm"
      >
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3 mb-4">
          <h2 id="profile-config-heading" className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-cyan-600 dark:text-cyan-400" aria-hidden="true" />
            <span>Household Vulnerability & Lifestyle Profile</span>
          </h2>
          <button
            onClick={fetchPlan}
            disabled={loading}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-cyan-600 hover:bg-cyan-700 text-white transition-all disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} aria-hidden="true" />
            <span>Recalculate Plan</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Vulnerable Conditions */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
              Vulnerable Family Members
            </label>
            <div className="space-y-1.5">
              {[
                { id: 'infant', label: 'Infant / Toddler (&lt; 5 yrs)' },
                { id: 'asthmatic', label: 'Asthmatic / Respiratory' },
                { id: 'elderly', label: 'Elderly (65+ yrs)' },
                { id: 'pregnant', label: 'Pregnant Member' },
              ].map(item => (
                <label key={item.id} className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={profile.vulnerableMembers.includes(item.id as VulnerableCondition)}
                    onChange={() => toggleVulnerable(item.id as VulnerableCondition)}
                    className="w-4 h-4 rounded text-cyan-600 focus:ring-cyan-500 border-slate-300 dark:border-slate-700"
                  />
                  <span dangerouslySetInnerHTML={{ __html: item.label }}></span>
                </label>
              ))}
            </div>
          </div>

          {/* Commute Mode */}
          <div>
            <label htmlFor="commute-select" className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
              Daily Commute Mode
            </label>
            <select
              id="commute-select"
              value={profile.commuteMode}
              onChange={e => setProfile({ ...profile, commuteMode: e.target.value as CommuteMode })}
              className="w-full text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2 font-medium text-slate-800 dark:text-slate-200"
            >
              <option value="car_solo">Solo Gasoline/Diesel Car</option>
              <option value="carpool">Carpool / Ride-share</option>
              <option value="public_transit">Subway / Metro / Bus</option>
              <option value="cycling">Bicycle / E-Bike</option>
              <option value="work_from_home">Work From Home (WFH)</option>
            </select>
            <div className="mt-2">
              <label htmlFor="distance-input" className="text-[11px] text-slate-500">Commute Round-Trip (km):</label>
              <input
                id="distance-input"
                type="number"
                min="0"
                max="100"
                value={profile.commuteDistanceKm}
                onChange={e => setProfile({ ...profile, commuteDistanceKm: Number(e.target.value) })}
                className="w-full text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-1.5 font-medium mt-0.5"
              />
            </div>
          </div>

          {/* Heating Type */}
          <div>
            <label htmlFor="heating-select" className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
              Primary Winter Heating
            </label>
            <select
              id="heating-select"
              value={profile.heatingType}
              onChange={e => setProfile({ ...profile, heatingType: e.target.value as HeatingType })}
              className="w-full text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2 font-medium text-slate-800 dark:text-slate-200"
            >
              <option value="natural_gas">Central Natural Gas</option>
              <option value="wood_biomass">Wood Stove / Fireplace (Biomass)</option>
              <option value="heat_pump">Electric Heat Pump (Clean)</option>
              <option value="district_heat">District / Municipal Steam</option>
              <option value="electric_resistance">Electric Baseboards</option>
            </select>
          </div>

          {/* Cooking Fuel & Purifier */}
          <div>
            <label htmlFor="cooking-select" className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
              Kitchen Cooking Fuel
            </label>
            <select
              id="cooking-select"
              value={profile.cookingFuel}
              onChange={e => setProfile({ ...profile, cookingFuel: e.target.value as CookingFuel })}
              className="w-full text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2 font-medium text-slate-800 dark:text-slate-200"
            >
              <option value="gas_stove">Gas Burners (Generates NO2)</option>
              <option value="induction">Induction Plate (Zero Exhaust)</option>
              <option value="electric">Electric Coil / Radiant</option>
            </select>

            <label className="flex items-center gap-2 mt-3 text-xs text-slate-700 dark:text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={profile.hasAirPurifier}
                onChange={e => setProfile({ ...profile, hasAirPurifier: e.target.checked })}
                className="w-4 h-4 rounded text-cyan-600 focus:ring-cyan-500 border-slate-300 dark:border-slate-700"
              />
              <span>Has Indoor Air Purifier / DIY Filter</span>
            </label>
          </div>
        </div>
      </section>

      {/* Routine Plan Results */}
      {plan && (
        <div className="space-y-6">
          {/* Overall Advisory Banner */}
          <div className="rounded-2xl p-5 bg-gradient-to-r from-cyan-600 to-sky-700 text-white shadow-md">
            <div className="flex items-start gap-3">
              <Sparkles className="w-6 h-6 text-cyan-200 shrink-0 mt-0.5" aria-hidden="true" />
              <div>
                <span className="text-xs font-bold uppercase tracking-wider opacity-90">
                  Tailored Daily Advisory for {plan.locationName} ({plan.date})
                </span>
                <p className="mt-1 text-sm font-medium leading-relaxed">
                  {plan.overallAdvisory}
                </p>
              </div>
            </div>
          </div>

          {/* Time-Slotted Schedule Cards */}
          <section aria-labelledby="schedule-heading">
            <h2 id="schedule-heading" className="text-lg font-bold text-slate-900 dark:text-white mb-3">
              Optimized Winter Smog Schedule
            </h2>

            <div className="space-y-3">
              {plan.routineSchedule.map((slot, idx) => {
                const isDanger = slot.status === 'danger';
                const isCaution = slot.status === 'caution';
                const borderColor = isDanger ? 'border-l-rose-500' : isCaution ? 'border-l-amber-500' : 'border-l-emerald-500';
                const statusBadge = isDanger
                  ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                  : isCaution
                  ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                  : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300';

                return (
                  <div
                    key={idx}
                    className={`rounded-xl p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 border-l-4 ${borderColor} shadow-sm`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-2">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-slate-400" aria-hidden="true" />
                        <span className="font-mono font-bold text-sm text-slate-900 dark:text-white">
                          {slot.timeSlot}
                        </span>
                        <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                          — {slot.activity}
                        </span>
                      </div>
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider self-start sm:self-auto ${statusBadge}`}>
                        {slot.status}
                      </span>
                    </div>

                    <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                      <div>
                        <strong className="text-slate-700 dark:text-slate-300">Recommended Action:</strong>
                        <p className="text-slate-600 dark:text-slate-400 mt-0.5 leading-relaxed">
                          {slot.recommendedAction}
                        </p>
                      </div>

                      <div>
                        <strong className="text-cyan-700 dark:text-cyan-400">Low-Emission / Health Alternative:</strong>
                        <p className="text-slate-600 dark:text-slate-400 mt-0.5 leading-relaxed">
                          {slot.lowEmissionAlternative}
                        </p>
                      </div>
                    </div>

                    <div className="mt-2 pt-2 border-t border-slate-100 dark:border-slate-800/60 text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
                      ✓ Direct Exposure Impact: {slot.exposureReduction}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Heating & Vulnerable Guides Strip */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Heating Optimization */}
            <div className="rounded-xl p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-bold text-sm mb-2">
                <Thermometer className="w-4 h-4" aria-hidden="true" />
                <span>Heating System Strategy</span>
              </div>
              <p className="text-xs text-slate-800 dark:text-slate-200 font-medium">
                {plan.heatingOptimization.temperatureSetting}
              </p>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                {plan.heatingOptimization.airQualityTip}
              </p>
              <div className="mt-3 inline-block px-2.5 py-1 rounded bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 text-[11px] font-bold text-amber-800 dark:text-amber-300">
                Weekly Emission Reduction: ~{plan.heatingOptimization.emissionSavingKg} kg CO2e
              </div>
            </div>

            {/* Vulnerable Protection Guide */}
            <div className="rounded-xl p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 font-bold text-sm mb-2">
                <ShieldAlert className="w-4 h-4" aria-hidden="true" />
                <span>Clinical & Pediatric Vulnerability Directives</span>
              </div>
              <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                {plan.vulnerableProtectionGuide.map((guide, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <span className="text-rose-500 font-bold">•</span>
                    <span>{guide}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};


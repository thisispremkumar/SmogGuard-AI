import React from 'react';
import { AlertTriangle, Sun, ArrowDown, Shield, Info, ArrowUpRight } from 'lucide-react';
import { ThermalInversionStatus } from '../types';

interface ThermalInversionAlertProps {
  inversion: ThermalInversionStatus;
  safeWindow: { startHour: number; endHour: number; note: string };
  worstWindow: { startHour: number; endHour: number; note: string };
  onNavigateToRoutine: () => void;
}

export const ThermalInversionAlert: React.FC<ThermalInversionAlertProps> = ({
  inversion,
  safeWindow,
  worstWindow,
  onNavigateToRoutine,
}) => {
  if (!inversion.active) return null;

  return (
    <section
      aria-labelledby="inversion-alert-heading"
      className="rounded-2xl border-2 border-amber-400/80 bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-red-500/10 dark:from-amber-950/40 dark:via-orange-950/30 dark:to-red-950/40 p-5 shadow-sm"
    >
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        {/* Main Alert Info */}
        <div className="flex items-start gap-3.5">
          <div className="p-2.5 rounded-xl bg-amber-500 text-white shadow-md shadow-amber-500/20 shrink-0">
            <AlertTriangle className="w-6 h-6 animate-pulse" aria-hidden="true" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 id="inversion-alert-heading" className="text-base font-bold text-slate-900 dark:text-slate-100">
                Active Winter Thermal Inversion Trapping Layer ({inversion.intensity.toUpperCase()} INTENSITY)
              </h2>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-200 dark:bg-amber-900/70 text-amber-900 dark:text-amber-200">
                Smog trapped below {inversion.altitudeMeters}m
              </span>
            </div>
            <p className="mt-1 text-sm text-slate-700 dark:text-slate-300 leading-relaxed max-w-3xl">
              {inversion.explanation} Cold surface air cannot rise, concentrating vehicle exhaust and heating soot near breathing level by a factor of <strong>{inversion.smogTrappingFactor}x</strong>.
            </p>
          </div>
        </div>

        {/* Quick Action Button */}
        <button
          onClick={onNavigateToRoutine}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-amber-600 hover:bg-amber-700 text-white shadow-sm transition-transform active:scale-95 shrink-0"
        >
          <span>View Inversion Routine</span>
          <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
        </button>
      </div>

      {/* Atmospheric Windows Comparison Strip */}
      <div className="mt-4 pt-4 border-t border-amber-300/40 dark:border-amber-800/40 grid grid-cols-1 md:grid-cols-2 gap-3">
        {/* Safest Window */}
        <div className="flex items-start gap-3 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30">
          <Sun className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" aria-hidden="true" />
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300">
                The Golden Window (Safest Air): {safeWindow.startHour}:00 - {safeWindow.endHour}:00
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
              {safeWindow.note}
            </p>
          </div>
        </div>

        {/* Worst Window */}
        <div className="flex items-start gap-3 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30">
          <ArrowDown className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" aria-hidden="true" />
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-rose-800 dark:text-rose-300">
                Worst Trapping Window: {worstWindow.startHour}:00 - {worstWindow.endHour}:00
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
              {worstWindow.note}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};


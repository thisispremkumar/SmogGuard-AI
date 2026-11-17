import React, { useState, useEffect } from 'react';
import { Wrench, Shield, CheckCircle2, ChevronRight, Sparkles, DollarSign, Gauge, Cpu, Box, HelpCircle } from 'lucide-react';
import { IndoorAirHack } from '../types';
import { apiClient } from '../services/apiClient';

export const IndoorAirLab: React.FC = () => {
  const [hacks, setHacks] = useState<IndoorAirHack[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedHack, setSelectedHack] = useState<IndoorAirHack | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    apiClient.getIndoorHacks()
      .then(data => {
        setHacks(data);
        if (data.length > 0) setSelectedHack(data[0]);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const categories = [
    { id: 'all', label: 'All Hacks' },
    { id: 'diy_filtration', label: 'DIY Filtration ($40 CR Box)' },
    { id: 'sanctuary_room', label: 'Bedroom Sanctuary' },
    { id: 'ventilation', label: 'Inversion Purge' },
    { id: 'source_control', label: 'Kitchen & Mask Control' },
    { id: 'plants_humidity', label: 'Humidity & Cilia' },
  ];

  const filteredHacks = selectedCategory === 'all'
    ? hacks
    : hacks.filter(h => h.category === selectedCategory);

  return (
    <div className="space-y-6">
      {/* Intro Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
          Indoor Air Quality (IAQ) Engineering Lab
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
          Low-cost, physics-backed hacks to isolate your indoor microclimate from severe outdoor winter smog and hazardous temperature inversions.
        </p>
      </div>

      {/* Category Pills */}
      <div className="flex flex-wrap gap-2" role="tablist" aria-label="Hack Categories">
        {categories.map(cat => (
          <button
            key={cat.id}
            role="tab"
            aria-selected={selectedCategory === cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              selectedCategory === cat.id
                ? 'bg-cyan-600 text-white shadow-sm'
                : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Master/Detail Split View */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Hack Cards List */}
        <div className="space-y-3">
          {filteredHacks.map(hack => {
            const isSelected = selectedHack?.id === hack.id;
            return (
              <button
                key={hack.id}
                onClick={() => setSelectedHack(hack)}
                className={`w-full text-left p-4 rounded-xl border transition-all ${
                  isSelected
                    ? 'bg-cyan-50 dark:bg-cyan-950/40 border-cyan-500 shadow-sm ring-1 ring-cyan-500'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-cyan-600 dark:text-cyan-400">
                    {hack.costLevel} • {hack.difficulty}
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[11px] font-extrabold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                    -{hack.effectivenessPm25}% PM2.5
                  </span>
                </div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white mt-1">
                  {hack.title}
                </h3>
              </button>
            );
          })}
        </div>

        {/* Right Column: Deep-Dive Blueprint Card */}
        {selectedHack && (
          <div className="lg:col-span-2 rounded-2xl p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
            {/* Header info */}
            <div className="border-b border-slate-200 dark:border-slate-800 pb-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Engineering Blueprint & Protocol
                </span>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-cyan-100 dark:bg-cyan-950 text-cyan-800 dark:text-cyan-300">
                    Cost: {selectedHack.costLevel}
                  </span>
                  <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                    Efficacy: -{selectedHack.effectivenessPm25}% PM2.5
                  </span>
                </div>
              </div>
              <h2 className="text-xl font-extrabold text-slate-900 dark:text-white mt-2">
                {selectedHack.title}
              </h2>
            </div>

            {/* If Corsi-Rosenthal Box, Show Interactive CAD Schematic */}
            {selectedHack.id === 'corsi-rosenthal-box' && (
              <div className="p-4 rounded-xl bg-slate-950 text-slate-100 border border-slate-800 font-mono text-xs">
                <div className="flex items-center justify-between text-cyan-400 font-bold mb-2">
                  <span className="flex items-center gap-1.5">
                    <Box className="w-4 h-4" />
                    <span>SCHEMATIC: 4-FILTER CUBE CONFIGURATION</span>
                  </span>
                  <span className="text-emerald-400">CADR: ~550 CFM</span>
                </div>
                <div className="bg-slate-900 p-3 rounded-lg border border-slate-800 text-[11px] leading-relaxed text-slate-300">
                  <pre className="whitespace-pre overflow-x-auto text-cyan-300">
{`        [ TOP: 20" Box Fan (Airflow Exhausts UP) ]
             ┌─────────────────────────┐
             │   (Shrouded Corners)    │
   ▲         └─────────────────────────┘         ▲
   │        ┌───────────────────────────┐        │
 MERV 13    │                           │     MERV 13
(Facing IN) │     CENTRAL LOW-PRESSURE  │   (Facing IN)
   │        │        CLEAN AIR PLENUM   │        │
   ▼        │                           │        ▼
            └───────────────────────────┘
          [ BOTTOM: Solid Sealed Cardboard Base ]`}
                  </pre>
                </div>
                <p className="mt-2 text-[11px] text-slate-400">
                  *Notice: Shrouding the fan corners eliminates the backward aerodynamic eddy vortex, increasing airflow delivery rate by 20%.
                </p>
              </div>
            )}

            {/* Materials Checklist */}
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100 mb-2">
                Required Materials & Tools
              </h3>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700 dark:text-slate-300">
                {selectedHack.materials.map((mat, idx) => (
                  <li key={idx} className="flex items-start gap-2 p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" aria-hidden="true" />
                    <span>{mat}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Step-by-Step Instructions */}
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100 mb-2">
                Construction & Execution Steps
              </h3>
              <ol className="space-y-2 text-xs text-slate-700 dark:text-slate-300">
                {selectedHack.steps.map((step, idx) => (
                  <li key={idx} className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                    <span className="w-5 h-5 rounded-full bg-cyan-600 text-white font-bold flex items-center justify-center shrink-0 text-[11px]">
                      {idx + 1}
                    </span>
                    <span className="leading-relaxed">{step}</span>
                  </li>
                ))}
              </ol>
            </div>

            {/* Environmental Science Explanation */}
            <div className="p-4 rounded-xl bg-cyan-50/70 dark:bg-cyan-950/30 border border-cyan-200 dark:border-cyan-800">
              <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-800 dark:text-cyan-300 mb-1 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" />
                <span>The Physics & Environmental Science Behind This</span>
              </h4>
              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                {selectedHack.scienceExplanation}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};


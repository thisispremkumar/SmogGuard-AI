import React, { useState, useEffect } from 'react';
import { Users, AlertTriangle, ThumbsUp, PlusCircle, ShieldCheck, Flame, Car, Building2, Sparkles } from 'lucide-react';
import { CommunityReport } from '../types';

interface PledgeStats {
  activePledges: number;
  woodStovesPaused: number;
  carpoolTripsUnified: number;
  estimatedParticulatePreventedKg: number;
}

export const CommunitySmogWatch: React.FC = () => {
  const [reports, setReports] = useState<CommunityReport[]>([]);
  const [stats, setStats] = useState<PledgeStats>({
    activePledges: 148,
    woodStovesPaused: 34,
    carpoolTripsUnified: 86,
    estimatedParticulatePreventedKg: 19.4,
  });

  const [showReportModal, setShowReportModal] = useState<boolean>(false);
  const [newNeighborhood, setNewNeighborhood] = useState<string>('');
  const [newType, setNewType] = useState<CommunityReport['type']>('wood_burning_smoke');
  const [newDetails, setNewDetails] = useState<string>('');
  const [newSeverity, setNewSeverity] = useState<CommunityReport['severity']>('warning');
  const [hasPledged, setHasPledged] = useState<boolean>(false);

  const fetchReports = async () => {
    try {
      const res = await fetch('/api/community/reports');
      const data = await res.json();
      if (data.status === 'success') {
        setReports(data.data.reports);
        setStats(data.data.stats);
      }
    } catch (err) {
      console.error('Failed to load community reports', err);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleUpvote = async (id: string) => {
    try {
      const res = await fetch(`/api/community/reports/${id}/upvote`, { method: 'POST' });
      const data = await res.json();
      if (data.status === 'success') {
        setReports(prev => prev.map(r => (r.id === id ? data.data : r)));
      }
    } catch (err) {
      console.error('Failed to upvote', err);
    }
  };

  const handleSubmitReport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNeighborhood.trim() || !newDetails.trim()) return;

    try {
      const res = await fetch('/api/community/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          neighborhood: newNeighborhood,
          type: newType,
          details: newDetails,
          severity: newSeverity,
        }),
      });
      const data = await res.json();
      if (data.status === 'success') {
        setReports(prev => [data.data, ...prev]);
        setShowReportModal(false);
        setNewNeighborhood('');
        setNewDetails('');
      }
    } catch (err) {
      console.error('Failed to create report', err);
    }
  };

  const handlePledge = async (type: 'wood_moratorium' | 'carpool' | 'sanctuary_host') => {
    try {
      const res = await fetch('/api/community/pledge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type }),
      });
      const data = await res.json();
      if (data.status === 'success') {
        setStats(data.data);
        setHasPledged(true);
      }
    } catch (err) {
      console.error('Failed to pledge', err);
    }
  };

  const getTypeBadge = (type: CommunityReport['type']) => {
    switch (type) {
      case 'wood_burning_smoke':
        return { label: 'Wood Smoke Alert', color: 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300' };
      case 'traffic_gridlock_smog':
        return { label: 'Idling Smog Corridor', color: 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300' };
      case 'clean_air_sanctuary':
        return { label: 'Clean Air Sanctuary Open', color: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' };
      case 'carpool_offer':
        return { label: 'School Carpool Cluster', color: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-950 dark:text-cyan-300' };
    }
  };

  return (
    <div className="space-y-6">
      {/* Intro Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <Users className="w-6 h-6 text-cyan-600 dark:text-cyan-400" aria-hidden="true" />
            <span>Community Smog Watch & Collective Action</span>
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            Severe winter smog is a shared atmospheric crisis. Coordinate with neighbors to enforce wood burning moratoriums, pool school runs, and report clean air sanctuaries.
          </p>
        </div>

        <button
          onClick={() => setShowReportModal(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-cyan-600 hover:bg-cyan-700 text-white shadow-sm transition-transform active:scale-95 shrink-0"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Report Smog / Sanctuary</span>
        </button>
      </div>

      {/* Community Collective Pledges Strip */}
      <section
        aria-labelledby="pledge-heading"
        className="rounded-2xl p-6 bg-gradient-to-r from-sky-900 via-indigo-900 to-slate-900 text-white shadow-md space-y-4"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-300">
              Collective Neighborhood Impact Pledges
            </span>
            <h2 id="pledge-heading" className="text-lg font-bold mt-0.5">
              {stats.activePledges} Local Households Acting in Solidarity
            </h2>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <div className="p-3 rounded-xl bg-white/10 backdrop-blur-sm border border-white/10 text-center">
              <span className="block text-2xl font-black text-amber-300">{stats.woodStovesPaused}</span>
              <span className="text-slate-300">Wood Stoves Paused</span>
            </div>
            <div className="p-3 rounded-xl bg-white/10 backdrop-blur-sm border border-white/10 text-center">
              <span className="block text-2xl font-black text-cyan-300">{stats.carpoolTripsUnified}</span>
              <span className="text-slate-300">Unified Carpools</span>
            </div>
            <div className="p-3 rounded-xl bg-white/10 backdrop-blur-sm border border-white/10 text-center">
              <span className="block text-2xl font-black text-emerald-300">~{stats.estimatedParticulatePreventedKg} kg</span>
              <span className="text-slate-300">Soot Prevented</span>
            </div>
          </div>
        </div>

        {/* Quick Pledge Actions */}
        <div className="pt-3 border-t border-white/10 flex flex-wrap gap-2.5">
          <button
            onClick={() => handlePledge('wood_moratorium')}
            disabled={hasPledged}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 border border-amber-400/40 transition-colors disabled:opacity-60"
          >
            <Flame className="w-4 h-4 text-amber-400" />
            <span>Pledge Wood-Burning Pause During Inversion</span>
          </button>

          <button
            onClick={() => handlePledge('carpool')}
            disabled={hasPledged}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-200 border border-cyan-400/40 transition-colors disabled:opacity-60"
          >
            <Car className="w-4 h-4 text-cyan-400" />
            <span>Join School Run Carpool Cluster</span>
          </button>
        </div>
      </section>

      {/* Community Reports Feed */}
      <section aria-labelledby="reports-heading" className="space-y-3">
        <h2 id="reports-heading" className="text-base font-bold text-slate-900 dark:text-white">
          Active Neighborhood Smog & Sanctuary Reports
        </h2>

        <div className="space-y-3">
          {reports.map(report => {
            const typeBadge = getTypeBadge(report.type);
            return (
              <div
                key={report.id}
                className="rounded-2xl p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${typeBadge.color}`}>
                      {typeBadge.label}
                    </span>
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                      {report.neighborhood}
                    </span>
                    <span className="text-[11px] text-slate-400">
                      • {report.reportedAt}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed max-w-3xl">
                    {report.details}
                  </p>
                </div>

                <button
                  onClick={() => handleUpvote(report.id)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors self-start sm:self-auto shrink-0"
                  aria-label={`Confirm this report. Currently ${report.upvotes} confirmations.`}
                >
                  <ThumbsUp className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
                  <span>Confirm ({report.upvotes})</span>
                </button>
              </div>
            );
          })}
        </div>
      </section>

      {/* New Report Modal Dialog */}
      {showReportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 max-w-md w-full p-6 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Submit Neighborhood Smog Alert
            </h3>

            <form onSubmit={handleSubmitReport} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">
                  Neighborhood / Cross Streets
                </label>
                <input
                  type="text"
                  required
                  placeholder="E.g., North Hillside Ave & 4th"
                  value={newNeighborhood}
                  onChange={e => setNewNeighborhood(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">
                  Report Type
                </label>
                <select
                  value={newType}
                  onChange={e => setNewType(e.target.value as CommunityReport['type'])}
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-medium"
                >
                  <option value="wood_burning_smoke">Wood Fireplace Smoke Trapped at Ground</option>
                  <option value="traffic_gridlock_smog">Idling Truck / Traffic Smog Corridor</option>
                  <option value="clean_air_sanctuary">Public Clean-Air Sanctuary (Filtered Air)</option>
                  <option value="carpool_offer">School / Commute Carpool Group</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">
                  Details & Observations
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="Describe location, smoke odor, or sanctuary opening times..."
                  value={newDetails}
                  onChange={e => setNewDetails(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                ></textarea>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowReportModal(false)}
                  className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg text-xs font-bold bg-cyan-600 hover:bg-cyan-700 text-white"
                >
                  Post Report
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};


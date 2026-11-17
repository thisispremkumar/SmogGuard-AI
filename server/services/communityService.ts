import { CommunityReport } from '../types/index.js';

export interface CommunityPledgeStats {
  activePledges: number;
  woodStovesPaused: number;
  carpoolTripsUnified: number;
  estimatedParticulatePreventedKg: number;
}

const INITIAL_REPORTS: CommunityReport[] = [
  {
    id: 'report-1',
    neighborhood: 'Oakwood North & 5th Ave',
    reportedAt: '15 mins ago',
    type: 'wood_burning_smoke',
    details: 'Heavy residential fireplace smoke lingering at ground level in the cul-de-sac due to the morning thermal inversion lid. Please notify neighbors to pause burning.',
    severity: 'warning',
    upvotes: 14,
  },
  {
    id: 'report-2',
    neighborhood: 'Central Downtown Library',
    reportedAt: '1 hour ago',
    type: 'clean_air_sanctuary',
    details: 'Central Library has activated its dual MERV 14 HVAC system. Indoor PM2.5 is measured at 8 µg/m³ (AQI 33). Quiet work tables and seating available for seniors and families with toddlers.',
    severity: 'info',
    upvotes: 29,
  },
  {
    id: 'report-3',
    neighborhood: 'South Ridge Elementary Cluster',
    reportedAt: '3 hours ago',
    type: 'carpool_offer',
    details: '4 parents organized a micro-bus carpool for 12 children, eliminating 8 individual cold-engine SUV start-ups in the morning smog bottleneck.',
    severity: 'info',
    upvotes: 21,
  },
  {
    id: 'report-4',
    neighborhood: 'Industrial Ring Road & West Boulevard',
    reportedAt: 'Yesterday',
    type: 'traffic_gridlock_smog',
    details: 'Idling freight trucks trapped in severe winter ground fog. Air monitors peaking at 285 µg/m³. Commuters advised to avoid open bike paths.',
    severity: 'urgent',
    upvotes: 38,
  },
];

export class CommunityService {
  private reportsMap = new Map<string, CommunityReport>();
  private pledgeStats: CommunityPledgeStats = {
    activePledges: 148,
    woodStovesPaused: 34,
    carpoolTripsUnified: 86,
    estimatedParticulatePreventedKg: 19.4,
  };

  constructor() {
    for (const report of INITIAL_REPORTS) {
      this.reportsMap.set(report.id, report);
    }
  }

  public getReports(): CommunityReport[] {
    return Array.from(this.reportsMap.values()).reverse();
  }

  public addReport(report: Omit<CommunityReport, 'id' | 'reportedAt' | 'upvotes'>): CommunityReport {
    const id = `report-${Date.now()}`;
    const newReport: CommunityReport = {
      id,
      ...report,
      reportedAt: 'Just now',
      upvotes: 1,
    };
    this.reportsMap.set(id, newReport);
    return newReport;
  }

  public upvoteReport(id: string): CommunityReport | null {
    const report = this.reportsMap.get(id);
    if (report) {
      report.upvotes += 1;
      return report;
    }
    return null;
  }

  public getPledgeStats(): CommunityPledgeStats {
    return this.pledgeStats;
  }

  public joinPledge(type: 'wood_moratorium' | 'carpool' | 'sanctuary_host'): CommunityPledgeStats {
    this.pledgeStats.activePledges += 1;
    if (type === 'wood_moratorium') {
      this.pledgeStats.woodStovesPaused += 1;
      this.pledgeStats.estimatedParticulatePreventedKg += 0.8;
    } else if (type === 'carpool') {
      this.pledgeStats.carpoolTripsUnified += 1;
      this.pledgeStats.estimatedParticulatePreventedKg += 0.2;
    }
    return this.pledgeStats;
  }
}

export const communityService = new CommunityService();

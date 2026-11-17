import { CommunityReport } from '../types/index.js';

let reports: CommunityReport[] = [
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

export interface CommunityPledgeStats {
  activePledges: number;
  woodStovesPaused: number;
  carpoolTripsUnified: number;
  estimatedParticulatePreventedKg: number;
}

let pledgeStats: CommunityPledgeStats = {
  activePledges: 148,
  woodStovesPaused: 34,
  carpoolTripsUnified: 86,
  estimatedParticulatePreventedKg: 19.4,
};

export class CommunityService {
  public getReports(): CommunityReport[] {
    return reports;
  }

  public addReport(report: Omit<CommunityReport, 'id' | 'reportedAt' | 'upvotes'>): CommunityReport {
    const newReport: CommunityReport = {
      id: `report-${Date.now()}`,
      ...report,
      reportedAt: 'Just now',
      upvotes: 1,
    };
    reports.unshift(newReport);
    return newReport;
  }

  public upvoteReport(id: string): CommunityReport | null {
    const report = reports.find(r => r.id === id);
    if (report) {
      report.upvotes += 1;
      return report;
    }
    return null;
  }

  public getPledgeStats(): CommunityPledgeStats {
    return pledgeStats;
  }

  public joinPledge(type: 'wood_moratorium' | 'carpool' | 'sanctuary_host'): CommunityPledgeStats {
    pledgeStats.activePledges += 1;
    if (type === 'wood_moratorium') {
      pledgeStats.woodStovesPaused += 1;
      pledgeStats.estimatedParticulatePreventedKg += 0.8;
    } else if (type === 'carpool') {
      pledgeStats.carpoolTripsUnified += 1;
      pledgeStats.estimatedParticulatePreventedKg += 0.2;
    }
    return pledgeStats;
  }
}

export const communityService = new CommunityService();

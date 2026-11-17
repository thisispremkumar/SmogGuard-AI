import { describe, it, expect } from 'vitest';
import { impactCalculatorService } from '../services/impactCalculatorService.js';

describe('ImpactCalculatorService (Health & Environmental Math)', () => {
  it('computes personal PM2.5 dosage reduction with DIY Corsi-Rosenthal filtration', () => {
    const unmitigated = impactCalculatorService.calculateImpact({
      carpoolDaysPerWeek: 0,
      heatingTempDropDegC: 0,
      diyFilterActive: false,
      transitShift: false,
      outdoorPm25: 180,
    });

    const mitigated = impactCalculatorService.calculateImpact({
      carpoolDaysPerWeek: 3,
      heatingTempDropDegC: 2,
      diyFilterActive: true,
      transitShift: false,
      outdoorPm25: 180,
    });

    // Running DIY filter should reduce personal dosage by over 50%
    expect(mitigated.personalImpact.pm25PercentReduction).toBeGreaterThan(50);
    expect(mitigated.personalImpact.indoorConcentrationEstimate).toBeLessThan(unmitigated.personalImpact.indoorConcentrationEstimate);
    expect(mitigated.personalImpact.acuteRespiratoryRiskReduction).toContain('lower risk');
  });

  it('quantifies community CO2 and particulate emissions prevented by carpooling & thermostat setbacks', () => {
    const impact = impactCalculatorService.calculateImpact({
      carpoolDaysPerWeek: 4,
      heatingTempDropDegC: 2,
      diyFilterActive: true,
      transitShift: false,
      commuteDistanceKm: 20,
    });

    expect(impact.communityImpact.co2AvoidedWeeklyKg).toBeGreaterThan(0);
    expect(impact.communityImpact.pm25AvoidedWeeklyGrams).toBeGreaterThan(0);
    expect(impact.communityImpact.equivalentCarKmSaved).toBeGreaterThan(0);
    expect(impact.communityImpact.communityTreeDaysEquivalent).toBeGreaterThan(0);
    expect(impact.narrativeExplanation).toContain('inversion layer');
  });

  it('gracefully handles zero or baseline inputs', () => {
    const baseline = impactCalculatorService.calculateImpact({
      carpoolDaysPerWeek: 0,
      heatingTempDropDegC: 0,
      diyFilterActive: false,
      transitShift: false,
    });

    expect(baseline.communityImpact.co2AvoidedWeeklyKg).toBe(0);
    expect(baseline.personalImpact.pm25PercentReduction).toBe(0);
  });
});


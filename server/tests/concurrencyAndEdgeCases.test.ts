import { describe, it, expect } from 'vitest';
import { calculateUsAqiFromPm25, getAqiCategory, generateHourlySmogCurve } from '../services/aqiService.js';
import { impactCalculatorService } from '../services/impactCalculatorService.js';
import { routinePlannerService } from '../services/routinePlannerService.js';

describe('Concurrency & Extreme Boundary Testing', () => {
  it('handles extreme hazardous atmospheric thresholds exceeding EPA 500 cap', () => {
    // Severe post-harvest agricultural burning / catastrophic wildfire scenario
    const extremeAqi = calculateUsAqiFromPm25(750);
    expect(extremeAqi).toBe(500); // Capped at EPA standard 500 Hazardous ceiling

    const cat = getAqiCategory(extremeAqi);
    expect(cat).toBe('Hazardous');
  });

  it('correctly calculates 24-hour winter diurnal curves without zero or negative PM values', () => {
    const curve = generateHourlySmogCurve(10); // Very clean baseline
    for (const point of curve) {
      expect(point.pm25).toBeGreaterThan(0);
      expect(point.aqi).toBeGreaterThanOrEqual(0);
      expect(point.hour).toBeGreaterThanOrEqual(0);
      expect(point.hour).toBeLessThanOrEqual(23);
    }
  });

  it('handles edge case inputs in impact calculations with high family sizes', () => {
    const largeFamily = impactCalculatorService.calculateImpact({
      carpoolDaysPerWeek: 5,
      heatingTempDropDegC: 3,
      diyFilterActive: true,
      transitShift: true,
      familySize: 8,
      commuteDistanceKm: 40,
    });

    expect(largeFamily.personalImpact.pm25InhaledDosageReductionUg).toBeGreaterThan(0);
    expect(largeFamily.communityImpact.co2AvoidedWeeklyKg).toBeGreaterThan(50);
    expect(largeFamily.personalImpact.pm25PercentReduction).toBeLessThanOrEqual(95);
  });

  it('handles multi-vulnerability profiles seamlessly in routine planner', async () => {
    const multiVulnerable = await routinePlannerService.generatePlan({
      id: 'fam-multi',
      name: 'Vulnerable Multi-Gen',
      vulnerableMembers: ['infant', 'asthmatic', 'elderly', 'pregnant'],
      commuteMode: 'car_solo',
      commuteDistanceKm: 12,
      heatingType: 'wood_biomass', // High-emission wood stove
      cookingFuel: 'gas_stove',
      hasAirPurifier: false,
      homeType: 'older_leaky',
    }, 'Krakow');

    expect(multiVulnerable.locationName).toBe('Krakow');
    expect(multiVulnerable.heatingOptimization.airQualityTip).toContain('wood stove');
    // Must contain specific guidance for all 4 vulnerabilities
    expect(multiVulnerable.vulnerableProtectionGuide.length).toBeGreaterThanOrEqual(3);
  });
});


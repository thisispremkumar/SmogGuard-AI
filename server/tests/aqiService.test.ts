import { describe, it, expect } from 'vitest';
import { calculateUsAqiFromPm25, getAqiCategory, generateHourlySmogCurve, aqiService } from '../services/aqiService.js';

describe('AqiService & Atmospheric Calculation Engine', () => {
  it('correctly calculates US AQI from PM2.5 concentrations based on EPA standard', () => {
    // Good: 0 - 12.0 µg/m³
    expect(calculateUsAqiFromPm25(10)).toBeLessThanOrEqual(50);
    // Moderate: 12.1 - 35.4 µg/m³
    expect(calculateUsAqiFromPm25(25)).toBeGreaterThanOrEqual(51);
    expect(calculateUsAqiFromPm25(25)).toBeLessThanOrEqual(100);
    // Unhealthy for Sensitive: 35.5 - 55.4 µg/m³
    expect(calculateUsAqiFromPm25(45)).toBeGreaterThanOrEqual(101);
    expect(calculateUsAqiFromPm25(45)).toBeLessThanOrEqual(150);
    // Unhealthy: 55.5 - 150.4 µg/m³
    expect(calculateUsAqiFromPm25(100)).toBeGreaterThanOrEqual(151);
    expect(calculateUsAqiFromPm25(100)).toBeLessThanOrEqual(200);
    // Hazardous: 250.5+ µg/m³
    expect(calculateUsAqiFromPm25(300)).toBeGreaterThanOrEqual(301);
  });

  it('accurately maps AQI scores to public health risk categories', () => {
    expect(getAqiCategory(25)).toBe('Good');
    expect(getAqiCategory(75)).toBe('Moderate');
    expect(getAqiCategory(125)).toBe('Unhealthy for Sensitive Groups');
    expect(getAqiCategory(175)).toBe('Unhealthy');
    expect(getAqiCategory(250)).toBe('Very Unhealthy');
    expect(getAqiCategory(380)).toBe('Hazardous');
  });

  it('models winter diurnal smog curve with solar afternoon inversion breakdown', () => {
    const basePm25 = 100;
    const curve = generateHourlySmogCurve(basePm25);

    expect(curve).toHaveLength(24);
    
    // Morning peak (07:00) should be significantly higher than afternoon solar minimum (13:00)
    const morningPoint = curve[7];
    const afternoonPoint = curve[13];

    expect(morningPoint.pm25).toBeGreaterThan(afternoonPoint.pm25);
    expect(morningPoint.inversionRisk).toBe(true);
    expect(afternoonPoint.inversionRisk).toBe(false);
  });

  it('retrieves comprehensive winter air quality profiles for hotspot cities', async () => {
    const delhi = await aqiService.getAirQuality('delhi');
    expect(delhi.city).toBe('New Delhi');
    expect(delhi.thermalInversion.active).toBeDefined();
    expect(delhi.safeVentilationWindow.startHour).toBe(13);
    expect(delhi.pollutants.pm25).toBeGreaterThan(50);

    const slc = await aqiService.getAirQuality('salt-lake-city');
    expect(slc.city).toBe('Salt Lake City');
    expect(slc.thermalInversion.explanation).toContain('Wasatch');
  });
});


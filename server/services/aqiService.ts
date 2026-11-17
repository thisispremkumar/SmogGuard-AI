import { AirQualityData, HourlyAqiPoint, PollutantBreakdown, ThermalInversionStatus } from '../types/index.js';
import { ATMOSPHERIC_CONSTANTS } from '../constants/atmospheric.js';
import { MemoryTtlCache } from '../utils/cache.js';

interface HotspotProfile {
  city: string;
  country: string;
  lat: number;
  lng: number;
  basePm25: number;
  basePm10: number;
  baseNo2: number;
  baseSo2: number;
  baseCo: number;
  baseO3: number;
  temperature: number;
  humidity: number;
  windSpeed: number;
  inversionIntensity: 'moderate' | 'severe' | 'extreme';
  inversionAltitude: number;
  explanation: string;
}

const PRESET_HOTSPOTS: Record<string, HotspotProfile> = {
  'delhi': {
    city: 'New Delhi',
    country: 'India',
    lat: 28.6139,
    lng: 77.2090,
    basePm25: 295,
    basePm10: 420,
    baseNo2: 78,
    baseSo2: 24,
    baseCo: 3.4,
    baseO3: 18,
    temperature: 13,
    humidity: 78,
    windSpeed: 3.2,
    inversionIntensity: 'extreme',
    inversionAltitude: 160,
    explanation: 'Intense winter radiation inversion traps stubble smoke, vehicular exhaust, and domestic heating particulates in a 160m stagnant cold-air pool.',
  },
  'salt-lake-city': {
    city: 'Salt Lake City',
    country: 'USA',
    lat: 40.7608,
    lng: -111.8910,
    basePm25: 68,
    basePm10: 95,
    baseNo2: 42,
    baseSo2: 6,
    baseCo: 1.2,
    baseO3: 22,
    temperature: -3,
    humidity: 82,
    windSpeed: 2.1,
    inversionIntensity: 'severe',
    inversionAltitude: 250,
    explanation: 'Wasatch Mountain bowl creates classic multi-day valley inversion. High pressure traps sub-freezing dense air and vehicle emissions along the valley floor.',
  },
  'krakow': {
    city: 'Krakow',
    country: 'Poland',
    lat: 50.0647,
    lng: 19.9450,
    basePm25: 84,
    basePm10: 130,
    baseNo2: 48,
    baseSo2: 22,
    baseCo: 1.6,
    baseO3: 15,
    temperature: -1,
    humidity: 85,
    windSpeed: 2.8,
    inversionIntensity: 'severe',
    inversionAltitude: 200,
    explanation: 'Vistula river basin topography combined with residential solid fuel burning produces persistent winter smog blankets during anticyclonic weather.',
  },
  'beijing': {
    city: 'Beijing',
    country: 'China',
    lat: 39.9042,
    lng: 116.4074,
    basePm25: 145,
    basePm10: 210,
    baseNo2: 62,
    baseSo2: 18,
    baseCo: 2.1,
    baseO3: 19,
    temperature: 2,
    humidity: 65,
    windSpeed: 4.0,
    inversionIntensity: 'severe',
    inversionAltitude: 220,
    explanation: 'Northern heating season combined with low boundary layer and southerly moisture transport creates stagnant winter haze events.',
  },
  'milan': {
    city: 'Milan',
    country: 'Italy',
    lat: 45.4642,
    lng: 9.1900,
    basePm25: 72,
    basePm10: 105,
    baseNo2: 58,
    baseSo2: 8,
    baseCo: 1.3,
    baseO3: 20,
    temperature: 4,
    humidity: 88,
    windSpeed: 1.8,
    inversionIntensity: 'severe',
    inversionAltitude: 180,
    explanation: 'Po Valley closed alpine geography acts as a natural stagnant basin. Extremely low wind speeds in winter trap urban emissions close to ground.',
  },
  'london': {
    city: 'London',
    country: 'United Kingdom',
    lat: 51.5074,
    lng: -0.1278,
    basePm25: 38,
    basePm10: 55,
    baseNo2: 44,
    baseSo2: 5,
    baseCo: 0.8,
    baseO3: 25,
    temperature: 5,
    humidity: 84,
    windSpeed: 6.5,
    inversionIntensity: 'moderate',
    inversionAltitude: 350,
    explanation: 'Urban street canyons and cold anticyclone stagnation trigger localized winter particulate and NO2 accumulation during peak hours.',
  },
  'lahore': {
    city: 'Lahore',
    country: 'Pakistan',
    lat: 31.5204,
    lng: 74.3587,
    basePm25: 340,
    basePm10: 490,
    baseNo2: 85,
    baseSo2: 30,
    baseCo: 3.8,
    baseO3: 14,
    temperature: 14,
    humidity: 79,
    windSpeed: 2.4,
    inversionIntensity: 'extreme',
    inversionAltitude: 140,
    explanation: 'Dense seasonal winter smog layer trapped beneath a 140m ground inversion layer, exacerbated by low wind and regional post-harvest fires.',
  },
};

export const calculateUsAqiFromPm25 = (pm25: number): number => {
  // EPA formula breakpoints for PM2.5 to US AQI
  const breakpoints = [
    { cLow: 0.0, cHigh: 12.0, iLow: 0, iHigh: 50 },
    { cLow: 12.1, cHigh: 35.4, iLow: 51, iHigh: 100 },
    { cLow: 35.5, cHigh: 55.4, iLow: 101, iHigh: 150 },
    { cLow: 55.5, cHigh: 150.4, iLow: 151, iHigh: 200 },
    { cLow: 150.5, cHigh: 250.4, iLow: 201, iHigh: 300 },
    { cLow: 250.5, cHigh: 350.4, iLow: 301, iHigh: 400 },
    { cLow: 350.5, cHigh: 500.4, iLow: 401, iHigh: 500 },
  ];

  const rounded = Math.round(pm25 * 10) / 10;
  for (const bp of breakpoints) {
    if (rounded >= bp.cLow && rounded <= bp.cHigh) {
      return Math.round(((bp.iHigh - bp.iLow) / (bp.cHigh - bp.cLow)) * (rounded - bp.cLow) + bp.iLow);
    }
  }

  if (rounded > 500.4) return 500;
  return 0;
};

export const getAqiCategory = (aqi: number): AirQualityData['category'] => {
  if (aqi <= 50) return 'Good';
  if (aqi <= 100) return 'Moderate';
  if (aqi <= 150) return 'Unhealthy for Sensitive Groups';
  if (aqi <= 200) return 'Unhealthy';
  if (aqi <= 300) return 'Very Unhealthy';
  return 'Hazardous';
};

export const generateHourlySmogCurve = (basePm25: number): HourlyAqiPoint[] => {
  const multipliers = [
    1.15, 1.20, 1.25, 1.30, 1.38, 1.45, 1.50, 1.55, 1.40, 1.25, // 0-9h
    1.05, 0.90, 0.75, 0.65, 0.68, 0.78, 0.95, 1.15, 1.35, 1.42, // 10-19h
    1.38, 1.30, 1.22, 1.18                                       // 20-23h
  ];

  return multipliers.map((mul, hour) => {
    const pm = Math.max(5, Math.round(basePm25 * mul));
    const aqi = calculateUsAqiFromPm25(pm);
    const inversionRisk = (hour >= ATMOSPHERIC_CONSTANTS.MORNING_INVERSION_PEAK_START_HOUR && hour <= ATMOSPHERIC_CONSTANTS.MORNING_INVERSION_PEAK_END_HOUR) || 
                          (hour >= 18 && hour <= 23);
    const timeStr = `${hour.toString().padStart(2, '0')}:00`;

    return {
      time: timeStr,
      hour,
      aqi,
      pm25: pm,
      inversionRisk,
    };
  });
};

export class AqiService {
  private cache = new MemoryTtlCache<AirQualityData>(300_000, 100); // 5 min TTL, 100 entries

  public async getAirQuality(cityQuery = 'New Delhi'): Promise<AirQualityData> {
    const key = cityQuery.toLowerCase().trim().replace(/[\s_]+/g, '-');
    const matchedKey = Object.keys(PRESET_HOTSPOTS).find(k => key.includes(k) || k.includes(key)) || 'delhi';
    const currentHour = new Date().getHours();
    const cacheKey = `${matchedKey}:${currentHour}`;

    // Fast-path: Check in-memory cache
    const cached = this.cache.get(cacheKey);
    if (cached) {
      return cached;
    }

    const profile = PRESET_HOTSPOTS[matchedKey];
    const hourly = generateHourlySmogCurve(profile.basePm25);
    const currentPoint = hourly[currentHour] || hourly[12];

    const pollutants: PollutantBreakdown = {
      pm25: currentPoint.pm25,
      pm10: Math.round(profile.basePm10 * (currentPoint.pm25 / profile.basePm25)),
      no2: profile.baseNo2,
      so2: profile.baseSo2,
      co: profile.baseCo,
      o3: profile.baseO3,
    };

    const aqi = currentPoint.aqi;
    const category = getAqiCategory(aqi);

    const thermalInversion: ThermalInversionStatus = {
      active: currentPoint.inversionRisk,
      intensity: currentPoint.inversionRisk ? profile.inversionIntensity : 'moderate',
      altitudeMeters: profile.inversionAltitude,
      explanation: profile.explanation,
      smogTrappingFactor: currentPoint.inversionRisk ? 2.8 : 1.2,
    };

    const result: AirQualityData = {
      city: profile.city,
      country: profile.country,
      coordinates: { lat: profile.lat, lng: profile.lng },
      aqi,
      category,
      primaryPollutant: 'PM2.5 (Fine particulate matter)',
      pollutants,
      thermalInversion,
      temperature: profile.temperature,
      humidity: profile.humidity,
      windSpeed: profile.windSpeed,
      timestamp: new Date().toISOString(),
      forecastHourly: hourly,
      safeVentilationWindow: {
        startHour: ATMOSPHERIC_CONSTANTS.SOLAR_CONVECTIVE_WINDOW_START_HOUR,
        endHour: ATMOSPHERIC_CONSTANTS.SOLAR_CONVECTIVE_WINDOW_END_HOUR,
        note: 'Solar heating weakens surface inversion layer. PM2.5 is at daily low (approx. -40% vs morning). Short 10-15m filtered purge recommended.',
      },
      worstExposureWindow: {
        startHour: ATMOSPHERIC_CONSTANTS.MORNING_INVERSION_PEAK_START_HOUR,
        endHour: ATMOSPHERIC_CONSTANTS.MORNING_INVERSION_PEAK_END_HOUR,
        note: 'Cold ground temperature inversion traps tailpipe NO2 and biomass particulates below 160m. Avoid outdoor jogging and seal doors.',
      },
    };

    this.cache.set(cacheKey, result);
    return result;
  }

  public getAvailableHotspots() {
    return Object.entries(PRESET_HOTSPOTS).map(([slug, data]) => ({
      slug,
      city: data.city,
      country: data.country,
      basePm25: data.basePm25,
    }));
  }

  public getCacheStats() {
    return this.cache.getStats();
  }
}

export const aqiService = new AqiService();

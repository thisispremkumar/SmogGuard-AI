export interface PollutantBreakdown {
  pm25: number;   // µg/m³
  pm10: number;   // µg/m³
  no2: number;    // ppb / µg/m³
  so2: number;    // ppb / µg/m³
  co: number;     // ppm
  o3: number;     // ppb
}

export interface ThermalInversionStatus {
  active: boolean;
  intensity: 'none' | 'moderate' | 'severe' | 'extreme';
  altitudeMeters: number;
  explanation: string;
  smogTrappingFactor: number;
}

export interface HourlyAqiPoint {
  time: string;
  hour: number;
  aqi: number;
  pm25: number;
  inversionRisk: boolean;
}

export interface AirQualityData {
  city: string;
  country: string;
  coordinates: { lat: number; lng: number };
  aqi: number;
  category: 'Good' | 'Moderate' | 'Unhealthy for Sensitive Groups' | 'Unhealthy' | 'Very Unhealthy' | 'Hazardous';
  primaryPollutant: string;
  pollutants: PollutantBreakdown;
  thermalInversion: ThermalInversionStatus;
  temperature: number; // °C
  humidity: number;    // %
  windSpeed: number;   // km/h
  timestamp: string;
  forecastHourly: HourlyAqiPoint[];
  safeVentilationWindow: { startHour: number; endHour: number; note: string };
  worstExposureWindow: { startHour: number; endHour: number; note: string };
}

export type VulnerableCondition = 'infant' | 'asthmatic' | 'elderly' | 'pregnant' | 'heart_condition';
export type CommuteMode = 'public_transit' | 'car_solo' | 'carpool' | 'cycling' | 'walking' | 'work_from_home';
export type HeatingType = 'district_heat' | 'heat_pump' | 'natural_gas' | 'wood_biomass' | 'electric_resistance';
export type CookingFuel = 'induction' | 'gas_stove' | 'electric';
export type HomeType = 'apartment' | 'detached_house' | 'sealed_modern' | 'older_leaky';

export interface FamilyProfile {
  id: string;
  name: string;
  vulnerableMembers: VulnerableCondition[];
  commuteMode: CommuteMode;
  commuteDistanceKm: number;
  heatingType: HeatingType;
  cookingFuel: CookingFuel;
  hasAirPurifier: boolean;
  homeType: HomeType;
}

export interface ScheduleItem {
  timeSlot: string;
  activity: string;
  status: 'safe' | 'caution' | 'danger';
  recommendedAction: string;
  lowEmissionAlternative: string;
  exposureReduction: string;
}

export interface DailyRoutinePlan {
  date: string;
  locationName: string;
  currentAqi: number;
  overallAdvisory: string;
  routineSchedule: ScheduleItem[];
  heatingOptimization: {
    temperatureSetting: string;
    emissionSavingKg: number;
    airQualityTip: string;
  };
  ventilationAdvice: {
    bestWindow: string;
    filtrationNeeded: boolean;
    instructions: string;
  };
  vulnerableProtectionGuide: string[];
}

export interface IndoorAirHack {
  id: string;
  title: string;
  category: 'diy_filtration' | 'ventilation' | 'source_control' | 'plants_humidity' | 'sanctuary_room';
  costLevel: 'Free' | 'Under $15' | 'Under $40' | '$50+';
  difficulty: 'Easy' | 'Moderate' | 'Advanced';
  effectivenessPm25: number;
  materials: string[];
  steps: string[];
  scienceExplanation: string;
  cadDiagramDescription?: string;
}

export interface ImpactCalculation {
  inputs: {
    carpoolDaysPerWeek: number;
    heatingTempDropDegC: number;
    diyFilterActive: boolean;
    transitShift: boolean;
  };
  personalImpact: {
    pm25InhaledDosageReductionUg: number;
    pm25PercentReduction: number;
    acuteRespiratoryRiskReduction: string;
    indoorConcentrationEstimate: number;
  };
  communityImpact: {
    co2AvoidedWeeklyKg: number;
    pm25AvoidedWeeklyGrams: number;
    equivalentCarKmSaved: number;
    communityTreeDaysEquivalent: number;
  };
  narrativeExplanation: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  metadata?: {
    groundedData?: string[];
    actionPills?: Array<{ label: string; action: string }>;
    safetyNotice?: string;
  };
}

export interface CommunityReport {
  id: string;
  neighborhood: string;
  reportedAt: string;
  type: 'wood_burning_smoke' | 'traffic_gridlock_smog' | 'clean_air_sanctuary' | 'carpool_offer';
  details: string;
  severity: 'info' | 'warning' | 'urgent';
  upvotes: number;
}


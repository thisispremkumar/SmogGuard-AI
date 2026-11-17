/**
 * Atmospheric & Environmental Epidemiological Constants
 * 
 * Citations:
 * - World Health Organization (WHO) Global Air Quality Guidelines (2021)
 * - US Environmental Protection Agency (EPA) National Ambient Air Quality Standards (NAAQS)
 * - American Society of Heating, Refrigerating and Air-Conditioning Engineers (ASHRAE Standard 62.1)
 * - Intergovernmental Panel on Climate Change (IPCC) Emission Factor Database
 */

export const ATMOSPHERIC_CONSTANTS = {
  // Respiratory physiology
  HUMAN_DAILY_VENTILATION_VOLUME_M3: 12.0, // m³ air inhaled per person/day (WHO)
  INDOOR_TIME_FRACTION_WINTER: 20.0 / 24.0, // 20 hours indoor during winter smog
  OUTDOOR_TIME_FRACTION_WINTER: 4.0 / 24.0, // 4 hours transit/outdoor

  // Unmitigated building envelope penetration
  BASELINE_INDOOR_PM25_INFILTRATION_FACTOR: 0.70, // 70% of outdoor PM2.5 penetrates leaky unpurified homes

  // Filtration engineering efficiencies (Corsi & Rosenthal 2020)
  DIY_CORSI_ROSENTHAL_EFFICIENCY: 0.88, // 88% average PM2.5 single-pass/recirculation removal
  N95_COMMUTE_EFFICIENCY: 0.90, // 90% filtration efficiency with proper facial seal

  // Vehicular transport emissions (EPA & EEA benchmarks)
  ICE_CAR_CO2_PER_KM_KG: 0.165, // 165g CO2 per vehicle km
  ICE_CAR_PM25_PER_KM_GRAMS: 0.085, // 0.085g PM2.5 per km (exhaust + brake/tire wear)

  // Heating thermodynamics (US Dept of Energy / UK Energy Saving Trust)
  HEATING_SAVINGS_FACTOR_PER_DEG_C: 0.07, // 7% energy/emissions reduction per 1°C thermostat setback
  AVERAGE_HOUSEHOLD_GAS_HEATING_WEEKLY_CO2_KG: 45.0, // Baseline winter week CO2
  AVERAGE_HOUSEHOLD_GAS_HEATING_WEEKLY_NOX_GRAMS: 8.5, // Avoided combustion NOx/particulates

  // Urban carbon sequestration
  URBAN_TREE_DAILY_CO2_ABSORPTION_KG: 0.06, // ~22 kg CO2/year = 0.06 kg/day per mature tree

  // Air quality threshold benchmarks (µg/m³)
  WHO_24H_PM25_TARGET: 15.0,
  WHO_24H_PM10_TARGET: 45.0,
  WHO_1H_NO2_TARGET: 25.0,

  // Inversion diurnal factor bounds
  SOLAR_CONVECTIVE_WINDOW_START_HOUR: 13,
  SOLAR_CONVECTIVE_WINDOW_END_HOUR: 15,
  MORNING_INVERSION_PEAK_START_HOUR: 6,
  MORNING_INVERSION_PEAK_END_HOUR: 10,
} as const;


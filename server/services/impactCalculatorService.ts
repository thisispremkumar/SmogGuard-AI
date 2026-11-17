import { ImpactCalculation } from '../types/index.js';
import { ATMOSPHERIC_CONSTANTS } from '../constants/atmospheric.js';

interface ImpactInputParams {
  carpoolDaysPerWeek: number;    // 0 - 5 days
  heatingTempDropDegC: number;   // 0 - 4 °C
  diyFilterActive: boolean;      // true / false
  transitShift: boolean;         // true / false
  commuteDistanceKm?: number;    // default 16 km round trip
  outdoorPm25?: number;          // default 150 µg/m³
  familySize?: number;           // default 3
}

export class ImpactCalculatorService {
  /**
   * Quantifies individual health protection & community emissions reduction based on EPA & EEA models.
   */
  public calculateImpact(params: ImpactInputParams): ImpactCalculation {
    const {
      carpoolDaysPerWeek = 2,
      heatingTempDropDegC = 1.5,
      diyFilterActive = true,
      transitShift = false,
      commuteDistanceKm = 16,
      outdoorPm25 = 150,
      familySize = 3,
    } = params;

    const {
      HUMAN_DAILY_VENTILATION_VOLUME_M3,
      BASELINE_INDOOR_PM25_INFILTRATION_FACTOR,
      DIY_CORSI_ROSENTHAL_EFFICIENCY,
      INDOOR_TIME_FRACTION_WINTER,
      OUTDOOR_TIME_FRACTION_WINTER,
      ICE_CAR_CO2_PER_KM_KG,
      ICE_CAR_PM25_PER_KM_GRAMS,
      HEATING_SAVINGS_FACTOR_PER_DEG_C,
      AVERAGE_HOUSEHOLD_GAS_HEATING_WEEKLY_CO2_KG,
      AVERAGE_HOUSEHOLD_GAS_HEATING_WEEKLY_NOX_GRAMS,
      URBAN_TREE_DAILY_CO2_ABSORPTION_KG,
    } = ATMOSPHERIC_CONSTANTS;

    // --- Personal Health Impact Model ---
    const baselineIndoorPm25 = outdoorPm25 * BASELINE_INDOOR_PM25_INFILTRATION_FACTOR;
    const filtrationEfficiency = diyFilterActive ? DIY_CORSI_ROSENTHAL_EFFICIENCY : 0.0;
    const effectiveIndoorPm25 = Math.max(8, Math.round(baselineIndoorPm25 * (1 - filtrationEfficiency)));

    // Daily inhaled dose in micrograms (ug): Volume * Concentration
    const baselineDailyDoseUg = HUMAN_DAILY_VENTILATION_VOLUME_M3 * 
      (INDOOR_TIME_FRACTION_WINTER * baselineIndoorPm25 + OUTDOOR_TIME_FRACTION_WINTER * outdoorPm25);
    
    const mitigatedOutdoorPm = transitShift ? outdoorPm25 * 0.70 : outdoorPm25;
    const mitigatedDailyDoseUg = HUMAN_DAILY_VENTILATION_VOLUME_M3 * 
      (INDOOR_TIME_FRACTION_WINTER * effectiveIndoorPm25 + OUTDOOR_TIME_FRACTION_WINTER * mitigatedOutdoorPm);

    const doseReductionUg = Math.max(0, Math.round(baselineDailyDoseUg - mitigatedDailyDoseUg));
    const percentReduction = Math.min(95, Math.round((doseReductionUg / baselineDailyDoseUg) * 100));

    let acuteRisk = 'Low reduction';
    if (percentReduction >= 60) {
      acuteRisk = '70% lower risk of acute bronchospasm, pediatric asthma flare-ups, and systemic vascular inflammation';
    } else if (percentReduction >= 35) {
      acuteRisk = '45% lower risk of eye irritation, dry cough, and nighttime wheezing';
    } else {
      acuteRisk = '20% lower respiratory irritation';
    }

    // --- Community Emission Reduction Model ---
    const carpoolKmSavedWeekly = carpoolDaysPerWeek * commuteDistanceKm * 0.5;
    const transitKmSavedWeekly = transitShift ? 5 * commuteDistanceKm : 0;
    const totalKmSavedWeekly = carpoolKmSavedWeekly + transitKmSavedWeekly;

    const carCo2SavedWeeklyKg = totalKmSavedWeekly * ICE_CAR_CO2_PER_KM_KG;
    const carPm25SavedWeeklyGrams = totalKmSavedWeekly * ICE_CAR_PM25_PER_KM_GRAMS;

    const heatingSavingFactor = (heatingTempDropDegC * HEATING_SAVINGS_FACTOR_PER_DEG_C);
    const heatingCo2SavedWeeklyKg = AVERAGE_HOUSEHOLD_GAS_HEATING_WEEKLY_CO2_KG * heatingSavingFactor;
    const heatingPm25SavedWeeklyGrams = AVERAGE_HOUSEHOLD_GAS_HEATING_WEEKLY_NOX_GRAMS * heatingSavingFactor;

    const totalCo2SavedWeeklyKg = Math.round((carCo2SavedWeeklyKg + heatingCo2SavedWeeklyKg) * 10) / 10;
    const totalPm25SavedWeeklyGrams = Math.round((carPm25SavedWeeklyGrams + heatingPm25SavedWeeklyGrams) * 10) / 10;
    const treeDaysEquivalent = Math.round(totalCo2SavedWeeklyKg / URBAN_TREE_DAILY_CO2_ABSORPTION_KG);

    const narrative = `By running ${diyFilterActive ? 'a DIY Corsi-Rosenthal filter indoors' : 'ambient routines'}, ` +
      `lowering your thermostat by ${heatingTempDropDegC}°C, and ${carpoolDaysPerWeek > 0 ? `carpooling ${carpoolDaysPerWeek} days/wk` : 'optimizing travel'}, ` +
      `your family avoids inhaling ${doseReductionUg} µg of hazardous fine particles daily (${percentReduction}% personal reduction). ` +
      `Simultaneously, your actions eliminate ${totalCo2SavedWeeklyKg} kg of greenhouse emissions and keep ${totalPm25SavedWeeklyGrams} grams of toxic PM2.5 out of your neighborhood's trapped winter inversion layer every single week.`;

    return {
      inputs: {
        carpoolDaysPerWeek,
        heatingTempDropDegC,
        diyFilterActive,
        transitShift,
      },
      personalImpact: {
        pm25InhaledDosageReductionUg: doseReductionUg * familySize,
        pm25PercentReduction: percentReduction,
        acuteRespiratoryRiskReduction: acuteRisk,
        indoorConcentrationEstimate: effectiveIndoorPm25,
      },
      communityImpact: {
        co2AvoidedWeeklyKg: totalCo2SavedWeeklyKg,
        pm25AvoidedWeeklyGrams: totalPm25SavedWeeklyGrams,
        equivalentCarKmSaved: Math.round(totalKmSavedWeekly),
        communityTreeDaysEquivalent: treeDaysEquivalent,
      },
      narrativeExplanation: narrative,
    };
  }
}

export const impactCalculatorService = new ImpactCalculatorService();

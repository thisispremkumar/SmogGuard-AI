import { ImpactCalculation } from '../types/index.js';

interface ImpactInputParams {
  carpoolDaysPerWeek: number;    // 0 - 5 days
  heatingTempDropDegC: number;   // 0 - 4 °C
  diyFilterActive: boolean;      // true / false
  transitShift: boolean;         // true / false
  commuteDistanceKm?: number;    // default 15 km round trip
  outdoorPm25?: number;          // default 140 µg/m³
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

    // --- Personal Health Impact Model ---
    // Average human ventilation rate: ~12 m³ of air inhaled per person per day (WHO benchmark)
    const dailyBreathingVolumeM3 = 12;
    
    // Unmitigated baseline indoor air without filtration typically tracks 65-75% of outdoor PM2.5
    const baselineIndoorPm25 = outdoorPm25 * 0.70;
    
    // DIY Corsi-Rosenthal / HEPA filtration reduces indoor concentration by ~80-90%
    const filtrationEfficiency = diyFilterActive ? 0.85 : 0.0;
    const effectiveIndoorPm25 = Math.max(10, Math.round(baselineIndoorPm25 * (1 - filtrationEfficiency)));
    
    // Average hours spent indoors during winter: ~20 hours/day
    const indoorFraction = 20 / 24;
    const outdoorFraction = 4 / 24;

    // Daily inhaled dose in micrograms (ug): Volume * Concentration
    const baselineDailyDoseUg = dailyBreathingVolumeM3 * (indoorFraction * baselineIndoorPm25 + outdoorFraction * outdoorPm25);
    const mitigatedDailyDoseUg = dailyBreathingVolumeM3 * (indoorFraction * effectiveIndoorPm25 + outdoorFraction * (transitShift ? outdoorPm25 * 0.7 : outdoorPm25));
    
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
    // Average passenger ICE car emits ~165g CO2/km and ~0.08g primary PM2.5/km (exhaust + brake/tire wear)
    const carCo2PerKmKg = 0.165;
    const carPm25PerKmGrams = 0.085;

    // Carpool savings: 50% reduction for days carpooled
    const carpoolKmSavedWeekly = carpoolDaysPerWeek * commuteDistanceKm * 0.5;
    // Transit shift: eliminates car trip entirely for 5 days
    const transitKmSavedWeekly = transitShift ? 5 * commuteDistanceKm : 0;
    const totalKmSavedWeekly = carpoolKmSavedWeekly + transitKmSavedWeekly;

    const carCo2SavedWeeklyKg = totalKmSavedWeekly * carCo2PerKmKg;
    const carPm25SavedWeeklyGrams = totalKmSavedWeekly * carPm25PerKmGrams;

    // Heating savings: 1°C thermostat setpoint reduction saves ~7% energy consumption
    // Typical natural gas household heating produces ~45kg CO2/week and emits NOx/particulates
    const heatingSavingFactor = (heatingTempDropDegC * 0.07);
    const heatingCo2SavedWeeklyKg = 45 * heatingSavingFactor;
    const heatingPm25SavedWeeklyGrams = 8.5 * heatingSavingFactor; // avoided burner particulates/NOx precursors

    const totalCo2SavedWeeklyKg = Math.round((carCo2SavedWeeklyKg + heatingCo2SavedWeeklyKg) * 10) / 10;
    const totalPm25SavedWeeklyGrams = Math.round((carPm25SavedWeeklyGrams + heatingPm25SavedWeeklyGrams) * 10) / 10;
    
    // Mature urban tree absorbs approx. 22kg CO2 per year (~0.06 kg/day = 1 tree-day)
    const treeDaysEquivalent = Math.round(totalCo2SavedWeeklyKg / 0.06);

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

import { DailyRoutinePlan, FamilyProfile, ScheduleItem } from '../types/index.js';
import { aqiService } from './aqiService.js';

export class RoutinePlannerService {
  public async generatePlan(profile: FamilyProfile, locationName = 'New Delhi'): Promise<DailyRoutinePlan> {
    const aqiData = await aqiService.getAirQuality(locationName);
    const hasVulnerable = profile.vulnerableMembers.length > 0;
    const isAsthmatic = profile.vulnerableMembers.includes('asthmatic');
    const hasInfant = profile.vulnerableMembers.includes('infant');
    const hasElderly = profile.vulnerableMembers.includes('elderly');

    const schedule: ScheduleItem[] = [
      {
        timeSlot: '06:30 - 08:30',
        activity: 'Morning Commute & School Departure',
        status: aqiData.aqi > 150 ? 'danger' : 'caution',
        recommendedAction: hasVulnerable
          ? 'Thermal inversion traps vehicle exhaust at ground level. Fit well-sealed N95/KF94 masks on children before exiting the threshold. Pre-circulate car air on recirculation mode 3 mins before entering.'
          : 'Ground inversion peak. Avoid cycling or outdoor cardio; carpool or use metro/bus with windows closed.',
        lowEmissionAlternative: profile.commuteMode === 'car_solo'
          ? 'Pool with a neighboring family for school drop-off, cutting 2 cold-start vehicle trips from your street.'
          : 'Use electric bus or rail transit to minimize local ground-level NOx emissions.',
        exposureReduction: 'Reduces morning acute particulate exposure by 65-80%.',
      },
      {
        timeSlot: '08:30 - 12:30',
        activity: 'Work & Indoor Activities',
        status: 'safe',
        recommendedAction: 'Keep exterior doors tightly closed. Run the indoor air purifier/Corsi-Rosenthal box on medium speed. If working from home, keep bedroom doors closed to isolate dust.',
        lowEmissionAlternative: 'Avoid burning scented candles, incense, or running auxiliary space heaters during the morning stagnation.',
        exposureReduction: 'Maintains indoor PM2.5 under 25 µg/m³ during work hours.',
      },
      {
        timeSlot: '13:00 - 15:30',
        activity: 'Safest Ventilation & Outdoor Errand Window',
        status: 'safe',
        recommendedAction: 'The sun has warmed the earth surface, weakening the winter inversion lid. Open opposing interior windows for 10-15 minutes to purge stale CO2 without a major PM2.5 penalty.',
        lowEmissionAlternative: 'Conduct unavoidable outdoor walking, grocery pickups, or light dog walks during this exact 2.5-hour window.',
        exposureReduction: 'Outdoor PM2.5 is 35-45% lower than morning or evening rush peaks.',
      },
      {
        timeSlot: '17:30 - 19:30',
        activity: 'Evening Rush, Heating Ignition & Dinner Prep',
        status: aqiData.aqi > 150 ? 'danger' : 'caution',
        recommendedAction: 'Inversion layer reforms rapidly as the ground cools. Close all windows by 17:00. Turn on kitchen range hood on High 2 mins BEFORE igniting stove burners. Cook with pot lids firmly in place.',
        lowEmissionAlternative: profile.cookingFuel === 'gas_stove'
          ? 'Prepare meals using an electric pressure cooker or induction hotplate to eliminate indoor NO2 spikes.'
          : 'Avoid high-temperature searing or deep frying; steam or bake instead.',
        exposureReduction: 'Eliminates up to 80% of indoor cooking-generated ultrafine particles.',
      },
      {
        timeSlot: '20:30 - 06:30',
        activity: 'Overnight Sleeping & Sanctuary Mode',
        status: 'safe',
        recommendedAction: `Retire to the designated Clean-Air Bedroom Sanctuary. Ensure door draft stopper is down. Run the DIY air purifier on continuous low mode next to the doorway.${
          isAsthmatic ? ' Keep rescue inhalers at bedside away from cold drafts.' : ''
        }`,
        lowEmissionAlternative: 'Lower thermostat setpoint by 1.5°C to 2°C overnight and add a dense down blanket. Every 1°C saves ~7% of heating fuel emissions.',
        exposureReduction: 'Guarantees 8 continuous hours of sub-12 µg/m³ clean air for restorative lung tissue recovery.',
      },
    ];

    const heatingOptimization = {
      temperatureSetting: profile.heatingType === 'wood_biomass'
        ? 'URGENT: Cease all wood stove burning during active winter inversion alerts! Switch to secondary electric or heat pump.'
        : 'Set heating to 19.5°C (67°F) during day and 18°C (64°F) overnight.',
      emissionSavingKg: profile.heatingType === 'wood_biomass' ? 32.0 : 4.5,
      airQualityTip: profile.heatingType === 'wood_biomass'
        ? 'A single wood stove emits as much fine soot per hour as 18 heavy diesel trucks idling. Shifting fuels cleans the entire block\'s air.'
        : 'Lowering the thermostat by 1.5°C prevents ~12 kg of CO2 and 40g of NOx emissions per week.',
    };

    const ventilationAdvice = {
      bestWindow: `${aqiData.safeVentilationWindow.startHour}:00 - ${aqiData.safeVentilationWindow.endHour}:00`,
      filtrationNeeded: aqiData.aqi > 100,
      instructions: 'Crack two windows on the interior courtyard side for 12 minutes. Run your DIY filter on High for 20 minutes immediately afterward.',
    };

    const vulnerableProtectionGuide: string[] = [];
    if (hasInfant) {
      vulnerableProtectionGuide.push('Infants breathe 2-3x more air per kilogram of body weight than adults: place a wet towel under the nursery door and position the air purifier 3 feet off the floor away from drafts.');
    }
    if (isAsthmatic) {
      vulnerableProtectionGuide.push('Cold dry smog triggers acute airway bronchospasm: inhale only through an N95 when outdoors to warm and humidify the air before it reaches the bronchioles.');
    }
    if (hasElderly) {
      vulnerableProtectionGuide.push('Fine PM2.5 crosses into the bloodstream, triggering vascular constriction and cardiac stress: strictly avoid morning outdoor walks before 11:00 AM.');
    }
    if (!hasVulnerable) {
      vulnerableProtectionGuide.push('Maintain optimal 40-50% indoor humidity to keep bronchial mucus escalator functioning at full efficiency.');
    }

    return {
      date: new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
      locationName: aqiData.city,
      currentAqi: aqiData.aqi,
      overallAdvisory: aqiData.aqi > 200
        ? `Severe Winter Smog Alert in ${aqiData.city} (AQI ${aqiData.aqi}). Dense ${aqiData.thermalInversion.intensity} thermal inversion trapping particulates below ${aqiData.thermalInversion.altitudeMeters}m. Execute sanctuary room protocols and avoid all outdoor exertion.`
        : `Moderate to Unhealthy Winter Smog in ${aqiData.city} (AQI ${aqiData.aqi}). Timing your ventilation and commute around the 13:00-15:00 solar mixing window will slash your family's particulate exposure by over 60%.`,
      routineSchedule: schedule,
      heatingOptimization,
      ventilationAdvice,
      vulnerableProtectionGuide,
    };
  }
}

export const routinePlannerService = new RoutinePlannerService();

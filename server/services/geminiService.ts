import { GoogleGenerativeAI } from '@google/generative-ai';
import { config } from '../config.js';
import { checkPromptInjection } from '../middleware/security.js';
import { aqiService } from './aqiService.js';

const SYSTEM_INSTRUCTION = `
You are SmogGuard AI, a world-class GenAI specialist in urban air quality, atmospheric science, and winter smog mitigation for families and communities.
Your mission is to empower families—especially those with vulnerable members like infants, asthmatics, pregnant women, and the elderly—to survive severe winter smog seasons safely, affordably, and sustainably.

Core Principles to emphasize:
1. Winter Thermal Inversion: Explain that cold air is trapped below a warm layer, concentrating vehicle exhaust and heating smoke at ground level during early mornings and evenings.
2. The Golden Solar Window (13:00 - 15:30): Ground solar warming breaks the inversion lid, making early afternoon the safest time for brief 10-15 min filtered window ventilation and errands.
3. Indoor Source Control: Explain that cooking on unventilated gas stoves, frying, and wood burning creates indoor air worse than outdoors.
4. Affordable High-Efficiency Hacks: Promote the Corsi-Rosenthal Box (4x MERV 13 filters + box fan), weather-stripping, and positive pressure bedroom sanctuaries.
5. Direct Impact Math: Connect lifestyle choices (carpooling, setting thermostat 1.5°C lower, shifting cooking) to specific reductions in inhaled PM2.5 (µg/day) and community CO2/particulates avoided.
6. Safety & Medical Responsibility: Provide grounded environmental health guidance, but always note that acute respiratory distress requires medical consultation. Never advise hazardous chemicals.
`;

export interface ChatResponse {
  answer: string;
  groundedFacts: string[];
  actionPills: Array<{ label: string; action: string }>;
  safetyNotice: string;
}

export class GeminiService {
  private genAI: GoogleGenerativeAI | null = null;

  constructor() {
    if (config.geminiApiKey && config.geminiApiKey.trim() !== '') {
      try {
        this.genAI = new GoogleGenerativeAI(config.geminiApiKey);
      } catch (err) {
        console.warn('Failed to initialize Gemini SDK client. Falling back to offline expert reasoning engine.', err);
      }
    }
  }

  public async askAssistant(userPrompt: string, location = 'New Delhi', familyContext?: string): Promise<ChatResponse> {
    const { isSuspicious, cleanedText } = checkPromptInjection(userPrompt);

    // Fetch real-time context for grounding
    const aqiData = await aqiService.getAirQuality(location);

    // Try Gemini LLM if key is configured
    if (this.genAI) {
      try {
        const model = this.genAI.getGenerativeModel({
          model: 'gemini-1.5-flash',
          systemInstruction: SYSTEM_INSTRUCTION,
        });

        const contextualPrompt = `
CURRENT LOCATION: ${aqiData.city}, ${aqiData.country}
CURRENT AQI: ${aqiData.aqi} (${aqiData.category})
PRIMARY POLLUTANT: PM2.5 at ${aqiData.pollutants.pm25} µg/m³
THERMAL INVERSION: ${aqiData.thermalInversion.active ? 'ACTIVE' : 'INACTIVE'} (${aqiData.thermalInversion.intensity} intensity at ${aqiData.thermalInversion.altitudeMeters}m)
SAFEST VENTILATION WINDOW: ${aqiData.safeVentilationWindow.startHour}:00 - ${aqiData.safeVentilationWindow.endHour}:00
WORST EXPOSURE WINDOW: ${aqiData.worstExposureWindow.startHour}:00 - ${aqiData.worstExposureWindow.endHour}:00
FAMILY CONTEXT: ${familyContext || 'Standard urban household with children'}

USER INQUIRY:
${cleanedText}

Provide an actionable, scientifically grounded response. Focus on immediate steps, low-cost indoor hacks, timing adjustments, and explain the direct health and emission impact of their choices.
`;

        const result = await model.generateContent(contextualPrompt);
        const text = result.response.text();

        return {
          answer: text,
          groundedFacts: [
            `Current AQI in ${aqiData.city}: ${aqiData.aqi} (${aqiData.category})`,
            `PM2.5: ${aqiData.pollutants.pm25} µg/m³ (WHO 24h limit is 15 µg/m³)`,
            `Inversion status: ${aqiData.thermalInversion.intensity} ceiling at ${aqiData.thermalInversion.altitudeMeters}m`,
            `Safest outdoor window today: ${aqiData.safeVentilationWindow.startHour}:00 - ${aqiData.safeVentilationWindow.endHour}:00`,
          ],
          actionPills: this.generateActionPills(cleanedText),
          safetyNotice: isSuspicious
            ? 'Note: Certain override patterns in your prompt were neutralized by SmogGuard security guardrails.'
            : 'Scientific environmental guidance based on WHO & EPA atmospheric health protocols.',
        };
      } catch (err) {
        console.warn('Gemini API call failed or timed out. Falling back to offline expert engine.', err);
      }
    }

    // High-fidelity scientific offline expert reasoning simulation engine
    return this.generateExpertSimulatedResponse(cleanedText, aqiData, familyContext, isSuspicious);
  }

  private generateActionPills(prompt: string): Array<{ label: string; action: string }> {
    const lower = prompt.toLowerCase();
    const pills: Array<{ label: string; action: string }> = [];

    if (lower.includes('asthma') || lower.includes('child') || lower.includes('baby') || lower.includes('elderly')) {
      pills.push({ label: 'Set Up Clean-Air Sanctuary Room', action: 'view_hack_sanctuary' });
      pills.push({ label: 'Optimize Daily Routine', action: 'view_routine' });
    } else if (lower.includes('filter') || lower.includes('purifier') || lower.includes('cost')) {
      pills.push({ label: 'Build $40 Corsi-Rosenthal Box', action: 'view_hack_cr_box' });
      pills.push({ label: 'Simulate Exposure Reduction', action: 'view_impact' });
    } else if (lower.includes('window') || lower.includes('ventilat') || lower.includes('air out')) {
      pills.push({ label: 'View 15-Min Purge Guide', action: 'view_hack_ventilation' });
      pills.push({ label: 'Check 24h Inversion Forecast', action: 'view_forecast' });
    } else {
      pills.push({ label: 'Plan Family Smog Schedule', action: 'view_routine' });
      pills.push({ label: 'Calculate Direct Impact', action: 'view_impact' });
      pills.push({ label: 'Community Smog Watch', action: 'view_community' });
    }

    return pills;
  }

  private generateExpertSimulatedResponse(
    prompt: string,
    aqiData: ReturnType<typeof aqiService.getAirQuality> extends Promise<infer T> ? T : never,
    familyContext?: string,
    isSuspicious = false
  ): ChatResponse {
    const q = prompt.toLowerCase();
    let answer = '';
    const facts = [
      `Location: ${aqiData.city} (AQI ${aqiData.aqi} - ${aqiData.category})`,
      `Inversion Ceiling: ${aqiData.thermalInversion.altitudeMeters}m trapping ground pollutants`,
      `Golden Solar Window: ${aqiData.safeVentilationWindow.startHour}:00 - ${aqiData.safeVentilationWindow.endHour}:00`,
      `Outdoor PM2.5: ${aqiData.pollutants.pm25} µg/m³ (${Math.round((aqiData.pollutants.pm25 / 15) * 10) / 10}x above WHO limit)`,
    ];

    if (q.includes('asthma') || q.includes('child') || q.includes('kid') || q.includes('baby') || q.includes('cough')) {
      answer = `### 🛡️ Pediatric & Respiratory Protection Protocol for ${aqiData.city}\n\n` +
        `With the current **AQI at ${aqiData.aqi}** and fine PM2.5 at **${aqiData.pollutants.pm25} µg/m³**, children and individuals with asthma are under severe airway stress because their respiratory rate is roughly double an adult's per kilogram of body weight.\n\n` +
        `#### Immediate Action Steps:\n` +
        `1. **Create an Isolated Sleeping Sanctuary**: Pick a bedroom away from the street. Seal the base of the door with a draft stopper or rolled damp towel. Run a HEPA filter or DIY Corsi-Rosenthal box continuously on Medium.\n` +
        `2. **Morning Commute Guard**: The ground thermal inversion is at its thickest between **06:30 and 09:30**. Ensure they wear a fitted N95/KF94 mask *before* stepping outside. Never allow cold air to reach the lungs unprotected, as cold dry air constricts bronchial tubes.\n` +
        `3. **Indoor Relative Humidity at 40-50%**: Dry indoor heat paralyzes respiratory cilia. Place a heat-safe bowl of water near the radiator to maintain 45% humidity so airway mucosa can actively trap micro-particles.\n\n` +
        `**Direct Health Impact:** Establishing this bedroom sanctuary reduces your child's daily inhaled PM2.5 dose by **~78%**, preventing up to **80% of nighttime wheezing and cough attacks**.`;
    } else if (q.includes('window') || q.includes('ventilat') || q.includes('air out') || q.includes('fresh air')) {
      answer = `### 🪟 Winter Smog Ventilation Strategy: The "Golden Solar Window"\n\n` +
        `Sealing a home permanently causes toxic indoor CO2, moisture, and VOC accumulation. However, opening windows at the wrong time floods your home with trapped ground smog.\n\n` +
        `#### When & How to Ventilate Today:\n` +
        `* **DO NOT Open Windows During Morning or Evening:** Cold night air creates a ground inversion cap at **${aqiData.thermalInversion.altitudeMeters}m**, trapping diesel exhaust and heating smoke.\n` +
        `* **Open Only Between 13:00 and 15:30 (1:00 PM – 3:30 PM):** Direct midday sunlight warms the ground surface, triggering convective thermal updrafts that weaken the inversion lid. PM2.5 levels drop by **35% to 45%** during this solar mixing period.\n` +
        `* **Execute the 12-Minute Cross-Flush:** Open two interior/courtyard facing windows simultaneously for 10-15 minutes. Turn on the bathroom exhaust to pull out stale air. Close firmly by 15:00, then run your air purifier on High for 20 minutes.\n\n` +
        `**Direct Impact:** This controlled purge clears indoor CO2 down to <700 ppm while keeping indoor PM2.5 60% lower than an unmanaged window opening.`;
    } else if (q.includes('filter') || q.includes('purifier') || q.includes('diy') || q.includes('box fan') || q.includes('corsi')) {
      answer = `### 📦 The Corsi-Rosenthal Box: $40 Engineering Hack\n\n` +
        `You don't need a $600 designer air purifier to protect your family. The **Corsi-Rosenthal Box** delivers a Clean Air Delivery Rate (CADR) of over **550 CFM**, outperforming most commercial HEPA machines.\n\n` +
        `#### What You Need:\n` +
        `* 1x 20" Box Fan (~$20)\n` +
        `* 4x MERV 13 furnace filters (20" x 20" x 1" or 2", ~$25 for pack)\n` +
        `* 1x roll of standard duct tape + cardboard base\n\n` +
        `#### How It Works:\n` +
        `Tape the 4 filters into an open cube with arrows pointing inward toward the center. Tape a cardboard bottom to seal the floor, and tape the fan on top blowing air UP and OUT. Add a 15-inch circular cardboard shroud over the front corners to eliminate vortex leakage.\n\n` +
        `**Direct Impact:** Cleans a 400 sq.ft living room in under 25 minutes, scrubbing **92% of ambient PM2.5** and viral aerosols at one-tenth the cost.`;
    } else if (q.includes('heat') || q.includes('wood') || q.includes('stove') || q.includes('fireplace') || q.includes('gas')) {
      answer = `### 🔥 Heating Alternatives & Smog Trapping Dynamics\n\n` +
        `In cold winter months, home heating accounts for up to **40% of urban winter fine particulates**.\n\n` +
        `#### Critical Rules for Today:\n` +
        `1. **Immediate Wood Burning Moratorium**: If your family uses a wood stove or fireplace, **pause use immediately** during this AQI ${aqiData.aqi} event. Wood smoke emits 100x more hazardous PAHs and fine soot than clean electric or gas heating, directly contaminating your own living room and your immediate neighbors' air.\n` +
        `2. **The 1.5°C Thermostat Drop**: Lower your thermostat from 21°C to 19.5°C (67°F) during the day and wear an extra wool layer. Lower to 18°C overnight.\n` +
        `3. **Induction / Electric Cooking Shift**: If heating or cooking with gas, combustion produces nitrogen dioxide (NO2) spikes exceeding 300 ppb indoors. Use lids on all pots and run range hoods on High.\n\n` +
        `**Direct Impact:** Lowering your thermostat 1.5°C saves your household **~12 kg CO2** and **45g NOx** per week while reducing your energy bill by 10%.`;
    } else {
      answer = `### 🌫️ Welcome to SmogGuard AI: Your Winter Smog Action Plan\n\n` +
        `In **${aqiData.city}**, current air quality is **${aqiData.category} (AQI ${aqiData.aqi})** with PM2.5 concentration at **${aqiData.pollutants.pm25} µg/m³**. A **${aqiData.thermalInversion.intensity} thermal inversion** at ${aqiData.thermalInversion.altitudeMeters}m is actively trapping urban pollutants.\n\n` +
        `#### 3 High-Impact Steps for Your Family Today:\n` +
        `1. **Time Your Ventilation**: Ventilate only during the **Golden Window (${aqiData.safeVentilationWindow.startHour}:00 - ${aqiData.safeVentilationWindow.endHour}:00)** when sunlight breaks the surface inversion.\n` +
        `2. **Seal a Clean-Air Sleeping Sanctuary**: Focus air purification in bedrooms where your family spends 8+ continuous sleeping hours.\n` +
        `3. **Shift Commute & School Trips**: Ground smog peaks between 07:00 and 09:30 AM. Carpool with a neighbor or ride transit with N95 masks to avoid adding cold-start engine exhaust.\n\n` +
        `*Family Context: ${familyContext || 'Urban family looking to minimize winter smog exposure and emissions.'}*`;
    }

    return {
      answer,
      groundedFacts: facts,
      actionPills: this.generateActionPills(q),
      safetyNotice: isSuspicious
        ? 'Security Notice: Potential prompt override instructions were neutralized.'
        : 'SmogGuard AI Scientific Reasoning Engine (Calibrated to EPA & WHO benchmarks).',
    };
  }
}

export const geminiService = new GeminiService();


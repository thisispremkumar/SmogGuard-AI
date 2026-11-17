export interface AqiBadgeInfo {
  category: string;
  badgeClass: string;
  textClass: string;
  bgLightClass: string;
  borderClass: string;
  iconName: 'check-circle' | 'alert-circle' | 'alert-triangle' | 'shield-alert' | 'skull';
  ariaLabel: string;
}

export const getAqiBadgeInfo = (aqi: number, highContrast = false): AqiBadgeInfo => {
  if (highContrast) {
    if (aqi <= 50) {
      return {
        category: 'Good',
        badgeClass: 'bg-emerald-950 text-emerald-200 border-2 border-emerald-400 font-bold',
        textClass: 'text-emerald-400 font-bold',
        bgLightClass: 'bg-black border-2 border-emerald-400',
        borderClass: 'border-emerald-400',
        iconName: 'check-circle',
        ariaLabel: `Air quality is Good, index ${aqi}. Safe for all outdoor activities.`,
      };
    }
    if (aqi <= 100) {
      return {
        category: 'Moderate',
        badgeClass: 'bg-amber-950 text-amber-200 border-2 border-amber-400 font-bold',
        textClass: 'text-amber-400 font-bold',
        bgLightClass: 'bg-black border-2 border-amber-400',
        borderClass: 'border-amber-400',
        iconName: 'alert-circle',
        ariaLabel: `Air quality is Moderate, index ${aqi}. Unusually sensitive individuals should limit prolonged outdoor exertion.`,
      };
    }
    if (aqi <= 150) {
      return {
        category: 'Unhealthy for Sensitive Groups',
        badgeClass: 'bg-orange-950 text-orange-200 border-2 border-orange-400 font-bold',
        textClass: 'text-orange-400 font-bold',
        bgLightClass: 'bg-black border-2 border-orange-400',
        borderClass: 'border-orange-400',
        iconName: 'alert-triangle',
        ariaLabel: `Air quality is Unhealthy for Sensitive Groups, index ${aqi}. Asthmatics, children, and elderly should reduce outdoor activities.`,
      };
    }
    if (aqi <= 200) {
      return {
        category: 'Unhealthy',
        badgeClass: 'bg-red-950 text-red-200 border-2 border-red-400 font-bold',
        textClass: 'text-red-400 font-bold',
        bgLightClass: 'bg-black border-2 border-red-400',
        borderClass: 'border-red-400',
        iconName: 'shield-alert',
        ariaLabel: `Air quality is Unhealthy, index ${aqi}. Everyone may begin to experience health effects. Wear an N95 outdoors.`,
      };
    }
    if (aqi <= 300) {
      return {
        category: 'Very Unhealthy',
        badgeClass: 'bg-purple-950 text-purple-200 border-2 border-purple-400 font-bold',
        textClass: 'text-purple-400 font-bold',
        bgLightClass: 'bg-black border-2 border-purple-400',
        borderClass: 'border-purple-400',
        iconName: 'shield-alert',
        ariaLabel: `Air quality is Very Unhealthy, index ${aqi}. Health alert. Significant health effects for the entire population.`,
      };
    }
    return {
      category: 'Hazardous',
      badgeClass: 'bg-stone-950 text-red-200 border-4 border-red-500 font-black',
      textClass: 'text-red-400 font-black',
      bgLightClass: 'bg-black border-4 border-red-500',
      borderClass: 'border-red-500',
      iconName: 'skull',
      ariaLabel: `Air quality is Hazardous, emergency condition, index ${aqi}. Entire population is more likely to be affected. Avoid all outdoor physical activity.`,
    };
  }

  // Standard high-clarity color palette
  if (aqi <= 50) {
    return {
      category: 'Good',
      badgeClass: 'bg-emerald-100 text-emerald-800 border border-emerald-300 dark:bg-emerald-950/80 dark:text-emerald-300 dark:border-emerald-700',
      textClass: 'text-emerald-600 dark:text-emerald-400',
      bgLightClass: 'bg-emerald-50/60 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800',
      borderClass: 'border-emerald-500',
      iconName: 'check-circle',
      ariaLabel: `Air quality is Good with an index of ${aqi}. Outdoor air is clean.`,
    };
  }
  if (aqi <= 100) {
    return {
      category: 'Moderate',
      badgeClass: 'bg-amber-100 text-amber-800 border border-amber-300 dark:bg-amber-950/80 dark:text-amber-300 dark:border-amber-700',
      textClass: 'text-amber-600 dark:text-amber-400',
      bgLightClass: 'bg-amber-50/60 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800',
      borderClass: 'border-amber-500',
      iconName: 'alert-circle',
      ariaLabel: `Air quality is Moderate with an index of ${aqi}. Acceptable quality, but sensitive individuals should monitor symptoms.`,
    };
  }
  if (aqi <= 150) {
    return {
      category: 'Unhealthy for Sensitive Groups',
      badgeClass: 'bg-orange-100 text-orange-800 border border-orange-300 dark:bg-orange-950/80 dark:text-orange-300 dark:border-orange-700',
      textClass: 'text-orange-600 dark:text-orange-400',
      bgLightClass: 'bg-orange-50/60 dark:bg-orange-950/30 border-orange-200 dark:border-orange-800',
      borderClass: 'border-orange-500',
      iconName: 'alert-triangle',
      ariaLabel: `Air quality is Unhealthy for Sensitive Groups with an index of ${aqi}. Asthmatics and children at risk.`,
    };
  }
  if (aqi <= 200) {
    return {
      category: 'Unhealthy',
      badgeClass: 'bg-red-100 text-red-800 border border-red-300 dark:bg-red-950/80 dark:text-red-300 dark:border-red-700',
      textClass: 'text-red-600 dark:text-red-400',
      bgLightClass: 'bg-red-50/60 dark:bg-red-950/30 border-red-200 dark:border-red-800',
      borderClass: 'border-red-500',
      iconName: 'shield-alert',
      ariaLabel: `Air quality is Unhealthy with an index of ${aqi}. General public at increased health risk.`,
    };
  }
  if (aqi <= 300) {
    return {
      category: 'Very Unhealthy',
      badgeClass: 'bg-purple-100 text-purple-800 border border-purple-300 dark:bg-purple-950/80 dark:text-purple-300 dark:border-purple-700',
      textClass: 'text-purple-600 dark:text-purple-400',
      bgLightClass: 'bg-purple-50/60 dark:bg-purple-950/30 border-purple-200 dark:border-purple-800',
      borderClass: 'border-purple-500',
      iconName: 'shield-alert',
      ariaLabel: `Air quality is Very Unhealthy with an index of ${aqi}. Health warnings of emergency conditions.`,
    };
  }
  return {
    category: 'Hazardous',
    badgeClass: 'bg-rose-900 text-rose-100 border border-rose-500 dark:bg-rose-950 dark:text-rose-200 dark:border-rose-600',
    textClass: 'text-rose-600 dark:text-rose-400',
    bgLightClass: 'bg-rose-50/80 dark:bg-rose-950/40 border-rose-300 dark:border-rose-800',
    borderClass: 'border-rose-600',
    iconName: 'skull',
    ariaLabel: `Air quality is Hazardous with an index of ${aqi}. Severe health emergency. Stay indoors with air filtration.`,
  };
};


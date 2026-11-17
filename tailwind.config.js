/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        aqi: {
          good: '#10B981',       // 0-50 (Green)
          moderate: '#F59E0B',   // 51-100 (Yellow/Amber)
          sensitive: '#F97316',  // 101-150 (Orange)
          unhealthy: '#EF4444',  // 151-200 (Red)
          veryUnhealthy: '#8B5CF6', // 201-300 (Purple)
          hazardous: '#7F1D1D',  // 301-500 (Deep Maroon)
        },
        winter: {
          ice: '#E0F2FE',
          frost: '#0284C7',
          smogSky: '#475569',
          thermalTrap: '#334155',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      }
    },
  },
  plugins: [],
}


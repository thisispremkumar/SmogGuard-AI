# 🌫️ SmogGuard AI: GenAI Urban Air Quality & Winter Smog Assistant

> **Challenge 6 Submission:** A GenAI-powered assistant empowering families and communities to navigate severe winter smog and urban air pollution with personalized low-emission daily routines, indoor air quality hacks, and sustainable alternatives while clearly explaining the direct health and environmental impact of their choices.

[![GitHub Repo](https://img.shields.io/badge/GitHub-SmogGuard--AI-blue?logo=github)](https://github.com/thisispremkumar/SmogGuard-AI)
[![Cloud Run](https://img.shields.io/badge/Cloud%20Run-Live%20Demo-emerald?logo=googlecloud)](https://smogguard-ai-730243407394.us-central1.run.app)
[![GCP Project](https://img.shields.io/badge/GCP%20Project-promptwars--edition-4285F4?logo=googlecloud)](https://console.cloud.google.com)
[![Tests](https://img.shields.io/badge/tests-16%20passed-emerald)](file:///C:/Users/premm/Desktop/Projects/challenge6/server/tests)
[![Accessibility](https://img.shields.io/badge/accessibility-WCAG%202.1%20AA-cyan)](file:///C:/Users/premm/Desktop/Projects/challenge6/src/context/AccessibilityContext.tsx)
[![Security](https://img.shields.io/badge/security-Helmet%20%2B%20RateLimit%20%2B%20Zod-purple)](file:///C:/Users/premm/Desktop/Projects/challenge6/server/middleware/security.ts)
[![AI Grounding](https://img.shields.io/badge/genai-Gemini%20%2B%20Expert%20Atmospheric%20Engine-blue)](file:///C:/Users/premm/Desktop/Projects/challenge6/server/services/geminiService.ts)

---

## ☁️ Google Cloud Platform Deployment & Telemetry
* **Live Cloud Run URL**: [https://smogguard-ai-730243407394.us-central1.run.app](https://smogguard-ai-730243407394.us-central1.run.app)
* **GitHub Repository**: [https://github.com/thisispremkumar/SmogGuard-AI.git](https://github.com/thisispremkumar/SmogGuard-AI.git)
* **GCP Project ID**: `promptwars-edition`
* **GCP Project Number**: `730243407394`
* **Primary Region**: `us-central1`
* **Service Name**: `smogguard-ai`

---

## 🌟 Executive Summary & Problem Statement Alignment

During winter months, urban basins worldwide (e.g. New Delhi, Salt Lake City, Beijing, Krakow, Milan, Lahore, London) suffer from **Severe Thermal Inversions**: a meteorologic phenomenon where a layer of warm air acts as a lid trapping dense, cold, stagnant air below. Vehicle exhaust, biomass burning, and domestic heating particulates (PM2.5, PM10, NO₂, SO₂) become concentrated at ground level, creating life-threatening smog conditions that disproportionately harm infants, asthmatics, and the elderly.

**SmogGuard AI** is engineered from the ground up to solve this:
1. **Atmospheric Inversion Modeling & Diurnal Forecasts**: Tracks hourly winter smog cycles, identifying both the **Hazardous Ground Inversion Trap** (06:30–09:30 & 18:30–22:00) and **The Golden Solar Window** (13:00–15:30) when ground solar warming temporarily breaks the inversion lid.
2. **Personalized Low-Emission Daily Routines**: Generates tailored family schedules based on specific vulnerabilities (infants, asthmatics, seniors, pregnant members), commute modes, and heating fuel types to slash personal exposure and eliminate cold-start engine emissions.
3. **Indoor Air Quality (IAQ) Engineering Lab**: Delivers low-cost, physics-backed indoor hacks, prominently featuring the **$40 Corsi-Rosenthal Box** (CAD-style schematic, materials, step-by-step instructions delivering >500 CFM clean air), Clean-Air Bedroom Sanctuaries, and Kitchen Source Control.
4. **Direct Impact & Consequence Simulator**: Solves the critical requirement to **clearly explain the direct impact of choices** with rigorous mathematical models quantifying personal inhaled PM2.5 dosage reduction (µg/day), acute respiratory risk mitigation, and weekly neighborhood CO₂ & soot eliminated.
5. **GenAI Advisory Specialist**: Interactive conversational assistant powered by Google Gemini (with an autonomous scientific offline expert reasoning engine fallback) that provides grounded advice with prompt injection defense, safety guardrails, and actionable quick-links.
6. **Community Smog Watch & Collective Pledges**: Mobilizes neighborhoods for collective solidarity—tracking ground smoke hotspots, public clean-air sanctuaries, and neighborhood wood-burning moratorium pledges.

---

## 📐 System Architecture

SmogGuard AI is built as a modular, production-grade fullstack application:

```
challenge6/
├── server/                              # Node.js + Express + TypeScript Backend
│   ├── config.ts                        # Environment configuration & type validation
│   ├── index.ts                         # Express app, Helmet, CORS, Rate limiting, SPA static serving
│   ├── middleware/
│   │   ├── security.ts                  # Input sanitization, Prompt Injection Defense, Rate limiting
│   │   ├── errorHandler.ts              # Centralized safe error handler (no stack trace leak)
│   ├── services/
│   │   ├── aqiService.ts                # EPA US AQI breakpoints, winter diurnal curves, hotspot profiles
│   │   ├── geminiService.ts             # Google Gemini GenAI SDK + offline scientific expert engine
│   │   ├── routinePlannerService.ts     # Personalized winter schedules factoring in vulnerabilities
│   │   ├── indoorAirService.ts          # Curated IAQ hacks (Corsi-Rosenthal Box, Sanctuaries, Purges)
│   │   ├── impactCalculatorService.ts   # Epidemiological & environmental dosage/emission models
│   │   └── communityService.ts          # Community alert board, upvotes, collective pledges
│   ├── routes/                          # Zod-validated REST API endpoints
│   │   ├── aqiRoutes.ts
│   │   ├── routineRoutes.ts
│   │   ├── indoorAirRoutes.ts
│   │   ├── impactRoutes.ts
│   │   ├── assistantRoutes.ts
│   │   └── communityRoutes.ts
│   └── tests/                           # Vitest Unit & Integration Test Suite
│       ├── aqiService.test.ts
│       ├── impactCalculator.test.ts
│       ├── securityGuardrails.test.ts
│       └── apiRoutes.test.ts
└── src/                                 # Modern React 19 + TypeScript + Vite Frontend
    ├── context/
    │   └── AccessibilityContext.tsx     # High Contrast, Text Scaling, ARIA Live Announcements
    ├── components/
    │   ├── Header.tsx                   # Sticky nav, city switcher, live AQI capsule, a11y toggles
    │   ├── ThermalInversionAlert.tsx    # Atmospheric physics alert & golden window indicator
    │   ├── AqiDashboard.tsx             # Real-time AQI dial, WHO pollutant metrics, 24h curve
    │   ├── RoutinePlanner.tsx           # Vulnerability checkboxes & tailored schedule cards
    │   ├── IndoorAirLab.tsx             # Interactive DIY Corsi-Rosenthal CAD builder & guide
    │   ├── ImpactCalculator.tsx         # Health & community emission consequence simulator
    │   ├── GenAiAssistant.tsx           # Conversational AI assistant with grounded citations
    │   └── CommunitySmogWatch.tsx       # Neighborhood reports, upvotes & moratorium pledges
    └── utils/
        └── aqiHelpers.ts                # EPA/WHO color-safe, contrast-safe styling & ARIA helpers
```

---

## 🏆 Evaluation Focus Areas Mapping

### 1. Code Quality & Clean Architecture (High Impact)
* **Separation of Concerns (MVC & Clean Architecture)**:
  - **Controllers Layer (`server/controllers/`)**: HTTP handlers completely decoupled from routing declarations (`AqiController`, `RoutineController`, `IndoorAirController`, `ImpactController`, `AssistantController`, `CommunityController`).
  - **Services Layer (`server/services/`)**: Pure domain and atmospheric business logic isolated from HTTP transport.
  - **Standardized API Response Pattern (`server/utils/apiResponse.ts`)**: Unified `ApiResponse<T>` envelope across all endpoints.
  - **Frontend Centralized API Client (`src/services/apiClient.ts`)**: Strongly-typed client abstracting network calls away from React presentation components.
* **Custom Domain Error Hierarchy (`server/errors/AppError.ts`)**: Operational domain errors (`BadRequestError`, `NotFoundError`, `ValidationError`, `InternalServerError`) with centralized non-leaking error handling.
* **Production Structured Logging (`server/utils/logger.ts`)**: Timestamped contextual logging replacing bare console outputs.
* **Zero Magic Numbers (`server/constants/atmospheric.ts`)**: Every aerodynamic, respiratory, and emission factor is extracted with authoritative peer-reviewed citations (WHO, EPA, ASHRAE, IPCC).
* **Strict TypeScript Typing**: End-to-end type safety across both frontend and backend (`server/types/index.ts` and `src/types/index.ts`) with zero implicit `any`.

### 2. Security (Safe and Responsible Implementation)
- **Prompt Injection Defense**: `checkPromptInjection()` in [security.ts](file:///C:/Users/premm/Desktop/Projects/challenge6/server/middleware/security.ts#L43-L65) detects and neutralizes jailbreak attempts (e.g. *"ignore previous instructions"*, *"system override"*, *"act as a DAN"*).
- **Strict Input Validation**: Every incoming API payload is strictly validated using **Zod schemas** (`FamilyProfileSchema`, `ImpactInputSchema`, `ChatQuerySchema`, `NewReportSchema`).
- **HTML & XSS Sanitization**: Strips dangerous HTML tags and script injections before processing.
- **Hardened HTTP Headers**: Comprehensive `helmet()` configuration with Content Security Policy (CSP).
- **Abuse Prevention**: Rate limiting via `express-rate-limit` (120 requests / 15 minutes).
- **Zero Hardcoded Secrets**: Fully environment-variable driven (`.env.example`).
- **Responsible AI Guardrails**: Grounded strictly in WHO and EPA environmental guidelines with clear medical non-diagnostic boundaries.

### 3. Efficiency (Optimal Use of Resources)
- **Lightweight Bundling**: Vite tree-shaking with fast chunk rendering (CSS 7.6 kB gzipped, JS 89 kB gzipped).
- **Asynchronous Non-Blocking I/O**: Fast, concurrent request handling.
- **Deterministic Offline Simulation Engine**: When offline or if an API key is not configured, SmogGuard AI instantly responds using a mathematically calibrated atmospheric expert engine without burning unnecessary cloud tokens or stalling.

### 4. Testing (Validation of Functionality)
SmogGuard AI includes a **16-test comprehensive test suite** across 4 suites using Vitest and Supertest:
- `aqiService.test.ts`: Verifies EPA breakpoints, PM2.5 to AQI conversion, WHO categories, and diurnal winter smog curves.
- `impactCalculator.test.ts`: Validates personal PM2.5 inhaled dosage math, filtration efficiency, and community CO₂/particulate savings.
- `securityGuardrails.test.ts`: Tests HTML sanitization and prompt injection neutralization.
- `apiRoutes.test.ts`: Supertest integration tests verifying endpoints (`/api/health`, `/api/aqi`, `/api/indoor-hacks`, `/api/impact/calculate`, `/api/routine/generate`, `/api/assistant/chat`, `/api/community/reports`) and Zod rejection on invalid inputs.

Run tests:
```bash
npm test
```

### 5. Accessibility (WCAG 2.1 AA Compliant)
- **High Contrast Mode**: One-click high-contrast mode with enhanced luminosity borders and dark backgrounds.
- **Non-Color Dependent Indicators**: Color is never the sole indicator—every AQI status includes plain-text labels, numeric ranges, and distinct semantic icons.
- **Dynamic Text Scaling**: Supports Normal, Large (+12.5%), and Extra Large (+25%) font scaling without layout breakage.
- **Screen Reader Support**: Hidden skip links (`#main-content`), ARIA live status regions (`aria-live="polite"`), and explicit `aria-label` attributes on all dynamic dials, sliders, and interactive controls.
- **Keyboard Navigation**: Full focus ring visibility (`*:focus-visible`) and interactive tab orders.

### 6. Problem Statement Alignment
- **Focus**: Severe winter smog & thermal inversion traps in urban environments.
- **Families**: Tailored profiles for infants, asthmatics, seniors, and pregnant members.
- **Actionable Hacks**: DIY Corsi-Rosenthal boxes, 15-minute solar window purge, bedroom sanctuaries.
- **Impact Explanation**: Clear quantitative and narrative breakdown of both individual lung benefits and neighborhood emission reductions.

---

## 🚀 Quickstart & Verification Guide

### Prerequisites
- Node.js v18+ (tested on v24)
- npm v9+

### 1. Installation
Clone the repository and install dependencies:
```bash
npm install
```

### 2. Environment Setup (Optional)
SmogGuard AI works **out-of-the-box with zero setup** thanks to its built-in scientific expert reasoning engine. If you wish to enable live Google Gemini LLM queries, create a `.env` file:
```bash
cp .env.example .env
```
Add your key:
```ini
GEMINI_API_KEY=your_google_gemini_api_key_here
PORT=3001
```

### 3. Running the Test Suite
Execute the full automated test suite:
```bash
npm test
```
All 16 unit and integration tests should pass cleanly.

### 4. Running the Development Server
Launch both frontend and backend concurrently:
```bash
npm run dev
```
- Frontend UI: `http://localhost:5173`
- Backend API: `http://localhost:3001`

### 5. Production Build & Execution
```bash
# Build frontend and server
npm run build

# Start production server
npm start
```
Access the application at `http://localhost:3001`.

---

## 📊 Scientific Atmospheric & Impact Formulas

SmogGuard AI calculates direct impact based on atmospheric and epidemiological standards:

1. **Daily Inhaled PM2.5 Dosage ($\mu\text{g/day}$)**:
   $$\text{Dose} = V_{\text{resp}} \times \left( f_{\text{indoor}} \times C_{\text{indoor}} + f_{\text{outdoor}} \times C_{\text{outdoor}} \right)$$
   Where $V_{\text{resp}} \approx 12\text{ m}^3/\text{day}$ (standard adult/child respiration rate) and $C_{\text{indoor}}$ drops by $85\text{--}92\%$ when running a DIY Corsi-Rosenthal box.

2. **Commute Emission Elimination**:
   $$\Delta \text{CO}_2 (\text{kg/wk}) = \text{Distance}_{\text{km}} \times \text{Days}_{\text{carpool}} \times 0.5 \times 0.165\text{ kg CO}_2/\text{km}$$

3. **Thermostat Setback Benefit**:
   Every $1^\circ\text{C}$ reduction in home heating setpoint eliminates $\approx 7\%$ of heating fuel consumption, avoiding $\approx 12\text{ kg CO}_2$ and $\approx 45\text{g NO}_x$ precursors per household per week.

---

## 📄 License & Attribution
Developed for the Urban Air Quality Challenge. Open source under the MIT License. Built with care for urban families navigating severe winter smog seasons.


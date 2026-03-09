# DevTrails — Parametric Income Insurance for Gig Workers

A full-stack MERN application that provides automatic income protection for food delivery workers (Swiggy, Zomato, Dunzo, Blinkit) against income loss caused by weather disruptions, poor air quality, and civic events like curfews.

---

## What Is Parametric Insurance?

Traditional insurance requires you to file a claim, submit proof, and wait weeks. **Parametric insurance** works differently — it pays automatically when a measurable trigger condition is met, with no paperwork.

**Example:** If rainfall in Mumbai exceeds 80 mm/hr, every active policy holder in Mumbai is automatically credited a payout to their UPI wallet within minutes — no claim form, no waiting.

---

## Problem Statement

Food delivery workers lose income every time:
- Heavy rain makes roads unsafe
- Extreme heat (42°C+) forces them to stop riding
- Severe air pollution (AQI > 300) makes outdoor work dangerous
- Floods or curfews shut down entire areas

They have no safety net. DevTrails fixes this with automated, real-time income protection.

---

## Core Features

| Feature | Description |
|---|---|
| **Automated Claim Triggers** | Cron job monitors weather every 15 minutes across 7 cities and auto-generates claims when thresholds are breached |
| **Risk Scoring** | AI-style risk score (0–100) calculated from live weather data, city, platform, and seasonal factors |
| **Dynamic Premiums** | Weekly premium calculated per worker (base ₹20 + risk factors, capped ~₹50/week) |
| **Fraud Detection** | Automatic scoring: GPS mismatch, duplicate claims within 24h, excessive claim frequency, pending KYC |
| **Admin Dashboard** | Full analytics, fraud review, worker management, city-wise disruption monitoring |
| **Dark Mode** | System-aware dark/light mode toggle with persistence |

---

## Tech Stack

### Backend
| Package | Role |
|---|---|
| Node.js + Express.js | REST API server |
| MongoDB + Mongoose | Database and ODM |
| JSON Web Tokens (jsonwebtoken) | Stateless authentication |
| bcryptjs | Password hashing |
| node-cron | Scheduled disruption monitoring job |
| Axios | Weather API calls (OpenWeatherMap, WAQI) |
| Helmet + CORS | Security headers |
| express-rate-limit | Brute-force protection |
| Morgan | HTTP request logging |

### Frontend
| Package | Role |
|---|---|
| React 18 + Vite | UI framework and dev bundler |
| Tailwind CSS 3 | Utility-first styling |
| Framer Motion | Page transitions and animations |
| Recharts | Earnings, payouts, claims charts |
| TanStack React Query v5 | Server state, caching, refetching |
| React Router v6 | Client-side routing |
| Lucide React | Icon system |
| Radix UI | Accessible headless UI primitives |
| React Hot Toast | Notification toasts |

---

## Project Structure

```
devtrails/
├── backend/
│   ├── server.js                   # Express app entry point
│   ├── .env                        # Environment variables (copy from .env.example)
│   └── src/
│       ├── config/
│       │   ├── database.js         # MongoDB connection
│       │   └── constants.js        # Disruption types, risk levels, cities
│       ├── models/
│       │   ├── User.js             # Auth user (name, email, role)
│       │   ├── WorkerProfile.js    # Delivery platform, city, risk score
│       │   ├── InsurancePolicy.js  # Coverage config, premium, payment history
│       │   ├── DisruptionEvent.js  # Weather trigger events per city
│       │   ├── Claim.js            # Auto-generated claim with timeline
│       │   └── FraudFlag.js        # AI fraud detection flags
│       ├── controllers/
│       │   ├── authController.js   # register, login, getMe
│       │   ├── workerController.js # profile, risk score, dashboard data
│       │   ├── policyController.js # activate, cancel, premium calculator
│       │   ├── claimController.js  # list claims, stats, single claim
│       │   └── adminController.js  # platform analytics, fraud review, workers
│       ├── services/
│       │   ├── riskScoringService.js     # Calculates risk score + premium breakdown
│       │   ├── weatherService.js         # OpenWeatherMap + WAQI API integration
│       │   ├── claimTriggerService.js    # Auto-generates parametric claims
│       │   └── fraudDetectionService.js  # Evaluates fraud probability (0–100)
│       ├── middleware/
│       │   ├── auth.js             # JWT protect(), requireRole()
│       │   ├── errorHandler.js     # Global error handler
│       │   └── rateLimiter.js      # 200 req/15min general, 10 req/15min auth
│       ├── routes/
│       │   ├── auth.js             # /api/auth
│       │   ├── worker.js           # /api/worker
│       │   ├── policy.js           # /api/policy
│       │   ├── claims.js           # /api/claims
│       │   ├── admin.js            # /api/admin
│       │   └── disruptions.js      # /api/disruptions
│       └── jobs/
│           └── disruptionMonitor.js  # Cron job — runs every 15 minutes
│
└── frontend/
    ├── index.html
    ├── vite.config.js              # Proxies /api/* to localhost:5000
    ├── tailwind.config.js          # Custom colors: indigo/emerald/orange
    └── src/
        ├── main.jsx                # App bootstrap
        ├── App.jsx                 # Route definitions
        ├── index.css               # Global styles, glass-card, btn-primary utilities
        ├── context/
        │   ├── AuthContext.jsx     # JWT auth state, login/register/logout
        │   └── ThemeContext.jsx    # Dark/light mode toggle
        ├── services/
        │   └── api.js              # Axios instance with auth interceptor
        ├── utils/
        │   └── helpers.js          # formatCurrency, formatDate, getStatusColor
        ├── components/
        │   ├── StatCard.jsx        # Animated metric card with trend indicator
        │   ├── RiskMeter.jsx       # SVG circular progress gauge
        │   ├── AlertCard.jsx       # Disruption alert display
        │   ├── ClaimTimeline.jsx   # Animated claim event timeline
        │   ├── Sidebar.jsx         # Responsive navigation sidebar
        │   ├── Navbar.jsx          # Top bar with dark mode + notifications
        │   └── charts/Charts.jsx   # EarningsChart, ClaimsBarChart, DailyPayoutsChart
        ├── layouts/
        │   └── DashboardLayout.jsx # Shell: sidebar + navbar + animated outlet
        └── pages/
            ├── Landing.jsx         # Marketing landing page
            ├── Login.jsx           # Sign in with demo quick-login buttons
            ├── Register.jsx        # 2-step onboarding form
            ├── worker/
            │   ├── Dashboard.jsx   # Risk meter, alerts, recent claims, earnings chart
            │   ├── Policy.jsx      # Policy status, activation, premium breakdown
            │   ├── Claims.jsx      # Filterable claims list with expandable timeline
            │   └── ClaimAutomation.jsx  # How the automated trigger pipeline works
            └── admin/
                ├── Dashboard.jsx   # Platform overview with 6 stat cards
                ├── Analytics.jsx   # City/type charts, daily payout trends
                ├── FraudAlerts.jsx # Review and approve/reject flagged claims
                └── Workers.jsx     # Searchable worker management table
```

---

## Automated Claim Flow

This is the core innovation — zero manual steps from weather event to worker payout.

```
Step 1 — Weather Monitoring (every 15 min)
  DisruptionMonitor cron job runs checkDisruptions()
  For each of 7 cities → calls weatherService.getCurrentWeather(lat, lon)
  If API unavailable → falls back to getMockWeather(city)

Step 2 — Threshold Check
  checkDisruptionThreshold(weather) evaluates:
    rain1h  >= 80 mm   → triggers 'rain' disruption
    temp    >= 42 °C   → triggers 'heat' disruption
    aqi     >= 300     → triggers 'aqi' disruption

Step 3 — Disruption Event Created
  DisruptionEvent saved to MongoDB with:
    city, type, measuredValue, threshold, severity, isActive: true

Step 4 — Claims Auto-Generated (claimTriggerService)
  Finds all WorkerProfiles in the affected city
  Joins with active InsurancePolicies
  For each eligible worker:
    Checks coverage is enabled for this disruption type
    Checks no duplicate claim for same disruption exists
    Calculates progressive payout:
      excess = measuredValue - threshold
      multiplier = min(2, 1 + excess / threshold)
      payout = min(maxPayout × coverage.multiplier × multiplier, maxPayout)

Step 5 — Fraud Detection (fraudDetectionService)
  Scores the claim 0–100:
    +40  GPS location mismatch with city
    +30  Duplicate claim within 24 hours
    +20  More than 4 claims in the past month
    +10  KYC not verified
  Score < 50  → auto-approved
  Score >= 50 → flagged for admin review

Step 6 — Payout Processed
  Claim status: pending → approved → paid
  Mock UPI transaction ID generated (UPI-XXXX)
  WorkerProfile totals incremented
  Timeline events appended to claim
```

---

## Risk Scoring Model

Each worker's risk score (0–100) is calculated from weighted factors:

| Factor | Weight | Source |
|---|---|---|
| Rain risk | 35% | Live rain data vs threshold proximity |
| Heat risk | 25% | Temperature vs 42°C threshold |
| AQI risk | 20% | Air quality index vs 300 threshold |
| Historical claims | 10% | Past claim frequency |
| Seasonal factor | 10% | Month-based risk multiplier |

**Risk levels:**
- 0–33 → Low (green) — base premium ₹20/week
- 34–66 → Medium (amber) — premium ₹20–₹35/week
- 67–100 → High (red) — premium ₹35–₹50/week

---

## API Reference

### Auth
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register new worker account |
| POST | `/api/auth/login` | Login, returns JWT |
| GET | `/api/auth/me` | Get authenticated user |

### Worker
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/worker/profile` | Worker profile + city |
| PUT | `/api/worker/profile` | Update profile |
| GET | `/api/worker/risk-score` | Current risk score + premium breakdown |
| GET | `/api/worker/dashboard` | Dashboard summary data |
| GET | `/api/worker/earnings-chart` | 30-day earnings vs compensation chart |

### Policy
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/policy` | Get current policy |
| POST | `/api/policy/activate` | Activate policy |
| POST | `/api/policy/calculate-premium` | Preview premium for city/platform |
| PUT | `/api/policy/:id/cancel` | Cancel active policy |

### Claims
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/claims` | List all claims for current worker |
| GET | `/api/claims/:id` | Single claim with full timeline |
| GET | `/api/claims/stats/summary` | Total received, this month, pending count |

### Admin
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/admin/dashboard` | Platform KPI overview |
| GET | `/api/admin/claims` | All claims (paginated) |
| PUT | `/api/admin/claims/:id/review` | Approve or reject a flagged claim |
| GET | `/api/admin/fraud-flags` | Fraud flags with filter by status |
| GET | `/api/admin/analytics/claims` | Claims by city, by type, daily payouts |
| GET | `/api/admin/workers` | All registered workers |
| GET | `/api/admin/disruptions` | All disruption events |

### Disruptions
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/disruptions` | All disruption events |
| GET | `/api/disruptions/active/alerts` | Currently active disruptions |

---

## Cities Covered

| City | Lat | Lon |
|---|---|---|
| Mumbai | 19.0760 | 72.8777 |
| Delhi | 28.6139 | 77.2090 |
| Bengaluru | 12.9716 | 77.5946 |
| Chennai | 13.0827 | 80.2707 |
| Hyderabad | 17.3850 | 78.4867 |
| Kolkata | 22.5726 | 88.3639 |
| Pune | 18.5204 | 73.8567 |

---

## Setup and Installation

### Prerequisites
- Node.js v18+
- MongoDB v6+ (running locally or MongoDB Atlas)
- npm v9+

### 1. Clone and install dependencies

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 2. Configure environment variables

```bash
cd backend
cp .env.example .env
```

Edit `backend/.env`:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/devtrails
JWT_SECRET=your_minimum_32_character_secret_here
JWT_EXPIRE=7d
NODE_ENV=development

# OpenWeatherMap — https://openweathermap.org/api
OPENWEATHER_API_KEY=your_key_here
OPENWEATHER_BASE_URL=https://api.openweathermap.org/data/2.5

# WAQI Air Quality — https://aqicn.org/api/
AQI_API_KEY=your_key_here
AQI_BASE_URL=https://api.waqi.info

# Disruption thresholds (can be adjusted)
RAIN_THRESHOLD_MM=80
HEAT_THRESHOLD_CELSIUS=42
AQI_THRESHOLD=300

# Cron check interval (minutes)
DISRUPTION_CHECK_INTERVAL=15
```

> If API keys are not provided, the app automatically falls back to realistic mock weather data for all 7 cities.

### 3. Start the servers

Open two terminal windows:

```bash
# Terminal 1 — Backend (port 5000)
cd backend
npm run dev

# Terminal 2 — Frontend (port 5173)
cd frontend
npm run dev
```

Open **http://localhost:5173** in your browser.

### 4. Demo accounts

Use the quick-login buttons on the Login page, or create an account via Register.

| Role | Email | Password |
|---|---|---|
| Worker | worker@demo.com | demo1234 |
| Admin | admin@demo.com | demo1234 |

> These are seeded automatically if you set up a seed script, or you can register manually.

---

## User Roles

### Worker
- Register and complete onboarding (city + delivery platform)
- View personalised risk score and premium breakdown
- Activate insurance policy (weekly payment)
- Automatically receive payouts when disruption thresholds are breached
- View full claim history with status timeline
- Understand the parametric trigger workflow

### Admin
- Monitor platform-wide KPIs (workers, policies, payouts, fraud flags)
- Review and approve/reject fraud-flagged claims
- Analyse claims data by city, disruption type, and day
- Manage worker accounts and policy statuses
- View all disruption events across cities

---

## Disruption Trigger Thresholds

| Type | Threshold | Unit | Max Payout |
|---|---|---|---|
| Heavy Rain | 80 | mm/hr | ₹500 |
| Extreme Heat | 42 | °C | ₹300 |
| Poor Air Quality | 300 | AQI | ₹250 |
| Flood Alert | Level: high | — | ₹500 |
| Curfew / Lockdown | Active | — | ₹500 |
| Severe Storm | Active | — | ₹400 |

Payouts scale progressively — a more severe event (e.g. 110 mm of rain vs the 80 mm threshold) results in a higher payout up to the policy maximum.

---

## Design System

| Token | Value | Usage |
|---|---|---|
| `primary` | Indigo (`#6366f1`) | Buttons, active states, links |
| `secondary` | Emerald (`#10b981`) | Success, payouts, active policies |
| `accent` | Orange (`#f97316`) | Warnings, heat-related alerts |

Key CSS utility classes (defined in `src/index.css`):
- `.glass-card` — frosted glass card with backdrop blur
- `.btn-primary` — filled primary button
- `.btn-secondary` — outlined secondary button
- `.input-field` — styled form input
- `.sidebar-link` — navigation link with active indicator
- `.skeleton` — shimmer loading placeholder

---

## Security

- JWT tokens expire in 7 days and are stored in `localStorage`
- All routes except `/api/auth/*` require a valid `Bearer` token
- Passwords are hashed with bcrypt (salt rounds: 12)
- `helmet` sets secure HTTP headers on all responses
- Rate limiting: 200 requests/15 min general, 10 requests/15 min on auth endpoints
- All text inputs validated with `express-validator` before processing
- MongoDB queries use Mongoose schema validation and typed ObjectId refs

---

## License

MIT

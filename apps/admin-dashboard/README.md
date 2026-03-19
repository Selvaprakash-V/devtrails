# QuickClaim Admin Dashboard

The Admin Dashboard acts as a real-time control center to monitor workers, detect fraud, analyze disruptions, and protect the platform from coordinated attacks.

---

## Tech Stack

- React 18 + Vite
- Tailwind CSS (dark theme)
- Recharts (line, bar, pie, scatter, area charts)
- React Router v6
- Axios

---

## Getting Started

```bash
cd apps/admin-dashboard
npm install
npm run dev
```

Runs at `http://localhost:3001`

**Login credentials**
```
Username: admin
Password: admin123
```

> Works offline — falls back to mock data when the API server is not running.

---

## Modules

### 1. Global Overview
Real-time snapshot of the entire platform.

- Active workers, policies, live disruptions, total payouts
- Fraud alert count (highlighted when above threshold)
- Payout trend line chart
- Risk distribution pie chart
- Claims per city bar chart
- Live insight banners for anomaly spikes

### 2. Worker Monitoring
Track every worker across platforms.

- Worker table with ID, platform, city, risk score, location, status
- Risk score bar per worker (color-coded: green / amber / red)
- Status filter — Active, Idle, Suspicious
- Automated red flag signals — location cluster, no movement, instant jump
- Alert banner when suspicious workers are detected

### 3. Disruption Intelligence
Live weather and environmental event tracking.

- Active event count, critical alerts, workers affected, cities impacted
- Event timeline with severity indicators (Critical / High / Medium / Low)
- Threshold vs actual comparison per event
- System insight banners for auto-triggered payouts

### 4. Claims & Payout Engine
Full financial flow visibility.

- Claims table with trigger type, payout amount, risk level, status
- Approve / Reject actions for pending claims
- Payout trend chart (hourly)
- Average payout per city bar chart
- Status filter — Pending, Approved, Flagged, Rejected

### 5. Fraud Detection
Rule-based multi-signal fraud intelligence.

- Active alert cards with fraud score, reason, and signal breakdown
- Fraud score displayed as a circular progress indicator
- Normal vs Anomaly scatter plot
- Five fraud signal types with severity weights
- One-click resolve per alert

### 6. Adversarial Defense Panel
Defense system against coordinated GPS spoofing attacks.

- Attack summary — suspected attackers, fraud rings, blocked payouts, amount saved
- Fraud score distribution histogram
- Claim burst detection area chart with threshold reference line
- Detected fraud cluster cards with worker count and coordinates
- Defense strategy matrix (8 strategies)

---

## Defense Strategy

The system uses eight layered strategies to detect and respond to coordinated fraud:

| # | Strategy | Description |
|---|----------|-------------|
| 01 | Multi-Signal Location Validation | GPS + IP + historical movement. `distance(GPS, IP) > threshold` → suspicious |
| 02 | Movement Consistency Check | Speed > 120 km/h = impossible. Zero movement + active claim = fake |
| 03 | Cluster Detection | Many workers at identical coordinates at the same timestamp = fraud ring |
| 04 | Temporal Pattern Analysis | All claims within a 2–5 minute window = coordinated attack |
| 05 | Behavioral Profiling | Static location + repeated claims + same zone = fraud profile |
| 06 | Graph-Based Detection | Workers as nodes, similarity as edges — dense cluster = fraud ring |
| 07 | Progressive Trust System | New worker → low trust. Consistent worker → high trust |
| 08 | Soft vs Hard Blocking | Reduce payout first → mark for review → block only when confirmed |

**Fairness principle:** The system avoids penalizing genuine workers by requiring multiple signal agreement, applying progressive trust scoring, and routing borderline cases to manual review.

---

## Project Structure

```
admin-dashboard/
├── src/
│   ├── pages/
│   │   ├── Dashboard.jsx          # Global overview
│   │   ├── Workers.jsx            # Worker monitoring
│   │   ├── Disruptions.jsx        # Disruption intelligence
│   │   ├── Claims.jsx             # Claims & payout engine
│   │   ├── FraudAlerts.jsx        # Fraud detection
│   │   └── AdversarialDefense.jsx # Adversarial defense panel
│   ├── services/
│   │   ├── api.js                 # Axios client with auth interceptor
│   │   └── mockData.js            # Fallback data for offline mode
│   ├── App.jsx                    # Layout, sidebar, routing
│   └── index.css                  # Dark theme, component styles
├── index.html
├── vite.config.js
├── tailwind.config.js
└── package.json
```

---

## API Endpoints Used

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/admin/login` | Admin login |
| GET | `/api/admin/dashboard` | Platform stats |
| GET | `/api/admin/workers` | All workers |
| GET | `/api/admin/claims` | All claims |
| PATCH | `/api/admin/claims/:id` | Update claim status |
| GET | `/api/admin/fraud-alerts` | Active fraud alerts |
| PATCH | `/api/admin/fraud-alerts/:id/resolve` | Resolve alert |
| GET | `/api/admin/disruptions` | Live disruption events |

All requests include a `Bearer` token from `localStorage` via an Axios interceptor. If the API is unreachable, all pages fall back to mock data silently.

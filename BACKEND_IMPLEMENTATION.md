# QuickClaim Backend - Complete Implementation

## ✅ IMPLEMENTED FEATURES

### 1️⃣ AUTH & WORKER MANAGEMENT
- ✅ Register worker (name, phone, platform, city, vehicle, license)
- ✅ OTP verification (mock: 1234)
- ✅ JWT token management
- ✅ Fetch worker profile
- ✅ Update worker details

**Files:**
- `services/api-server/src/controllers/authController.js`
- `services/api-server/src/models/Worker.js`

---

### 2️⃣ LOCATION TRACKING SYSTEM
- ✅ Receive GPS data (POST /worker/location)
- ✅ Store location history (last 100 entries)
- ✅ Fetch latest location per worker
- ✅ Handle missing/invalid GPS
- ✅ GPS status tracking (active/weak/offline)

**Files:**
- `services/api-server/src/controllers/workerController.js` → updateLocation()
- `services/api-server/src/models/Worker.js` → locationHistory array

---

### 3️⃣ RISK ENGINE (CORE LOGIC)
- ✅ Fetch environmental data (weather, AQI, traffic) from ML service
- ✅ Calculate risk score (0–100)
- ✅ Calculate risk level (LOW/MEDIUM/HIGH)
- ✅ Store risk snapshot in database
- ✅ Maintain risk breakdown (rain, AQI, heat, traffic)

**Files:**
- `services/api-server/src/services/environmentService.js`
- `services/api-server/src/models/RiskSnapshot.js`
- `ml/api/environment_routes.py` → /environment/data endpoint

**API Keys Configured:**
- OpenWeather: `8df98cefdbb8847398d1d45a9a9ec789`
- TomTom Traffic: `fukiFyMLgExkRAgxwCPB9UiMQ2HxsolJ`

---

### 4️⃣ REAL-TIME STATE MANAGEMENT
- ✅ Latest risk state per worker
- ✅ Active alert system
- ✅ Last updated timestamp
- ✅ GPS status (active/weak/offline)

**Files:**
- `services/api-server/src/controllers/workerController.js` → getDashboard()
- `services/api-server/src/models/Alert.js`

---

### 5️⃣ PAYOUT ENGINE (MONEY LOGIC 💰)
- ✅ Trigger payout when risk threshold crossed (score >= 70)
- ✅ Calculate payout amount dynamically
- ✅ Maintain payout status (pending/approved/credited)
- ✅ Prevent duplicate payouts (6-hour window)
- ✅ Idempotency key for each claim

**Files:**
- `services/api-server/src/services/payoutService.js`
- `services/api-server/src/models/Claim.js`

**Logic:**
```javascript
baseAmount = estimatedLoss * (riskScore / 100) * planMultiplier
```

---

### 6️⃣ PAYOUT HISTORY
- ✅ Fetch all payouts per worker
- ✅ Filter by date, event type, status
- ✅ Include amount, risk score, status, timestamp
- ✅ Breakdown by disruption type

**Endpoints:**
- GET `/api/claims` → All claims
- GET `/api/claims/stats` → Statistics
- GET `/api/claims/:id` → Single claim

---

### 7️⃣ INSURANCE / PLAN MANAGEMENT
- ✅ Assign plan to worker (basic/pro/elite)
- ✅ Plan-based rules (payout multiplier, covered conditions)
- ✅ Fetch current plan details

**Files:**
- `services/api-server/src/models/Worker.js` → plan object

---

### 8️⃣ FRAUD DETECTION
- ✅ Detect unrealistic movement (speed > 120 km/h)
- ✅ Detect static/fake GPS patterns
- ✅ Flag suspicious sessions
- ✅ Maintain trust score (0–100)
- ✅ Invalid coordinates check (0,0)
- ✅ Location jump detection (>100km in <1hr)

**Files:**
- `services/api-server/src/services/trustScoreService.js`
- `services/api-server/src/services/fraudService.js`

---

### 9️⃣ WORKER TRUST SCORE SYSTEM
- ✅ Increase score for normal behavior (+1)
- ✅ Decrease for suspicious activity (-5 to -20)
- ✅ Store and expose trust score
- ✅ Status labels (trusted/under_review/risky)

**Thresholds:**
- Trusted: >= 80
- Under Review: 50-79
- Risky: < 50

---

### 🔟 ALERT / NOTIFICATION ENGINE
- ✅ Generate alerts (high_risk, payout_credited, gps_issue, trust_warning)
- ✅ Store active alerts
- ✅ Send to frontend via API
- ✅ Mark alerts as read
- ✅ Auto-expire after 24 hours

**Files:**
- `services/api-server/src/services/alertService.js`
- `services/api-server/src/models/Alert.js`

---

### 1️⃣1️⃣ DASHBOARD AGGREGATION API
- ✅ Single endpoint: GET `/api/worker/dashboard`
- ✅ Returns:
  - Risk score + level + breakdown
  - Earnings (expected/protected/at risk)
  - Active alerts
  - GPS status
  - Weather data
  - Trust score

**File:**
- `services/api-server/src/controllers/workerController.js` → getDashboard()

---

### 1️⃣2️⃣ BACKGROUND JOBS
⚠️ **TO BE IMPLEMENTED:**
- Cron job to run every 30-60 seconds
- Pull latest location
- Fetch environment data
- Compute risk
- Trigger payouts
- Update dashboard state

**Recommended:** Use `node-cron` package

---

### 1️⃣3️⃣ DATA LOGGING & HISTORY
- ✅ Location logs (last 100 per worker)
- ✅ Risk history (RiskSnapshot model)
- ✅ Payout logs (Claim model)
- ✅ Fraud events (FraudFlag model)

**Endpoints:**
- GET `/api/worker/risk-history?days=7`

---

### 1️⃣4️⃣ ERROR & EDGE CASE HANDLING
- ✅ No GPS → pause coverage (gpsStatus = 'offline')
- ✅ API failure (weather/AQI) → fallback logic (default values)
- ✅ Duplicate requests → idempotency key
- ✅ Invalid coordinates → validation + error response

---

### 1️⃣5️⃣ API RATE LIMITING & SECURITY
⚠️ **TO BE IMPLEMENTED:**
- Rate limit location updates
- Validate payloads (express-validator already added)
- Basic auth protection (JWT implemented)
- Prevent spam submissions

**Recommended:** Use `express-rate-limit` package

---

## 📡 API ENDPOINTS

### Auth
- POST `/api/auth/register`
- POST `/api/auth/login`
- POST `/api/auth/admin/login`

### Worker
- GET `/api/worker/profile`
- PUT `/api/worker/profile`
- POST `/api/worker/location`
- GET `/api/worker/dashboard`
- GET `/api/worker/risk-history`
- PATCH `/api/worker/alerts/:alertId/read`

### Claims
- GET `/api/claims`
- GET `/api/claims/stats`
- GET `/api/claims/:id`

### Admin
- GET `/api/admin/dashboard`
- GET `/api/admin/claims`
- PATCH `/api/admin/claims/:id`
- GET `/api/admin/fraud-alerts`
- PATCH `/api/admin/fraud-alerts/:id/resolve`
- GET `/api/admin/workers`

### ML Service
- POST `/environment/data` → Fetch weather, AQI, traffic

---

## 📱 FRONTEND PAGES

### Worker App
1. **Splash** (5s) → Logo + Quote
2. **Onboarding** (3 steps) → Personal, Work, Vehicle info
3. **OTP Verification** → 4-digit input (1234)
4. **Permissions** → Location access request
5. **Dashboard** → Risk, Earnings, Weather, Alerts
6. **Stats** → Earnings analytics, breakdown by type
7. **Profile** → Worker details, Trust score, Logout
8. **Payouts** → Claim history (moved from dashboard)

### Bottom Navigation (3 tabs)
- Home (Dashboard)
- Stats (Analytics)
- Profile (Account)

---

## 🚀 SETUP INSTRUCTIONS

### 1. Install Dependencies

```bash
# API Server
cd services/api-server
npm install

# Worker App
cd apps/worker-app
npm install

# ML Service
cd ml
pip install -r requirements.txt
```

### 2. Start Services

```bash
# Terminal 1: ML Service
cd ml
python api/main.py

# Terminal 2: API Server (requires MongoDB)
cd services/api-server
npm run dev

# Terminal 3: Worker App
cd apps/worker-app
npm run dev
```

### 3. Test in Mock Mode

Worker app is currently in **MOCK MODE** (no backend needed).

To switch to real backend:
- Open `apps/worker-app/src/services/api.js`
- Change `MOCK_MODE = false`

---

## 🔑 CREDENTIALS

**Worker OTP:** 1234
**Admin Login:** admin / admin123

---

## 📊 DATABASE MODELS

1. **Worker** → User profile, location history, trust score
2. **RiskSnapshot** → Risk history per worker
3. **Claim** → Payout records
4. **Alert** → Notifications
5. **FraudFlag** → Fraud events
6. **Policy** → Insurance plans

---

## ⚠️ PENDING TASKS

1. Implement cron job for background processing
2. Add rate limiting middleware
3. Connect MongoDB and test real backend
4. Deploy ML service with API keys
5. Test end-to-end flow with real data

---

## 🎯 PRODUCTION CHECKLIST

- [ ] MongoDB connection string
- [ ] Environment variables secured
- [ ] API keys validated
- [ ] Rate limiting enabled
- [ ] Error logging configured
- [ ] Background jobs running
- [ ] Frontend connected to backend
- [ ] SSL/HTTPS enabled
- [ ] CORS configured properly

#  DevTrails — AI Parametric Income Insurance for Gig Workers

An **AI-powered parametric insurance platform** designed to protect food delivery partners (Swiggy, Zomato, Dunzo, Blinkit) from **income loss caused by environmental and civic disruptions**.

This project was built for **Guidewire DEVTrails Hackathon 2026**.

The platform automatically detects disruptions such as heavy rain, extreme heat, or poor air quality and **triggers instant compensation payouts without requiring manual claims**.

---

# 📌 Problem Statement

India's gig economy relies heavily on delivery workers from platforms such as:

- Swiggy
- Zomato
- Dunzo
- Blinkit
- Amazon
- Zepto

These workers earn **per delivery**, meaning their income depends on how many orders they complete daily.

However, external disruptions often prevent them from working:

-  Heavy rain and flooding
-  Extreme heat waves
-  Severe air pollution
-  Curfews and civic shutdowns

When such events occur, workers may lose **20–30% of their weekly income**.

Currently, there is **no automated income protection system** for gig workers against these disruptions.

---

#  Objective

Build an **AI-enabled parametric insurance system** that:

- Protects gig workers against income loss
- Uses **external data triggers** to detect disruptions
- Calculates **dynamic weekly premiums**
- Automatically triggers **instant payouts**

This ensures a **fast, transparent, and fair financial safety net** for delivery workers.

---

#  Our Solution

DevTrails introduces a **Parametric Income Insurance Platform**.

Instead of filing claims manually, the system continuously monitors disruption signals using external APIs.

When predefined conditions are met, the platform **automatically approves claims and issues payouts**.

### Example

```
Rainfall > 80mm in worker's city
AND
Worker has an active insurance policy
```

→ Claim automatically generated  
→ Payout instantly processed

No paperwork. No waiting.

---

#  Core Features

| Feature | Description |
|---|---|
| **AI Risk Scoring** | Each worker receives a risk score (0-100) based on weather, pollution, location, and seasonal patterns |
| **Dynamic Weekly Premiums** | Insurance pricing adapts based on risk level |
| **Automated Parametric Triggers** | Claims generated automatically when disruption thresholds are exceeded |
| **Fraud Detection System** | AI-based fraud scoring detects suspicious claims |
| **Admin Analytics Dashboard** | Platform-wide insights on disruptions, claims, and payouts |
| **Worker Dashboard** | Shows coverage status, earnings protected, and claim history |

---

#  AI Components

The platform integrates AI/ML models for:

### Risk Prediction

Predicts disruption exposure using:

- Weather patterns
- Pollution levels
- City infrastructure
- Seasonal factors

### Income Estimation

Expected weekly income is estimated using:

```
Expected Income =
avg_orders_per_day
× avg_payout_per_order
× working_days
```

This helps determine **coverage limits and payouts**.

### Fraud Detection

Claims are scored using anomaly detection:

- GPS mismatch
- Duplicate claims
- Unusual claim frequency
- Missing KYC verification

---

# 🗺 System Workflow

```
Worker Registration
        │
        ▼
AI Risk Profiling
        │
        ▼
Weekly Premium Calculation
        │
        ▼
Insurance Policy Activated
        │
        ▼
External Data Monitoring
(Weather / AQI / Traffic APIs)
        │
        ▼
Disruption Event Detected
        │
        ▼
Parametric Trigger Activated
        │
        ▼
Claim Auto-Generated
        │
        ▼
Fraud Detection Check
        │
        ▼
Instant Payout Processed
```

---

#  System Architecture

```
              +---------------------+
              |  Delivery Worker    |
              |      Dashboard      |
              +----------+----------+
                         |
                         ▼
               +-------------------+
               |   Backend Server   |
               | Insurance Engine   |
               +---------+---------+
                         |
        ---------------------------------------
        |                |                    |
        ▼                ▼                    ▼
+---------------+  +--------------+   +----------------+
| Weather APIs  |  | AQI APIs     |   | Traffic APIs   |
+---------------+  +--------------+   +----------------+
         |
         ▼
+---------------------------+
| AI Risk Prediction Engine |
+---------------------------+
         |
         ▼
+---------------------------+
| Parametric Trigger System |
+---------------------------+
         |
         ▼
+---------------------------+
| Payment Gateway (Mock)    |
+---------------------------+
```

---

#  Dashboards

## Worker Dashboard

Workers can view:

- Risk score
- Active insurance coverage
- Weekly premium
- Earnings protected
- Claim history

---

## Admin Dashboard

Insurers can monitor:

- Claims by city
- Disruption types
- Fraud alerts
- Weekly payouts
- Platform analytics

---

# Tech Stack

## Frontend

- React.js
- Vite
- TailwindCSS
- Framer Motion
- Recharts
- TanStack React Query
- React Router
- Radix UI

## Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- bcrypt Password Hashing
- Node-Cron for trigger monitoring

## External APIs

- OpenWeatherMap API
- WAQI Air Quality API
- Mock Traffic Data APIs

## Payment Simulation

- Razorpay Test Mode
- Stripe Sandbox
- Mock UPI transactions

---

#  Cities Covered

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

# 📈 Disruption Trigger Thresholds

| Disruption | Threshold | Unit | Max Payout |
|---|---|---|---|
| Heavy Rain | 80 | mm/hr | ₹500 |
| Extreme Heat | 42 | °C | ₹300 |
| Poor Air Quality | 300 | AQI | ₹250 |
| Flood Alert | High Level | — | ₹500 |
| Curfew / Lockdown | Active | — | ₹500 |

Payouts scale depending on the **severity of the disruption event**.

---

#  Setup Instructions

### 1. Clone Repository

```
git clone https://github.com/your-team/devtrails.git
cd devtrails
```

### 2. Install Dependencies

Backend

```
cd backend
npm install
```

Frontend

```
cd ../frontend
npm install
```

---

### 3. Configure Environment Variables

Create `.env` inside backend:

```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/devtrails
JWT_SECRET=your_secret_here

OPENWEATHER_API_KEY=your_key
AQI_API_KEY=your_key
```

---

### 4. Start Servers

Backend

```
npm run dev
```

Frontend

```
npm run dev
```

Open:

```
http://localhost:5173
```

---

# 👥 User Roles

### Worker

- Register and create profile
- View risk score
- Activate weekly insurance
- Receive automatic payouts during disruptions
- Track claim history

### Admin

- Monitor claims and payouts
- Review fraud alerts
- Analyse disruption data
- Manage workers and policies

---

#  Security

- JWT authentication
- Password hashing with bcrypt
- Rate limiting
- Secure HTTP headers via Helmet
- Schema validation using Mongoose

---

#  Future Enhancements

- Integration with real delivery platforms
- Real-time rider activity tracking
- Predictive disruption forecasting
- Hyper-local risk zone modeling
- Government disaster data integration

---

#  License

MIT License

---

Project built for **Guidewire DEVTrails Hackathon 2026**  
Theme: **AI-Powered Parametric Insurance for Gig Workers**

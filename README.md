# QuickClaim: The Complete Journey  
### A Revolutionary Parametric Insurance Platform

---

> Let me take you on an exciting journey through this incredible project we've built together!  
> This isn't just code - it's a complete digital transformation of how gig workers get insurance protection in India.

---

## The Big Picture: What We've Created

Imagine you're a delivery driver in Mumbai.  
It's monsoon season, the AQI is terrible, traffic is crazy, and you're worried about losing income due to weather disruptions.

QuickClaim is your digital guardian angel - an AI-powered insurance platform that:

- Watches over you with real-time environmental monitoring  
- Protects your income automatically when conditions get dangerous  
- Pays you instantly when you can't work due to weather/pollution  
- Prevents fraud with GPS intelligence  
- Learns from you with personalized AI assistance  



## The Architecture: A Symphony of Modern Tech

### The Multi-App Ecosystem
```

WORKER APP (React + Capacitor)
↕ Real-time data exchange

ADMIN DASHBOARD (React)
↕ Management interface

API SERVER (Node.js + Express)
↕ Business logic hub

ML SERVICE (Python + FastAPI)
↕ Intelligence engine

POSTGRESQL (Supabase)
↕ Data persistence

CHATBOT (Groq AI)
↕ User assistance

---
```
> A system designed not just to process claims,  
> but to eliminate the need for claiming at all.

```
devtrails/
├── apps/
│   ├── worker-app/          # Gig worker mobile/web app
│   └── admin-dashboard/     # Admin panel
├── services/
│   └── api-server/          # Node.js backend
├── ml/                      # ML microservice (FastAPI)
└── docker-compose.yml
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Python 3.9+
- MongoDB

### 1. Setup API Server

```bash
cd services/api-server
npm install
cp .env.example .env
npm run dev
```

### 2. Setup ML Service

```bash
cd ml
pip install -r requirements.txt
python api/main.py
```

### 3. Setup Worker App

```bash
cd apps/worker-app
npm install
npm run dev
```

### 4. Setup Admin Dashboard

```bash
cd apps/admin-dashboard
npm install
npm run dev
```

## 🔑 Default Credentials

**Admin Login:**
- Username: `admin`
- Password: `admin123`

**Worker OTP:**
- Any phone number
- OTP: `1234`

## 🌐 Endpoints

- Worker App: http://localhost:3000
- Admin Dashboard: http://localhost:3001
- API Server: http://localhost:5000
- ML Service: http://localhost:8000

## 📡 API Routes

### Auth
- POST `/api/auth/login` - Worker login
- POST `/api/auth/register` - Worker registration
- POST `/api/auth/admin/login` - Admin login

### Worker
- GET `/api/worker/profile` - Get profile
- POST `/api/worker/location` - Update location
- GET `/api/worker/dashboard` - Get dashboard data

### Claims
- POST `/api/claims` - Create claim (with fraud check)
- GET `/api/claims` - Get my claims
- GET `/api/claims/:id` - Get claim by ID

### Admin
- GET `/api/admin/dashboard` - Dashboard stats
- GET `/api/admin/claims` - All claims
- PATCH `/api/admin/claims/:id` - Update claim status
- GET `/api/admin/fraud-alerts` - Fraud alerts
- PATCH `/api/admin/fraud-alerts/:id/resolve` - Resolve alert
- GET `/api/admin/workers` - All workers

## 🤖 ML Models

### Risk Model
Predicts disruption risk based on:
- Rainfall, Temperature, AQI, Traffic, Month

### Income Model
Estimates expected income based on:
- Orders per day, Payout per order, Working hours, City factor

### Payout Calculation
Calculates payout amount based on:
- Risk score, Expected income, Disruption hours

## 🚨 Fraud Detection

Backend validates:
- GPS vs IP location mismatch (>20km)
- Invalid coordinates (0,0)
- Speed anomaly (>120 km/h)
- Rapid claims (<6 hours)
- Location jumps (>50km in <1 hour)

## 🐳 Docker Deployment

```bash
docker-compose up --build
```

## 📝 Environment Variables

### API Server (.env)
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/quickclaim
JWT_SECRET=your_secret_key
ML_SERVICE_URL=http://localhost:8000
OPENWEATHER_API_KEY=your_api_key (optional)
```

## 🧪 Testing

1. Register a worker
2. Login and view dashboard
3. Create a claim
4. Check admin dashboard for claim
5. Test fraud detection by creating rapid claims

## 📊 Features

✅ Real-time risk prediction
✅ Automated payout calculation
✅ GPS-based fraud detection
✅ Admin claim management
✅ Worker dashboard with earnings
✅ Fraud alert system
✅ Location tracking
✅ Weather integration

## 🔒 Security

- JWT authentication
- GPS spoofing detection
- IP validation
- Rate limiting on claims
- Admin-only routes

## 📈 Future Enhancements

- ML-based fraud model
- Real-time notifications
- Payment gateway integration
- Mobile app (React Native)
- Advanced analytics

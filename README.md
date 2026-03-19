# QuickClaim - Parametric Insurance Platform

Production-grade parametric insurance platform for gig workers with ML-powered risk prediction and fraud detection.

## 🏗️ Architecture

- **Frontend**: React + Vite + Tailwind CSS
- **Backend**: Node.js + Express + MongoDB
- **ML Service**: Python + FastAPI + Scikit-learn
- **Fraud Detection**: GPS spoofing, location anomaly detection

## 📁 Project Structure

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

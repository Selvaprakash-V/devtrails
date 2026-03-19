# QuickClaim - Complete Setup Guide

## ✅ What's Been Done

### Database Setup (PostgreSQL on Supabase)
- ✅ Created 7 production tables (users, claims, payouts, fraud_flags, location_history, risk_history, notifications)
- ✅ Configured connection to Supabase
- ✅ Created all database models with CRUD operations
- ✅ Tested connection successfully

### Backend API (Node.js + Express)
- ✅ User registration with phone number
- ✅ JWT authentication (30-day tokens)
- ✅ Location tracking with GPS history
- ✅ Real-time environmental data (OpenWeather + TomTom APIs)
- ✅ Risk calculation and dashboard
- ✅ Payouts, claims, and fraud flags per user
- ✅ All data stored by mobile number

### Frontend Integration
- ✅ Updated API calls to use real backend
- ✅ Configured for mobile testing (WiFi IP: 172.16.142.132)
- ✅ Removed all mock data
- ✅ User registration on OTP verification

---

## 🚀 How to Run

### Step 1: Start Backend Server

**Option A: Double-click the batch file**
```
devtrails\services\api-server\start-backend.bat
```

**Option B: Command line**
```bash
cd devtrails\services\api-server
npm start
```

You should see:
```
✓ Connected to PostgreSQL database
API Server running on port 5000
```

### Step 2: Test Backend (Optional)
Open browser: `http://localhost:5000/health`
Should return: `{"status":"ok"}`

### Step 3: Run Mobile App

**For Android testing:**
```bash
cd devtrails\apps\worker-app
npm run dev
# Then in Android Studio, sync and run
```

**For web testing:**
```bash
cd devtrails\apps\worker-app
npm run dev
# Open http://localhost:5173
```

---

## 📱 User Flow with Database

### 1. Onboarding (3 steps)
- User enters: name, phone, platform, city, vehicle type, license number
- Data stored in localStorage temporarily
- Navigates to OTP page

### 2. OTP Verification
- Random 6-digit OTP shown in popup
- User enters OTP
- **Backend Call:** `POST /api/auth/register`
  - Creates user in `users` table
  - Stores all onboarding data by phone number
  - Returns JWT token
- Token saved in localStorage
- User data saved in localStorage

### 3. Location Permissions
- User grants location access
- Permission saved in localStorage

### 4. Dashboard
- **Backend Call:** `POST /api/worker/location` (updates GPS)
- **Backend Call:** `GET /api/worker/dashboard`
  - Fetches user from database by token
  - Gets real environmental data
  - Calculates risk score
  - Stores risk history in database
  - Returns personalized dashboard

### 5. Profile Page
- **Backend Call:** `GET /api/worker/profile`
  - Fetches user data from database
  - Shows all onboarding information

### 6. Payouts Page
- **Backend Call:** `GET /api/worker/payouts`
  - Fetches user's payouts from database
  - Filtered by user ID

### 7. Stats Page
- **Backend Call:** `GET /api/worker/stats`
  - Aggregates claims data for user
  - Shows totals by disruption type

### 8. Fraud Flags Page
- **Backend Call:** `GET /api/worker/fraud-flags`
  - Shows fraud flags for user

---

## 🔑 Key Features

### Per-User Data Storage
- Each user identified by phone number
- All data (claims, payouts, location history) linked to user ID
- JWT token contains user ID for authentication

### Real-Time Environmental Data
- OpenWeather API for temperature, rainfall, AQI
- TomTom API for traffic data
- Calculated risk score based on conditions

### Database Tables
1. **users** - User profiles with onboarding data
2. **claims** - Insurance claims per user
3. **payouts** - Payout transactions per user
4. **fraud_flags** - Fraud detection flags per user
5. **location_history** - GPS tracking history per user
6. **risk_history** - Risk score history per user
7. **notifications** - User notifications

---

## 🔧 Troubleshooting

### Backend won't start - Port 5000 in use
```bash
# Find process
netstat -ano | findstr :5000

# Kill process (replace PID)
taskkill /F /PID <PID>

# Or change port in .env
PORT=5001
```

### Database connection error
```bash
# Test connection
cd devtrails\services\api-server
node test-db.js

# Should show:
# ✓ Connected to PostgreSQL database
# ✓ Tables found: 7
```

### Mobile app can't connect to backend
- Ensure backend is running on `http://172.16.142.132:5000`
- Check WiFi - both PC and phone on same network
- Check Windows Firewall allows port 5000

### User registration fails
- Check backend console for errors
- Verify DATABASE_URL in .env is correct
- Test database connection with `node test-db.js`

### Token expired error
- Tokens expire after 30 days
- Clear localStorage and re-register
- Or update JWT_SECRET in .env

---

## 📊 API Endpoints

### Authentication
```
POST /api/auth/register
Body: { phone, name, city, platform, vehicleType, licenseNumber, avgOrdersPerDay, payoutPerOrder, workingHours }
Returns: { token, user }

POST /api/auth/login
Body: { phone, otp }
Returns: { token, user }
```

### Worker (Requires Authorization: Bearer <token>)
```
GET /api/worker/profile
Returns: User profile data

PUT /api/worker/profile
Body: { name, city, avgOrdersPerDay, payoutPerOrder, workingHours }
Returns: Updated user

POST /api/worker/location
Body: { lat, lng, accuracy }
Returns: { success, gpsStatus, trustScore }

GET /api/worker/dashboard
Returns: { worker, risk, earnings, weather, gpsStatus, alerts }

GET /api/worker/payouts
Returns: Array of payouts for user

GET /api/worker/stats
Returns: { overall, byType } claim statistics

GET /api/worker/fraud-flags
Returns: Array of fraud flags for user
```

---

## 🎯 Testing Checklist

- [ ] Backend starts without errors
- [ ] Database connection successful
- [ ] Health endpoint returns OK
- [ ] User can complete onboarding
- [ ] OTP verification creates user in database
- [ ] Dashboard loads with real data
- [ ] Profile shows correct user data
- [ ] Location updates are stored
- [ ] Multiple users can register with different phone numbers
- [ ] Each user sees only their own data

---

## 📝 Environment Variables

File: `devtrails\services\api-server\.env`

```env
DATABASE_URL=postgresql://postgres.sudwshadggemwxhroyms:Yugendra842007@aws-0-ap-northeast-1.pooler.supabase.com:6543/postgres
PORT=5000
JWT_SECRET=quickclaim_secret_key
```

---

## 🎉 You're All Set!

**To test the complete flow:**

1. Start backend: `cd devtrails\services\api-server && npm start`
2. Start frontend: `cd devtrails\apps\worker-app && npm run dev`
3. Open app on mobile or browser
4. Complete onboarding with a phone number
5. Verify OTP
6. Grant location permissions
7. View dashboard with real data from database
8. Check profile to see stored onboarding data

**Each user's data is now stored in PostgreSQL and retrieved by their phone number!**

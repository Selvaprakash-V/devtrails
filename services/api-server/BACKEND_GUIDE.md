# QuickClaim Backend - Quick Start

## Running the Backend

### Option 1: Using Batch Script (Recommended)
```bash
cd devtrails\services\api-server
start-backend.bat
```

### Option 2: Using npm
```bash
cd devtrails\services\api-server
npm start
```

### Option 3: Development Mode (Auto-reload)
```bash
cd devtrails\services\api-server
npm run dev
```

## When to Run Backend

**YES - Run backend when:**
- Testing user registration/onboarding
- Testing real database operations
- Testing payouts, claims, fraud flags
- Testing profile updates
- Production-like testing

**NO - Don't need backend when:**
- Just testing UI/UX
- Testing location tracking (uses external APIs directly)
- Quick frontend changes

## Backend Features

✅ **User Registration** - Stores user data by phone number in PostgreSQL
✅ **Authentication** - JWT tokens with 30-day expiry
✅ **Location Tracking** - Stores GPS history in database
✅ **Risk Calculation** - Real-time environmental data (OpenWeather, TomTom)
✅ **Dashboard Data** - User-specific dashboard with real data
✅ **Payouts** - Track and manage payouts per user
✅ **Claims** - Store and retrieve claims by user
✅ **Fraud Detection** - Track fraud flags per user
✅ **Stats** - User-specific statistics

## API Endpoints

### Auth
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login with phone + OTP

### Worker (Requires Auth Token)
- `GET /api/worker/profile` - Get user profile
- `PUT /api/worker/profile` - Update profile
- `POST /api/worker/location` - Update location
- `GET /api/worker/dashboard` - Get dashboard data
- `GET /api/worker/payouts` - Get user payouts
- `GET /api/worker/stats` - Get claim statistics
- `GET /api/worker/fraud-flags` - Get fraud flags

## Database

**Type:** PostgreSQL (Supabase)
**Tables:** 7 tables (users, claims, payouts, fraud_flags, location_history, risk_history, notifications)
**Connection:** Automatic via DATABASE_URL in .env

## Mobile Testing

Backend runs on: `http://172.16.142.132:5000`
Frontend configured to connect to this IP for mobile testing.

## Troubleshooting

**Port 5000 already in use:**
```bash
# Change PORT in .env file
PORT=5001
```

**Database connection error:**
- Check DATABASE_URL in .env
- Verify Supabase project is active
- Test connection: `node test-db.js`

**JWT errors:**
- JWT_SECRET is set to default: `quickclaim_secret_key`
- Change in .env for production

## Environment Variables

Required in `.env`:
```
DATABASE_URL=postgresql://postgres.sudwshadggemwxhroyms:Yugendra842007@aws-0-ap-northeast-1.pooler.supabase.com:6543/postgres
PORT=5000
JWT_SECRET=quickclaim_secret_key
```

# QuickClaim - Quick Start Guide

## Prerequisites Check

1. **Node.js** (v18+): `node --version`
2. **Python** (v3.9+): `python --version`
3. **MongoDB**: Running on port 27017

## Installation (One-time)

```bash
# Install API Server dependencies
cd services/api-server
npm install

# Install Worker App dependencies
cd ../../apps/worker-app
npm install

# Install ML Service dependencies
cd ../../ml
pip install -r requirements.txt
```

## Running the Application

### Option 1: Automated (Windows)
```bash
start-all.bat
```

### Option 2: Manual (3 terminals)

**Terminal 1 - ML Service:**
```bash
cd ml
python api/main.py
```

**Terminal 2 - API Server:**
```bash
cd services/api-server
npm run dev
```

**Terminal 3 - Worker App:**
```bash
cd apps/worker-app
npm run dev
```

## Access Points

- **Worker App**: http://localhost:3000
- **API Server**: http://localhost:5000
- **ML Service**: http://localhost:8000

## Testing the App

1. Open http://localhost:3000
2. Wait 5 seconds for splash screen
3. Fill onboarding form (3 steps)
4. Enter OTP: **1234**
5. Allow location permission
6. View dashboard

## Troubleshooting

### Network Error / Connection Refused
- Make sure all 3 services are running
- Check MongoDB is running: `mongod --version`
- Verify ports are not blocked by firewall

### MongoDB Not Running
```bash
# Windows
net start MongoDB

# Or install MongoDB Community Edition
```

### Port Already in Use
- Kill process on port: `netstat -ano | findstr :5000`
- Change port in .env file

## Default Credentials

**Worker OTP**: 1234
**Admin Login**: admin / admin123

## Notes

- Backend must be running for OTP verification to work
- Location permission required for dashboard access
- All services must be running simultaneously

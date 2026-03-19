# QuickClaim Worker App

Production-grade mobile-first PWA for gig workers.

## Features

✅ Step-by-step onboarding with realistic worker data collection
✅ OTP verification (mock: 1234)
✅ Location permission handling with explanations
✅ Real-time risk monitoring dashboard
✅ GPS tracking with automatic location updates
✅ Payout history with status tracking
✅ PWA support (Add to Home Screen)
✅ Capacitor-ready for Android APK

## Tech Stack

- React 18
- Vite
- Tailwind CSS
- React Router DOM
- Axios
- Vite PWA Plugin

## Setup

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## PWA Features

- Standalone mode
- App icon
- Offline-ready (service worker)
- Mobile-optimized

## Flow

1. **Onboarding** (3 steps)
   - Personal info (name, phone)
   - Work details (platform, city)
   - Vehicle info (type, license)

2. **OTP Verification**
   - 4-digit OTP input
   - Mock OTP: 1234

3. **Permissions**
   - Location access request
   - Explanation of why needed

4. **Dashboard**
   - Risk level display
   - Expected earnings
   - Weather conditions
   - Active alerts
   - Auto-refresh every 60s

5. **Payouts**
   - History of all claims
   - Status tracking
   - Amount details

## API Integration

All API calls are in `src/services/api.js`:

- `workerAPI.register()` - Register worker
- `workerAPI.verifyOTP()` - Verify OTP
- `workerAPI.updateLocation()` - Send GPS location
- `workerAPI.getDashboard()` - Get dashboard data
- `workerAPI.getPayouts()` - Get payout history

## Location Tracking

GPS tracking implemented in `src/services/location.js`:

- Requests high-accuracy location
- Watches location changes
- Sends updates every 30-60 seconds
- Handles permission errors

## Mobile Optimization

- Touch-friendly buttons (min 44px)
- No hover states
- Smooth transitions
- Gradient backgrounds
- Glassmorphism effects
- Bottom navigation
- Safe area handling

## Capacitor Integration (Future)

Ready for Capacitor wrapping:

```bash
npm install @capacitor/core @capacitor/cli
npx cap init
npx cap add android
npx cap sync
npx cap open android
```

## Environment Variables

Create `.env` file:

```
VITE_API_URL=http://localhost:5000/api
```

## Production Deployment

1. Build: `npm run build`
2. Deploy `dist/` folder
3. Ensure HTTPS for PWA features
4. Configure API URL

## Notes

- OTP is mocked as `1234` for demo
- Location permission required for app access
- Auto-refresh dashboard every 60 seconds
- GPS updates sent automatically
- Works offline with service worker

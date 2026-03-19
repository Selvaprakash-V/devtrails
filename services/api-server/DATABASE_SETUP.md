# QuickClaim Database Setup Guide - PostgreSQL on Supabase

## Prerequisites
- Supabase account (free tier available)
- Node.js installed
- Backend API server ready

## Step 1: Create Supabase Project

1. Go to https://supabase.com
2. Sign up / Log in
3. Click "New Project"
4. Fill in:
   - **Project Name**: quickclaim-production
   - **Database Password**: (Generate strong password - SAVE THIS!)
   - **Region**: Choose closest to your users (e.g., Mumbai for India)
   - **Pricing Plan**: Free (500MB database, 2GB bandwidth)
5. Click "Create new project" (takes 2-3 minutes)

## Step 2: Run Database Schema

1. In Supabase Dashboard, go to **SQL Editor** (left sidebar)
2. Click "New Query"
3. Copy entire content from `services/api-server/database/schema.sql`
4. Paste into SQL Editor
5. Click "Run" button
6. Verify: Go to **Table Editor** → You should see all tables created

## Step 3: Get Database Connection String

1. In Supabase Dashboard, go to **Project Settings** (gear icon)
2. Click **Database** in left menu
3. Scroll to **Connection String** section
4. Copy the **Connection pooling** URI (recommended for serverless)
5. Format: `postgresql://postgres.[project-ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres`

## Step 4: Configure Backend Environment

1. Open `services/api-server/.env`
2. Add/Update these variables:

```env
# Database
DATABASE_URL=postgresql://postgres.[your-project-ref]:[your-password]@aws-0-[region].pooler.supabase.com:6543/postgres

# Existing variables
PORT=5000
REDIS_HOST=localhost
REDIS_PORT=6379
OPENWEATHER_API_KEY=your_key
TOMTOM_API_KEY=your_key
```

## Step 5: Install Database Dependencies

```bash
cd services/api-server
npm install pg
```

## Step 6: Update package.json

Add to `services/api-server/package.json` dependencies:

```json
{
  "dependencies": {
    "pg": "^8.11.3"
  }
}
```

## Step 7: Test Database Connection

Create test file `services/api-server/test-db.js`:

```javascript
const db = require('./database/db');

async function testConnection() {
  try {
    const result = await db.query('SELECT NOW()');
    console.log('✓ Database connected successfully!');
    console.log('Current time:', result.rows[0].now);
    process.exit(0);
  } catch (error) {
    console.error('✗ Database connection failed:', error.message);
    process.exit(1);
  }
}

testConnection();
```

Run test:
```bash
node test-db.js
```

## Step 8: Update Backend Routes to Use Database

The models are already created in `src/models/`:
- `User.js` - User operations
- `Claim.js` - Claims management
- `Payout.js` - Payout tracking
- `FraudFlag.js` - Fraud detection
- `History.js` - Location & Risk history

Example usage in routes:

```javascript
const User = require('../models/User');
const Claim = require('../models/Claim');

// In workerRoutes.js
router.post('/register', async (req, res) => {
  try {
    const { phone, name, city, platform } = req.body;
    
    // Check if user exists
    let user = await User.findByPhone(phone);
    
    if (!user) {
      // Create new user
      user = await User.create({
        phone,
        name,
        city,
        platform,
        vehicleType: req.body.vehicleType,
        licenseNumber: req.body.licenseNumber
      });
    } else {
      // Update last login
      await User.updateLastLogin(user.id);
    }
    
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

## Step 9: Database Security (Supabase RLS)

Supabase has Row Level Security (RLS) enabled by default. For backend API access:

1. Go to **Project Settings** → **API**
2. Copy **service_role** key (has full access, bypasses RLS)
3. Add to `.env`:

```env
SUPABASE_SERVICE_KEY=your_service_role_key_here
```

4. Use this key for backend operations (not in frontend!)

## Step 10: Monitoring & Maintenance

### View Database Activity
- Supabase Dashboard → **Database** → **Logs**

### Backup Database
- Supabase Dashboard → **Database** → **Backups**
- Free tier: Daily backups, 7-day retention

### Monitor Usage
- Supabase Dashboard → **Settings** → **Usage**
- Track: Database size, API requests, bandwidth

## Database Schema Overview

### Tables Created:
1. **users** - Worker profiles and authentication
2. **claims** - Insurance claims with weather data
3. **payouts** - Payment processing and tracking
4. **fraud_flags** - Fraud detection alerts
5. **location_history** - GPS tracking for fraud prevention
6. **risk_history** - Historical risk scores
7. **notifications** - User notifications

### Key Features:
- ✅ UUID primary keys
- ✅ Foreign key constraints
- ✅ Automatic timestamps (created_at, updated_at)
- ✅ Indexes for performance
- ✅ Check constraints for data validation
- ✅ Cascading deletes
- ✅ JSONB for flexible data storage

## Production Checklist

- [ ] Database created on Supabase
- [ ] Schema executed successfully
- [ ] Connection string added to .env
- [ ] pg package installed
- [ ] Database connection tested
- [ ] Models integrated in routes
- [ ] Service role key configured
- [ ] Backups enabled
- [ ] Monitoring set up

## Scaling to Production

### When to Upgrade from Free Tier:
- Database > 500MB
- Bandwidth > 2GB/month
- Need more than 50,000 monthly active users

### Supabase Pro Plan ($25/month):
- 8GB database
- 50GB bandwidth
- Daily backups with point-in-time recovery
- Priority support

### Performance Optimization:
1. Add indexes for frequently queried columns
2. Use connection pooling (already configured)
3. Enable Redis caching (already implemented)
4. Monitor slow queries in Supabase logs

## Troubleshooting

### Connection Timeout
- Check if IP is whitelisted (Supabase allows all by default)
- Verify connection string format
- Check firewall settings

### Permission Denied
- Use service_role key for backend operations
- Check RLS policies if using anon key

### Slow Queries
- Check indexes are created
- Use EXPLAIN ANALYZE in SQL Editor
- Consider adding composite indexes

## Support Resources

- Supabase Docs: https://supabase.com/docs
- PostgreSQL Docs: https://www.postgresql.org/docs/
- Community: https://github.com/supabase/supabase/discussions

---

**Your database is now production-ready!** 🚀

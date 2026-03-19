import dotenv from 'dotenv';
import pkg from 'pg';
const { Pool } = pkg;

dotenv.config();

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function seed() {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // 1. Get user
    const userRes = await client.query(
      'SELECT * FROM users WHERE phone = $1',
      ['+919025442157']
    );
    if (userRes.rows.length === 0) {
      throw new Error('User with phone +919025442157 not found. Run seed-worker.js first.');
    }
    const user = userRes.rows[0];
    const userId = user.id;
    console.log('Found user:', userId);

    // 2. Claims (3 approved, 1 pending, 1 rejected)
    const claimsData = [
      {
        locationLat: 12.9716, locationLng: 77.5946,
        locationAddress: 'Koramangala, Bangalore',
        weatherCondition: 'Rain', temperature: 22.5, rainfall: 18.2,
        aqi: 145, trafficDelay: 65,
        riskScore: 0.78, riskLevel: 'high',
        amount: 375.00, status: 'approved',
        disruptionType: 'rain'
      },
      {
        locationLat: 12.9352, locationLng: 77.6245,
        locationAddress: 'HSR Layout, Bangalore',
        weatherCondition: 'Haze', temperature: 41.3, rainfall: 0,
        aqi: 210, trafficDelay: 55,
        riskScore: 0.65, riskLevel: 'high',
        amount: 325.00, status: 'approved',
        disruptionType: 'heat'
      },
      {
        locationLat: 12.9279, locationLng: 77.6271,
        locationAddress: 'BTM Layout, Bangalore',
        weatherCondition: 'Smoke', temperature: 32.0, rainfall: 0,
        aqi: 285, trafficDelay: 45,
        riskScore: 0.55, riskLevel: 'medium',
        amount: 275.00, status: 'approved',
        disruptionType: 'aqi'
      },
      {
        locationLat: 12.9716, locationLng: 77.5946,
        locationAddress: 'Indiranagar, Bangalore',
        weatherCondition: 'Rain', temperature: 24.0, rainfall: 12.5,
        aqi: 120, trafficDelay: 70,
        riskScore: 0.60, riskLevel: 'medium',
        amount: 300.00, status: 'pending',
        disruptionType: 'rain'
      },
      {
        locationLat: 12.9800, locationLng: 77.5900,
        locationAddress: 'Whitefield, Bangalore',
        weatherCondition: 'Clear', temperature: 28.0, rainfall: 0,
        aqi: 80, trafficDelay: 30,
        riskScore: 0.20, riskLevel: 'low',
        amount: 100.00, status: 'rejected',
        disruptionType: 'rain'
      }
    ];

    const claimIds = [];
    let dayOffset = 1;
    for (const c of claimsData) {
      const approvedAt = c.status === 'approved' ? new Date(Date.now() - 2 * 86400000) : null;
      const r = await client.query(
        `INSERT INTO claims (
          user_id, location_lat, location_lng, location_address,
          weather_condition, temperature, rainfall, aqi, traffic_delay,
          risk_score, risk_level, amount, status, approved_at, created_at
        ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14, NOW() - ($15 * INTERVAL '1 day'))
        RETURNING id`,
        [
          userId, c.locationLat, c.locationLng, c.locationAddress,
          c.weatherCondition, c.temperature, c.rainfall, c.aqi, c.trafficDelay,
          c.riskScore, c.riskLevel, c.amount, c.status, approvedAt, dayOffset++
        ]
      );
      claimIds.push({ id: r.rows[0].id, ...c });
    }
    console.log('Claims inserted:', claimIds.length);

    // 3. Payouts (for approved claims)
    const approvedClaims = claimIds.filter(c => c.status === 'approved');
    for (const c of approvedClaims) {
      await client.query(
        `INSERT INTO payouts (
          user_id, claim_id, amount, status, payment_method,
          upi_id, transaction_id, processed_at, completed_at, created_at
        ) VALUES ($1,$2,$3,'completed','upi','yugendra@upi',$4, NOW() - INTERVAL '1 day', NOW() - INTERVAL '1 day', NOW() - INTERVAL '2 days')`,
        [userId, c.id, c.amount, `TXN${Date.now()}${Math.floor(Math.random()*1000)}`]
      );
    }
    console.log('Payouts inserted:', approvedClaims.length);

    // 4. Fraud Flags — 2 GPS spoofing events
    const fraudData = [
      {
        flagType: 'gps_spoofing',
        severity: 'high',
        description: 'GPS location (Bangalore) differs from IP location (Mumbai) by 984km',
        evidence: {
          timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
          distance: 984.32,
          gpsLocation: { lat: 12.9716, lng: 77.5946 },
          ipLocation: { lat: 19.0760, lng: 72.8777, city: 'Mumbai' }
        },
        status: 'active'
      },
      {
        flagType: 'gps_spoofing',
        severity: 'medium',
        description: 'GPS location (Bangalore) differs from IP location (Chennai) by 346km',
        evidence: {
          timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          distance: 346.18,
          gpsLocation: { lat: 12.9352, lng: 77.6245 },
          ipLocation: { lat: 13.0827, lng: 80.2707, city: 'Chennai' }
        },
        status: 'resolved'
      }
    ];

    for (const f of fraudData) {
      await client.query(
        `INSERT INTO fraud_flags (user_id, flag_type, severity, description, evidence, status, created_at)
         VALUES ($1,$2,$3,$4,$5,$6, NOW() - INTERVAL '3 days')`,
        [userId, f.flagType, f.severity, f.description, JSON.stringify(f.evidence), f.status]
      );
    }
    console.log('Fraud flags inserted:', fraudData.length);

    // 5. Location History (10 entries around Bangalore)
    const locations = [
      { lat: 12.9716, lng: 77.5946, isSpoofed: false },
      { lat: 12.9352, lng: 77.6245, isSpoofed: false },
      { lat: 12.9279, lng: 77.6271, isSpoofed: false },
      { lat: 12.9800, lng: 77.5900, isSpoofed: false },
      { lat: 12.9600, lng: 77.6100, isSpoofed: false },
      { lat: 12.9716, lng: 77.5946, isSpoofed: true  }, // spoofed
      { lat: 12.9400, lng: 77.6000, isSpoofed: false },
      { lat: 12.9550, lng: 77.5800, isSpoofed: false },
      { lat: 12.9352, lng: 77.6245, isSpoofed: true  }, // spoofed
      { lat: 12.9716, lng: 77.5946, isSpoofed: false },
    ];

    for (let i = 0; i < locations.length; i++) {
      const l = locations[i];
      await client.query(
        `INSERT INTO location_history (user_id, latitude, longitude, accuracy, speed, is_spoofed, recorded_at)
         VALUES ($1,$2,$3,$4,$5,$6, NOW() - INTERVAL '${i * 30} minutes')`,
        [userId, l.lat, l.lng, 15.0, 25.5, l.isSpoofed]
      );
    }
    console.log('Location history inserted:', locations.length);

    // 6. Risk History (7 days)
    const riskEntries = [
      { score: 0.78, level: 'high',   weather: 'Rain',  temp: 22.5, rain: 18.2, aqi: 145, traffic: 65 },
      { score: 0.65, level: 'high',   weather: 'Haze',  temp: 41.3, rain: 0,    aqi: 210, traffic: 55 },
      { score: 0.45, level: 'medium', weather: 'Clouds',temp: 30.0, rain: 2.1,  aqi: 130, traffic: 50 },
      { score: 0.20, level: 'low',    weather: 'Clear', temp: 28.0, rain: 0,    aqi: 80,  traffic: 30 },
      { score: 0.55, level: 'medium', weather: 'Smoke', temp: 32.0, rain: 0,    aqi: 285, traffic: 45 },
      { score: 0.30, level: 'low',    weather: 'Clear', temp: 27.5, rain: 0,    aqi: 95,  traffic: 35 },
      { score: 0.60, level: 'medium', weather: 'Rain',  temp: 24.0, rain: 12.5, aqi: 120, traffic: 70 },
    ];

    for (let i = 0; i < riskEntries.length; i++) {
      const r = riskEntries[i];
      await client.query(
        `INSERT INTO risk_history (user_id, risk_score, risk_level, weather_condition, temperature, rainfall, aqi, traffic_delay, location_lat, location_lng, recorded_at)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10, NOW() - INTERVAL '${i} days')`,
        [userId, r.score, r.level, r.weather, r.temp, r.rain, r.aqi, r.traffic, 12.9716, 77.5946]
      );
    }
    console.log('Risk history inserted:', riskEntries.length);

    await client.query('COMMIT');
    console.log('\n✅ All dashboard data seeded for +919025442157');
    console.log('   Expected Daily Earnings: ₹750 (15 orders × ₹50)');
    console.log('   Total Payout (approved): ₹975');
    console.log('   Claims: 5 total (3 approved, 1 pending, 1 rejected)');
    console.log('   Fraud Flags: 2 (1 active GPS spoof, 1 resolved)');
    console.log('   GPS Spoof distances: 984km (Mumbai), 346km (Chennai)');

  } catch (err) {
    await client.query('ROLLBACK');
    console.error('❌ Seed failed:', err.message);
  } finally {
    client.release();
    await pool.end();
  }
}

seed();

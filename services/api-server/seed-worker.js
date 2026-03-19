import dotenv from 'dotenv';
import pkg from 'pg';
const { Pool } = pkg;

dotenv.config();

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

const workerData = {
  phone: '+919025442157',
  name: 'Yugendra',           // mock
  city: 'Bangalore',          // mock
  platform: 'swiggy',         // mock
  vehicle_type: 'bike',       // mock
  license_number: 'KA01-20240001', // mock
  firebase_uid: null,
  is_active: true
};

async function seed() {
  try {
    const existing = await pool.query('SELECT id FROM users WHERE phone = $1', [workerData.phone]);
    if (existing.rows.length > 0) {
      console.log('Worker already exists:', existing.rows[0].id);
      return;
    }

    const result = await pool.query(
      `INSERT INTO users (phone, name, city, platform, vehicle_type, license_number, firebase_uid, is_active)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING id, phone, name`,
      [workerData.phone, workerData.name, workerData.city, workerData.platform,
       workerData.vehicle_type, workerData.license_number, workerData.firebase_uid, workerData.is_active]
    );

    console.log('Worker inserted:', result.rows[0]);
  } catch (err) {
    console.error('Seed error:', err.message);
  } finally {
    await pool.end();
  }
}

seed();

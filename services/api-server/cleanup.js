import dotenv from 'dotenv';
import pkg from 'pg';
dotenv.config();
const { Pool } = pkg;
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function cleanup() {
  const phones = ['+9190325442157', '+919025442157', '9025442157', '90325442157'];
  const u = await pool.query(`SELECT id, phone FROM users WHERE phone = ANY($1)`, [phones]);

  if (!u.rows.length) {
    console.log('No matching user found in DB — already clean.');
    await pool.end();
    return;
  }

  const id = u.rows[0].id;
  console.log(`Found user: ${u.rows[0].phone} (${id})`);

  await pool.query('DELETE FROM fraud_flags WHERE user_id=$1', [id]);
  await pool.query('DELETE FROM location_history WHERE user_id=$1', [id]);
  await pool.query('DELETE FROM risk_history WHERE user_id=$1', [id]);
  await pool.query('DELETE FROM payouts WHERE user_id=$1', [id]);
  await pool.query('DELETE FROM claims WHERE user_id=$1', [id]);
  await pool.query('DELETE FROM notifications WHERE user_id=$1', [id]);
  await pool.query('DELETE FROM users WHERE id=$1', [id]);

  console.log('✅ All data deleted. DB is fresh for this number.');
  await pool.end();
}

cleanup().catch(async e => { console.error('❌', e.message); await pool.end(); });

import dotenv from 'dotenv';
import pkg from 'pg';
const { Pool } = pkg;

dotenv.config();

const connectionString = process.env.DATABASE_URL;

console.log('Connection string:', connectionString);
console.log('\nParsing connection...');

const pool = new Pool({
  connectionString: connectionString,
  ssl: {
    rejectUnauthorized: false
  }
});

async function test() {
  try {
    const client = await pool.connect();
    console.log('✓ Connected!');
    
    const result = await client.query('SELECT NOW()');
    console.log('✓ Query successful:', result.rows[0]);
    
    client.release();
    await pool.end();
    process.exit(0);
  } catch (error) {
    console.error('✗ Error:', error.message);
    console.error('Full error:', error);
    process.exit(1);
  }
}

test();

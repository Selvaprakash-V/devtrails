import dotenv from 'dotenv';
dotenv.config();

import db from './database/db.js';

async function testConnection() {
  try {
    console.log('Testing database connection...\n');
    
    const result = await db.query('SELECT NOW() as current_time, version() as pg_version');
    
    console.log('✓ Database connected successfully!');
    console.log('✓ Current time:', result.rows[0].current_time);
    console.log('✓ PostgreSQL version:', result.rows[0].pg_version.split(' ')[1]);
    
    const tablesResult = await db.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name
    `);
    
    console.log('\n✓ Tables found:', tablesResult.rows.length);
    tablesResult.rows.forEach(row => {
      console.log('  -', row.table_name);
    });
    
    console.log('\n✅ Database setup is complete and working!\n');
    await db.pool.end();
    process.exit(0);
  } catch (error) {
    console.error('\n✗ Database connection failed!');
    console.error('Error:', error.message);
    process.exit(1);
  }
}

testConnection();

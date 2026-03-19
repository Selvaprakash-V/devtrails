import db from '../../database/db.js';

class User {
  // Create new user
  static async create({ phone, name, city, platform, vehicleType, licenseNumber, firebaseUid, baselineIpLocation }) {
    const query = `
      INSERT INTO users (phone, name, city, platform, vehicle_type, license_number, firebase_uid, baseline_ip_location)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *
    `;
    const values = [phone, name, city, platform, vehicleType, licenseNumber, firebaseUid, baselineIpLocation ? JSON.stringify(baselineIpLocation) : null];
    const result = await db.query(query, values);
    return result.rows[0];
  }

  // Find user by phone
  static async findByPhone(phone) {
    const query = 'SELECT * FROM users WHERE phone = $1';
    const result = await db.query(query, [phone]);
    return result.rows[0];
  }

  // Find user by ID
  static async findById(id) {
    const query = 'SELECT * FROM users WHERE id = $1';
    const result = await db.query(query, [id]);
    return result.rows[0];
  }

  // Find user by Firebase UID
  static async findByFirebaseUid(firebaseUid) {
    const query = 'SELECT * FROM users WHERE firebase_uid = $1';
    const result = await db.query(query, [firebaseUid]);
    return result.rows[0];
  }

  // Update user
  static async update(id, data) {
    const fields = [];
    const values = [];
    let paramCount = 1;

    Object.keys(data).forEach(key => {
      if (data[key] !== undefined) {
        fields.push(`${key} = $${paramCount}`);
        values.push(data[key]);
        paramCount++;
      }
    });

    if (fields.length === 0) return null;

    values.push(id);
    const query = `
      UPDATE users 
      SET ${fields.join(', ')}
      WHERE id = $${paramCount}
      RETURNING *
    `;
    
    const result = await db.query(query, values);
    return result.rows[0];
  }

  // Update last login
  static async updateLastLogin(id) {
    const query = 'UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = $1 RETURNING *';
    const result = await db.query(query, [id]);
    return result.rows[0];
  }

  // Get user stats
  static async getStats(userId) {
    const query = `
      SELECT 
        COUNT(DISTINCT c.id) as total_claims,
        COUNT(DISTINCT CASE WHEN c.status = 'approved' THEN c.id END) as approved_claims,
        COUNT(DISTINCT CASE WHEN c.status = 'rejected' THEN c.id END) as rejected_claims,
        COALESCE(SUM(CASE WHEN c.status = 'approved' THEN c.amount ELSE 0 END), 0) as total_claimed_amount,
        COALESCE(SUM(CASE WHEN p.status = 'completed' THEN p.amount ELSE 0 END), 0) as total_paid_amount,
        COUNT(DISTINCT f.id) as fraud_flags_count
      FROM users u
      LEFT JOIN claims c ON u.id = c.user_id
      LEFT JOIN payouts p ON u.id = p.user_id
      LEFT JOIN fraud_flags f ON u.id = f.user_id AND f.status = 'active'
      WHERE u.id = $1
      GROUP BY u.id
    `;
    const result = await db.query(query, [userId]);
    return result.rows[0] || {
      total_claims: 0,
      approved_claims: 0,
      rejected_claims: 0,
      total_claimed_amount: 0,
      total_paid_amount: 0,
      fraud_flags_count: 0
    };
  }
}

export default User;

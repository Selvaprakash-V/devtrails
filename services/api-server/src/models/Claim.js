import db from '../../database/db.js';

class Claim {
  // Create new claim
  static async create(data) {
    const query = `
      INSERT INTO claims (
        user_id, location_lat, location_lng, location_address,
        weather_condition, temperature, rainfall, aqi, traffic_delay,
        risk_score, risk_level, amount, status
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
      RETURNING *
    `;
    const values = [
      data.userId, data.locationLat, data.locationLng, data.locationAddress,
      data.weatherCondition, data.temperature, data.rainfall, data.aqi, data.trafficDelay,
      data.riskScore, data.riskLevel, data.amount, data.status || 'pending'
    ];
    const result = await db.query(query, values);
    return result.rows[0];
  }

  // Get claims by user ID
  static async findByUserId(userId, limit = 50, offset = 0) {
    const query = `
      SELECT * FROM claims 
      WHERE user_id = $1 
      ORDER BY created_at DESC 
      LIMIT $2 OFFSET $3
    `;
    const result = await db.query(query, [userId, limit, offset]);
    return result.rows;
  }

  // Get claim by ID
  static async findById(id) {
    const query = 'SELECT * FROM claims WHERE id = $1';
    const result = await db.query(query, [id]);
    return result.rows[0];
  }

  // Update claim status
  static async updateStatus(id, status, rejectionReason = null) {
    const query = `
      UPDATE claims 
      SET status = $1, 
          rejection_reason = $2,
          approved_at = CASE WHEN $1 = 'approved' THEN CURRENT_TIMESTAMP ELSE approved_at END,
          paid_at = CASE WHEN $1 = 'paid' THEN CURRENT_TIMESTAMP ELSE paid_at END
      WHERE id = $3
      RETURNING *
    `;
    const result = await db.query(query, [status, rejectionReason, id]);
    return result.rows[0];
  }

  // Get claims by status
  static async findByStatus(userId, status) {
    const query = 'SELECT * FROM claims WHERE user_id = $1 AND status = $2 ORDER BY created_at DESC';
    const result = await db.query(query, [userId, status]);
    return result.rows;
  }

  // Get total claims amount by user
  static async getTotalAmount(userId) {
    const query = `
      SELECT 
        COALESCE(SUM(CASE WHEN status = 'approved' THEN amount ELSE 0 END), 0) as approved_amount,
        COALESCE(SUM(CASE WHEN status = 'paid' THEN amount ELSE 0 END), 0) as paid_amount,
        COALESCE(SUM(CASE WHEN status = 'pending' THEN amount ELSE 0 END), 0) as pending_amount
      FROM claims 
      WHERE user_id = $1
    `;
    const result = await db.query(query, [userId]);
    return result.rows[0];
  }

  // Get recent claims
  static async getRecent(userId, days = 30) {
    const query = `
      SELECT * FROM claims 
      WHERE user_id = $1 
        AND created_at >= CURRENT_TIMESTAMP - INTERVAL '${days} days'
      ORDER BY created_at DESC
    `;
    const result = await db.query(query, [userId]);
    return result.rows;
  }
}

export default Claim;

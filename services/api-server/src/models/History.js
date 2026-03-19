import db from '../../database/db.js';

class LocationHistory {
  // Record location
  static async create(data) {
    const query = `
      INSERT INTO location_history (
        user_id, latitude, longitude, accuracy, altitude, speed, heading,
        is_spoofed, distance_from_last, time_from_last
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *
    `;
    const values = [
      data.userId, data.latitude, data.longitude, data.accuracy, data.altitude,
      data.speed, data.heading, data.isSpoofed || false, data.distanceFromLast, data.timeFromLast
    ];
    const result = await db.query(query, values);
    return result.rows[0];
  }

  // Get recent locations
  static async getRecent(userId, limit = 100) {
    const query = `
      SELECT * FROM location_history 
      WHERE user_id = $1 
      ORDER BY recorded_at DESC 
      LIMIT $2
    `;
    const result = await db.query(query, [userId, limit]);
    return result.rows;
  }

  // Get last location
  static async getLast(userId) {
    const query = `
      SELECT * FROM location_history 
      WHERE user_id = $1 
      ORDER BY recorded_at DESC 
      LIMIT 1
    `;
    const result = await db.query(query, [userId]);
    return result.rows[0];
  }

  // Check for GPS spoofing patterns
  static async checkSpoofingPattern(userId, hours = 24) {
    const query = `
      SELECT 
        COUNT(*) as total_records,
        COUNT(CASE WHEN is_spoofed = true THEN 1 END) as spoofed_records,
        AVG(distance_from_last) as avg_distance,
        MAX(distance_from_last) as max_distance
      FROM location_history 
      WHERE user_id = $1 
        AND recorded_at >= CURRENT_TIMESTAMP - INTERVAL '${hours} hours'
    `;
    const result = await db.query(query, [userId]);
    return result.rows[0];
  }
}

class RiskHistory {
  // Record risk score
  static async create(data) {
    const query = `
      INSERT INTO risk_history (
        user_id, risk_score, risk_level, weather_condition, temperature,
        rainfall, aqi, traffic_delay, location_lat, location_lng
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *
    `;
    const values = [
      data.userId, data.riskScore, data.riskLevel, data.weatherCondition,
      data.temperature, data.rainfall, data.aqi, data.trafficDelay,
      data.locationLat, data.locationLng
    ];
    const result = await db.query(query, values);
    return result.rows[0];
  }

  // Get risk history
  static async getHistory(userId, days = 30) {
    const query = `
      SELECT * FROM risk_history 
      WHERE user_id = $1 
        AND recorded_at >= CURRENT_TIMESTAMP - INTERVAL '${days} days'
      ORDER BY recorded_at DESC
    `;
    const result = await db.query(query, [userId]);
    return result.rows;
  }

  // Get average risk score
  static async getAverageRisk(userId, days = 30) {
    const query = `
      SELECT 
        AVG(risk_score) as avg_risk_score,
        MAX(risk_score) as max_risk_score,
        MIN(risk_score) as min_risk_score
      FROM risk_history 
      WHERE user_id = $1 
        AND recorded_at >= CURRENT_TIMESTAMP - INTERVAL '${days} days'
    `;
    const result = await db.query(query, [userId]);
    return result.rows[0];
  }
}

export { LocationHistory, RiskHistory };

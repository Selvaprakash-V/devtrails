import db from '../../database/db.js';

class FraudFlag {
  // Create new fraud flag
  static async create(data) {
    const query = `
      INSERT INTO fraud_flags (
        user_id, claim_id, flag_type, severity, description, evidence, status
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `;
    const values = [
      data.userId, data.claimId, data.flagType, data.severity || 'medium',
      data.description, JSON.stringify(data.evidence || {}), data.status || 'active'
    ];
    const result = await db.query(query, values);
    return result.rows[0];
  }

  // Get fraud flags by user ID
  static async findByUserId(userId, status = null) {
    let query = 'SELECT * FROM fraud_flags WHERE user_id = $1';
    const params = [userId];
    
    if (status) {
      query += ' AND status = $2';
      params.push(status);
    }
    
    query += ' ORDER BY created_at DESC';
    const result = await db.query(query, params);
    return result.rows;
  }

  // Get active fraud flags count
  static async getActiveCount(userId) {
    const query = 'SELECT COUNT(*) as count FROM fraud_flags WHERE user_id = $1 AND status = $2';
    const result = await db.query(query, [userId, 'active']);
    return parseInt(result.rows[0].count);
  }

  // Resolve fraud flag
  static async resolve(id, resolvedBy, resolutionNotes) {
    const query = `
      UPDATE fraud_flags 
      SET status = 'resolved', 
          resolved_at = CURRENT_TIMESTAMP,
          resolved_by = $1,
          resolution_notes = $2
      WHERE id = $3
      RETURNING *
    `;
    const result = await db.query(query, [resolvedBy, resolutionNotes, id]);
    return result.rows[0];
  }

  // Mark as false positive
  static async markFalsePositive(id, notes) {
    const query = `
      UPDATE fraud_flags 
      SET status = 'false_positive', 
          resolved_at = CURRENT_TIMESTAMP,
          resolution_notes = $1
      WHERE id = $2
      RETURNING *
    `;
    const result = await db.query(query, [notes, id]);
    return result.rows[0];
  }
}

export default FraudFlag;

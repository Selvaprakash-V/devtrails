import db from '../../database/db.js';

class Payout {
  // Create new payout
  static async create(data) {
    const query = `
      INSERT INTO payouts (
        user_id, claim_id, amount, status, payment_method,
        bank_account_number, ifsc_code, upi_id
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *
    `;
    const values = [
      data.userId, data.claimId, data.amount, data.status || 'pending',
      data.paymentMethod, data.bankAccountNumber, data.ifscCode, data.upiId
    ];
    const result = await db.query(query, values);
    return result.rows[0];
  }

  // Get payouts by user ID
  static async findByUserId(userId, limit = 50, offset = 0) {
    const query = `
      SELECT p.*, c.claim_date, c.risk_level
      FROM payouts p
      LEFT JOIN claims c ON p.claim_id = c.id
      WHERE p.user_id = $1 
      ORDER BY p.created_at DESC 
      LIMIT $2 OFFSET $3
    `;
    const result = await db.query(query, [userId, limit, offset]);
    return result.rows;
  }

  // Update payout status
  static async updateStatus(id, status, transactionId = null, failureReason = null) {
    const query = `
      UPDATE payouts 
      SET status = $1, 
          transaction_id = $2,
          failure_reason = $3,
          processed_at = CASE WHEN $1 = 'processing' THEN CURRENT_TIMESTAMP ELSE processed_at END,
          completed_at = CASE WHEN $1 = 'completed' THEN CURRENT_TIMESTAMP ELSE completed_at END
      WHERE id = $4
      RETURNING *
    `;
    const result = await db.query(query, [status, transactionId, failureReason, id]);
    return result.rows[0];
  }

  // Get total payouts by user
  static async getTotalByUser(userId) {
    const query = `
      SELECT 
        COALESCE(SUM(CASE WHEN status = 'completed' THEN amount ELSE 0 END), 0) as completed_amount,
        COALESCE(SUM(CASE WHEN status = 'pending' THEN amount ELSE 0 END), 0) as pending_amount,
        COUNT(*) as total_payouts
      FROM payouts 
      WHERE user_id = $1
    `;
    const result = await db.query(query, [userId]);
    return result.rows[0];
  }
}

export default Payout;

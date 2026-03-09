const Claim = require('../models/Claim');
const FraudFlag = require('../models/FraudFlag');

/**
 * Evaluate a claim for fraud signals.
 * Returns: { score: 0-100, flags: string[] }
 */
const evaluate = async (claim, workerProfile, disruption) => {
  const flags = [];
  let score = 0;

  // 1. GPS mismatch – worker not in affected city
  if (workerProfile?.city && disruption?.city) {
    if (workerProfile.city !== disruption.city) {
      flags.push('gps_mismatch');
      score += 40;
    }
  }

  // 2. Duplicate claim within 24h for same type
  const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
  const recentDuplicate = await Claim.findOne({
    worker: claim.worker,
    type: claim.type,
    createdAt: { $gte: oneDayAgo },
    _id: { $ne: claim._id },
  });
  if (recentDuplicate) {
    flags.push('duplicate_claim');
    score += 30;
  }

  // 3. Excessive claims this month (> 4)
  const monthStart = new Date();
  monthStart.setDate(1);
  monthStart.setHours(0, 0, 0, 0);
  const monthCount = await Claim.countDocuments({
    worker: claim.worker,
    createdAt: { $gte: monthStart },
  });
  if (monthCount > 4) {
    flags.push('excessive_claims');
    score += 20;
  }

  // 4. Profile incomplete  
  if (!workerProfile?.kycStatus || workerProfile.kycStatus === 'pending') {
    flags.push('suspicious_pattern');
    score += 10;
  }

  score = Math.min(100, score);

  // Persist flags if fraud detected
  if (flags.length > 0) {
    await FraudFlag.create({
      worker: claim.worker,
      claim: claim._id,
      flagType: flags[0],
      severity: score >= 70 ? 'high' : score >= 40 ? 'medium' : 'low',
      description: `Auto-detected fraud signals: ${flags.join(', ')}`,
      evidence: { score, flags, claimId: claim._id },
    });
  }

  return { score, flags };
};

module.exports = { evaluate };

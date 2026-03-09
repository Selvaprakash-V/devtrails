const WorkerProfile = require('../models/WorkerProfile');
const InsurancePolicy = require('../models/InsurancePolicy');
const Claim = require('../models/Claim');
const DisruptionEvent = require('../models/DisruptionEvent');
const fraudDetectionService = require('./fraudDetectionService');

/**
 * Generate automatic parametric claims for all active workers in an affected zone.
 */
const triggerClaimsForDisruption = async (disruption) => {
  // Find active policy holders in the affected city
  const profiles = await WorkerProfile.find({ city: disruption.city });
  const workerIds = profiles.map(p => p.user);

  const activePolicies = await InsurancePolicy.find({
    worker: { $in: workerIds },
    status: 'active',
  });

  let generated = 0;
  for (const policy of activePolicies) {
    const coverage = policy.coverageConfig?.[disruption.type];
    if (!coverage?.enabled) continue;

    // Avoid duplicate claims for same disruption and worker
    const existing = await Claim.findOne({ worker: policy.worker, disruption: disruption._id });
    if (existing) continue;

    const payoutAmount = calculatePayout(disruption, coverage);

    const claim = await Claim.create({
      worker:     policy.worker,
      policy:     policy._id,
      disruption: disruption._id,
      type:       disruption.type,
      status:     'pending',
      amount:     payoutAmount,
      disruptionValue: disruption.measuredValue,
      threshold:  disruption.threshold,
      isAutomatic: true,
      isParametric: true,
      timeline: [{ event: 'Disruption detected', timestamp: disruption.detectedAt }],
    });

    // Run fraud detection
    const profile = profiles.find(p => p.user.toString() === policy.worker.toString());
    const fraudResult = await fraudDetectionService.evaluate(claim, profile, disruption);

    if (fraudResult.score < 50) {
      // Auto-approve low fraud risk
      await Claim.findByIdAndUpdate(claim._id, {
        status: 'approved',
        fraudScore: fraudResult.score,
        'timeline': [
          ...claim.timeline,
          { event: 'Claim auto-approved', timestamp: new Date() },
        ],
      });

      // Auto-pay (mock UPI payout)
      await processPayout(claim._id, policy.worker, payoutAmount);
    } else {
      await Claim.findByIdAndUpdate(claim._id, {
        status: 'flagged',
        fraudScore: fraudResult.score,
        fraudFlags: fraudResult.flags,
      });
    }

    generated++;
  }

  await DisruptionEvent.findByIdAndUpdate(disruption._id, {
    claimsGenerated: generated,
    isTriggered: true,
  });

  return { generated };
};

const calculatePayout = (disruption, coverage) => {
  const excess = disruption.measuredValue - disruption.threshold;
  const basePayout = coverage.maxPayout || 200;
  // Progressive payout: more severe = more compensation
  const multiplier = Math.min(2, 1 + excess / disruption.threshold);
  return Math.round(Math.min(basePayout * coverage.multiplier * multiplier, basePayout));
};

const processPayout = async (claimId, workerId, amount) => {
  // Mock UPI payout — replace with Razorpay in production
  const txnId = 'UPI-' + Date.now().toString(36).toUpperCase();
  await Claim.findByIdAndUpdate(claimId, {
    status: 'paid',
    paidAt: new Date(),
    payoutTxnId: txnId,
    $push: {
      timeline: { event: `Payout of ₹${amount} processed via UPI`, timestamp: new Date(), meta: { txnId } },
    },
  });

  // Update worker totals
  await require('../models/WorkerProfile').findOneAndUpdate(
    { user: workerId },
    {
      $inc: { totalEarningsProtected: amount, totalClaimsReceived: 1 },
    }
  );
};

module.exports = { triggerClaimsForDisruption, processPayout };

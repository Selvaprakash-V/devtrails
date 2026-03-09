const InsurancePolicy = require('../models/InsurancePolicy');
const WorkerProfile = require('../models/WorkerProfile');
const riskScoringService = require('../services/riskScoringService');
const { PREMIUM_BASE, MAX_COMPENSATION } = require('../config/constants');

// GET /api/policy
const getPolicy = async (req, res, next) => {
  try {
    const policy = await InsurancePolicy.findOne({ worker: req.user._id })
      .sort({ createdAt: -1 });
    res.json({ success: true, data: policy });
  } catch (err) { next(err); }
};

// POST /api/policy/activate
const activatePolicy = async (req, res, next) => {
  try {
    const profile = await WorkerProfile.findOne({ user: req.user._id });
    if (!profile) return res.status(404).json({ success: false, message: 'Worker profile not found' });

    // Cancel any existing active policy
    await InsurancePolicy.updateMany(
      { worker: req.user._id, status: 'active' },
      { status: 'cancelled' }
    );

    const { weeklyPremium, premiumBreakdown, score } = await riskScoringService.calculate(profile);

    const now = new Date();
    const end = new Date(now);
    end.setDate(end.getDate() + 7);

    const policy = await InsurancePolicy.create({
      worker: req.user._id,
      status: 'active',
      weeklyPremium,
      maxCompensation: MAX_COMPENSATION,
      premiumBreakdown,
      coverageConfig: {
        rain:   { enabled: true, maxPayout: 200, multiplier: 1.0 },
        heat:   { enabled: true, maxPayout: 150, multiplier: 0.8 },
        aqi:    { enabled: true, maxPayout: 100, multiplier: 0.5 },
        flood:  { enabled: true, maxPayout: 300, multiplier: 1.5 },
        curfew: { enabled: true, maxPayout: 500, multiplier: 2.0 },
      },
      startDate:   now,
      endDate:     end,
      renewalDate: end,
      paymentMethod: req.body.paymentMethod || 'upi',
      paymentHistory: [{
        amount: weeklyPremium,
        paidAt: now,
        txnId: 'MOCK-' + Date.now(),
        status: 'success',
      }],
      totalPremiumPaid: weeklyPremium,
    });

    res.status(201).json({ success: true, data: policy });
  } catch (err) { next(err); }
};

// POST /api/policy/calculate-premium
const calculatePremium = async (req, res, next) => {
  try {
    const { city, deliveryPlatform, location } = req.body;
    const mockProfile = { city, deliveryPlatform, location, avgWeeklyIncome: 3000, workingDaysPerWeek: 6 };
    const result = await riskScoringService.calculate(mockProfile);
    res.json({ success: true, data: result });
  } catch (err) { next(err); }
};

// PUT /api/policy/:id/cancel
const cancelPolicy = async (req, res, next) => {
  try {
    const policy = await InsurancePolicy.findOneAndUpdate(
      { _id: req.params.id, worker: req.user._id, status: 'active' },
      { status: 'cancelled' },
      { new: true }
    );
    if (!policy) return res.status(404).json({ success: false, message: 'Active policy not found' });
    res.json({ success: true, data: policy });
  } catch (err) { next(err); }
};

module.exports = { getPolicy, activatePolicy, calculatePremium, cancelPolicy };

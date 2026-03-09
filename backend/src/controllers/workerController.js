const WorkerProfile = require('../models/WorkerProfile');
const InsurancePolicy = require('../models/InsurancePolicy');
const Claim = require('../models/Claim');
const riskScoringService = require('../services/riskScoringService');

// GET /api/worker/profile
const getProfile = async (req, res, next) => {
  try {
    const profile = await WorkerProfile.findOne({ user: req.user._id });
    if (!profile) return res.status(404).json({ success: false, message: 'Profile not found' });
    res.json({ success: true, data: profile });
  } catch (err) { next(err); }
};

// PUT /api/worker/profile
const updateProfile = async (req, res, next) => {
  try {
    const allowed = ['city', 'zone', 'location', 'vehicleType', 'avgWeeklyIncome', 'workingDaysPerWeek', 'deliveryPlatform'];
    const updates = {};
    allowed.forEach(k => { if (req.body[k] !== undefined) updates[k] = req.body[k]; });

    const profile = await WorkerProfile.findOneAndUpdate(
      { user: req.user._id },
      updates,
      { new: true, runValidators: true }
    );
    res.json({ success: true, data: profile });
  } catch (err) { next(err); }
};

// GET /api/worker/risk-score
const getRiskScore = async (req, res, next) => {
  try {
    const profile = await WorkerProfile.findOne({ user: req.user._id });
    if (!profile) return res.status(404).json({ success: false, message: 'Profile not found' });

    const result = await riskScoringService.calculate(profile);

    // Persist updated score
    await WorkerProfile.findByIdAndUpdate(profile._id, {
      riskScore: result.score,
      riskLevel: result.level,
      weeklyPremium: result.weeklyPremium,
      riskLastUpdated: new Date(),
    });

    res.json({ success: true, data: result });
  } catch (err) { next(err); }
};

// GET /api/worker/dashboard
const getDashboard = async (req, res, next) => {
  try {
    const profile = await WorkerProfile.findOne({ user: req.user._id });
    const policy  = await InsurancePolicy.findOne({ worker: req.user._id, status: 'active' });

    const recentClaims = await Claim.find({ worker: req.user._id })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('disruption', 'type city detectedAt measuredValue');

    const monthStart = new Date();
    monthStart.setDate(1);
    monthStart.setHours(0, 0, 0, 0);

    const monthlyStats = await Claim.aggregate([
      { $match: { worker: req.user._id, status: 'paid', createdAt: { $gte: monthStart } } },
      { $group: { _id: null, totalPaid: { $sum: '$amount' }, count: { $sum: 1 } } },
    ]);

    res.json({
      success: true,
      data: {
        profile,
        policy,
        recentClaims,
        monthlyStats: monthlyStats[0] || { totalPaid: 0, count: 0 },
      },
    });
  } catch (err) { next(err); }
};

// GET /api/worker/earnings-chart
const getEarningsChart = async (req, res, next) => {
  try {
    const weeks = parseInt(req.query.weeks) || 8;
    const start = new Date();
    start.setDate(start.getDate() - weeks * 7);

    const claims = await Claim.find({
      worker: req.user._id,
      status: 'paid',
      createdAt: { $gte: start },
    }).populate('disruption', 'type');

    // Group by week
    const profile = await WorkerProfile.findOne({ user: req.user._id });
    const weeklyData = [];
    for (let i = weeks - 1; i >= 0; i--) {
      const weekStart = new Date();
      weekStart.setDate(weekStart.getDate() - i * 7 - 6);
      const weekEnd = new Date();
      weekEnd.setDate(weekEnd.getDate() - i * 7);

      const weekClaims = claims.filter(
        c => c.createdAt >= weekStart && c.createdAt <= weekEnd
      );
      const compensations = weekClaims.reduce((s, c) => s + c.amount, 0);

      weeklyData.push({
        week: `Week ${weeks - i}`,
        date: weekStart.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }),
        income: profile?.avgWeeklyIncome || 3000,
        compensation: compensations,
        disruptions: weekClaims.length,
      });
    }

    res.json({ success: true, data: weeklyData });
  } catch (err) { next(err); }
};

module.exports = { getProfile, updateProfile, getRiskScore, getDashboard, getEarningsChart };

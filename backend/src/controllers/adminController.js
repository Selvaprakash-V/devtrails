const User = require('../models/User');
const WorkerProfile = require('../models/WorkerProfile');
const InsurancePolicy = require('../models/InsurancePolicy');
const Claim = require('../models/Claim');
const FraudFlag = require('../models/FraudFlag');
const DisruptionEvent = require('../models/DisruptionEvent');

// GET /api/admin/dashboard
const getDashboard = async (req, res, next) => {
  try {
    const [totalWorkers, activePolicies, pendingClaims, openFraudFlags] = await Promise.all([
      User.countDocuments({ role: 'worker' }),
      InsurancePolicy.countDocuments({ status: 'active' }),
      Claim.countDocuments({ status: 'pending' }),
      FraudFlag.countDocuments({ status: 'open' }),
    ]);

    const monthStart = new Date();
    monthStart.setDate(1); monthStart.setHours(0, 0, 0, 0);

    const monthlyPayouts = await Claim.aggregate([
      { $match: { status: 'paid', paidAt: { $gte: monthStart } } },
      { $group: { _id: null, total: { $sum: '$amount' }, count: { $sum: 1 } } },
    ]);

    const recentDisruptions = await DisruptionEvent.find()
      .sort({ detectedAt: -1 }).limit(10);

    const activeAlerts = await DisruptionEvent.find({ isActive: true })
      .sort({ detectedAt: -1 }).limit(5);

    res.json({
      success: true,
      data: {
        stats: {
          totalWorkers,
          activePolicies,
          pendingClaims,
          openFraudFlags,
          monthlyPayouts: monthlyPayouts[0]?.total || 0,
          monthlyClaimsCount: monthlyPayouts[0]?.count || 0,
        },
        recentDisruptions,
        activeAlerts,
      },
    });
  } catch (err) { next(err); }
};

// GET /api/admin/claims
const getAllClaims = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, status, city, type } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (type)   filter.type   = type;

    const claims = await Claim.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .populate('worker', 'name email phone')
      .populate('disruption', 'type city detectedAt measuredValue severity');

    const total = await Claim.countDocuments(filter);
    res.json({ success: true, data: claims, pagination: { total, page: parseInt(page), limit: parseInt(limit) } });
  } catch (err) { next(err); }
};

// PUT /api/admin/claims/:id/review
const reviewClaim = async (req, res, next) => {
  try {
    const { status, reviewNote } = req.body;
    if (!['approved', 'rejected', 'flagged'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }
    const claim = await Claim.findByIdAndUpdate(
      req.params.id,
      { status, reviewNote, reviewedBy: req.user._id, reviewedAt: new Date() },
      { new: true }
    );
    if (!claim) return res.status(404).json({ success: false, message: 'Claim not found' });
    res.json({ success: true, data: claim });
  } catch (err) { next(err); }
};

// GET /api/admin/fraud-flags
const getFraudFlags = async (req, res, next) => {
  try {
    const { status = 'open', severity } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (severity) filter.severity = severity;

    const flags = await FraudFlag.find(filter)
      .sort({ createdAt: -1 })
      .populate('worker', 'name email phone')
      .populate('claim', 'claimNumber amount type status');

    res.json({ success: true, data: flags });
  } catch (err) { next(err); }
};

// GET /api/admin/analytics/claims
const getClaimsAnalytics = async (req, res, next) => {
  try {
    const claimsByCity = await Claim.aggregate([
      { $lookup: { from: 'disruptionevents', localField: 'disruption', foreignField: '_id', as: 'event' } },
      { $unwind: '$event' },
      { $group: { _id: '$event.city', count: { $sum: 1 }, totalPayout: { $sum: '$amount' } } },
      { $sort: { count: -1 } },
    ]);

    const claimsByType = await Claim.aggregate([
      { $group: { _id: '$type', count: { $sum: 1 }, totalPayout: { $sum: '$amount' } } },
      { $sort: { count: -1 } },
    ]);

    const last30Days = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const dailyPayouts = await Claim.aggregate([
      { $match: { createdAt: { $gte: last30Days }, status: 'paid' } },
      { $group: {
        _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
        count: { $sum: 1 },
        amount: { $sum: '$amount' },
      }},
      { $sort: { _id: 1 } },
    ]);

    res.json({ success: true, data: { claimsByCity, claimsByType, dailyPayouts } });
  } catch (err) { next(err); }
};

// GET /api/admin/workers
const getWorkers = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, city, riskLevel } = req.query;
    const filter = {};
    if (city)      filter.city      = city;
    if (riskLevel) filter.riskLevel = riskLevel;

    const profiles = await WorkerProfile.find(filter)
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .populate('user', 'name email phone createdAt');

    const total = await WorkerProfile.countDocuments(filter);
    res.json({ success: true, data: profiles, pagination: { total, page: parseInt(page), limit: parseInt(limit) } });
  } catch (err) { next(err); }
};

// GET /api/admin/disruptions
const getDisruptions = async (req, res, next) => {
  try {
    const disruptions = await DisruptionEvent.find()
      .sort({ detectedAt: -1 })
      .limit(50);
    res.json({ success: true, data: disruptions });
  } catch (err) { next(err); }
};

module.exports = { getDashboard, getAllClaims, reviewClaim, getFraudFlags, getClaimsAnalytics, getWorkers, getDisruptions };

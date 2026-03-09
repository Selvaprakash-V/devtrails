const Claim = require('../models/Claim');
const FraudFlag = require('../models/FraudFlag');

// GET /api/claims (worker's own)
const getMyClaims = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const filter = { worker: req.user._id };
    if (status) filter.status = status;

    const claims = await Claim.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .populate('disruption', 'type city detectedAt measuredValue unit severity');

    const total = await Claim.countDocuments(filter);
    res.json({ success: true, data: claims, pagination: { total, page: parseInt(page), limit: parseInt(limit) } });
  } catch (err) { next(err); }
};

// GET /api/claims/:id
const getClaimById = async (req, res, next) => {
  try {
    const claim = await Claim.findOne({ _id: req.params.id, worker: req.user._id })
      .populate('disruption')
      .populate('policy', 'policyNumber weeklyPremium maxCompensation');
    if (!claim) return res.status(404).json({ success: false, message: 'Claim not found' });
    res.json({ success: true, data: claim });
  } catch (err) { next(err); }
};

// GET /api/claims/stats/summary
const getClaimStats = async (req, res, next) => {
  try {
    const stats = await Claim.aggregate([
      { $match: { worker: req.user._id } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalAmount: { $sum: '$amount' },
        },
      },
    ]);

    const typeBreakdown = await Claim.aggregate([
      { $match: { worker: req.user._id, status: 'paid' } },
      { $group: { _id: '$type', count: { $sum: 1 }, totalAmount: { $sum: '$amount' } } },
    ]);

    res.json({ success: true, data: { byStatus: stats, byType: typeBreakdown } });
  } catch (err) { next(err); }
};

module.exports = { getMyClaims, getClaimById, getClaimStats };

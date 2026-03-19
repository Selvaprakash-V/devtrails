import Claim from '../models/Claim.js';
import { getPayoutHistory } from '../services/payoutService.js';

export const getMyClaims = async (req, res) => {
  const { status, disruptionType, startDate, endDate, limit } = req.query;
  
  const filters = {
    status,
    disruptionType,
    startDate,
    endDate,
    limit: parseInt(limit) || 50
  };

  const claims = await getPayoutHistory(req.userId, filters);
  
  res.json(claims);
};

export const getClaimById = async (req, res) => {
  const claim = await Claim.findOne({ 
    _id: req.params.id, 
    workerId: req.userId 
  });
  
  if (!claim) {
    return res.status(404).json({ error: 'Claim not found' });
  }
  
  res.json(claim);
};

export const getClaimStats = async (req, res) => {
  const stats = await Claim.aggregate([
    { $match: { workerId: req.userId } },
    {
      $group: {
        _id: null,
        totalClaims: { $sum: 1 },
        totalPayout: { $sum: '$payoutAmount' },
        approvedClaims: {
          $sum: { $cond: [{ $in: ['$status', ['approved', 'credited']] }, 1, 0] }
        },
        pendingClaims: {
          $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] }
        },
        avgPayout: { $avg: '$payoutAmount' }
      }
    }
  ]);

  const byType = await Claim.aggregate([
    { $match: { workerId: req.userId } },
    {
      $group: {
        _id: '$disruptionType',
        count: { $sum: 1 },
        totalAmount: { $sum: '$payoutAmount' }
      }
    }
  ]);

  res.json({
    overall: stats[0] || {
      totalClaims: 0,
      totalPayout: 0,
      approvedClaims: 0,
      pendingClaims: 0,
      avgPayout: 0
    },
    byType
  });
};

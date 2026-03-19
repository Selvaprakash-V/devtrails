import Worker from '../models/Worker.js';
import Claim from '../models/Claim.js';
import FraudFlag from '../models/FraudFlag.js';

export const getDashboard = async (req, res) => {
  const [totalWorkers, totalClaims, pendingClaims, fraudFlags] = await Promise.all([
    Worker.countDocuments({ isActive: true }),
    Claim.countDocuments(),
    Claim.countDocuments({ status: 'pending' }),
    FraudFlag.countDocuments({ resolved: false })
  ]);

  const totalPayouts = await Claim.aggregate([
    { $match: { status: { $in: ['approved', 'paid'] } } },
    { $group: { _id: null, total: { $sum: '$payoutAmount' } } }
  ]);

  res.json({
    totalWorkers,
    totalClaims,
    pendingClaims,
    fraudFlags,
    totalPayouts: totalPayouts[0]?.total || 0
  });
};

export const getAllClaims = async (req, res) => {
  const claims = await Claim.find()
    .populate('workerId', 'name phone city')
    .sort({ createdAt: -1 })
    .limit(100);
  res.json(claims);
};

export const updateClaimStatus = async (req, res) => {
  const { status } = req.body;
  const claim = await Claim.findByIdAndUpdate(
    req.params.id,
    { status, processedAt: new Date() },
    { new: true }
  );
  res.json(claim);
};

export const getFraudAlerts = async (req, res) => {
  const alerts = await FraudFlag.find({ resolved: false })
    .populate('workerId', 'name phone city')
    .populate('claimId')
    .sort({ createdAt: -1 });
  res.json(alerts);
};

export const resolveAlert = async (req, res) => {
  const alert = await FraudFlag.findByIdAndUpdate(
    req.params.id,
    { resolved: true },
    { new: true }
  );
  res.json(alert);
};

export const getWorkers = async (req, res) => {
  const workers = await Worker.find().sort({ createdAt: -1 });
  res.json(workers);
};

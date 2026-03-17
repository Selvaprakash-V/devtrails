const OnboardingUser = require('../models/OnboardingUser');

// helper to always work on the authenticated onboarding user
const getUserFromReq = (req) => req.user;

// POST /api/user/language
exports.updateLanguage = async (req, res, next) => {
  try {
    const user = getUserFromReq(req);
    user.language = req.body.language;
    await user.save();
    res.json({ success: true, language: user.language });
  } catch (err) {
    next(err);
  }
};

// POST /api/user/location
exports.updateLocation = async (req, res, next) => {
  try {
    const user = getUserFromReq(req);
    const { city, area, lat, lng } = req.body;
    user.location = {
      city,
      area,
      coordinates: { lat, lng },
    };
    await user.save();
    res.json({ success: true, location: user.location });
  } catch (err) {
    next(err);
  }
};

// POST /api/user/work-settings
exports.updateWorkSettings = async (req, res, next) => {
  try {
    const user = getUserFromReq(req);
    const { vehicleType, workArea, workTime } = req.body;
    user.workSettings = { vehicleType, workArea, workTime };
    await user.save();
    res.json({ success: true, workSettings: user.workSettings });
  } catch (err) {
    next(err);
  }
};

// POST /api/user/profile
exports.updateProfile = async (req, res, next) => {
  try {
    const user = getUserFromReq(req);
    const { name, age, gender } = req.body;
    user.profile = { name, age, gender };
    await user.save();
    res.json({ success: true, profile: user.profile });
  } catch (err) {
    next(err);
  }
};

// POST /api/user/bank
exports.updateBankDetails = async (req, res, next) => {
  try {
    const user = getUserFromReq(req);
    const { accountNumber, ifsc, bankName } = req.body;
    user.bankDetails = { accountNumber, ifsc, bankName };
    await user.save();
    res.json({ success: true, bankDetails: { ifsc: user.bankDetails.ifsc, bankName: user.bankDetails.bankName } });
  } catch (err) {
    next(err);
  }
};

// POST /api/user/documents
exports.updateDocuments = async (req, res, next) => {
  try {
    const user = getUserFromReq(req);
    const { type, idNumber } = req.body;

    // simple mock verification: mark Aadhaar and PAN as verified if length looks plausible
    let verified = false;
    if (type === 'Aadhaar' && /^\d{12}$/.test(idNumber)) verified = true;
    if (type === 'PAN' && /^[A-Z]{5}\d{4}[A-Z]$/.test(idNumber)) verified = true;

    user.documents = { type, idNumber, verified };
    await user.save();

    res.json({ success: true, documents: user.documents });
  } catch (err) {
    next(err);
  }
};

const router = require('express').Router();
const { protect } = require('../middleware/auth');
const DisruptionEvent = require('../models/DisruptionEvent');

// GET /api/disruptions?city=Mumbai
router.get('/', protect, async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.city) filter.city = req.query.city;
    if (req.query.active === 'true') filter.isActive = true;

    const events = await DisruptionEvent.find(filter)
      .sort({ detectedAt: -1 })
      .limit(parseInt(req.query.limit) || 20);

    res.json({ success: true, data: events });
  } catch (err) { next(err); }
});

// GET /api/disruptions/active/alerts — public-ish, used by landing page
router.get('/active/alerts', async (req, res, next) => {
  try {
    const events = await DisruptionEvent.find({ isActive: true })
      .sort({ detectedAt: -1 })
      .limit(10)
      .select('type city severity measuredValue unit detectedAt');
    res.json({ success: true, data: events });
  } catch (err) { next(err); }
});

module.exports = router;

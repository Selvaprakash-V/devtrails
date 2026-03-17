const router = require('express').Router();
const { getCurrentWeather } = require('../services/weatherService');

// GET /api/weather/current?lat=..&lon=..
router.get('/current', async (req, res, next) => {
  try {
    const lat = parseFloat(req.query.lat);
    const lon = parseFloat(req.query.lon);

    if (Number.isNaN(lat) || Number.isNaN(lon)) {
      return res.status(400).json({ success: false, message: 'lat and lon are required' });
    }

    const weather = await getCurrentWeather(lat, lon);
    res.json({ success: true, data: weather });
  } catch (err) {
    next(err);
  }
});

module.exports = router;

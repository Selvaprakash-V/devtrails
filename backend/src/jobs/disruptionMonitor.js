const cron = require('node-cron');
const weatherService = require('../services/weatherService');
const claimTriggerService = require('../services/claimTriggerService');
const DisruptionEvent = require('../models/DisruptionEvent');
const { CITIES, DISRUPTION_TYPES } = require('../config/constants');

const INTERVAL = parseInt(process.env.DISRUPTION_CHECK_INTERVAL || 15);

const checkDisruptions = async () => {
  console.log(`[DisruptionMonitor] Running check at ${new Date().toISOString()}`);

  for (const city of CITIES) {
    try {
      let weather;
      try {
        weather = await weatherService.getCurrentWeather(city.lat, city.lon);
      } catch {
        weather = weatherService.getMockWeather(city.name);
      }

      const triggers = weatherService.checkDisruptionThreshold(weather);

      for (const trigger of triggers) {
        // Avoid duplicate active events
        const existing = await DisruptionEvent.findOne({
          city: city.name,
          type: trigger.type,
          isActive: true,
          detectedAt: { $gte: new Date(Date.now() - 3 * 60 * 60 * 1000) }, // within 3h
        });

        if (existing) continue;

        const severity = trigger.value / trigger.threshold > 1.5 ? 'extreme' :
                         trigger.value / trigger.threshold > 1.2 ? 'high'   :
                         trigger.value / trigger.threshold > 1.0 ? 'medium' : 'low';

        const disruptionEvent = await DisruptionEvent.create({
          type:          trigger.type,
          city:          city.name,
          location:      { lat: city.lat, lon: city.lon },
          measuredValue: trigger.value,
          threshold:     trigger.threshold,
          unit:          DISRUPTION_TYPES[trigger.type.toUpperCase()]?.unit,
          severity,
          weatherData:   weather,
          isActive:      true,
          isTriggered:   false,
          source:        'OpenWeatherMap',
        });

        console.log(`[DisruptionMonitor] Triggered: ${trigger.type} in ${city.name} — ${trigger.value}${DISRUPTION_TYPES[trigger.type.toUpperCase()]?.unit}`);

        // Generate claims asynchronously
        claimTriggerService.triggerClaimsForDisruption(disruptionEvent)
          .then(r => console.log(`[ClaimTrigger] ${r.generated} claims generated for ${city.name} ${trigger.type}`))
          .catch(err => console.error('[ClaimTrigger] Error:', err.message));
      }

      // Resolve events no longer active
      await DisruptionEvent.updateMany(
        {
          city: city.name,
          isActive: true,
          detectedAt: { $lt: new Date(Date.now() - 6 * 60 * 60 * 1000) },
        },
        { isActive: false, resolvedAt: new Date() }
      );

    } catch (err) {
      console.error(`[DisruptionMonitor] Error for ${city.name}:`, err.message);
    }
  }
};

const start = () => {
  // Run every N minutes
  cron.schedule(`*/${INTERVAL} * * * *`, checkDisruptions);
  console.log(`[DisruptionMonitor] Scheduled every ${INTERVAL} minutes`);
  // Run once immediately on startup
  setTimeout(checkDisruptions, 5000);
};

module.exports = { start, checkDisruptions };

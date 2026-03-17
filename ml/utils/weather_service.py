import os
from functools import lru_cache
import requests
import logging

API_KEY = os.environ.get('OPENWEATHER_API_KEY', 'YOUR_OPENWEATHER_KEY')
_LOG = logging.getLogger(__name__)


def get_rainfall_forecast(lat: float, lon: float) -> float:
    """Use OpenWeather 5-day/3-hour forecast to sum rainfall over next 12 hours.

    Iterates over the first 4 items in `list` and sums `rain.3h`.
    Returns 0.0 on error.
    """
    url = f"https://api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid={API_KEY}&units=metric"
    try:
        resp = requests.get(url, timeout=5)
        resp.raise_for_status()
        data = resp.json()
        total = 0.0
        entries = data.get('list', [])[:4]
        for item in entries:
            rain_data = item.get('rain')
            r = 0.0
            if isinstance(rain_data, dict):
                r = float(rain_data.get('3h', 0.0) or 0.0)
            total += r
        _LOG.debug(f"forecast rainfall for %s,%s = %s", lat, lon, total)
        return float(total)
    except Exception as e:
        _LOG.warning("forecast API failed for %s,%s: %s", lat, lon, e)
        return 0.0


@lru_cache(maxsize=50)
def get_weather(lat: float, lon: float):
    """Return temperature (°C), rainfall (mm), and echo back lat/lon.
    Uses lat/lon instead of city name. Fetches forecast rainfall and returns
    the max(current_rainfall, forecast_rainfall) to reflect near-future risk.
    """
    url = f"https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={API_KEY}&units=metric"

    try:
        resp = requests.get(url, timeout=5)
        resp.raise_for_status()
        data = resp.json()

        temperature = float(data.get('main', {}).get('temp', 0.0))

        rain_data = data.get('rain')
        current_rain = float(rain_data.get('1h', 0) if isinstance(rain_data, dict) else 0.0)

        # get forecast rainfall for next 12 hours
        forecast_rain = get_rainfall_forecast(lat, lon)

        rainfall = max(current_rain, forecast_rain)

        _LOG.info("weather %s,%s temp=%s current_rain=%s forecast_rain=%s -> use=%s",
                  lat, lon, temperature, current_rain, forecast_rain, rainfall)

        return {
            'temperature': float(temperature),
            'rainfall': float(rainfall),
            'lat': lat,
            'lon': lon
        }

    except Exception as e:
        _LOG.error("weather API failed for %s,%s: %s", lat, lon, e)
        return {
            'temperature': 25.0,
            'rainfall': 0.0,
            'lat': lat,
            'lon': lon
        }
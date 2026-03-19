import os
from dotenv import load_dotenv
from functools import lru_cache
import requests

load_dotenv()

API_KEY = os.environ.get('OPENWEATHER_API_KEY')

if not API_KEY:
    raise ValueError("OpenWeather API key not set")


@lru_cache(maxsize=200)
def get_aqi(lat: float, lon: float):
    """Fetch AQI and convert to realistic scale."""

    if lat is None or lon is None:
        return 150  # fallback

    url = f"https://api.openweathermap.org/data/2.5/air_pollution?lat={lat}&lon={lon}&appid={API_KEY}"

    try:
        resp = requests.get(url, timeout=5)
        resp.raise_for_status()
        data = resp.json()

        aqi_raw = data.get('list', [{}])[0].get('main', {}).get('aqi')

        if aqi_raw is None:
            return 150

        # realistic mapping
        aqi_map = {
            1: 50,
            2: 100,
            3: 200,
            4: 300,
            5: 400
        }

        aqi = aqi_map.get(aqi_raw, 150)

        return float(max(0, min(500, aqi)))

    except Exception as e:
        print(f"[AQI ERROR] {e}")
        return 150
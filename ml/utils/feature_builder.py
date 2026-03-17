from datetime import datetime
from .weather_service import get_weather
from .aqi_service import get_aqi
from .traffic_service import get_traffic
from functools import lru_cache


@lru_cache(maxsize=50)
def get_features(city: str, lat: float, lon: float):
    # Require lat/lon — city is kept for caller context only
    if lat is None or lon is None:
        raise ValueError("lat/lon required")

    w = get_weather(lat, lon)

    # Safe API calls with sensible fallbacks
    try:
        aqi = get_aqi(lat, lon)
    except Exception:
        aqi = 150

    try:
        traffic = get_traffic(lat, lon)
    except Exception:
        traffic = 50

    # Clamp traffic and apply demo fallback when zero
    traffic = max(0.0, min(100.0, float(traffic)))
    if traffic == 0.0:
        traffic = 40.0

    features = {
        'rainfall': float(w.get('rainfall', 0.0) or 0.0),
        'temperature': float(w.get('temperature', 0.0) or 0.0),
        'aqi': int(aqi or 0),
        'traffic': float(traffic),
        'month': int(datetime.utcnow().month)
    }

    print(f"[FEATURES] {features}")

    return features
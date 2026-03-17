import os
from functools import lru_cache
import requests

TOMTOM_KEY = os.environ.get('TOMTOM_API_KEY')

if not TOMTOM_KEY:
    raise ValueError("TomTom API key not set")


@lru_cache(maxsize=200)
def get_traffic(lat: float, lon: float):
    """Fetch TomTom traffic and return risk (0–100)."""

    if lat is None or lon is None:
        return 50  # fallback

    url = f"https://api.tomtom.com/traffic/services/4/flowSegmentData/absolute/10/json?point={lat},{lon}&key={TOMTOM_KEY}"

    try:
        resp = requests.get(url, timeout=5)
        resp.raise_for_status()
        data = resp.json()

        fs = data.get('flowSegmentData', {})
        current = fs.get('currentSpeed')
        freeflow = fs.get('freeFlowSpeed')

        if current is None or freeflow is None or freeflow == 0:
            return 50

        congestion_ratio = float(current) / float(freeflow)

        # clamp ratio
        congestion_ratio = max(0.0, min(1.0, congestion_ratio))

        traffic_risk = (1 - congestion_ratio) * 100
        traffic_risk = max(0.0, min(100.0, traffic_risk))

        return float(traffic_risk)

    except Exception as e:
        print(f"[TRAFFIC ERROR] {e}")
        return 50
# services/payout_service.py

# -------------------------------
# REGION CLASSIFICATION (India)
# -------------------------------
def get_region(lat: float):
    if 8 <= lat <= 15:
        return "south"
    elif 15 < lat <= 23:
        return "central"
    elif lat > 23:
        return "north"
    else:
        return "unknown"


# -------------------------------
# CITY TIER (Demand Level)
# -------------------------------
def get_city_tier(city: str):
    metro = [
        "mumbai", "delhi", "bangalore", "bengaluru",
        "chennai", "hyderabad", "kolkata", "pune"
    ]

    tier2 = [
        "coimbatore", "madurai", "lucknow", "jaipur",
        "ahmedabad", "indore", "surat", "vizag"
    ]

    city = city.lower()

    if city in metro:
        return "metro"
    elif city in tier2:
        return "tier2"
    return "tier3"


# -------------------------------
# HOTSPOT (ORDER DENSITY LOGIC)
# -------------------------------
def get_demand_hotspot(lat: float, lon: float):
    """
    Simulated demand zones based on major city clusters.
    (Hackathon-friendly approximation)
    """

    # Chennai hotspot
    if 12.9 <= lat <= 13.2 and 80.2 <= lon <= 80.3:
        return "high"

    # Bangalore hotspot
    if 12.9 <= lat <= 13.1 and 77.5 <= lon <= 77.7:
        return "high"

    # Mumbai hotspot
    if 18.9 <= lat <= 19.2 and 72.8 <= lon <= 73.0:
        return "high"

    return "normal"


# -------------------------------
# MULTIPLIERS
# -------------------------------
REGION_MULTIPLIER = {
    "south": 1.0,
    "central": 0.9,
    "north": 1.1,
    "unknown": 1.0
}

CITY_MULTIPLIER = {
    "metro": 1.25,
    "tier2": 1.1,
    "tier3": 1.0
}

HOTSPOT_MULTIPLIER = {
    "high": 1.2,
    "normal": 1.0
}


# -------------------------------
# MAIN PAYOUT FUNCTION
# -------------------------------
def calculate_payout(
    risk_score: float,
    expected_income: float,
    city: str,
    lat: float,
    lon: float
):
    """
    Combines:
    - Risk severity
    - Income
    - Region
    - City demand
    - Hotspot density
    """

    if expected_income <= 0:
        return {
            "amount": 0,
            "reason": "Invalid income"
        }

    # -----------------------
    # BASE PAYOUT FROM RISK
    # -----------------------
    if risk_score < 30:
        base = 0
        reason = "No significant disruption"

    elif risk_score <= 60:
        base = 0.3 * expected_income
        reason = "Moderate disruption detected"

    else:
        base = 0.6 * expected_income
        reason = "High disruption detected"

    # -----------------------
    # CONTEXTUAL FACTORS
    # -----------------------
    region = get_region(lat)
    city_tier = get_city_tier(city)
    hotspot = get_demand_hotspot(lat, lon)

    region_factor = REGION_MULTIPLIER.get(region, 1.0)
    city_factor = CITY_MULTIPLIER.get(city_tier, 1.0)
    hotspot_factor = HOTSPOT_MULTIPLIER.get(hotspot, 1.0)

    # -----------------------
    # FINAL PAYOUT
    # -----------------------
    final_amount = base * region_factor * city_factor * hotspot_factor

    return {
        "amount": round(final_amount, 2),
        "reason": reason,
        "meta": {
            "region": region,
            "city_tier": city_tier,
            "hotspot": hotspot,
            "multipliers": {
                "region": region_factor,
                "city": city_factor,
                "hotspot": hotspot_factor
            }
        }
    }
# services/simulation_service.py

from utils.feature_builder import get_features
from models.risk_model.predict import predict_risk
from models.income_model.predict import predict_income
from services.payout_service import calculate_payout


def simulate_full_flow(city: str, lat: float, lon: float):
    """
    Full pipeline:
    Features → Risk → Income → Payout
    """

    # -------------------------
    # STEP 1: Get Features
    # -------------------------
    features = get_features(city, lat, lon)

    # -------------------------
    # STEP 2: Risk Prediction
    # -------------------------
    risk_result = predict_risk(features)
    risk_score = risk_result["risk_score"]
    risk_level = risk_result["risk_level"]

    # -------------------------
    # STEP 3: Income Estimation
    # (Use realistic defaults for now)
    # -------------------------
    income_input = {
        "avg_orders": 22,
        "payout_per_order": 35,
        "working_hours": 8,
        "city_factor": 1.2
    }

    income_result = predict_income(income_input)
    expected_income = income_result["expected_daily_income"]

    # -------------------------
    # STEP 4: Payout Calculation
    # -------------------------
    payout_result = calculate_payout(
        risk_score,
        expected_income,
        city,
        lat,
        lon
    )

    # -------------------------
    # FINAL RESPONSE
    # -------------------------
    return {
        "city": city,
        "coordinates": {
            "lat": lat,
            "lon": lon
        },
        "features": features,
        "risk": {
            "score": round(risk_score, 2),
            "level": risk_level
        },
        "income": income_result,
        "payout": payout_result
    }
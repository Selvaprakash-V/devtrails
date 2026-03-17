import os
import joblib
import numpy as np

MODEL_PATH = os.path.join(os.path.dirname(__file__), 'model.pkl')

_model = None


def load_model(path=MODEL_PATH):
    return joblib.load(path)


def get_model():
    global _model
    if _model is None:
        _model = load_model()
    return _model


def _clamp(x, lo=0.0, hi=100.0):
    return float(max(lo, min(hi, x)))


def _risk_level(score: float):
    if score < 30:
        return 'low'
    if score <= 60:
        return 'medium'
    return 'high'


def _validate(data):
    data["rainfall"] = max(0, data["rainfall"])
    data["aqi"] = max(0, data["aqi"])
    data["traffic"] = max(0, data["traffic"])

    if not (1 <= data["month"] <= 12):
        raise ValueError("Invalid month value")


def predict_risk(data: dict, model=None):
    """Predict risk given feature dict:
    rainfall, temperature, aqi, traffic, month
    """

    if model is None:
        model = get_model()

    required = ['rainfall', 'temperature', 'aqi', 'traffic', 'month']

    try:
        data = {k: float(data[k]) for k in required}
    except Exception as e:
        raise ValueError(f"Missing or invalid feature: {e}")

    _validate(data)

    # Feature order MUST match training
    x = [
        data["rainfall"],
        data["temperature"],
        data["aqi"],
        data["traffic"],
        data["month"]
    ]

    pred = model.predict([x])[0]
    pred = _clamp(pred, 0.0, 100.0)

    print(f"[ML] Input: {data} → Risk: {pred}")

    return {
        'risk_score': round(pred, 2),
        'risk_level': _risk_level(pred)
    }
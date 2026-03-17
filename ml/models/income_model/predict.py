import os
import joblib

MODEL_PATH = os.path.join(os.path.dirname(__file__), 'model.pkl')

_model = None


def get_model():
    global _model
    if _model is None:
        _model = joblib.load(MODEL_PATH)
    return _model


def predict_income(data: dict):
    model = get_model()

    features = [
        data["avg_orders"],
        data["payout_per_order"],
        data["working_hours"],
        data["city_factor"]
    ]

    pred = model.predict([features])[0]

    return {
        "expected_daily_income": round(float(pred), 2),
        "expected_weekly_income": round(float(pred) * 6, 2)
    }

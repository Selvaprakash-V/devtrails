import os
import joblib
import numpy as np
from sklearn.ensemble import RandomForestRegressor

MODEL_PATH = os.path.join(os.path.dirname(__file__), 'model.pkl')


def generate_synthetic(n=800, random_state=42):
    rng = np.random.RandomState(random_state)

    rainfall = rng.uniform(0, 120, size=n)          # mm
    temperature = rng.uniform(20, 45, size=n)       # realistic °C
    aqi = rng.uniform(50, 400, size=n)              # AQI
    traffic = rng.uniform(0, 100, size=n)           # congestion score
    month = rng.randint(1, 13, size=n)

    # Base risk formula
    risk = (
        0.4 * rainfall +
        0.25 * aqi +
        0.2 * temperature +
        0.15 * traffic
    )

    # Add seasonal effect (monsoon months)
    season_factor = np.where((month >= 6) & (month <= 9), 1.2, 1.0)
    risk = risk * season_factor

    # Normalize to 0–100
    risk = (risk - risk.min()) / (risk.max() - risk.min()) * 100

    # Add noise
    risk = np.clip(risk + rng.normal(0, 2, size=n), 0, 100)

    # Feature order: rainfall, temperature, aqi, traffic, month
    X = np.vstack([rainfall, temperature, aqi, traffic, month]).T
    y = risk

    return X, y


def train_and_save(n_samples=800):
    X, y = generate_synthetic(n_samples)

    model = RandomForestRegressor(
        n_estimators=120,
        max_depth=8,
        random_state=42
    )

    model.fit(X, y)

    joblib.dump(model, MODEL_PATH)
    print(f"✅ Model trained and saved to {MODEL_PATH}")


if __name__ == '__main__':
    train_and_save()
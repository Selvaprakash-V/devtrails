import os
import joblib
import numpy as np
from sklearn.ensemble import RandomForestRegressor

MODEL_PATH = os.path.join(os.path.dirname(__file__), 'model.pkl')


def generate_data(n=800):
    rng = np.random.RandomState(42)

    avg_orders = rng.randint(10, 30, size=n)
    payout_per_order = rng.uniform(20, 60, size=n)
    working_hours = rng.uniform(4, 10, size=n)
    city_factor = rng.uniform(0.8, 1.5, size=n)

    # income logic
    income = avg_orders * payout_per_order * city_factor

    # slight randomness
    income += rng.normal(0, 50, size=n)

    X = np.vstack([avg_orders, payout_per_order, working_hours, city_factor]).T
    y = income

    return X, y


def train():
    X, y = generate_data()

    model = RandomForestRegressor(n_estimators=100, random_state=42)
    model.fit(X, y)

    joblib.dump(model, MODEL_PATH)
    print("✅ Income model trained")


if __name__ == "__main__":
    train()

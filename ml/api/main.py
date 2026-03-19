from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import logging

from utils.feature_builder import get_features
from models.risk_model.predict import predict_risk
from models.income_model.predict import predict_income
from typing import Dict, Any
from api.environment_routes import router as environment_router


class TestRiskResponse(BaseModel):
    input: Dict[str, Any]
    result: Dict[str, Any]
from services.simulation_service import simulate_full_flow


logging.basicConfig(level=logging.INFO)
app = FastAPI()

app.include_router(environment_router)


class InputPayload(BaseModel):
    city: str
    lat: float | None = None
    lon: float | None = None


class IncomeInput(BaseModel):
    avg_orders: int
    payout_per_order: float
    working_hours: float
    city_factor: float


class SimulationInput(BaseModel):
    city: str
    lat: float
    lon: float


@app.on_event("startup")
def startup_event():
    logging.info("🚀 ML Risk Service Started")


@app.get('/health')
def health():
    return {'status': 'ok'}


@app.post('/predict-risk')
def predict_endpoint(payload: InputPayload):
    try:
        if not payload.city:
            raise HTTPException(status_code=400, detail="City is required")

        feats = get_features(payload.city, payload.lat, payload.lon)
        result = predict_risk(feats)

        return {
            "risk_score": result["risk_score"],
            "risk_level": result["risk_level"],
            "features": feats
        }

    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

    except Exception as e:
        logging.exception('Prediction failed')
        raise HTTPException(status_code=500, detail='prediction error')


@app.post('/predict-income')
def income_endpoint(payload: IncomeInput):
    try:
        result = predict_income(payload.dict())
        return result
    except Exception as e:
        logging.exception('Income prediction failed')
        raise HTTPException(status_code=500, detail='income prediction error')


@app.post('/test-risk', response_model=TestRiskResponse)
def test_risk():
    # For testing only: extreme scenario
    fake_data = {
        "rainfall": 90,
        "temperature": 42,
        "aqi": 350,
        "traffic": 80,
        "month": 7
    }

    try:
        result = predict_risk(fake_data)
        logging.info('Test risk result: %s', result)
        return {"input": fake_data, "result": result}
    except Exception as e:
        logging.exception('Test risk failed')
        raise HTTPException(status_code=500, detail='test risk failed')


@app.post('/simulate-full-flow')
def simulate_endpoint(payload: SimulationInput):
    try:
        result = simulate_full_flow(
            payload.city,
            payload.lat,
            payload.lon
        )
        return result

    except Exception as e:
        logging.exception("Simulation failed")
        raise HTTPException(status_code=500, detail="Simulation error")
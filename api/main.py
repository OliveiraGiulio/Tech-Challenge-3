from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from configs.config import settings
from api.schemas import HeartRequest, PredictionResponse
from api.prediction_service import PredictionService
from infra.postgres_repo import PostgresHeartRepository
from domain.entities import HeartRecord

app = FastAPI(title="Heart-Disease API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_methods=["POST"],
    allow_headers=["*"],
)

pred_svc = PredictionService(settings.MODEL_PATH)
repo = PostgresHeartRepository()

@app.post("/predict", response_model=PredictionResponse)
def predict(req: HeartRequest):
    prob, flag = pred_svc.predict(req.model_dump())
    # store for dashboard
    repo.bulk_upsert([HeartRecord(**req.model_dump(),
                                  HeartDisease=int(flag))])
    return {"probability": prob, "has_disease": flag}

import pandas as pd, joblib
from services.training_service import TrainingService
from infra.kaggle_loader import KaggleDatasetLoader
from configs.config import settings, Path

df = KaggleDatasetLoader().load()
TrainingService().fit_and_save(df, settings.MODEL_PATH)
print(f"model saved → {settings.MODEL_PATH}")

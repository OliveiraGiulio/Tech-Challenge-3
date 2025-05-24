import joblib
import numpy as np
import pandas as pd 
from pathlib import Path

class PredictionService:
    def __init__(self, model_path: Path):
        self._pipe = joblib.load(model_path)

    def predict(self, payload: dict) -> tuple[float, bool]:

        X = pd.DataFrame([payload])
        prob = float(self._pipe.predict_proba(X)[0, 1])
        return prob, prob >= 0.5

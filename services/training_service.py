from pathlib import Path
import joblib
import pandas as pd
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import OneHotEncoder
from sklearn.impute import SimpleImputer
from sklearn.pipeline import Pipeline
from sklearn.ensemble import RandomForestClassifier
from configs.config import settings

_NUM = ["Age", "RestingBP", "Cholesterol", "MaxHR", "Oldpeak"]
_CAT = ["Sex", "ChestPainType", "FastingBS",
        "RestingECG", "ExerciseAngina", "ST_Slope"]


class TrainingService:

    def fit_and_save(self, df: pd.DataFrame, model_path: Path) -> Path:
        y = df.pop("HeartDisease")

        pre = ColumnTransformer([
            ("num", SimpleImputer(strategy="median"), _NUM),
            ("cat", Pipeline([
                ("imputer", SimpleImputer(strategy="most_frequent")),
                ("ohe", OneHotEncoder(handle_unknown="ignore"))
            ]), _CAT)
        ])

        model = RandomForestClassifier(
            n_estimators=600,          
            max_depth=None,            
            min_samples_leaf=2,        
            class_weight="balanced",   
            n_jobs=-1,                 
            random_state=42
        )

        pipe = Pipeline([
            ("pre", pre),              
            ("model", model)           
        ])

        pipe.fit(df, y)
        model_path.parent.mkdir(exist_ok=True, parents=True)
        joblib.dump(pipe, model_path)
        return model_path

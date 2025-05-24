import kagglehub
import pandas as pd
from pathlib import Path
from domain.ports import DatasetLoader
from kagglehub import KaggleDatasetAdapter

class KaggleDatasetLoader(DatasetLoader):

    _DATASET = "fedesoriano/heart-failure-prediction"
    _CSV = "heart.csv"

    def load(self) -> pd.DataFrame:
        df = kagglehub.dataset_load(
            KaggleDatasetAdapter.PANDAS,
            self._DATASET,
            self._CSV,
        )
        df["Cholesterol"] = (df['Cholesterol'].replace(0, pd.NA)).astype("Int64")
        df["RestingBP"] = (df['RestingBP'].replace(0, pd.NA)).astype("Int64")      
        return df
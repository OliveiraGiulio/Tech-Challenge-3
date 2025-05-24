from pathlib import Path
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    DB_URL: str
    KAGGLE_USERNAME: str
    KAGGLE_KEY: str
    MODEL_PATH: Path = Path("models/heart_model.pkl")

    class Config:
        env_file = ".env"

settings = Settings()
from pydantic import BaseModel, Field

class HeartRequest(BaseModel):
    Age: int
    Sex: str
    ChestPainType: str
    RestingBP: int | None = Field(..., ge=0)
    Cholesterol: int | None
    FastingBS: int
    RestingECG: str
    MaxHR: int
    ExerciseAngina: str
    Oldpeak: float
    ST_Slope: str

class PredictionResponse(BaseModel):
    probability: float
    has_disease: bool

from pydantic import BaseModel

class HeartRecord(BaseModel):
    Age: int
    Sex: str
    ChestPainType: str
    RestingBP: int | None
    Cholesterol: int | None
    FastingBS: int
    RestingECG: str
    MaxHR: int
    ExerciseAngina: str
    Oldpeak: float
    ST_Slope: str
    HeartDisease: int | None = None

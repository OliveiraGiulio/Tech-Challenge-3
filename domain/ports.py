import pandas as pd
from abc import ABC, abstractmethod
from typing import Iterable

class DatasetLoader(ABC):
    @abstractmethod
    def load(self) -> pd.DataFrame: ...

class HeartRepository(ABC):
    @abstractmethod
    def bulk_upsert(self, records: Iterable["HeartRecord"]) -> None: ...

from typing import List
from domain.entities import HeartRecord
from domain.ports import DatasetLoader, HeartRepository

class HeartETLService:
    def __init__(self, loader: DatasetLoader, repo: HeartRepository):
        self.loader, self.repo = loader, repo

    def run(self) -> None:
        df = self.loader.load()
        records: List[HeartRecord] = [HeartRecord(**row) for row in df.to_dict("records")]
        self.repo.bulk_upsert(records)
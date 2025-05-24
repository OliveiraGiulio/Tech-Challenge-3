from infra.kaggle_loader import KaggleDatasetLoader
from infra.postgres_repo import PostgresHeartRepository, pool
from services.etl_service import HeartETLService

try:
    HeartETLService(KaggleDatasetLoader(), PostgresHeartRepository()).run()
finally:
    pool.close()
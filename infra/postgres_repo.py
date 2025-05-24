from __future__ import annotations
from typing import Iterable, Sequence

import psycopg
from psycopg_pool import ConnectionPool

from configs.config import settings
from domain.entities import HeartRecord
from domain.ports import HeartRepository

pool = ConnectionPool(
    conninfo = settings.DB_URL,
    min_size=1,
    max_size=4,
    timeout=10,
    open=False,
    )
pool.open()

class PostgresHeartRepository(HeartRepository):
    """

    Table DDL (run once):

        CREATE TABLE heart_raw (
            id           SERIAL PRIMARY KEY,
            age          INT     NOT NULL,
            sex          TEXT    NOT NULL,
            chest_pain   TEXT    NOT NULL,
            resting_bp   INT,
            cholesterol  INT,
            fasting_bs   INT     NOT NULL,
            resting_ecg  TEXT    NOT NULL,
            max_hr       INT     NOT NULL,
            exercise_angina TEXT NOT NULL,
            oldpeak      DOUBLE PRECISION NOT NULL,
            st_slope     TEXT    NOT NULL,
            heart_disease INT,
            UNIQUE (age, sex, chest_pain, resting_bp,
                    cholesterol, fasting_bs, resting_ecg,
                    max_hr, exercise_angina, oldpeak, st_slope)
        );

        DROP INDEX IF EXISTS heart_raw_uniq;
        CREATE UNIQUE INDEX heart_raw_uniq ON heart_raw (
            age, sex, chest_pain,
            COALESCE(resting_bp, -1),
            COALESCE(cholesterol, -1),
            fasting_bs, resting_ecg, max_hr,
            exercise_angina, oldpeak, st_slope
        );
    """

    _TABLE = "heart_raw"
    _COLS: Sequence[str] = (
        "age", "sex", "chest_pain", "resting_bp", "cholesterol",
        "fasting_bs", "resting_ecg", "max_hr", "exercise_angina",
        "oldpeak", "st_slope", "heart_disease"
    )

    def bulk_upsert(self, records: Iterable[HeartRecord]) -> None:

        data = [
            (
                r.Age,
                r.Sex,
                r.ChestPainType,
                r.RestingBP,
                r.Cholesterol,
                r.FastingBS,
                r.RestingECG,
                r.MaxHR,
                r.ExerciseAngina,
                r.Oldpeak,
                r.ST_Slope,
                r.HeartDisease,
            )
            for r in records
        ]

        if not data:
            return

        placeholders = ", ".join(["%s"] * len(self._COLS))
        columns = ", ".join(self._COLS)

        conflict_cols = (
            "age, sex, chest_pain, resting_bp, cholesterol, fasting_bs, "
            "resting_ecg, max_hr, exercise_angina, oldpeak, st_slope"
        )

        sql = (
            f"INSERT INTO {self._TABLE} ({columns}) VALUES ({placeholders})"
            f" ON CONFLICT ({conflict_cols}) "
            f" DO UPDATE SET heart_disease = EXCLUDED.heart_disease"
        )

        with pool.connection() as conn:
            with conn.cursor() as cur:
                cur.executemany(sql, data)
            conn.commit()

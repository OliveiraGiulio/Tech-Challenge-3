import psycopg, os
from psycopg_pool import ConnectionPool
from configs.config import settings

DDL = """CREATE TABLE heart_raw (
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

pool = ConnectionPool(conninfo=settings.DB_URL, min_size=1, max_size=1)
pool.open() 
with pool.connection() as conn:
     conn.execute(DDL) 
     conn.commit() 
     print("✓ Schema ready")
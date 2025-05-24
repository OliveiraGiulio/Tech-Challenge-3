# Heart-Disease Prediction Service

> **FastAPI + Next.js + PostgreSQL**  
> A production-ready mini-platform that predicts the probability of heart
> disease from basic clinical parameters and shows the results on an
> interactive dashboard.
---

## Quick start (local)

### 1 Prerequisites

* Python ≥ 3.11, Node ≥ 18, Git
* PostgreSQL running locally **or** a cloud URL (Neon, Supabase, …)
* Kaggle API credentials (`kaggle.json`)

### 2 Clone & set up

```bash
git clone https://github.com/OliveiraGiulio/Tech-Challenge-3.git
cd Tech-Challenge-3

# Python
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt

# Node (dashboard)
cd dashboards/nextjs-dashboard
npm install
cd ../..
```

### 3 .env at repo root
```bash
DB_URL=postgresql://user:pass@localhost:5432/heart?sslmode=disable
KAGGLE_USERNAME=<your_kg_user>
KAGGLE_KEY=<your_kg_key>
MODEL_PATH=models/heart_model.pkl
```
### 4 Run once
```bash
python scripts/init_db.py        # creates table if needed
python scripts/load_to_db.py     # Kaggle → Postgres
python scripts/train.py          # writes models/heart_model.pkl
```
### 5 Run the stack
```bash
# in one terminal
uvicorn api.main:app --reload --port 8000

# in another
cd dashboards/nextjs-dashboard
npm run dev
```
### 6 Go to the localhost API and Dashboard
## API -> http://127.0.0.1:8000/docs#/default/predict_predict_post
## Dashboard -> http://localhost:3000/

### 7 Fill the dashboard with data
![image](https://github.com/user-attachments/assets/59526ce5-8e64-4864-ab88-9fa1f0d2ab79)



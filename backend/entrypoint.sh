#!/usr/bin/env bash
set -euo pipefail

echo "[backend] Waiting for database..."

python - <<'PY'
import os, time, psycopg2

retries = 30
for i in range(retries):
    try:
        conn = psycopg2.connect(
            dbname=os.getenv("POSTGRES_DB"),
            user=os.getenv("POSTGRES_USER"),
            password=os.getenv("POSTGRES_PASSWORD"),
            host=os.getenv("POSTGRES_HOST"),
            port=os.getenv("POSTGRES_PORT")
        )
        conn.close()
        print("[backend] Database is ready")
        break
    except Exception as e:
        print(f"[backend] DB not ready yet ({i+1}/{retries}): {e}")
        time.sleep(2)
else:
    raise SystemExit("DB not ready after retries")
PY

echo "[backend] Running Alembic migrations..."
export PYTHONPATH=/app
cd /app/alembic
alembic upgrade head

echo "[backend] Starting FastAPI app..."
cd /app
exec uvicorn app:app --host 0.0.0.0 --port 8000 --reload

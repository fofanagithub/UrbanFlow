import json
import os

from fastapi import FastAPI, Depends, HTTPException, Query, Header
from sqlalchemy.orm import Session

from models.base import get_db
from models.crud import (
    create_decision,
    create_sensor_reading,
    get_latest_decision,
    get_recent_decisions,
)
from schemas import DecisionCreate, DecisionOut, DecisionsList, IngestPayload


app = FastAPI(title="UrbanFlow Backend", version="0.2.0")


def _serialize_decision(row) -> DecisionOut:
    summary = row.decision
    set_green = None
    reason = None

    if row.decision:
        try:
            parsed = json.loads(row.decision)
            if isinstance(parsed, dict):
                summary = parsed.get("summary", summary)
                set_green = parsed.get("set_green_duration_s")
                reason = parsed.get("reason")
        except json.JSONDecodeError:
            pass

    return DecisionOut(
        sensor_id=row.sensor_id,
        decision=summary,
        timestamp=str(row.timestamp),
        tx_id=row.tx_id,
        set_green_duration_s=set_green,
        reason=reason,
    )


@app.get("/health")
def health():
    return {"status": "ok"}


@app.post("/ingest")
def ingest(payload: IngestPayload, db: Session = Depends(get_db)):
    rec = create_sensor_reading(db, payload.sensor_id, payload.queue_len, payload.payload)
    return {"id": rec.id, "status": "inserted"}


@app.post("/decisions", response_model=DecisionOut, status_code=201)
def submit_decision(
    payload: DecisionCreate,
    db: Session = Depends(get_db),
    api_key: str | None = Header(default=None, alias="x-api-key"),
):
    expected_key = os.getenv("URBANFLOW_API_KEY")
    if expected_key and api_key != expected_key:
        raise HTTPException(status_code=401, detail="Invalid API key")

    decision_payload = {
        "summary": f"set_green_duration_s={payload.set_green_duration_s}s",
        "set_green_duration_s": payload.set_green_duration_s,
        "reason": payload.reason,
    }

    row = create_decision(db, payload.intersection_id, decision_payload)
    return _serialize_decision(row)


@app.get("/decisions/{sensor_id}", response_model=DecisionOut)
def latest_decision(sensor_id: str, db: Session = Depends(get_db)):
    row = get_latest_decision(db, sensor_id)
    if not row:
        raise HTTPException(404, detail="No decision yet")
    return _serialize_decision(row)


@app.get("/decisions", response_model=DecisionsList)
def list_decisions(
    minutes: int = Query(5, ge=1, le=1440),
    limit: int = Query(50, ge=1, le=500),
    db: Session = Depends(get_db),
):
    rows = get_recent_decisions(db, minutes=minutes, limit=limit)
    items = [_serialize_decision(r) for r in rows]
    return {"items": items}

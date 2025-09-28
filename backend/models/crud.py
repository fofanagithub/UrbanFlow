import json
from sqlalchemy.orm import Session
from sqlalchemy import and_, func
from sqlalchemy import select, desc
from .entities import SensorReading, Decision
from datetime import datetime, timedelta, timezone
from typing import List, Any



def get_recent_decisions(db: Session, minutes: int = 5, limit: int = 50):
    cutoff = datetime.now(timezone.utc) - timedelta(minutes=minutes)
    stmt = (
        select(Decision)
        .where(Decision.timestamp >= cutoff)
        .order_by(desc(Decision.timestamp))
        .limit(limit)
    )
    return list(db.execute(stmt).scalars().all())

def get_unpublished_decisions(db: Session, minutes: int = 10, limit: int = 100):
    cutoff = datetime.now(timezone.utc) - timedelta(minutes=minutes)
    stmt = (
        select(Decision)
        .where(and_(Decision.tx_id.is_(None), Decision.timestamp >= cutoff))
        .order_by(desc(Decision.timestamp))
        .limit(limit)
    )
    return list(db.execute(stmt).scalars().all())

def set_decision_tx(db: Session, decision_id: int, tx_id: str):
    d = db.get(Decision, decision_id)
    if not d:
        return None
    d.tx_id = tx_id
    db.add(d)
    db.commit()
    db.refresh(d)
    return d

def create_sensor_reading(db: Session, sensor_id: str, queue_len: float, payload: dict | None):
    r = SensorReading(sensor_id=sensor_id, queue_len=queue_len, payload=payload)
    db.add(r)
    db.commit()
    db.refresh(r)
    return r


def get_latest_decision(db: Session, sensor_id: str):
    stmt = select(Decision).where(Decision.sensor_id==sensor_id).order_by(desc(Decision.timestamp)).limit(1)
    return db.execute(stmt).scalars().first()


def create_decision(db: Session, sensor_id: str, payload: dict[str, Any]):
    record = Decision(sensor_id=sensor_id, decision=json.dumps(payload))
    db.add(record)
    db.commit()
    db.refresh(record)
    return record

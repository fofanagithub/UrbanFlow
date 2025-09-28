from sqlalchemy import Integer, String, Float, TIMESTAMP, text
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import Mapped, mapped_column
from .base import Base


class SensorReading(Base):
    __tablename__ = "sensor_readings"
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    sensor_id: Mapped[str] = mapped_column(String, index=True, nullable=False)
    queue_len: Mapped[float] = mapped_column(Float, nullable=False)
    payload: Mapped[dict | None] = mapped_column(JSONB, nullable=True)
    timestamp: Mapped[str] = mapped_column(TIMESTAMP(timezone=True), server_default=text("NOW()"), index=True)


class Decision(Base):
    __tablename__ = "decisions"
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    sensor_id: Mapped[str] = mapped_column(String, index=True, nullable=False)
    decision: Mapped[str] = mapped_column(String, nullable=False)
    tx_id: Mapped[str | None] = mapped_column(String, index=True, nullable=True) # <-- NEW
    timestamp: Mapped[str] = mapped_column(TIMESTAMP(timezone=True), server_default=text("NOW()"), index=True)
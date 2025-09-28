from pydantic import BaseModel, Field
from typing import Any, Optional, List


class IngestPayload(BaseModel):
    sensor_id: str = Field(..., examples=["sensor_a"])
    queue_len: float = Field(..., ge=0, examples=[12])
    payload: Optional[dict[str, Any]] = None


class DecisionOut(BaseModel):
    sensor_id: str
    decision: str
    timestamp: str
    tx_id: str | None = None
    set_green_duration_s: float | None = None
    reason: str | None = None


class DecisionsList(BaseModel):
    items: List[DecisionOut]


class DecisionCreate(BaseModel):
    intersection_id: str = Field(..., examples=["RIVIERA-12"])
    set_green_duration_s: float = Field(..., ge=0, description="Durée proposée du feu vert en secondes")
    reason: Optional[str] = Field(None, description="Justification facultative fournie par l'agent")

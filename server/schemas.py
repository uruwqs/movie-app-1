from pydantic import BaseModel
from datetime import datetime
from typing import Optional


# --- Измерения ---
class ReadingResponse(BaseModel):
    id: int
    measured_at: datetime
    location: str
    temperature: float
    brightness: Optional[str] = None
    noise: Optional[str] = None

    class Config:
        from_attributes = True


# --- Аналитика / Summary ---
class ReadingShort(BaseModel):
    temperature: float
    brightness: Optional[str] = None
    noise: Optional[str] = None
    measured_at: datetime

    class Config:
        from_attributes = True


class Stats(BaseModel):
    min_temp: float
    max_temp: float
    avg_temp: float


class SummaryResponse(BaseModel):
    latest_atrium: Optional[ReadingShort] = None
    latest_outside: Optional[ReadingShort] = None
    status_text: str
    stats_today: Stats
    health_warning: Optional[str] = None
    analytical_insight: str


# --- Отзывы / Reports ---
class ReportCreate(BaseModel):
    category: str
    comment: Optional[str] = None


class ReportUpdate(BaseModel):
    status: Optional[str] = None
    comment: Optional[str] = None


class ReportResponse(BaseModel):
    id: int
    created_at: datetime
    category: str
    comment: Optional[str] = None
    status: str

    class Config:
        from_attributes = True

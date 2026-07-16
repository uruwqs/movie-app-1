from datetime import datetime, date
from typing import List, Optional

from fastapi import Depends, FastAPI, HTTPException, Query, status
from sqlalchemy import func
from sqlalchemy.orm import Session

import database
import schemas

# Создаем таблицы в SQLite
database.Base.metadata.create_all(bind=database.engine)

app = FastAPI(title="Atrium Comfort API")


# ---------------------------------------------------------
# 1. GET /api/readings (с валидацией сортировки, фильтрами и пагинацией)
# ---------------------------------------------------------
@app.get("/api/readings", response_model=List[schemas.ReadingResponse])
def get_readings(
    location: Optional[str] = Query(None, description="atrium или outside"),
    date_from: Optional[datetime] = Query(None, description="Начальная дата (ISO)"),
    date_to: Optional[datetime] = Query(None, description="Конечная дата (ISO)"),
    noise_level: Optional[str] = Query(
        None, description="Фильтр шума (например Quiet, Noisy)"
    ),
    sort_by: Optional[str] = Query(
        "measured_at", description="measured_at или temperature"
    ),
    order: Optional[str] = Query("desc", description="asc или desc"),
    limit: int = Query(100, ge=1, le=1000),
    offset: int = Query(0, ge=0),
    db: Session = Depends(database.get_db),
):
    # Валидация параметров сортировки
    if sort_by not in ["measured_at", "temperature"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Недопустимое значение sort_by. Разрешено: 'measured_at', 'temperature'",
        )
    if order not in ["asc", "desc"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Недопустимое значение order. Разрешено: 'asc', 'desc'",
        )

    query = db.query(database.ReadingDB)

    # Фильтрация
    if location:
        query = query.filter(database.ReadingDB.location == location)
    if date_from:
        query = query.filter(database.ReadingDB.measured_at >= date_from)
    if date_to:
        query = query.filter(database.ReadingDB.measured_at <= date_to)
    if noise_level:
        query = query.filter(database.ReadingDB.noise.ilike(f"%{noise_level}%"))

    # Сортировка
    sort_column = (
        database.ReadingDB.temperature
        if sort_by == "temperature"
        else database.ReadingDB.measured_at
    )
    if order == "asc":
        query = query.order_by(sort_column.asc())
    else:
        query = query.order_by(sort_column.desc())

    # Пагинация
    return query.offset(offset).limit(limit).all()


# ---------------------------------------------------------
# 2. GET /api/readings/{id}
# ---------------------------------------------------------
@app.get("/api/readings/{id}", response_model=schemas.ReadingResponse)
def get_reading_by_id(id: int, db: Session = Depends(database.get_db)):
    reading = db.query(database.ReadingDB).filter(database.ReadingDB.id == id).first()
    if not reading:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Reading not found"
        )
    return reading


# ---------------------------------------------------------
# 3. GET /api/summary
# ---------------------------------------------------------
@app.get("/api/summary", response_model=schemas.SummaryResponse)
def get_summary(
    selected_date: Optional[date] = Query(None),
    db: Session = Depends(database.get_db),
):
    latest_atrium = (
        db.query(database.ReadingDB)
        .filter(database.ReadingDB.location == "atrium")
        .order_by(database.ReadingDB.measured_at.desc())
        .first()
    )

    latest_outside = (
        db.query(database.ReadingDB)
        .filter(database.ReadingDB.location == "outside")
        .order_by(database.ReadingDB.measured_at.desc())
        .first()
    )
    # ---------------------------------------------------------
    # Итоговая оценка состояния
    # ---------------------------------------------------------

    if latest_atrium:
        temp = latest_atrium.temperature
        noise = (latest_atrium.noise or "").lower()

        statuses = []

        # Температура
        if temp >= 30:
            statuses.append("Очень жарко")
        elif temp >= 26:
            statuses.append("Жарко")
        elif temp < 18:
            statuses.append("Прохладно")
        else:
            statuses.append("Комфортно")

        # Шум
        if "quiet" in noise:
            statuses.append("Тихо")
        elif "noisy" in noise or "loud" in noise or "mild" in noise:
            statuses.append("Шумно")

        # Общая рекомендация
        if 18 <= temp <= 26 and "quiet" in noise:
            statuses.append("Подходит для учёбы")
        else:
            statuses.append("Лучше выбрать другое место")

        status_text = " • ".join(statuses)

    else:
        status_text = "Нет данных"

    # Статистика за всё время для атриума

    # Статистика за всё время / за выбранный день
    stats_query = db.query(
        func.min(database.ReadingDB.temperature).label("min_temp"),
        func.max(database.ReadingDB.temperature).label("max_temp"),
        func.avg(database.ReadingDB.temperature).label("avg_temp"),
    ).filter(database.ReadingDB.location == "atrium")

    # Если пользователь выбрал дату — считаем только за неё
    if selected_date is not None:
        stats_query = stats_query.filter(
            func.date(database.ReadingDB.measured_at) == selected_date
        )

    stats = stats_query.first()

    # Проверка значений через is not None
    min_t = round(stats.min_temp, 1) if (stats and stats.min_temp is not None) else 0.0
    max_t = round(stats.max_temp, 1) if (stats and stats.max_temp is not None) else 0.0
    avg_t = round(stats.avg_temp, 1) if (stats and stats.avg_temp is not None) else 0.0

    # Безопасное формирование аналитики
    if latest_atrium is not None and latest_outside is not None:
        diff = round(latest_atrium.temperature - latest_outside.temperature, 1)
        if diff > 0:
            insight = f"В атриуме сейчас на {diff}°C тепле, чем на улице."
        elif diff < 0:
            insight = f"В атриуме сейчас на {abs(diff)}°C прохладнее, чем на улице."
        else:
            insight = "Температура в атриуме и на улице одинаковая."
    else:
        insight = "Недостаточно данных для анализа."

        # ---------------------------------------------------------
    # Health Warning
    # ---------------------------------------------------------

    health_warning = None

    if latest_atrium is not None and latest_outside is not None:
        temperature_difference = abs(
            latest_atrium.temperature - latest_outside.temperature
        )

        if temperature_difference >= 10:
            health_warning = (
                "⚠️ Большой перепад температуры между помещением и улицей. "
                "При выходе рекомендуется дать организму несколько минут адаптироваться."
            )
        elif latest_outside.temperature >= 35:
            health_warning = (
                "☀️ На улице очень жарко. "
                "Рекомендуется пить больше воды и избегать длительного пребывания на солнце."
            )

    return schemas.SummaryResponse(
        latest_atrium=latest_atrium,
        latest_outside=latest_outside,
        status_text=status_text,
        stats_today=schemas.Stats(
            min_temp=min_t,
            max_temp=max_t,
            avg_temp=avg_t,
        ),
        analytical_insight=insight,
        health_warning=health_warning,
    )


# ---------------------------------------------------------
# 4. REPORTS (CRUD для отзывов)
# ---------------------------------------------------------


@app.get("/api/reports", response_model=List[schemas.ReportResponse])
def get_reports(db: Session = Depends(database.get_db)):
    return (
        db.query(database.ReportDB).order_by(database.ReportDB.created_at.desc()).all()
    )


@app.post(
    "/api/reports",
    response_model=schemas.ReportResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_report(
    report_data: schemas.ReportCreate, db: Session = Depends(database.get_db)
):
    new_report = database.ReportDB(**report_data.model_dump())
    db.add(new_report)

    try:
        db.commit()
        db.refresh(new_report)
        return new_report
    except Exception:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Ошибка при сохранении отзыва в базу данных.",
        )


@app.patch("/api/reports/{id}", response_model=schemas.ReportResponse)
@app.put("/api/reports/{id}", response_model=schemas.ReportResponse)
def update_report(
    id: int, report_data: schemas.ReportUpdate, db: Session = Depends(database.get_db)
):
    report = db.query(database.ReportDB).filter(database.ReportDB.id == id).first()
    if not report:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Report not found",
        )

    if report_data.status is not None:
        report.status = report_data.status
    if report_data.comment is not None:
        report.comment = report_data.comment

    try:
        db.commit()
        db.refresh(report)
        return report
    except Exception:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Ошибка при обновлении отзыва в базе данных.",
        )


@app.delete("/api/reports/{id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_report(id: int, db: Session = Depends(database.get_db)):
    report = db.query(database.ReportDB).filter(database.ReportDB.id == id).first()
    if not report:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Report not found",
        )
    try:
        db.delete(report)
        db.commit()
        return None
    except Exception:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Ошибка при удалении отзыва из базы данных.",
        )

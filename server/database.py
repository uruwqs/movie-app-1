from sqlalchemy import create_engine, Column, Integer, String, Float, DateTime
from sqlalchemy.orm import declarative_base, sessionmaker

# SQLite database
SQLALCHEMY_DATABASE_URL = "sqlite:///./db.sqlite"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False},
)

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine,
)

Base = declarative_base()


# -----------------------------
# Sensor Readings
# -----------------------------
class ReadingDB(Base):
    __tablename__ = "readings"

    id = Column(Integer, primary_key=True, index=True)
    measured_at = Column(DateTime, index=True, nullable=False)
    location = Column(String, nullable=False)
    temperature = Column(Float, nullable=False)

    # Если по заданию нужны категории Quiet/Normal/Noisy,
    # оставьте String.
    brightness = Column(String, nullable=True)
    noise = Column(String, nullable=True)


# -----------------------------
# User Reports
# -----------------------------
class ReportDB(Base):
    __tablename__ = "reports"

    id = Column(Integer, primary_key=True, index=True)
    created_at = Column(DateTime, index=True, nullable=False)
    category = Column(String, nullable=False)
    comment = Column(String, nullable=True)
    status = Column(String, default="open", nullable=False)


# -----------------------------
# Database session
# -----------------------------
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

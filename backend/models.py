from sqlalchemy import Column, Integer, String, Float, Date, Text, DateTime
from sqlalchemy.sql import func
from database import Base


class Patient(Base):
    __tablename__ = "patients"

    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String(150), nullable=False)
    date_of_birth = Column(Date, nullable=False)
    email = Column(String(255), unique=True, nullable=False, index=True)
    glucose = Column(Float, nullable=False)        # mg/dL
    haemoglobin = Column(Float, nullable=False)    # g/dL
    cholesterol = Column(Float, nullable=False)    # mg/dL
    remarks = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

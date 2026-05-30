from pydantic import BaseModel, EmailStr, field_validator, model_validator
from typing import Optional
from datetime import date, datetime


class PatientBase(BaseModel):
    full_name: str
    date_of_birth: date
    email: EmailStr
    glucose: float
    haemoglobin: float
    cholesterol: float

    @field_validator("full_name")
    @classmethod
    def validate_full_name(cls, v):
        v = v.strip()
        if len(v) < 2:
            raise ValueError("Full name must be at least 2 characters")
        if len(v) > 150:
            raise ValueError("Full name must be at most 150 characters")
        return v

    @field_validator("date_of_birth")
    @classmethod
    def validate_dob(cls, v):
        if v >= date.today():
            raise ValueError("Date of birth cannot be today or a future date")
        if v.year < 1900:
            raise ValueError("Date of birth seems too far in the past")
        return v

    @field_validator("glucose")
    @classmethod
    def validate_glucose(cls, v):
        if v < 0 or v > 1000:
            raise ValueError("Glucose must be between 0 and 1000 mg/dL")
        return round(v, 2)

    @field_validator("haemoglobin")
    @classmethod
    def validate_haemoglobin(cls, v):
        if v < 0 or v > 25:
            raise ValueError("Haemoglobin must be between 0 and 25 g/dL")
        return round(v, 2)

    @field_validator("cholesterol")
    @classmethod
    def validate_cholesterol(cls, v):
        if v < 0 or v > 1000:
            raise ValueError("Cholesterol must be between 0 and 1000 mg/dL")
        return round(v, 2)


class PatientCreate(PatientBase):
    pass


class PatientUpdate(BaseModel):
    full_name: Optional[str] = None
    date_of_birth: Optional[date] = None
    email: Optional[EmailStr] = None
    glucose: Optional[float] = None
    haemoglobin: Optional[float] = None
    cholesterol: Optional[float] = None

    @field_validator("full_name")
    @classmethod
    def validate_full_name(cls, v):
        if v is not None:
            v = v.strip()
            if len(v) < 2:
                raise ValueError("Full name must be at least 2 characters")
        return v

    @field_validator("date_of_birth")
    @classmethod
    def validate_dob(cls, v):
        if v is not None and v >= date.today():
            raise ValueError("Date of birth cannot be today or a future date")
        return v

    @field_validator("glucose")
    @classmethod
    def validate_glucose(cls, v):
        if v is not None and (v < 0 or v > 1000):
            raise ValueError("Glucose must be between 0 and 1000 mg/dL")
        return round(v, 2) if v is not None else v

    @field_validator("haemoglobin")
    @classmethod
    def validate_haemoglobin(cls, v):
        if v is not None and (v < 0 or v > 25):
            raise ValueError("Haemoglobin must be between 0 and 25 g/dL")
        return round(v, 2) if v is not None else v

    @field_validator("cholesterol")
    @classmethod
    def validate_cholesterol(cls, v):
        if v is not None and (v < 0 or v > 1000):
            raise ValueError("Cholesterol must be between 0 and 1000 mg/dL")
        return round(v, 2) if v is not None else v


class PatientResponse(PatientBase):
    id: int
    remarks: Optional[str] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

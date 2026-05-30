from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List
import uvicorn

from database import Base, engine, get_db
from models import Patient
from schemas import PatientCreate, PatientUpdate, PatientResponse
from ai_service import get_health_prediction

Base.metadata.create_all(bind=engine)

app = FastAPI(title="HealthPredict API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root():
    return {"message": "HealthPredict API is running", "version": "1.0.0"}


@app.get("/patients", response_model=List[PatientResponse])
def get_all_patients(db: Session = Depends(get_db)):
    patients = db.query(Patient).order_by(Patient.created_at.desc()).all()
    return patients


@app.get("/patients/{patient_id}", response_model=PatientResponse)
def get_patient(patient_id: int, db: Session = Depends(get_db)):
    patient = db.query(Patient).filter(Patient.id == patient_id).first()
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")
    return patient


@app.post("/patients", response_model=PatientResponse, status_code=201)
async def create_patient(patient_data: PatientCreate, db: Session = Depends(get_db)):
    # Check for duplicate email
    existing = db.query(Patient).filter(Patient.email == patient_data.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")

    # Get AI prediction
    remarks = await get_health_prediction(
        full_name=patient_data.full_name,
        date_of_birth=str(patient_data.date_of_birth),
        glucose=patient_data.glucose,
        haemoglobin=patient_data.haemoglobin,
        cholesterol=patient_data.cholesterol,
    )

    patient = Patient(
        full_name=patient_data.full_name,
        date_of_birth=patient_data.date_of_birth,
        email=patient_data.email,
        glucose=patient_data.glucose,
        haemoglobin=patient_data.haemoglobin,
        cholesterol=patient_data.cholesterol,
        remarks=remarks,
    )
    db.add(patient)
    db.commit()
    db.refresh(patient)
    return patient


@app.put("/patients/{patient_id}", response_model=PatientResponse)
async def update_patient(patient_id: int, patient_data: PatientUpdate, db: Session = Depends(get_db)):
    patient = db.query(Patient).filter(Patient.id == patient_id).first()
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")

    # Check email conflict on update
    if patient_data.email and patient_data.email != patient.email:
        existing = db.query(Patient).filter(Patient.email == patient_data.email).first()
        if existing:
            raise HTTPException(status_code=400, detail="Email already registered")

    update_fields = patient_data.dict(exclude_unset=True)

    # Re-run AI if blood values changed
    blood_fields = {"glucose", "haemoglobin", "cholesterol"}
    if blood_fields.intersection(update_fields.keys()):
        glucose = update_fields.get("glucose", patient.glucose)
        haemoglobin = update_fields.get("haemoglobin", patient.haemoglobin)
        cholesterol = update_fields.get("cholesterol", patient.cholesterol)
        full_name = update_fields.get("full_name", patient.full_name)
        dob = update_fields.get("date_of_birth", patient.date_of_birth)

        update_fields["remarks"] = await get_health_prediction(
            full_name=full_name,
            date_of_birth=str(dob),
            glucose=glucose,
            haemoglobin=haemoglobin,
            cholesterol=cholesterol,
        )

    for key, value in update_fields.items():
        setattr(patient, key, value)

    db.commit()
    db.refresh(patient)
    return patient


@app.delete("/patients/{patient_id}", status_code=204)
def delete_patient(patient_id: int, db: Session = Depends(get_db)):
    patient = db.query(Patient).filter(Patient.id == patient_id).first()
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")
    db.delete(patient)
    db.commit()
    return None


@app.get("/health")
def health_check():
    return {"status": "healthy"}


if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)

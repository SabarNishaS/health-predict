import React, { useState, useEffect } from "react";

const INITIAL_FORM = {
  full_name: "",
  date_of_birth: "",
  email: "",
  glucose: "",
  haemoglobin: "",
  cholesterol: "",
};

const REFERENCE = [
  { label: "Glucose", normal: "70–99 mg/dL (fasting)" },
  { label: "Haemoglobin", normal: "M: 13.5–17.5 | F: 12.0–15.5 g/dL" },
  { label: "Cholesterol", normal: "<200 mg/dL (desirable)" },
];

export default function PatientModal({ patient, onSubmit, onClose, aiLoading }) {
  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (patient) {
      setForm({
        full_name: patient.full_name || "",
        date_of_birth: patient.date_of_birth || "",
        email: patient.email || "",
        glucose: patient.glucose ?? "",
        haemoglobin: patient.haemoglobin ?? "",
        cholesterol: patient.cholesterol ?? "",
      });
    } else {
      setForm(INITIAL_FORM);
    }
    setErrors({});
  }, [patient]);

  const validate = () => {
    const errs = {};
    if (!form.full_name.trim() || form.full_name.trim().length < 2)
      errs.full_name = "Full name must be at least 2 characters.";

    if (!form.date_of_birth)
      errs.date_of_birth = "Date of birth is required.";
    else if (new Date(form.date_of_birth) >= new Date())
      errs.date_of_birth = "Date of birth cannot be today or in the future.";

    if (!form.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      errs.email = "A valid email address is required.";

    const glucose = parseFloat(form.glucose);
    if (form.glucose === "" || isNaN(glucose))
      errs.glucose = "Glucose must be a number.";
    else if (glucose < 0 || glucose > 1000)
      errs.glucose = "Glucose must be between 0 and 1000 mg/dL.";

    const hb = parseFloat(form.haemoglobin);
    if (form.haemoglobin === "" || isNaN(hb))
      errs.haemoglobin = "Haemoglobin must be a number.";
    else if (hb < 0 || hb > 25)
      errs.haemoglobin = "Haemoglobin must be between 0 and 25 g/dL.";

    const chol = parseFloat(form.cholesterol);
    if (form.cholesterol === "" || isNaN(chol))
      errs.cholesterol = "Cholesterol must be a number.";
    else if (chol < 0 || chol > 1000)
      errs.cholesterol = "Cholesterol must be between 0 and 1000 mg/dL.";

    return errs;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: null }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    onSubmit({
      full_name: form.full_name.trim(),
      date_of_birth: form.date_of_birth,
      email: form.email.trim(),
      glucose: parseFloat(form.glucose),
      haemoglobin: parseFloat(form.haemoglobin),
      cholesterol: parseFloat(form.cholesterol),
    });
  };

  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-box">
        <div className="modal-header">
          <div className="modal-title-group">
            <div className="modal-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </div>
            <h2 className="modal-title">
              {patient ? "Edit Patient Record" : "New Patient Record"}
            </h2>
          </div>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div className="modal-body">
            {/* Personal Info */}
            <div className="form-section">
              <h3 className="section-label">Personal Information</h3>
              <div className="form-grid">
                <div className="form-group full-width">
                  <label>Full Name *</label>
                  <input
                    name="full_name"
                    value={form.full_name}
                    onChange={handleChange}
                    placeholder="e.g. Aarav Sharma"
                    className={errors.full_name ? "error" : ""}
                    disabled={aiLoading}
                  />
                  {errors.full_name && <span className="err-msg">{errors.full_name}</span>}
                </div>

                <div className="form-group">
                  <label>Date of Birth *</label>
                  <input
                    type="date"
                    name="date_of_birth"
                    value={form.date_of_birth}
                    onChange={handleChange}
                    max={today}
                    className={errors.date_of_birth ? "error" : ""}
                    disabled={aiLoading}
                  />
                  {errors.date_of_birth && <span className="err-msg">{errors.date_of_birth}</span>}
                </div>

                <div className="form-group">
                  <label>Email Address *</label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="patient@example.com"
                    className={errors.email ? "error" : ""}
                    disabled={aiLoading}
                  />
                  {errors.email && <span className="err-msg">{errors.email}</span>}
                </div>
              </div>
            </div>

            {/* Blood Test Values */}
            <div className="form-section">
              <h3 className="section-label">Blood Test Results</h3>
              <div className="ref-ranges">
                {REFERENCE.map((r) => (
                  <div key={r.label} className="ref-item">
                    <span className="ref-label">{r.label}</span>
                    <span className="ref-val">{r.normal}</span>
                  </div>
                ))}
              </div>

              <div className="form-grid three-col">
                <div className="form-group">
                  <label>Glucose (mg/dL) *</label>
                  <input
                    type="number"
                    name="glucose"
                    value={form.glucose}
                    onChange={handleChange}
                    placeholder="e.g. 95"
                    step="0.01"
                    min="0"
                    max="1000"
                    className={errors.glucose ? "error" : ""}
                    disabled={aiLoading}
                  />
                  {errors.glucose && <span className="err-msg">{errors.glucose}</span>}
                </div>

                <div className="form-group">
                  <label>Haemoglobin (g/dL) *</label>
                  <input
                    type="number"
                    name="haemoglobin"
                    value={form.haemoglobin}
                    onChange={handleChange}
                    placeholder="e.g. 14.5"
                    step="0.01"
                    min="0"
                    max="25"
                    className={errors.haemoglobin ? "error" : ""}
                    disabled={aiLoading}
                  />
                  {errors.haemoglobin && <span className="err-msg">{errors.haemoglobin}</span>}
                </div>

                <div className="form-group">
                  <label>Cholesterol (mg/dL) *</label>
                  <input
                    type="number"
                    name="cholesterol"
                    value={form.cholesterol}
                    onChange={handleChange}
                    placeholder="e.g. 180"
                    step="0.01"
                    min="0"
                    max="1000"
                    className={errors.cholesterol ? "error" : ""}
                    disabled={aiLoading}
                  />
                  {errors.cholesterol && <span className="err-msg">{errors.cholesterol}</span>}
                </div>
              </div>
            </div>

            {aiLoading && (
              <div className="ai-loading-banner">
                <div className="ai-pulse" />
                <span>AI is analysing blood values and generating health assessment…</span>
              </div>
            )}
          </div>

          <div className="modal-footer">
            <button type="button" className="btn-secondary" onClick={onClose} disabled={aiLoading}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={aiLoading}>
              {aiLoading ? (
                <>
                  <span className="btn-spinner" /> Predicting…
                </>
              ) : patient ? (
                "Update Record"
              ) : (
                "Add & Predict"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

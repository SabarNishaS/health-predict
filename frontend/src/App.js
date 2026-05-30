import React, { useState, useEffect, useCallback } from "react";
import { Toaster, toast } from "react-hot-toast";
import { patientApi } from "./api/patients";
import PatientTable from "./components/PatientTable";
import PatientModal from "./components/PatientModal";
import DeleteModal from "./components/DeleteModal";
import StatsBar from "./components/StatsBar";
import "./App.css";

export default function App() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteModal, setDeleteModal] = useState({ open: false, patient: null });
  const [editingPatient, setEditingPatient] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [aiLoading, setAiLoading] = useState(false);

  const fetchPatients = useCallback(async () => {
    try {
      setLoading(true);
      const data = await patientApi.getAll();
      setPatients(data);
    } catch (err) {
      toast.error("Failed to load patients: " + err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPatients();
  }, [fetchPatients]);

  const handleCreate = () => {
    setEditingPatient(null);
    setModalOpen(true);
  };

  const handleEdit = (patient) => {
    setEditingPatient(patient);
    setModalOpen(true);
  };

  const handleDelete = (patient) => {
    setDeleteModal({ open: true, patient });
  };

  const handleSubmit = async (formData) => {
    setAiLoading(true);
    try {
      if (editingPatient) {
        const updated = await patientApi.update(editingPatient.id, formData);
        setPatients((prev) =>
          prev.map((p) => (p.id === updated.id ? updated : p))
        );
        toast.success("Patient record updated successfully!");
      } else {
        const created = await patientApi.create(formData);
        setPatients((prev) => [created, ...prev]);
        toast.success("Patient added with AI health assessment!");
      }
      setModalOpen(false);
      setEditingPatient(null);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setAiLoading(false);
    }
  };

  const handleConfirmDelete = async () => {
    try {
      await patientApi.delete(deleteModal.patient.id);
      setPatients((prev) => prev.filter((p) => p.id !== deleteModal.patient.id));
      toast.success("Patient record deleted.");
      setDeleteModal({ open: false, patient: null });
    } catch (err) {
      toast.error("Delete failed: " + err.message);
    }
  };

  const filtered = patients.filter(
    (p) =>
      p.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="app">
      <Toaster position="top-right" toastOptions={{ duration: 4000 }} />

      {/* Header */}
      <header className="app-header">
        <div className="header-brand">
          <div className="brand-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
            </svg>
          </div>
          <div>
            <h1 className="brand-name">HealthPredict</h1>
            <p className="brand-tagline">AI-Powered Patient Health Analytics</p>
          </div>
        </div>
        <button className="btn-add" onClick={handleCreate}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Add Patient
        </button>
      </header>

      {/* Stats Bar */}
      <StatsBar patients={patients} />

      {/* Search */}
      <div className="toolbar">
        <div className="search-wrap">
          <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            className="search-input"
            type="text"
            placeholder="Search by name or email…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button className="search-clear" onClick={() => setSearchQuery("")}>×</button>
          )}
        </div>
        <span className="record-count">
          {filtered.length} record{filtered.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Table */}
      <PatientTable
        patients={filtered}
        loading={loading}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {/* Modals */}
      {modalOpen && (
        <PatientModal
          patient={editingPatient}
          onSubmit={handleSubmit}
          onClose={() => { setModalOpen(false); setEditingPatient(null); }}
          aiLoading={aiLoading}
        />
      )}

      {deleteModal.open && (
        <DeleteModal
          patient={deleteModal.patient}
          onConfirm={handleConfirmDelete}
          onClose={() => setDeleteModal({ open: false, patient: null })}
        />
      )}
    </div>
  );
}

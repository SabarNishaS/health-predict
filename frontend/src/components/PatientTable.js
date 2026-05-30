import React, { useState } from "react";
import { format } from "date-fns";

export default function PatientTable({ patients, loading, onEdit, onDelete }) {
  const [expandedRemark, setExpandedRemark] = useState(null);

  if (loading) {
    return (
      <div className="table-container">
        <div className="loading-state">
          <div className="spinner" />
          <p>Loading patient records…</p>
        </div>
      </div>
    );
  }

  if (patients.length === 0) {
    return (
      <div className="table-container">
        <div className="empty-state">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M16 4h2a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2h2" />
            <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
          </svg>
          <h3>No patient records found</h3>
          <p>Add your first patient to get started with AI health predictions.</p>
        </div>
      </div>
    );
  }

  const getGlucoseStatus = (v) => {
    if (v < 70) return { label: "Low", cls: "badge-danger" };
    if (v < 100) return { label: "Normal", cls: "badge-success" };
    if (v < 126) return { label: "Pre-DM", cls: "badge-warn" };
    return { label: "High", cls: "badge-danger" };
  };

  const getHbStatus = (v) => {
    if (v < 12) return { label: "Low", cls: "badge-danger" };
    if (v <= 17.5) return { label: "Normal", cls: "badge-success" };
    return { label: "High", cls: "badge-warn" };
  };

  const getCholStatus = (v) => {
    if (v < 200) return { label: "Good", cls: "badge-success" };
    if (v < 240) return { label: "Border", cls: "badge-warn" };
    return { label: "High", cls: "badge-danger" };
  };

  return (
    <div className="table-container">
      <div className="table-scroll">
        <table className="patient-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Patient</th>
              <th>Date of Birth</th>
              <th>Glucose<br /><span className="unit">mg/dL</span></th>
              <th>Haemoglobin<br /><span className="unit">g/dL</span></th>
              <th>Cholesterol<br /><span className="unit">mg/dL</span></th>
              <th>AI Remarks</th>
              <th>Added</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {patients.map((p, idx) => {
              const g = getGlucoseStatus(p.glucose);
              const h = getHbStatus(p.haemoglobin);
              const c = getCholStatus(p.cholesterol);
              const isExpanded = expandedRemark === p.id;

              return (
                <tr key={p.id}>
                  <td className="td-num">{idx + 1}</td>
                  <td>
                    <div className="patient-cell">
                      <div className="avatar">
                        {p.full_name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="patient-name">{p.full_name}</div>
                        <div className="patient-email">{p.email}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    {p.date_of_birth
                      ? format(new Date(p.date_of_birth), "dd MMM yyyy")
                      : "—"}
                  </td>
                  <td>
                    <div className="metric-cell">
                      <span className="metric-val">{p.glucose}</span>
                      <span className={`badge ${g.cls}`}>{g.label}</span>
                    </div>
                  </td>
                  <td>
                    <div className="metric-cell">
                      <span className="metric-val">{p.haemoglobin}</span>
                      <span className={`badge ${h.cls}`}>{h.label}</span>
                    </div>
                  </td>
                  <td>
                    <div className="metric-cell">
                      <span className="metric-val">{p.cholesterol}</span>
                      <span className={`badge ${c.cls}`}>{c.label}</span>
                    </div>
                  </td>
                  <td className="td-remarks">
                    {p.remarks ? (
                      <div className="remark-cell">
                        <div className={`remark-text ${isExpanded ? "expanded" : ""}`}>
                          {p.remarks}
                        </div>
                        {p.remarks.length > 100 && (
                          <button
                            className="remark-toggle"
                            onClick={() => setExpandedRemark(isExpanded ? null : p.id)}
                          >
                            {isExpanded ? "Show less ↑" : "Read more ↓"}
                          </button>
                        )}
                      </div>
                    ) : (
                      <span className="no-remark">—</span>
                    )}
                  </td>
                  <td className="td-date">
                    {p.created_at
                      ? format(new Date(p.created_at), "dd MMM yyyy")
                      : "—"}
                  </td>
                  <td>
                    <div className="action-btns">
                      <button
                        className="btn-icon btn-edit"
                        onClick={() => onEdit(p)}
                        title="Edit"
                      >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                          <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
                        </svg>
                      </button>
                      <button
                        className="btn-icon btn-delete"
                        onClick={() => onDelete(p)}
                        title="Delete"
                      >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polyline points="3 6 5 6 21 6" />
                          <path d="M19 6l-1 14H6L5 6" />
                          <path d="M10 11v6M14 11v6" />
                          <path d="M9 6V4h6v2" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

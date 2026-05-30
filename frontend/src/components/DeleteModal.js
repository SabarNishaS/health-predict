import React from "react";

export default function DeleteModal({ patient, onConfirm, onClose }) {
  return (
    <div className="modal-overlay">
      <div className="modal-box modal-small">
        <div className="modal-header">
          <div className="modal-title-group">
            <div className="modal-icon danger-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="3 6 5 6 21 6" />
                <path d="M19 6l-1 14H6L5 6" />
                <path d="M10 11v6M14 11v6" />
                <path d="M9 6V4h6v2" />
              </svg>
            </div>
            <h2 className="modal-title">Delete Record</h2>
          </div>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        <div className="modal-body">
          <p className="delete-msg">
            Are you sure you want to delete the record for{" "}
            <strong>{patient?.full_name}</strong>?
          </p>
          <p className="delete-sub">This action cannot be undone.</p>
        </div>

        <div className="modal-footer">
          <button className="btn-secondary" onClick={onClose}>Cancel</button>
          <button className="btn-danger" onClick={onConfirm}>Delete</button>
        </div>
      </div>
    </div>
  );
}

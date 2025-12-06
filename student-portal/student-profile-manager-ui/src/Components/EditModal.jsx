import React from "react";

export default function EditModal({ editing, onChange, onClose, onSave }) {
  if (!editing) return null;
  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <h3>Edit Student</h3>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <form className="modal-form" onSubmit={onSave}>
          <label className="label">Student ID</label>
          <input name="studentId" disabled value={editing.studentId} onChange={onChange} className="input" />

          <label className="label">Full Name</label>
          <input name="name" value={editing.name} onChange={onChange} className="input" />

          <label className="label">Email</label>
          <input name="email" value={editing.email} onChange={onChange} className="input" />

          <div className="modal-actions">
            <button type="button" className="secondary-btn" onClick={onClose}>Cancel</button>
            <button type="submit" className="primary-btn">Save</button>
          </div>
        </form>
      </div>
    </div>
  );
}
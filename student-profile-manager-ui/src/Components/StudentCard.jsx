import React from "react";

export default function StudentCard({ student, onEdit, onDelete, deleting }) {
  const id = student.Id 
  const studentId = student.StudentId;
  const name = student.Name || "Unknown";
  const email = student.Email || "unknown@email.com";
  const initial = (name.split(" ")[0] || "A")[0].toUpperCase();

  return (
    <div className="card">
      <div className="card-left">
        <div className="avatar">{initial}</div>
      </div>

      <div className="card-content">
        <div className="card-name">{name}</div>
        <div className="card-id">{studentId}</div>
        <div className="card-email">{email}</div>
        
        <div className="card-actions">
          <button className="edit-btn" onClick={() => onEdit(student)}>Edit</button>
          <button className="delete-btn" onClick={() => onDelete(id, studentId)} disabled={deleting}>
            {deleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}
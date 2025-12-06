import React from "react";

export default function FormStudent({ form, onChange, onSubmit, loading }) {
  return (
    <aside className="left-card">
      <div className="left-header">
        {/* <span className="left-icon">+</span> */}
        {/* SVG User Registration Icon */}
        <span className="left-icon">
          {/* Example SVG: User Registration */}
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{ verticalAlign: "middle", marginRight: "8px" }}
          >
            <circle cx="15" cy="8" r="4" stroke="#1976d2" strokeWidth="2" fill="#e3f2fd" />
            <rect x="8" y="15" width="15" height="5" rx="2.5" stroke="#1976d2" strokeWidth="2" fill="#e3f2fd" />
            {/* <path d="M21 2v4M23 4h-4" stroke="#1976d2" strokeWidth="2" strokeLinecap="round" /> */}
          </svg>
        </span>
        <div className="left-title">Register Student</div>
      </div>

      <form className="form" onSubmit={onSubmit}>
        <label className="label">Student ID</label>
        <input name="studentId" value={form.studentId} onChange={onChange} className="input" placeholder="e.g. S-1024" />

        <label className="label">Full Name</label>
        <input name="fullName" value={form.fullName} onChange={onChange} className="input" placeholder="e.g. Alex Johnson" />

        <label className="label">Email Address</label>
        <input name="email" value={form.email} onChange={onChange} className="input" placeholder="alex@university.edu" />

        <button className="primary-btn" type="submit" disabled={loading}>
          {loading ? "Creating..." : "Create Profile"}
        </button>
      </form>
    </aside>
  );
}

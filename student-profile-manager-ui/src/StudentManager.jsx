import React, { useEffect, useState } from "react";
import "./student-manager.css";

import FormStudent from "../src/Components/FormStudent";
import StudentCard from "../src/Components/StudentCard";
import EditModal from "../src/Components/EditModal";

import { fetchStudents, createStudent, updateStudentApi, deleteStudentApi } from "./api/studentApi";

export default function StudentManager() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("");

  const [form, setForm] = useState({ studentId: "", fullName: "", email: "" });
  const [creating, setCreating] = useState(false);

  const [editing, setEditing] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    try {
      setLoading(true);
      const data = await fetchStudents();
      setStudents(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      alert(err.message || "Error loading students");
    } finally {
      setLoading(false);
    }
  }

  function handleFormChange(e) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  }

  async function handleCreate(e) {
    e.preventDefault();
    if (!form.studentId || !form.fullName || !form.email) return alert("Fill all fields");
    try {
      setCreating(true);
      const created = await createStudent({ studentId: form.studentId, name: form.fullName, email: form.email });
      setStudents((s) => [created, ...s]);
      setForm({ studentId: "", fullName: "", email: "" });
      await load();
    } catch (err) {
      console.error(err);
      alert(err.message || "Create failed");
    } finally {
      setCreating(false);
    }
  }

  function openEdit(student) {
    setEditing({ id: student.Id, studentId: student.StudentId, name: student.Name, email: student.Email });
  }
  function closeEdit() { setEditing(null); }

  function onEditChange(e) { const { name, value } = e.target; setEditing((s) => ({ ...s, [name]: value })); }

  async function saveEdit(e) {
    e.preventDefault();
    const idToUse = editing.id;
    try {
      const updated = await updateStudentApi(idToUse, { Id: editing.id, StudentId: editing.studentId, Name: editing.name, Email: editing.email });
      setStudents((s) => s.map((st) => (st.Id === updated.Id ? updated : st)));
      closeEdit();
      await load();
    } catch (err) {
      console.error(err);
      alert(err.message || "Update failed");
    }
  }

  async function handleDelete(id, studentId) {
    if (!window.confirm("Delete this student?")) return;
    try {
      setDeletingId(id);
      await deleteStudentApi(id, studentId);
      setStudents((s) => s.filter((x) => (x.Id || x.id) !== id));
    } catch (err) {
      console.error(err);
      alert(err.message || "Delete failed");
    } finally { setDeletingId(null); }
  }

  const filtered = students.filter((s) => {
    const text =
      (s.Name || s.name || "") +
      " " +
      (s.StudentId || s.studentId || "") +
      " " +
      (s.Email || s.email || "");
    return text.toLowerCase().includes(query.toLowerCase());
  });

  return (
    <div className="page">
      <div className="container">
        <header className="header-card">
          <h1>Student Manager</h1>
          {/* <p>React + Custom CSS</p> */}
        </header>

        <div className="layout">
          <FormStudent form={form} onChange={handleFormChange} onSubmit={handleCreate} loading={creating} />

          <main className="right-area">
            <div className="search-wrap">
              <input className="search-input" placeholder="Search students..." value={query} onChange={(e) => setQuery(e.target.value)} />
            </div>

            <div className="cards-grid">
              {loading ? (
                <div className="empty">Loading...</div>
              ) : filtered.length ? (
                filtered.map((stu) => (
                  <StudentCard key={stu.Id} student={stu} onEdit={openEdit} onDelete={handleDelete} deleting={deletingId === stu.Id} />
                ))
              ) : (
                <div className="empty">No students found</div>
              )}
            </div>
          </main>
        </div>
      </div>

      <EditModal editing={editing} onChange={onEditChange} onClose={closeEdit} onSave={saveEdit} />
    </div>
  );
}
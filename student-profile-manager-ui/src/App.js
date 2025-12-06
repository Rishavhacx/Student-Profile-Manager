// import React, { useEffect, useState } from "react";
// import "./student-manager.css"; // <-- import the CSS file below

// const API = {
//   getStudents: "/api/students",
//   createStudent: "/api/students",
//   updateStudent: (id) => `/api/students/${id}`,
//   deleteStudent: (id) => `/api/students/${id}`,
// };

// export default function StudentManagerNoTailwind() {
//   const [students, setStudents] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [query, setQuery] = useState("");

//   const [form, setForm] = useState({ studentId: "", fullName: "", email: "" });
//   const [creating, setCreating] = useState(false);

//   const [editing, setEditing] = useState(null);
//   const [deletingId, setDeletingId] = useState(null);

//   useEffect(() => {
//     fetchStudents();
//   }, []);

//   async function fetchStudents() {
//     try {
//       setLoading(true);
//       const res = await fetch(API.getStudents);
//       if (!res.ok) throw new Error("Failed to fetch students");
//       const data = await res.json();
//       setStudents(Array.isArray(data) ? data : []);
//     } catch (err) {
//       console.error(err);
//       alert("Error loading students: " + err.message);
//     } finally {
//       setLoading(false);
//     }
//   }

//   function onChangeForm(e) {
//     const { name, value } = e.target;
//     setForm((f) => ({ ...f, [name]: value }));
//   }

//   async function createProfile(e) {
//     e.preventDefault();
//     if (!form.studentId || !form.fullName || !form.email) {
//       alert("Please fill all fields");
//       return;
//     }
//     try {
//       setCreating(true);
//       const res = await fetch(API.createStudent, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ id: form.studentId, name: form.fullName, email: form.email }),
//       });
//       if (!res.ok) throw new Error("Create failed");
//       const created = await res.json();
//       setStudents((s) => [created, ...s]);
//       setForm({ studentId: "", fullName: "", email: "" });
//     } catch (err) {
//       console.error(err);
//       alert("Create error: " + err.message);
//     } finally {
//       setCreating(false);
//     }
//   }

//   function openEdit(student) {
//     setEditing({ id: student.id || student.studentId, studentId: student.studentId || student.id, name: student.name || student.fullName, email: student.email });
//   }

//   function closeEdit() {
//     setEditing(null);
//   }

//   function onEditChange(e) {
//     const { name, value } = e.target;
//     setEditing((s) => ({ ...s, [name]: value }));
//   }

//   async function saveEdit(e) {
//     e.preventDefault();
//     if (!editing) return;
//     try {
//       const idToUse = editing.id || editing.studentId;
//       const res = await fetch(API.updateStudent(idToUse), {
//         method: "PUT",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ id: editing.studentId, name: editing.name, email: editing.email }),
//       });
//       if (!res.ok) throw new Error("Update failed");
//       const updated = await res.json();
//       setStudents((s) => s.map((st) => (st.id === updated.id ? updated : st)));
//       closeEdit();
//     } catch (err) {
//       console.error(err);
//       alert("Update error: " + err.message);
//     }
//   }

//   async function deleteStudent(id) {
//     if (!window.confirm("Delete this student?")) return;
//     try {
//       setDeletingId(id);
//       const res = await fetch(API.deleteStudent(id), { method: "DELETE" });
//       if (!res.ok) throw new Error("Delete failed");
//       setStudents((s) => s.filter((x) => x.id !== id));
//     } catch (err) {
//       console.error(err);
//       alert("Delete error: " + err.message);
//     } finally {
//       setDeletingId(null);
//     }
//   }

//   const filtered = students.filter((s) => {
//     const text = (s.name || s.fullName || "") + " " + (s.id || s.studentId || "") + " " + (s.email || "");
//     return text.toLowerCase().includes(query.toLowerCase());
//   });

//   return (
//     <div className="page">
//       <div className="container">
//         <header className="header-card">
//           <h1>Student Manager</h1>
//           <p>React + Custom CSS</p>
//         </header>

//         <div className="layout">
//           <aside className="left-card">
//             <div className="left-header">
//               <span className="left-icon">+</span>
//               <div className="left-title">Register Student</div>
//             </div>

//             <form className="form" onSubmit={createProfile}>
//               <label className="label">Student ID</label>
//               <input className="input" name="studentId" value={form.studentId} onChange={onChangeForm} placeholder="e.g. S-1024" />

//               <label className="label">Full Name</label>
//               <input className="input" name="fullName" value={form.fullName} onChange={onChangeForm} placeholder="e.g. Alex Johnson" />

//               <label className="label">Email Address</label>
//               <input className="input" name="email" value={form.email} onChange={onChangeForm} placeholder="alex@university.edu" />

//               <button className="primary-btn" type="submit" disabled={creating}>
//                 {creating ? "Creating..." : "Create Profile"}
//               </button>
//             </form>
//           </aside>

//           <main className="right-area">
//             <div className="search-wrap">
//               <input className="search-input" placeholder="Search students..." value={query} onChange={(e) => setQuery(e.target.value)} />
//             </div>

//             <div className="cards-grid">
//               {loading ? (
//                 <div className="empty">Loading...</div>
//               ) : filtered.length ? (
//                 filtered.map((stu) => {
//                   const id = stu.id || stu.studentId;
//                   const name = stu.name || stu.fullName || "Unknown";
//                   const initial = (name.split(" ")[0] || "A")[0].toUpperCase();
//                   return (
//                     <div key={id} className="card">
//                       <div className="card-left">
//                         <div className="avatar">{initial}</div>
//                       </div>

//                       <div className="card-content">
//                         <div className="card-name">{name}</div>
//                         <div className="card-id">{id}</div>
//                         <div className="card-email">{stu.email}</div>

//                         <div className="card-actions">
//                           <button className="edit-btn" onClick={() => openEdit(stu)}>Edit</button>
//                           <button className="delete-btn" onClick={() => deleteStudent(id)} disabled={deletingId === id}>
//                             {deletingId === id ? "Deleting..." : "Delete"}
//                           </button>
//                         </div>
//                       </div>
//                     </div>
//                   );
//                 })
//               ) : (
//                 <div className="empty">No students found</div>
//               )}
//             </div>
//           </main>
//         </div>
//       </div>

//       {editing && (
//         <div className="modal-overlay">
//           <div className="modal">
//             <div className="modal-header">
//               <h3>Edit Student</h3>
//               <button className="modal-close" onClick={closeEdit}>✕</button>
//             </div>

//             <form className="modal-form" onSubmit={saveEdit}>
//               <label className="label">Student ID</label>
//               <input name="studentId" value={editing.studentId} onChange={onEditChange} className="input" />

//               <label className="label">Full Name</label>
//               <input name="name" value={editing.name} onChange={onEditChange} className="input" />

//               <label className="label">Email</label>
//               <input name="email" value={editing.email} onChange={onEditChange} className="input" />

//               <div className="modal-actions">
//                 <button type="button" className="secondary-btn" onClick={closeEdit}>Cancel</button>
//                 <button type="submit" className="primary-btn">Save</button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

export const API = {
  getStudents: `https://profilemanager.azurewebsites.net/api/students`,
  createStudent: "https://profilemanager.azurewebsites.net/api/students",
  updateStudent: (id) => `https://profilemanager.azurewebsites.net/api/students/${id}`,
  deleteStudent: (id, studentId) => `https://profilemanager.azurewebsites.net/api/students/${id}/${studentId}`,
};

export async function fetchStudents() {
  const res = await fetch(API.getStudents);
  if (!res.ok) throw new Error("Failed to fetch students");
  return res.json();
}

async function parseErrorResponse(res) {
  try {
    const json = await res.json();
    if (json && (json.message || json.Message)) return json.message || json.Message;
    return JSON.stringify(json);
  } catch {
    try {
      const text = await res.text();
      return text || res.statusText || `HTTP ${res.status}`;
    } catch {
      return `HTTP ${res.status}`;
    }
  }
}

export async function createStudent(payload) {
  const res = await fetch(API.createStudent, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const msg = await parseErrorResponse(res);
    throw new Error(msg || "Create failed");
  }
  return res.json();
}

export async function updateStudentApi(id, payload) {
  const res = await fetch(API.updateStudent(id), {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const msg = await parseErrorResponse(res);
    throw new Error(msg || "Update failed");
  }
  return res.json();
}

export async function deleteStudentApi(id, studentId) {
  const res = await fetch(API.deleteStudent(id, studentId), { method: "DELETE" });
  if (!res.ok) {
    const msg = await parseErrorResponse(res);
    throw new Error(msg || "Delete failed");
  }
  return true;
}

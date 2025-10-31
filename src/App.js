import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({ name: "", email: "" });
  const [editId, setEditId] = useState(null);

  // Ambil data user dari backend
  const fetchUsers = () => {
    axios.get("http://localhost:5000/users")
      .then((res) => setUsers(res.data))
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Simpan atau update user
  const handleSubmit = (e) => {
    e.preventDefault();
    if (editId) {
      axios.put(`http://localhost:5000/users/${editId}`, form)
        .then(() => {
          setForm({ name: "", email: "" });
          setEditId(null);
          fetchUsers();
        })
        .catch((err) => console.error(err));
    } else {
      axios.post("http://localhost:5000/users", form)
        .then(() => {
          setForm({ name: "", email: "" });
          fetchUsers();
        })
        .catch((err) => console.error(err));
    }
  };

  // Edit user
  const handleEdit = (user) => {
    setForm({ name: user.name, email: user.email });
    setEditId(user.id);
  };

  // Hapus user
  const handleDelete = (id) => {
    if (window.confirm("Yakin ingin menghapus user ini?")) {
      axios.delete(`http://localhost:5000/users/${id}`)
        .then(() => fetchUsers())
        .catch((err) => console.error(err));
    }
  };

  return (
    <div style={{ margin: "50px", fontFamily: "Arial" }}>
      <h2>📋 User Management</h2>

      <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
        <input
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />
        <input
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
        />
        <button type="submit" style={{ marginLeft: "10px" }}>
          {editId ? "Update User" : "Add User"}
        </button>

        {editId && (
          <button
            type="button"
            onClick={() => {
              setEditId(null);
              setForm({ name: "", email: "" });
            }}
            style={{ marginLeft: "10px" }}
          >
            Cancel
          </button>
        )}
      </form>

      <table border="1" cellPadding="8" style={{ borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ background: "#eee" }}>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {users.map((u) => (
            <tr key={u.id}>
              <td>{u.id}</td>
              <td>{u.name}</td>
              <td>{u.email}</td>
              <td>
                <button onClick={() => handleEdit(u)}>Edit</button>
                <button
                  onClick={() => handleDelete(u.id)}
                  style={{ marginLeft: "10px", color: "white" }}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;

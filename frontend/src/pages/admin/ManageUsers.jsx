import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../../App";
import "./admin.css";

const ManageUsers = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedAdmin = localStorage.getItem("adminData");
    if (!storedAdmin) {
      navigate("/admin/login");
      return;
    }
    fetchUsers();
  }, [navigate]);

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/admin/users`, {
        withCredentials: true,
      });
      setUsers(response.data.users);
    } catch (error) {
      console.error("Error fetching users:", error);
      if (error.response?.status === 401) {
        localStorage.removeItem("adminData");
        navigate("/admin/login");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete user "${name}"?`)) {
      return;
    }

    try {
      await axios.delete(`${API_URL}/api/admin/users/${id}`, {
        withCredentials: true,
      });
      setUsers(users.filter((user) => user._id !== id));
    } catch (error) {
      console.error("Error deleting user:", error);
      alert("Failed to delete user");
    }
  };

  if (loading) {
    return (
      <div className="admin-container">
        <div className="loading">Loading users...</div>
      </div>
    );
  }

  return (
    <div className="admin-container">
      <header className="admin-header">
        <h1>👥 Manage Users</h1>
      </header>

      <main className="admin-main">
        <Link to="/admin/dashboard" className="back-link">
          ← Back to Dashboard
        </Link>

        <h2>All Users ({users.length})</h2>

        {users.length === 0 ? (
          <p>No users found.</p>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id}>
                  <td>{user.fullName}</td>
                  <td>{user.email}</td>
                  <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                  <td>
                    <button
                      className="delete-btn"
                      onClick={() => handleDelete(user._id, user.fullName)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </main>
    </div>
  );
};

export default ManageUsers;


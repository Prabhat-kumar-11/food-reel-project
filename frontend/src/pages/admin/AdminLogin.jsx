import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../../App";
import "../../styles/auth.css";
import { ToastContainer, useToast } from "../../components/Toast";

const AdminLogin = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { toasts, removeToast, showSuccess, showError } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData(e.target);
      const email = formData.get("email");
      const password = formData.get("password");

      const response = await axios.post(
        `${API_URL}/api/admin/login`,
        { email, password },
        { withCredentials: true }
      );

      localStorage.setItem("adminData", JSON.stringify(response.data.admin));
      showSuccess("Login successful! Redirecting to dashboard...");
      setTimeout(() => navigate("/admin/dashboard"), 1000);
    } catch (err) {
      showError(
        err.response?.data?.message || "Login failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <ToastContainer toasts={toasts} removeToast={removeToast} />
      <div className="auth-card">
        <div className="auth-header">
          <h1>🔐 Admin Login</h1>
          <p>Access the admin dashboard</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              className="form-input"
              placeholder="admin@example.com"
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              className="form-input"
              placeholder="Enter your password"
              required
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            className={`submit-btn ${loading ? "loading" : ""}`}
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login to Dashboard"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;

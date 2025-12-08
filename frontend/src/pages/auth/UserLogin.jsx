import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../../styles/auth.css";
import axios from "axios";
import { API_URL } from "../../App";
import { useAuth } from "../../context/AuthContext";
import { ToastContainer, useToast } from "../../components/Toast";

const UserLogin = () => {
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const { toasts, removeToast, showSuccess, showError } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData(e.target);
      const email = formData.get("email");
      const password = formData.get("password");
      const rememberMe = formData.get("rememberMe") === "on";

      const response = await axios.post(
        `${API_URL}/api/auth/user/login`,
        {
          email,
          password,
          rememberMe,
        },
        {
          withCredentials: true,
        }
      );

      setUser(response.data.user || null);
      // Set localStorage flags for route protection
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("userRole", "user");
      showSuccess("Login successful! Redirecting...");
      setTimeout(() => navigate("/home"), 1000);
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
          <h1>Welcome Back</h1>
          <p>Sign in to your account to continue</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              className="form-input"
              placeholder="Enter your email"
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

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "var(--spacing-lg)",
            }}
          >
            <div className="form-checkbox" style={{ marginBottom: 0 }}>
              <input
                type="checkbox"
                id="rememberMe"
                name="rememberMe"
                disabled={loading}
              />
              <label htmlFor="rememberMe">Remember me</label>
            </div>
            <Link
              to="/forgot-password"
              style={{
                color: "var(--primary-color)",
                textDecoration: "none",
                fontSize: "var(--font-size-sm)",
              }}
            >
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            className={`submit-btn ${loading ? "loading" : ""}`}
            disabled={loading}
          >
            {loading ? "Logging in..." : "Log In"}
          </button>
        </form>

        <div className="divider">
          <span>or</span>
        </div>

        <div className="auth-footer">
          Don't have an account? <Link to="/user/register">Create one</Link>
        </div>
      </div>
    </div>
  );
};

export default UserLogin;

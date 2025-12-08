import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../../styles/auth.css";
import axios from "axios";
import { API_URL } from "../../App";
import { ToastContainer, useToast } from "../../components/Toast";

const UserRegister = () => {
  const navigate = useNavigate();
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toasts, removeToast, showSuccess, showError } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData(e.target);
      const fullName = formData.get("fullName");
      const email = formData.get("email");
      const password = formData.get("password");

      await axios.post(
        `${API_URL}/api/auth/user/register`,
        {
          fullName,
          email,
          password,
        },
        {
          withCredentials: true,
        }
      );

      showSuccess("Account created successfully! Redirecting to login...");
      setTimeout(() => navigate("/user/login"), 1500);
    } catch (err) {
      showError(
        err.response?.data?.message || "Registration failed. Please try again."
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
          <h1>Create Account</h1>
          <p>Join us as a user and discover delicious food</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="fullName">Full Name</label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              className="form-input"
              placeholder="Enter your full name"
              required
              disabled={loading}
            />
          </div>

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
            <label htmlFor="phone">Phone Number</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              className="form-input"
              placeholder="Enter your phone number"
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
              placeholder="Create a strong password"
              required
              disabled={loading}
            />
          </div>

          <div className="form-checkbox">
            <input
              type="checkbox"
              id="agreeToTerms"
              name="agreeToTerms"
              checked={agreeToTerms}
              onChange={(e) => setAgreeToTerms(e.target.checked)}
              required
              disabled={loading}
            />
            <label htmlFor="agreeToTerms">
              I agree to the{" "}
              <a href="#" style={{ color: "var(--primary-color)" }}>
                Terms and Conditions
              </a>
            </label>
          </div>

          <button
            type="submit"
            className={`submit-btn ${loading ? "loading" : ""}`}
            disabled={loading}
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        <div className="auth-footer">
          Already have an account? <Link to="/user/login">Log In</Link>
        </div>
      </div>
    </div>
  );
};

export default UserRegister;

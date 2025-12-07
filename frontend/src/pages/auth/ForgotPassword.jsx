import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import '../../styles/auth.css'
import axios from 'axios'
import { API_URL } from '../../App';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState('user'); // 'user' or 'food-partner'

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await axios.post(`${API_URL}/api/auth/forgot-password`, { email, role }, { withCredentials: true });
      setSuccess('If that email exists, a password reset link has been sent. Check your inbox.');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send reset email');
    } finally {
      setLoading(false);
    }
  }

  // Note: reset is handled via emailed token -> frontend ResetPassword page

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1>Reset Password</h1>
          <p>Follow the steps to reset your password</p>
        </div>

        {error && <div style={{ color: '#d32f2f', marginBottom: '1rem', padding: '0.5rem', backgroundColor: '#ffebee', borderRadius: '4px' }}>{error}</div>}
        {success && <div style={{ color: '#388e3c', marginBottom: '1rem', padding: '0.5rem', backgroundColor: '#e8f5e9', borderRadius: '4px' }}>{success}</div>}

        {/* Role Selection */}
        <div style={{ marginBottom: '1rem' }}>
          <label>Account Type</label>
          <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <input
                type="radio"
                name="role"
                value="user"
                checked={role === 'user'}
                onChange={(e) => setRole(e.target.value)}
              />
              User
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <input
                type="radio"
                name="role"
                value="food-partner"
                checked={role === 'food-partner'}
                onChange={(e) => setRole(e.target.value)}
              />
              Food Partner
            </label>
          </div>
        </div>

        {/* Email Form */}
        <form onSubmit={handleEmailSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-input"
              placeholder="Enter your email"
              required
            />
          </div>
          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? 'Sending...' : 'Send reset email'}
          </button>
        </form>

        {/* Footer */}
        <div className="auth-footer">
          Remember your password?{' '}
          <Link to="/user/login">Log in</Link>
        </div>
      </div>
    </div>
  )
}

export default ForgotPassword

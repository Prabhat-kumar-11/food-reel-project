import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import '../../styles/auth.css'
import axios from 'axios'
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../../App';



const UserRegister = () => {
  const navigate = useNavigate();
  const [agreeToTerms, setAgreeToTerms] = useState(false);

 const handleSubmit = async (e) => {
    e.preventDefault();

     const formData = new FormData(e.target);

    const fullName = formData.get('fullName');
    const email = formData.get('email');
    const phone = formData.get('phone');
    const password = formData.get('password');
    const agreeToTerms = formData.get('agreeToTerms') === 'on';

   const response = await axios.post(`${API_URL}/api/auth/user/register`, {
      fullName,
      email,
      password,
    },{
      withCredentials:true // to save token in cookies (from axios)
    })
    navigate("/user/login");
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1>Create Account</h1>
          <p>Join us as a user and discover delicious food</p>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Full Name */}
          <div className="form-group">
            <label htmlFor="fullName">Full Name</label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              className="form-input"
              placeholder="Enter your full name"
              
            
              required
            />
          </div>

          {/* Email */}
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              className="form-input"
              placeholder="Enter your email"
    
              required
            />
          </div>

          {/* Phone */}
          <div className="form-group">
            <label htmlFor="phone">Phone Number</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              className="form-input"
              placeholder="Enter your phone number"
             
            />
          </div>

          {/* Password */}
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              className="form-input"
              placeholder="Create a strong password"
             
              required
            />
          </div>

          {/* Terms and Conditions */}
          <div className="form-checkbox">
            <input
              type="checkbox"
              id="agreeToTerms"
              name="agreeToTerms"
              checked={agreeToTerms}
              onChange={(e) => setAgreeToTerms(e.target.checked)}
              required
            />
            <label htmlFor="agreeToTerms">
              I agree to the <a href="#" style={{ color: 'var(--primary-color)' }}>Terms and Conditions</a>
            </label>
          </div>

          {/* Submit Button */}
          <button type="submit" className="submit-btn">
            Create Account
          </button>
        </form>

        {/* Footer */}
        <div className="auth-footer">
          Already have an account?{' '}
          <Link to="/user/login">Log In</Link>
        </div>
      </div>
    </div>
  )
}

export default UserRegister

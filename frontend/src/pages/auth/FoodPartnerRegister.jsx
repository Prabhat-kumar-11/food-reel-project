import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import '../../styles/auth.css'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { API_URL } from '../../App'

const API = import.meta.env.API_URL

const FoodPartnerRegister = () => {
  const navigate = useNavigate();
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();
     const formData = new FormData(e.target);

    const businessName = formData.get('businessName');  
    const ownerName = formData.get('ownerName');
    const email = formData.get('email');
    const phone = formData.get('phone');
    const businessType = formData.get('businessType');
    const address = formData.get('address');
    const password = formData.get('password');
    const agreeToTerms = formData.get('agreeToTerms') === 'on';

    const response = await axios.post(`${API_URL}/api/auth/food-partner/register`, {
      businessName,
      ownerName,
      email,
      phone,
      businessType,
      address,
      password,
      agreeToTerms
    },{
      withCredentials:true 
    })
    navigate("/food-partner/login");
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1>Partner With Us</h1>
          <p>Register your food business and reach more customers</p>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Business Name */}
          <div className="form-group">
            <label htmlFor="businessName">Business Name</label>
            <input
              type="text"
              id="businessName"
              name="businessName"
              className="form-input"
              placeholder="Enter your business name"
              required
            />
          </div>

          {/* Owner Name */}
          <div className="form-group">
            <label htmlFor="ownerName">Owner's Full Name</label>
            <input
              type="text"
              id="ownerName"
              name="ownerName"
              className="form-input"
              placeholder="Enter owner's full name"
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
              required
            />
          </div>

          {/* Business Type */}
          <div className="form-group">
            <label htmlFor="businessType">Business Type</label>
            <select
              id="businessType"
              name="businessType"
              className="form-select"
              required
            >
              <option value="">Select business type</option>
              <option value="restaurant">Restaurant</option>
              <option value="cafe">Cafe</option>
              <option value="bakery">Bakery</option>
              <option value="cloud_kitchen">Cloud Kitchen</option>
              <option value="food_truck">Food Truck</option>
              <option value="catering">Catering Service</option>
              <option value="other">Other</option>
            </select>
          </div>

          {/* Address */}
          <div className="form-group">
            <label htmlFor="address">Business Address</label>
            <input
              type="text"
              id="address"
              name="address"
              className="form-input"
              placeholder="Enter your business address"
              required
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
            />
            <label htmlFor="agreeToTerms">
              I agree to the <a href="#" style={{ color: 'var(--primary-color)' }}>Terms and Conditions</a>
            </label>
          </div>

          {/* Submit Button */}
          <button type="submit" className="submit-btn">
            Register Business
          </button>
        </form>

        {/* Footer */}
        <div className="auth-footer">
          Already registered?{' '}
          <Link to="/food-partner/login"> Log In</Link>
        </div>
      </div>
    </div>
  )
}

export default FoodPartnerRegister

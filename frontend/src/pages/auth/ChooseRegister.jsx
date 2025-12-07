import React from 'react'
import { Link } from 'react-router-dom'
import '../../styles/chooseRegister.css'


const ChooseRegister = () => {
  return (
    <div className="auth-container">
      <div className="auth-content">
        <div className="auth-header">
          <h1>Welcome to Reel Zom</h1>
          <p>Discover amazing food or grow your food business with us</p>
        </div>

        <div className="roles-grid">
          {/* User Registration */}
          <div className="role-card user-card">
            <div className="role-icon">👤</div>
            <h2>I'm a Customer</h2>
            <p>Discover delicious food from your favorite restaurants and get it delivered to your door</p>
            <div className="role-buttons">
              <Link to="/user/register" className="btn btn-primary">
                Register as User
              </Link>
              <Link to="/user/login" className="btn btn-secondary">
                Login In
              </Link>
            </div>
          </div>

          {/* Food Partner Registration */}
          <div className="role-card partner-card">
            <div className="role-icon">🍔</div>
            <h2>I'm a Food Partner</h2>
            <p>Grow your food business by partnering with us and reaching more customers</p>
            <div className="role-buttons">
              <Link to="/food-partner/register" className="btn btn-primary">
                Register as Partner
              </Link>
              <Link to="/food-partner/login" className="btn btn-secondary">
                Login In
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ChooseRegister

import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import '../styles/bottom-nav.css'

const BottomNavigation = () => {
  const location = useLocation()

  const isActive = (path) => location.pathname === path

  return (
    <div className="bottom-nav">
      <Link 
        to="/" 
        className={`nav-item ${isActive('/') ? 'active' : ''}`}
        title="Home"
      >
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
        </svg>
        <span>Home</span>
      </Link>

      <Link 
        to="/saved" 
        className={`nav-item ${isActive('/saved') ? 'active' : ''}`}
        title="Saved"
      >
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M17 3H5c-1.11 0-2 .9-2 2v16l7-3 7 3V5c0-1.1.89-2 2-2z" />
        </svg>
        <span>Saved</span>
      </Link>
    </div>
  )
}

export default BottomNavigation

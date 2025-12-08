import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/bottom-nav.css";

const BottomNavigation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [showMenu, setShowMenu] = useState(false);

  const isActive = (path) => location.pathname === path;

  const handleLogout = async () => {
    await logout();
    navigate("/user/login");
  };

  return (
    <div className="bottom-nav">
      <Link
        to="/home"
        className={`nav-item ${isActive("/home") ? "active" : ""}`}
        title="Home"
      >
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
        </svg>
        <span>Home</span>
      </Link>

      <Link
        to="/saved"
        className={`nav-item ${isActive("/saved") ? "active" : ""}`}
        title="Saved"
      >
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M17 3H5c-1.11 0-2 .9-2 2v16l7-3 7 3V5c0-1.1.89-2 2-2z" />
        </svg>
        <span>Saved</span>
      </Link>

      <div
        className="nav-item profile-nav"
        onClick={() => setShowMenu(!showMenu)}
      >
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
        </svg>
        <span>Profile</span>

        {showMenu && (
          <div className="profile-menu">
            <button onClick={handleLogout} className="menu-item logout-item">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z" />
              </svg>
              Logout
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BottomNavigation;

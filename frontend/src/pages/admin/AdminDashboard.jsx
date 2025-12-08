import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../../App";
import "./admin.css";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalFoodPartners: 0,
    totalFoodItems: 0,
  });
  const [loading, setLoading] = useState(true);
  const [adminData, setAdminData] = useState(null);

  useEffect(() => {
    const storedAdmin = localStorage.getItem("adminData");
    if (!storedAdmin) {
      navigate("/admin/login");
      return;
    }
    setAdminData(JSON.parse(storedAdmin));
    fetchStats();
  }, [navigate]);

  const fetchStats = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/admin/dashboard`, {
        withCredentials: true,
      });
      setStats(response.data);
    } catch (error) {
      console.error("Error fetching stats:", error);
      if (error.response?.status === 401) {
        localStorage.removeItem("adminData");
        navigate("/admin/login");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post(`${API_URL}/api/admin/logout`, {}, { withCredentials: true });
    } catch (error) {
      console.error("Logout error:", error);
    }
    localStorage.removeItem("adminData");
    navigate("/admin/login");
  };

  if (loading) {
    return (
      <div className="admin-container">
        <div className="loading">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="admin-container">
      <header className="admin-header">
        <h1>🍔 Food Reel Admin</h1>
        <div className="admin-user">
          <span>Welcome, {adminData?.fullName || "Admin"}</span>
          <button onClick={handleLogout} className="logout-btn">
            Logout
          </button>
        </div>
      </header>

      <main className="admin-main">
        <h2>Dashboard Overview</h2>

        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">👥</div>
            <div className="stat-info">
              <h3>{stats.totalUsers}</h3>
              <p>Total Users</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">🏪</div>
            <div className="stat-info">
              <h3>{stats.totalFoodPartners}</h3>
              <p>Food Partners</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">🍕</div>
            <div className="stat-info">
              <h3>{stats.totalFoodItems}</h3>
              <p>Food Items</p>
            </div>
          </div>
        </div>

        <h2>Manage</h2>
        <div className="nav-grid">
          <Link to="/admin/users" className="nav-card">
            <span className="nav-icon">👥</span>
            <span>Manage Users</span>
          </Link>
          <Link to="/admin/food-partners" className="nav-card">
            <span className="nav-icon">🏪</span>
            <span>Manage Food Partners</span>
          </Link>
          <Link to="/admin/food-items" className="nav-card">
            <span className="nav-icon">🍕</span>
            <span>Manage Food Items</span>
          </Link>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;


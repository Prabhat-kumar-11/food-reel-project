import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../../App";
import "./admin.css";

const ManageFoodPartners = () => {
  const navigate = useNavigate();
  const [foodPartners, setFoodPartners] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedAdmin = localStorage.getItem("adminData");
    if (!storedAdmin) {
      navigate("/admin/login");
      return;
    }
    fetchFoodPartners();
  }, [navigate]);

  const fetchFoodPartners = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/admin/food-partners`, {
        withCredentials: true,
      });
      setFoodPartners(response.data.foodPartners);
    } catch (error) {
      console.error("Error fetching food partners:", error);
      if (error.response?.status === 401) {
        localStorage.removeItem("adminData");
        navigate("/admin/login");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (
      !window.confirm(
        `Are you sure you want to delete food partner "${name}"? This will also delete all their food items.`
      )
    ) {
      return;
    }

    try {
      await axios.delete(`${API_URL}/api/admin/food-partners/${id}`, {
        withCredentials: true,
      });
      setFoodPartners(foodPartners.filter((fp) => fp._id !== id));
    } catch (error) {
      console.error("Error deleting food partner:", error);
      alert("Failed to delete food partner");
    }
  };

  if (loading) {
    return (
      <div className="admin-container">
        <div className="loading">Loading food partners...</div>
      </div>
    );
  }

  return (
    <div className="admin-container">
      <header className="admin-header">
        <h1>🏪 Manage Food Partners</h1>
      </header>

      <main className="admin-main">
        <Link to="/admin/dashboard" className="back-link">
          ← Back to Dashboard
        </Link>

        <h2>All Food Partners ({foodPartners.length})</h2>

        {foodPartners.length === 0 ? (
          <p>No food partners found.</p>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Business Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Location</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {foodPartners.map((fp) => (
                <tr key={fp._id}>
                  <td>{fp.businessName}</td>
                  <td>{fp.email}</td>
                  <td>{fp.phone || "N/A"}</td>
                  <td>{fp.location || "N/A"}</td>
                  <td>{new Date(fp.createdAt).toLocaleDateString()}</td>
                  <td>
                    <button
                      className="delete-btn"
                      onClick={() => handleDelete(fp._id, fp.businessName)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </main>
    </div>
  );
};

export default ManageFoodPartners;


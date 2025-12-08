import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../../App";
import "./admin.css";

const ManageFoodItems = () => {
  const navigate = useNavigate();
  const [foodItems, setFoodItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedAdmin = localStorage.getItem("adminData");
    if (!storedAdmin) {
      navigate("/admin/login");
      return;
    }
    fetchFoodItems();
  }, [navigate]);

  const fetchFoodItems = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/admin/food-items`, {
        withCredentials: true,
      });
      setFoodItems(response.data.foodItems);
    } catch (error) {
      console.error("Error fetching food items:", error);
      if (error.response?.status === 401) {
        localStorage.removeItem("adminData");
        navigate("/admin/login");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete "${name}"?`)) {
      return;
    }

    try {
      await axios.delete(`${API_URL}/api/admin/food-items/${id}`, {
        withCredentials: true,
      });
      setFoodItems(foodItems.filter((item) => item._id !== id));
    } catch (error) {
      console.error("Error deleting food item:", error);
      alert("Failed to delete food item");
    }
  };

  if (loading) {
    return (
      <div className="admin-container">
        <div className="loading">Loading food items...</div>
      </div>
    );
  }

  return (
    <div className="admin-container">
      <header className="admin-header">
        <h1>🍕 Manage Food Items</h1>
      </header>

      <main className="admin-main">
        <Link to="/admin/dashboard" className="back-link">
          ← Back to Dashboard
        </Link>

        <h2>All Food Items ({foodItems.length})</h2>

        {foodItems.length === 0 ? (
          <p>No food items found.</p>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Preview</th>
                <th>Name</th>
                <th>Price</th>
                <th>Partner</th>
                <th>Likes</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {foodItems.map((item) => (
                <tr key={item._id}>
                  <td>
                    {item.videoUrl ? (
                      <video
                        src={item.videoUrl}
                        style={{ width: "80px", height: "60px", objectFit: "cover", borderRadius: "4px" }}
                        muted
                      />
                    ) : (
                      "No video"
                    )}
                  </td>
                  <td>{item.name}</td>
                  <td>₹{item.price}</td>
                  <td>{item.foodPartner?.businessName || "Unknown"}</td>
                  <td>{item.likes?.length || 0}</td>
                  <td>{new Date(item.createdAt).toLocaleDateString()}</td>
                  <td>
                    <button
                      className="delete-btn"
                      onClick={() => handleDelete(item._id, item.name)}
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

export default ManageFoodItems;


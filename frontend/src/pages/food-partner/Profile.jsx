import React, { useState, useEffect } from "react";
import "./profile.css";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../../App";

const Profile = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [profile, setprofile] = useState(null);
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    axios
      .get(`${API_URL}/api/food-partner/${id}`, { withCredentials: true })
      .then((response) => {
        setprofile(response.data.foodPartner);
        setVideos(response.data.foodPartner.foodItems || []);
      })
      .catch((error) => {
        console.error("Error fetching business data:", error);
      });
  }, [id]);

  if (!profile) {
    return (
      <div className="profile-container">
        <div className="profile-loading">Loading profile...</div>
      </div>
    );
  }
  return (
    <div className="profile-container">
      {/* Back Button */}
      <button className="profile-back-btn" onClick={() => navigate(-1)}>
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
        </svg>
        Back
      </button>

      {/* Business Header Section */}
      <div className="business-header">
        <div className="header-top">
          <div className="profile-circle">
            {profile.profileImage ? (
              <img src={profile.profileImage} alt="Business" />
            ) : (
              <img
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQF02Jj8T2t7PdkytAw42HDuuSz7yXguKn8Lg&s"
                alt="Default Business"
              />
            )}
          </div>
          <div className="business-info">
            <div className="info-item">
              <h2 className="business-name">{profile.name}</h2>
            </div>
            <div className="info-item">
              <p className="business-address">{profile.address}</p>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="stats-section">
          <div className="stat-item">
            <p className="stat-label">total meals</p>
            <p className="stat-value">{profile.totalMeals}</p>
          </div>
          <div className="stat-item">
            <p className="stat-label">customer serve</p>
            <p className="stat-value">{profile.customerServe}</p>
          </div>
        </div>
      </div>

      {/* Videos Grid Section */}
      <div className="videos-section">
        <div className="videos-grid">
          {videos.map((video, index) => (
            <div key={index} className="video-item">
              <div className="">
                <video
                  style={{ objectFit: "cover", width: "100%", height: "100%" }}
                  src={video.video}
                  muted
                ></video>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Profile;

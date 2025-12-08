import React, { useState, useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../App";

// Keys for localStorage
const AUTH_KEY = "isLoggedIn";
const AUTH_ROLE_KEY = "userRole";
const ADMIN_KEY = "adminData";

// Axios config
const axiosConfig = {
  withCredentials: true,
  validateStatus: (status) => status < 500,
};

// Loading Spinner Component
const LoadingSpinner = () => (
  <div className="route-loading">
    <div className="spinner"></div>
  </div>
);

// Helper to check if user might be logged in (quick localStorage check)
const mightBeLoggedIn = () => localStorage.getItem(AUTH_KEY) === "true";
const mightBeAdmin = () => !!localStorage.getItem(ADMIN_KEY);

// Helper to verify auth with server and update localStorage
const verifyAuth = async () => {
  try {
    const response = await axios.get(`${API_URL}/api/auth/me`, axiosConfig);
    if (response.status === 200 && response.data.user) {
      localStorage.setItem(AUTH_KEY, "true");
      localStorage.setItem(AUTH_ROLE_KEY, response.data.role || "user");
      return { authenticated: true, role: response.data.role };
    }
  } catch (e) {
    // Silent fail
  }
  localStorage.removeItem(AUTH_KEY);
  localStorage.removeItem(AUTH_ROLE_KEY);
  return { authenticated: false, role: null };
};

// Helper to verify admin auth
const verifyAdminAuth = async () => {
  try {
    const response = await axios.get(`${API_URL}/api/admin/me`, axiosConfig);
    if (response.status === 200 && response.data.role === "admin") {
      return true;
    }
  } catch (e) {
    // Silent fail
  }
  localStorage.removeItem(ADMIN_KEY);
  return false;
};

// Private Route - requires user or food partner login
export const PrivateRoute = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const checkAuth = async () => {
      // Quick check - if no localStorage flag, redirect immediately
      if (!mightBeLoggedIn()) {
        setIsAuthenticated(false);
        setLoading(false);
        return;
      }
      // Verify with server
      const { authenticated } = await verifyAuth();
      setIsAuthenticated(authenticated);
      setLoading(false);
    };
    checkAuth();
  }, []);

  if (loading) return <LoadingSpinner />;
  if (!isAuthenticated) {
    return <Navigate to="/user/login" state={{ from: location }} replace />;
  }
  return children;
};

// Public Route - redirects to home if already logged in
export const PublicRoute = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      // Quick check - if no localStorage flag, allow access immediately
      if (!mightBeLoggedIn()) {
        setIsAuthenticated(false);
        setLoading(false);
        return;
      }
      // Verify with server
      const { authenticated } = await verifyAuth();
      setIsAuthenticated(authenticated);
      setLoading(false);
    };
    checkAuth();
  }, []);

  if (loading) return <LoadingSpinner />;
  if (isAuthenticated) return <Navigate to="/home" replace />;
  return children;
};

// Food Partner Route - requires food partner login
export const FoodPartnerRoute = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [isFoodPartner, setIsFoodPartner] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const checkAuth = async () => {
      // Quick check
      if (
        !mightBeLoggedIn() ||
        localStorage.getItem(AUTH_ROLE_KEY) !== "foodPartner"
      ) {
        setIsFoodPartner(false);
        setLoading(false);
        return;
      }
      // Verify with server
      const { authenticated, role } = await verifyAuth();
      setIsFoodPartner(authenticated && role === "foodPartner");
      setLoading(false);
    };
    checkAuth();
  }, []);

  if (loading) return <LoadingSpinner />;
  if (!isFoodPartner) {
    return (
      <Navigate to="/food-partner/login" state={{ from: location }} replace />
    );
  }
  return children;
};

// Admin Route - requires admin login
export const AdminRoute = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const checkAuth = async () => {
      // Quick check
      if (!mightBeAdmin()) {
        setIsAdmin(false);
        setLoading(false);
        return;
      }
      // Verify with server
      const verified = await verifyAdminAuth();
      setIsAdmin(verified);
      setLoading(false);
    };
    checkAuth();
  }, []);

  if (loading) return <LoadingSpinner />;
  if (!isAdmin) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }
  return children;
};

export default PrivateRoute;

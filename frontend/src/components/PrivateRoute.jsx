import React, { useState, useEffect, useRef } from "react";
import { Navigate, useLocation } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../App";

// Keys for localStorage
const AUTH_KEY = "isLoggedIn";
const AUTH_ROLE_KEY = "userRole";
const ADMIN_KEY = "adminData";
const AUTH_TIMESTAMP_KEY = "authTimestamp";
const SESSION_MAX_AGE = 7 * 24 * 60 * 60 * 1000; // 7 days in ms

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

// Clear all auth data from localStorage
const clearAuthData = () => {
  localStorage.removeItem(AUTH_KEY);
  localStorage.removeItem(AUTH_ROLE_KEY);
  localStorage.removeItem(AUTH_TIMESTAMP_KEY);
};

// Check if session might still be valid (not expired based on timestamp)
const isSessionPossiblyValid = () => {
  const isLoggedIn = localStorage.getItem(AUTH_KEY) === "true";
  if (!isLoggedIn) return false;

  const timestamp = localStorage.getItem(AUTH_TIMESTAMP_KEY);
  if (!timestamp) {
    // No timestamp = old session, clear it
    clearAuthData();
    return false;
  }

  const elapsed = Date.now() - parseInt(timestamp, 10);
  if (elapsed > SESSION_MAX_AGE) {
    // Session expired, clear it
    clearAuthData();
    return false;
  }

  return true;
};

const mightBeAdmin = () => !!localStorage.getItem(ADMIN_KEY);

// Helper to verify auth with server and update localStorage
const verifyAuth = async () => {
  try {
    const response = await axios.get(`${API_URL}/api/auth/me`, axiosConfig);
    if (response.status === 200 && response.data.user) {
      localStorage.setItem(AUTH_KEY, "true");
      localStorage.setItem(AUTH_ROLE_KEY, response.data.role || "user");
      localStorage.setItem(AUTH_TIMESTAMP_KEY, Date.now().toString());
      return { authenticated: true, role: response.data.role };
    }
  } catch (e) {
    // Silent fail
  }
  clearAuthData();
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
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;
    const checkAuth = async () => {
      // Quick check - if session not possibly valid, redirect immediately
      if (!isSessionPossiblyValid()) {
        if (isMounted.current) {
          setIsAuthenticated(false);
          setLoading(false);
        }
        return;
      }
      // Verify with server
      const { authenticated } = await verifyAuth();
      if (isMounted.current) {
        setIsAuthenticated(authenticated);
        setLoading(false);
      }
    };
    checkAuth();
    return () => {
      isMounted.current = false;
    };
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
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;
    const checkAuth = async () => {
      // Quick check - if session not possibly valid, allow access immediately
      if (!isSessionPossiblyValid()) {
        if (isMounted.current) {
          setIsAuthenticated(false);
          setLoading(false);
        }
        return;
      }
      // Verify with server
      const { authenticated } = await verifyAuth();
      if (isMounted.current) {
        setIsAuthenticated(authenticated);
        setLoading(false);
      }
    };
    checkAuth();
    return () => {
      isMounted.current = false;
    };
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
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;
    const checkAuth = async () => {
      // Quick check
      if (
        !isSessionPossiblyValid() ||
        localStorage.getItem(AUTH_ROLE_KEY) !== "foodPartner"
      ) {
        if (isMounted.current) {
          setIsFoodPartner(false);
          setLoading(false);
        }
        return;
      }
      // Verify with server
      const { authenticated, role } = await verifyAuth();
      if (isMounted.current) {
        setIsFoodPartner(authenticated && role === "foodPartner");
        setLoading(false);
      }
    };
    checkAuth();
    return () => {
      isMounted.current = false;
    };
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
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;
    const checkAuth = async () => {
      // Quick check
      if (!mightBeAdmin()) {
        if (isMounted.current) {
          setIsAdmin(false);
          setLoading(false);
        }
        return;
      }
      // Verify with server
      const verified = await verifyAdminAuth();
      if (isMounted.current) {
        setIsAdmin(verified);
        setLoading(false);
      }
    };
    checkAuth();
    return () => {
      isMounted.current = false;
    };
  }, []);

  if (loading) return <LoadingSpinner />;
  if (!isAdmin) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }
  return children;
};

export default PrivateRoute;

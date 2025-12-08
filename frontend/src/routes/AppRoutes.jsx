import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import UserRegister from "../pages/auth/UserRegister";
import UserLogin from "../pages/auth/UserLogin";
import FoodPartnerRegister from "../pages/auth/FoodPartnerRegister";
import FoodPartnerLogin from "../pages/auth/FoodPartnerLogin";
import ChooseRegister from "../pages/auth/ChooseRegister";
import HomeGeneral from "../pages/general/HomeGeneral";
import Saved from "../pages/general/Saved";
import CreateFood from "../pages/food-partner/CreateFood";
import Profile from "../pages/food-partner/Profile";
import ForgotPassword from "../pages/auth/ForgotPassword";
import ResetPassword from "../pages/auth/ResetPassword";

// Admin pages
import AdminLogin from "../pages/admin/AdminLogin";
import AdminDashboard from "../pages/admin/AdminDashboard";
import ManageUsers from "../pages/admin/ManageUsers";
import ManageFoodPartners from "../pages/admin/ManageFoodPartners";
import ManageFoodItems from "../pages/admin/ManageFoodItems";

// Private Route Components
import {
  PrivateRoute,
  PublicRoute,
  FoodPartnerRoute,
  AdminRoute,
} from "../components/PrivateRoute";

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        {/* Public Routes - redirect to home if logged in */}
        <Route
          path="/"
          element={
            <PublicRoute>
              <ChooseRegister />
            </PublicRoute>
          }
        />
        <Route
          path="/user/register"
          element={
            <PublicRoute>
              <UserRegister />
            </PublicRoute>
          }
        />
        <Route
          path="/user/login"
          element={
            <PublicRoute>
              <UserLogin />
            </PublicRoute>
          }
        />
        <Route
          path="/food-partner/register"
          element={
            <PublicRoute>
              <FoodPartnerRegister />
            </PublicRoute>
          }
        />
        <Route
          path="/food-partner/login"
          element={
            <PublicRoute>
              <FoodPartnerLogin />
            </PublicRoute>
          }
        />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* Protected Routes - require user/food partner login */}
        <Route
          path="/home"
          element={
            <PrivateRoute>
              <HomeGeneral />
            </PrivateRoute>
          }
        />
        <Route
          path="/saved"
          element={
            <PrivateRoute>
              <Saved />
            </PrivateRoute>
          }
        />
        <Route
          path="/food-partner/:id"
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          }
        />

        {/* Food Partner Only Routes */}
        <Route
          path="/create-food"
          element={
            <FoodPartnerRoute>
              <CreateFood />
            </FoodPartnerRoute>
          }
        />

        {/* Admin Routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route
          path="/admin/dashboard"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <AdminRoute>
              <ManageUsers />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/food-partners"
          element={
            <AdminRoute>
              <ManageFoodPartners />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/food-items"
          element={
            <AdminRoute>
              <ManageFoodItems />
            </AdminRoute>
          }
        />
      </Routes>
    </Router>
  );
};

export default AppRoutes;

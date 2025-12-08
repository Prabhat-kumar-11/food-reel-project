const express = require("express");
const adminController = require("../controllers/admin.controller");
const authMiddleware = require("../middlewares/auth.middlewares");

const router = express.Router();

// Auth routes (public)
router.post("/register", adminController.registerAdmin);
router.post("/login", adminController.loginAdmin);
router.post("/logout", adminController.logoutAdmin);

// Session check (no middleware - checks token internally)
router.get("/me", adminController.getAdminMe);

// Protected routes (require admin auth)
router.get(
  "/profile",
  authMiddleware.authAdminMiddleware,
  adminController.getAdminProfile
);

router.get(
  "/dashboard",
  authMiddleware.authAdminMiddleware,
  adminController.getDashboardStats
);

// Users management
router.get(
  "/users",
  authMiddleware.authAdminMiddleware,
  adminController.getAllUsers
);

router.delete(
  "/users/:id",
  authMiddleware.authAdminMiddleware,
  adminController.deleteUser
);

// Food Partners management
router.get(
  "/food-partners",
  authMiddleware.authAdminMiddleware,
  adminController.getAllFoodPartners
);

router.delete(
  "/food-partners/:id",
  authMiddleware.authAdminMiddleware,
  adminController.deleteFoodPartner
);

// Food Items management
router.get(
  "/food-items",
  authMiddleware.authAdminMiddleware,
  adminController.getAllFoodItems
);

router.delete(
  "/food-items/:id",
  authMiddleware.authAdminMiddleware,
  adminController.deleteFoodItem
);

module.exports = router;

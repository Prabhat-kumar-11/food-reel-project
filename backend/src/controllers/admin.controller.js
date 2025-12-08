const adminModel = require("../models/admin.model");
const userModel = require("../models/user.model");
const foodPartnerModel = require("../models/foodpartner.model");
const foodModel = require("../models/food.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Helper to get cookie options based on request origin
const getCookieOptions = (req) => {
  const origin = req?.headers?.origin || "";
  const isProduction =
    process.env.NODE_ENV === "production" ||
    origin.includes("onrender.com") ||
    origin.includes("vercel.app") ||
    origin.startsWith("https://");

  return {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    path: "/",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  };
};

// ==================== AUTH ====================

async function registerAdmin(req, res) {
  try {
    const { fullName, email, password } = req.body;

    const existingAdmin = await adminModel.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({ message: "Admin already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const admin = await adminModel.create({
      fullName,
      email,
      password: hashedPassword,
    });

    res.status(201).json({
      message: "Admin registered successfully",
      admin: { id: admin._id, fullName: admin.fullName, email: admin.email },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
}

async function loginAdmin(req, res) {
  try {
    const { email, password } = req.body;

    const admin = await adminModel.findOne({ email });
    if (!admin) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: admin._id, role: "admin" },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie("adminToken", token, getCookieOptions(req));
    res.status(200).json({
      message: "Login successful",
      admin: { id: admin._id, fullName: admin.fullName, email: admin.email },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
}

async function logoutAdmin(req, res) {
  res.clearCookie("adminToken", getCookieOptions(req));
  res.status(200).json({ message: "Logged out successfully" });
}

// Get admin session (no middleware required)
async function getAdminMe(req, res) {
  try {
    const token = req.cookies.adminToken;
    if (!token) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== "admin") {
      return res.status(401).json({ message: "Not an admin" });
    }

    const admin = await adminModel.findById(decoded.id).select("-password");
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    return res.status(200).json({ admin, role: "admin" });
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}

async function getAdminProfile(req, res) {
  try {
    const admin = await adminModel.findById(req.admin._id).select("-password");
    res.status(200).json({ admin });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
}

// ==================== DASHBOARD STATS ====================

async function getDashboardStats(req, res) {
  try {
    const totalUsers = await userModel.countDocuments();
    const totalFoodPartners = await foodPartnerModel.countDocuments();
    const totalFoodItems = await foodModel.countDocuments();

    res.status(200).json({
      totalUsers,
      totalFoodPartners,
      totalFoodItems,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
}

// ==================== USERS CRUD ====================

async function getAllUsers(req, res) {
  try {
    const users = await userModel
      .find()
      .select("-password")
      .sort({ createdAt: -1 });
    res.status(200).json({ users });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
}

async function deleteUser(req, res) {
  try {
    const { id } = req.params;
    const user = await userModel.findByIdAndDelete(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
}

// ==================== FOOD PARTNERS CRUD ====================

async function getAllFoodPartners(req, res) {
  try {
    const foodPartners = await foodPartnerModel
      .find()
      .select("-password")
      .sort({ createdAt: -1 });
    res.status(200).json({ foodPartners });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
}

async function deleteFoodPartner(req, res) {
  try {
    const { id } = req.params;
    const foodPartner = await foodPartnerModel.findByIdAndDelete(id);
    if (!foodPartner) {
      return res.status(404).json({ message: "Food Partner not found" });
    }
    // Also delete all food items by this partner
    await foodModel.deleteMany({ foodPartner: id });
    res.status(200).json({
      message: "Food Partner and their food items deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
}

// ==================== FOOD ITEMS CRUD ====================

async function getAllFoodItems(req, res) {
  try {
    const foodItems = await foodModel
      .find()
      .populate("foodPartner", "businessName email")
      .sort({ createdAt: -1 });
    res.status(200).json({ foodItems });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
}

async function deleteFoodItem(req, res) {
  try {
    const { id } = req.params;
    const foodItem = await foodModel.findByIdAndDelete(id);
    if (!foodItem) {
      return res.status(404).json({ message: "Food item not found" });
    }
    res.status(200).json({ message: "Food item deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
}

module.exports = {
  registerAdmin,
  loginAdmin,
  logoutAdmin,
  getAdminMe,
  getAdminProfile,
  getDashboardStats,
  getAllUsers,
  deleteUser,
  getAllFoodPartners,
  deleteFoodPartner,
  getAllFoodItems,
  deleteFoodItem,
};

const express = require("express");
const foodPartnerController = require("../controllers/food-partner.controller");

const router = express.Router();

// /api/food-partner/:id - Public route (anyone can view food partner profiles)
router.get("/:id", foodPartnerController.getFoodPartnerById);

module.exports = router;

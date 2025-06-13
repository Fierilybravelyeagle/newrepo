// Needed Resources
const express = require("express");
const router = new express.Router();
const manageController = require("../controllers/manageController");

// Route to build inventory by classification view
router.get("/inv", manageController.buildManagementView);

module.exports = router;

// Needed Resources
const express = require("express");
const router = new express.Router();
const invController = require("../controllers/invController");
const manageController = require("../controllers/manageController");
const AddNewClassificationController = require("../controllers/AddNewClassificationController");
const AddNewInventoryController = require("../controllers/AddNewInventoryController");
const classValidate = require("../utilities/classification-validation");
const invValidate = require("../utilities/inventory-validation");
const utilities = require("../utilities/");

// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);

// Route to build management view
router.get("/", manageController.buildManagementView);

// Route to build add classification form view
router.get(
  "/AddNewClassification",
  AddNewClassificationController.buildAddNewClassificationView
);

// Route to build add inventory form view
router.get(
  "/AddNewInventory",
  AddNewInventoryController.buildAddNewInventoryView
);

// Route to handle new classification submission
router.post(
  "/AddNewClassification",
  classValidate.classRules(),
  classValidate.checkClassData,
  utilities.handleErrors(AddNewClassificationController.AddedNewClassification)
);

// Route to handle new inventory submission
router.post(
  "/AddNewInventory",
  invValidate.invRules(),
  invValidate.checkInvData,
  utilities.handleErrors(AddNewInventoryController.AddedNewInventory)
);

module.exports = router;

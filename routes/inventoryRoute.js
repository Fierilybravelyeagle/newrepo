const express = require("express");
const router = new express.Router();
const invController = require("../controllers/invController");
const manageController = require("../controllers/manageController");
const AddNewClassificationController = require("../controllers/AddNewClassificationController");
const AddNewInventoryController = require("../controllers/AddNewInventoryController");
const classValidate = require("../utilities/classification-validation");
const invValidate = require("../utilities/inventory-validation");
const utilities = require("../utilities/");
const accountController = require("../controllers/accountController");
const accountValidate = require("../utilities/account-validation");

// Route to build inventory by classification view (public)
router.get("/type/:classificationId", invController.buildByClassificationId);

// Route to build management view (protected)
router.get(
  "/",
  invValidate.checkEmployeeOrAdmin,
  manageController.buildManagementView
);

// Route to build add classification form view (protected)
router.get(
  "/AddNewClassification",
  invValidate.checkEmployeeOrAdmin,
  AddNewClassificationController.buildAddNewClassificationView
);

// Route to build add inventory form view (protected)
router.get(
  "/AddNewInventory",
  invValidate.checkEmployeeOrAdmin,
  AddNewInventoryController.buildAddNewInventoryView
);

// Route to handle new classification submission (protected)
router.post(
  "/AddNewClassification",
  invValidate.checkEmployeeOrAdmin,
  classValidate.classRules(),
  classValidate.checkClassData,
  utilities.handleErrors(AddNewClassificationController.AddedNewClassification)
);

// Route to handle new inventory submission (protected)
router.post(
  "/AddNewInventory",
  invValidate.checkEmployeeOrAdmin,
  invValidate.invRules(),
  invValidate.checkInvData,
  utilities.handleErrors(AddNewInventoryController.AddedNewInventory)
);

// Route to get inventory in JSON format (likely used by JS in management view — protect it)
router.get(
  "/getInventory/:classification_id",
  invValidate.checkEmployeeOrAdmin,
  utilities.handleErrors(invController.getInventoryJSON)
);

// Route to build edit inventory view (protected)
router.get(
  "/edit/:inventory_id",
  invValidate.checkEmployeeOrAdmin,
  utilities.handleErrors(invController.buildItemIditingForm)
);

// Route to handle update inventory POST (protected)
router.post(
  "/update/",
  invValidate.checkEmployeeOrAdmin,
  invValidate.invRules(),
  invValidate.checkUpdateData,
  utilities.handleErrors(invController.updateInventory)
);

// Route to build delete confirmation view (protected)
router.get(
  "/delete/:inventory_id",
  invValidate.checkEmployeeOrAdmin,
  utilities.handleErrors(invController.buildItemDeleteForm)
);

// Route to carry out deletion (protected)
router.post(
  "/delete/",
  invValidate.checkEmployeeOrAdmin,
  invValidate.checkDeleteData,
  utilities.handleErrors(invController.deleteInventory)
);

router.get("/update/:account_id", 
  utilities.checkLogin, 
  utilities.handleErrors(accountController.buildUpdateForm)
);

router.post(
  "/update",
  accountValidate.updateRules(),
  accountValidate.checkUpdateData,
  utilities.handleErrors(accountController.updateAccount)
);



module.exports = router;

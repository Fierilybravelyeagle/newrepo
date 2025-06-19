const express = require("express");
const router = new express.Router();
const buyController = require("../controllers/buyController");
const invController = require("../controllers/invController");
const utilities = require("../utilities/");

// Show buy form
router.get("/", utilities.handleErrors(buyController.buildBuyView));

// Public inventory fetch for classification
router.get(
  "/getInventory/:classification_id",
  utilities.handleErrors(invController.getInventoryJSON)
);

router.get("/buyForm/:inventory_id", utilities.handleErrors(buyController.getBuyFormView));

router.post("/confirm", utilities.handleErrors(buyController.confirmPurchase));

module.exports = router;

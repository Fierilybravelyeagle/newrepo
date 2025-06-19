const express = require("express");
const router = new express.Router();

// Controllers and Utilities
const accountController = require("../controllers/accountController");
const manageController = require("../controllers/manageController");
const utilities = require("../utilities");
const accountValidate = require("../utilities/account-validation"); // ✅ Correct variable name

// ==============================
// VIEWS (GET Requests)
// ==============================

// Show login view
router.get("/login", utilities.handleErrors(accountController.buildLoginView));

// Show register view
router.get(
  "/register",
  utilities.handleErrors(accountController.buildRegisterView)
);

// Show account management dashboard (protected)
router.get(
  "/",
  utilities.checkLogin,
  utilities.handleErrors(accountController.loggedAccount)
);

// Show update form (protected)
router.get(
  "/update/:account_id",
  utilities.handleErrors(accountController.getUpdateAccountView)
);

// Optional logout route
router.get("/logout", accountController.logout);

// ==============================
// FORM ACTIONS (POST Requests)
// ==============================

// Process registration
router.post(
  "/register",
  accountValidate.registrationRules(),
  accountValidate.checkRegData,
  utilities.handleErrors(accountController.registerAccount)
);

// Process login
router.post(
  "/login",
  accountValidate.loginRules(),
  accountValidate.checkLogData,
  utilities.handleErrors(accountController.accountLogin)
);

// Update account info (protected)
router.post(
  "/update",
  accountValidate.accountUpdateRules(),
  accountValidate.checkUpdateData,
  utilities.handleErrors(accountController.updateAccountInfo)
);

// Update password (protected)
router.post(
  "/update-password",
  accountValidate.passwordRules(),
  accountValidate.checkPasswordData,
  utilities.handleErrors(accountController.updatePassword)
);

module.exports = router;

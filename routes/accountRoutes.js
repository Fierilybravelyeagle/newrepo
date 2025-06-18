const express = require("express");
const router = new express.Router();
const accountController = require("../controllers/accountController");
const utilities = require("../utilities");
const validate = require("../utilities/account-validation");
const manageController = require("../controllers/manageController");

// Vistas
router.get("/login", utilities.handleErrors(accountController.buildLoginView));

router.get(
  "/register",
  utilities.handleErrors(accountController.buildRegisterView)
);
router.get(
  "/",
  utilities.checkLogin,
  utilities.handleErrors(accountController.loggedAccount)
);

// Procesos
router.post(
  "/register",
  validate.registrationRules(),
  validate.checkRegData,
  utilities.handleErrors(accountController.registerAccount)
);

router.post(
  "/login",
  validate.loginRules(),
  validate.checkLogData,
  utilities.handleErrors(accountController.accountLogin)
);

module.exports = router;

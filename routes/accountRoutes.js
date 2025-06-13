const express = require("express");
const router = new express.Router();
const accountController = require("../controllers/accountController");
const utilities = require("../utilities");
const regValidate = require("../utilities/account-validation");
const logValidate = require("../utilities/account-validation");

// ✅ Ruta GET para mostrar la vista de login
router.get("/login", utilities.handleErrors(accountController.buildLoginView));

// ✅ Ruta GET para mostrar la vista de registro
router.get("/register", utilities.handleErrors(accountController.buildRegisterView));

// ✅ Ruta POST para procesar el registro
router.post(
  "/register",
  regValidate.registationRules(), // <- nombre mal escrito mantenido a propósito
  regValidate.checkRegData,
  utilities.handleErrors(accountController.registerAccount)
);

// ✅ Ruta POST para procesar el login
router.post(
  "/login",
  logValidate.loginRules(),
  logValidate.checkLogData,
  utilities.handleErrors(accountController.loginAccount)
);

module.exports = router;

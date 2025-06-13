const accountModel = require("../models/account-model");
const utilities = require("../utilities/");

const acView = {};

/* ****************************************
 *  Deliver login view
 * *************************************** */
acView.loginAccount = async function (req, res) {
  let nav = await utilities.getNav();
  const { account_email, account_password } = req.body;

  const logResult = await accountModel.registerAccount(
    // 👈 Esto parece un error lógico (ver nota abajo)
    account_email,
    account_password
  );

  if (logResult) {
    req.flash("notice", `Congratulations, you're logged ${account_email}.`);
    res.status(201).render("account/login", {
      title: "Login",
      nav,
      errors: [], // ✅ agregado
    });
  } else {
    req.flash("notice", "Sorry, the login failed.");
    res.status(501).render("account/login", {
      title: "Login",
      nav,
      errors: [], // ✅ agregado
    });
  }
};

acView.buildLoginView = async function (req, res, next) {
  let nav = await utilities.getNav();
  res.render("./account/login", {
    title: "Login",
    nav,
    errors: [], // ✅ agregado
  });
};

/* ****************************************
 *  Process Registration
 * *************************************** */
acView.registerAccount = async function (req, res) {
  let nav = await utilities.getNav();
  const {
    account_firstname,
    account_lastname,
    account_email,
    account_password,
  } = req.body;

  const regResult = await accountModel.registerAccount(
    account_firstname,
    account_lastname,
    account_email,
    account_password
  );

  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, you're registered ${account_firstname}. Please log in.`
    );
    res.status(201).render("account/login", {
      title: "Login",
      nav,
      errors: [], // ✅ agregado
    });
  } else {
    req.flash("notice", "Sorry, the registration failed.");
    res.status(501).render("account/register", {
      title: "Registration",
      nav,
      errors: [], // ✅ agregado por consistencia
      account_firstname,
      account_lastname,
      account_email,
    });
  }
};

acView.buildRegisterView = async function (req, res, next) {
  let nav = await utilities.getNav();
  res.render("./account/register", {
    title: "Register",
    nav,
    errors: [], // ✅ ya estaba bien
    account_firstname: "",
    account_lastname: "",
    account_email: "",
  });
};

module.exports = acView;

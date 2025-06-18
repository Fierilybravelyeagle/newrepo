const accountModel = require("../models/account-model");
const utilities = require("../utilities/");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const accountController = {};

// Render login view
accountController.buildLoginView = async (req, res) => {
  const nav = await utilities.getNav();
  return res.render("./account/login", {
    title: "Login",
    nav,
    errors: [],
  });
};

// Render register view
accountController.buildRegisterView = async (req, res) => {
  const nav = await utilities.getNav();
  return res.render("./account/register", {
    title: "Register",
    nav,
    errors: [],
    account_firstname: "",
    account_lastname: "",
    account_email: "",
  });
};

// Process registration
accountController.registerAccount = async (req, res) => {
  const nav = await utilities.getNav();
  const {
    account_firstname,
    account_lastname,
    account_email,
    account_password,
  } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(account_password, 10);

    const regResult = await accountModel.registerAccount(
      account_firstname,
      account_lastname,
      account_email,
      hashedPassword
    );

    if (regResult) {
      req.flash(
        "notice",
        `Congratulations, you're registered ${account_firstname}. Please log in.`
      );
      return res.status(201).render("account/login", {
        title: "Login",
        nav,
        errors: [],
      });
    } else {
      req.flash("notice", "Sorry, the registration failed.");
      return res.status(501).render("account/register", {
        title: "Registration",
        nav,
        errors: [],
        account_firstname,
        account_lastname,
        account_email,
      });
    }
  } catch (error) {
    console.error("Registration error:", error);
    req.flash("notice", "There was an error processing your registration.");
    return res.status(500).render("account/register", {
      title: "Registration",
      nav,
      errors: [],
    });
  }
};

// Process login
accountController.accountLogin = async (req, res) => {
  const nav = await utilities.getNav();
  const { account_email, account_password } = req.body;

  const accountData = await accountModel.getAccountByEmail(account_email);

  if (!accountData) {
    req.flash("notice", "Please check your credentials and try again.");
    return res.status(400).render("account/login", {
      title: "Login",
      nav,
      errors: [],
      account_email,
    });
  }

  try {
    const passwordMatch = await bcrypt.compare(
      account_password,
      accountData.account_password
    );

    if (passwordMatch) {
      delete accountData.account_password;

      const token = jwt.sign(
        {
          account_id: accountData.account_id,
          account_firstname: accountData.account_firstname,
          account_lastname: accountData.account_lastname,
          account_email: accountData.account_email,
          account_type: accountData.account_type,
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "1h" }
      );

      res.cookie("jwt", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== "development",
        maxAge: 3600000,
      });

      return res.redirect("/account/");
    } else {
      req.flash("notice", "Please check your credentials and try again.");
      return res.status(400).render("account/login", {
        title: "Login",
        nav,
        errors: [],
        account_email,
      });
    }
  } catch (error) {
    console.error("Login error:", error);
    req.flash("notice", "Something went wrong. Please try again.");
    return res.status(500).render("account/login", {
      title: "Login",
      nav,
      errors: [],
      account_email,
    });
  }
};

// Render account management view
accountController.loggedAccount = async (req, res) => {
  const nav = await utilities.getNav();
  return res.render("account/logged", {
    title: "Account Management",
    nav,
    message: req.flash("notice"),
    errors: [],
  });
};

module.exports = accountController;

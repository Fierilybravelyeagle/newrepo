const invModel = require("../models/inventory-model");
const Util = {};
const jwt = require("jsonwebtoken");
require("dotenv").config();

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function () {
  let data = await invModel.getClassifications();

  let nav = `<nav class="navbar">
    <button class="hamburger" id="hamburger" aria-label="Toggle menu">☰</button>
    <ul class="nav-links" id="nav-links">
      <li><a href="/" title="Home page">Home</a></li>`;

  data.rows.forEach((row) => {
    nav += `<li>
      <a href="/inv/type/${row.classification_id}" title="See our inventory of ${row.classification_name} vehicles">
        ${row.classification_name}
      </a>
    </li>`;
  });

  nav += `</ul></nav>`;
  return nav;
};

/* **************************************
 * Build the classification view HTML
 * ************************************ */
Util.buildClassificationGrid = async function (data) {
  let grid = "";
  if (data.length > 0) {
    grid = '<ul id="inv-display">';
    data.forEach((vehicle) => {
      grid += "<li>";
      grid += '<div class="detCol1">';
      grid +=
        '<a href="/inv/detail/' +
        vehicle.inv_id +
        '" title="View ' +
        vehicle.inv_make +
        " " +
        vehicle.inv_model +
        ' details"><img src="' +
        vehicle.inv_thumbnail +
        '" alt="Image of ' +
        vehicle.inv_make +
        " " +
        vehicle.inv_model +
        ' on CSE Motors" /></a>';
      grid += '<div class="namePrice">';
      grid += "<hr />";
      grid += "<h2>";
      grid +=
        '<a href="/inv/detail/' +
        vehicle.inv_id +
        '" title="View ' +
        vehicle.inv_make +
        " " +
        vehicle.inv_model +
        ' details">' +
        vehicle.inv_make +
        " " +
        vehicle.inv_model +
        "</a>";
      grid += "</h2>";
      grid +=
        "<span>$" +
        new Intl.NumberFormat("en-US").format(vehicle.inv_price) +
        "</span>";
      grid += "</div>"; // close namePrice
      grid += "</div>"; // close detCol1
      grid += "</li>";
    });
    grid += "</ul>";
  } else {
    grid = '<p class="notice">Sorry, no matching vehicles could be found.</p>';
  }
  return grid;
};

/* **************************************
 * Build the detail grid view HTML
 * ************************************ */
Util.buildDetailGrid = async function (vehicle) {
  let grid = "";
  if (vehicle) {
    grid = '<ul id="detailGrid">';
    grid += '<div class="detCol1">';
    grid += "<h2>" + vehicle.inv_make + " " + vehicle.inv_model + "</h2>";
    grid +=
      '<a href="/inv/detail/' +
      vehicle.inv_id +
      '" title="View ' +
      vehicle.inv_make +
      " " +
      vehicle.inv_model +
      ' details"><img src="' +
      vehicle.inv_thumbnail +
      '" alt="Image of ' +
      vehicle.inv_make +
      " " +
      vehicle.inv_model +
      ' on CSE Motors" /></a>';
    grid += "</div>";

    grid += '<div id="detCol2">';
    grid += '<div class="price"><hr />';
    grid +=
      "<h2>" + vehicle.inv_make + " " + vehicle.inv_model + " Details</h2>";
    grid +=
      "<h2>Price: <span>$" +
      new Intl.NumberFormat("en-US").format(vehicle.inv_price) +
      "</span></h2></div>";

    grid += '<div class="descriptionDiv"><hr />';
    grid += '<h2 id="description">Description:</h2>';
    grid +=
      '<h2 id="descriptionText">' + vehicle.inv_description + "</h2></div>";

    grid += '<div class="colorDiv"><hr />';
    grid += '<h2 id="color">Color:</h2>';
    grid += '<h2 id="colorText">' + vehicle.inv_color + "</h2></div>";

    grid += '<div class="milesDiv"><hr />';
    grid += '<h2 id="miles">Miles:</h2>';
    grid += '<h2 id="milesText">' + vehicle.inv_miles + "</h2></div>";
    grid += "</div>"; // close detCol2
    grid += "</ul>";
  } else {
    grid = '<p class="notice">Sorry, no matching vehicles could be found.</p>';
  }
  return grid;
};

/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for
 * General Error Handling
 **************************************** */
Util.handleErrors = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

Util.buildClassificationList = async function (classification_id = null) {
  let data = await invModel.getClassifications();
  let classificationList =
    '<select name="classification_id" id="classificationList" required>';
  classificationList += "<option value=''>Choose a Classification</option>";
  data.rows.forEach((row) => {
    classificationList += '<option value="' + row.classification_id + '"';
    if (
      classification_id != null &&
      row.classification_id == classification_id
    ) {
      classificationList += " selected ";
    }
    classificationList += ">" + row.classification_name + "</option>";
  });
  classificationList += "</select>";
  return classificationList;
};

Util.checkJWTToken = (req, res, next) => {
  if (req.cookies.jwt) {
    jwt.verify(
      req.cookies.jwt,
      process.env.ACCESS_TOKEN_SECRET,
      function (err, accountData) {
        if (err) {
          req.flash("Please log in");
          res.clearCookie("jwt");
          return res.redirect("/account/login");
        }
        res.locals.accountData = accountData;
        res.locals.loggedin = 1;
        next();
      }
    );
  } else {
    next();
  }
};

Util.checkLogin = (req, res, next) => {
  if (res.locals.loggedin) {
    next();
  } else {
    req.flash("notice", "Please log in.");
    return res.redirect("/account/login");
  }
};

module.exports = Util;

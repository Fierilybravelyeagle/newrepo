const invModel = require("../models/inventory-model");
const Util = {};
const jwt = require("jsonwebtoken");
require("dotenv").config();

Util.requireLogin = (req, res, next) => {
  if (!res.locals.loggedin) {
    req.flash("notice", "You must be logged in to access this page.");
    return res.redirect("/account/login");
  }
  next();
};

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req = null) {
  // Get classifications
  let data = await invModel.getClassifications();

  // Start nav HTML
  let nav = `<nav class="navbar">
    <button class="hamburger" id="hamburger" aria-label="Toggle menu">☰</button>
    <ul class="nav-links" id="nav-links">
      <li><a href="/" title="Home page">Home</a></li>`;

  // Add classification links
  data.rows.forEach((row) => {
    nav += `<li>
      <a href="/inv/type/${row.classification_id}" title="See our inventory of ${row.classification_name} vehicles">
        ${row.classification_name}
      </a>
    </li>`;
  });

  // Show Management link for Employee or Admin
  if (req?.cookies?.jwt) {
    try {
      const decoded = jwt.verify(
        req.cookies.jwt,
        process.env.ACCESS_TOKEN_SECRET
      );
      const accountType = decoded.account_type;

      if (accountType === "Employee" || accountType === "Admin") {
        nav += `<li><a href="/inventory" title="Inventory Management">Management</a></li>`;
      }
    } catch (err) {
      // Token invalid or missing
    }
  }

  // Close nav
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
        ' details"><img id="detImg" src="' +
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
    
    grid += '<li class="detail-item">';
    grid += '<div id="detail-image-container" class="detCol1">';
    grid += `<a href="/inv/detail/${vehicle.inv_id}" id="detail-image-link" title="View ${vehicle.inv_make} ${vehicle.inv_model} details">`;
    grid += `<img id="detail-image" src="${vehicle.inv_thumbnail}" alt="Image of ${vehicle.inv_make} ${vehicle.inv_model} on CSE Motors" />`;
    grid += `</a>`;
    grid += "</div>";

    grid += '<div id="detail-info-container" class="detCol2">';
    
    grid += '<div id="price-section" class="price-section"><hr />';
    grid += `<h2 id="vehicle-title">${vehicle.inv_make} ${vehicle.inv_model} Details</h2>`;
    grid += `<h2 id="vehicle-price">Price: <span>$${new Intl.NumberFormat("en-US").format(vehicle.inv_price)}</span></h2>`;
    grid += "</div>";

    grid += '<div id="description-section" class="description-section"><hr />';
    grid += `<h3>Description:</h3>`;
    grid += `<p id="description-text">${vehicle.inv_description}</p>`;
    grid += "</div>";

    grid += '<div id="color-section" class="color-section"><hr />';
    grid += `<h3>Color:</h3>`;
    grid += `<p id="color-text">${vehicle.inv_color}</p>`;
    grid += "</div>";

    grid += '<div id="miles-section" class="miles-section"><hr />';
    grid += `<h3>Miles:</h3>`;
    grid += `<p id="miles-text">${vehicle.inv_miles}</p>`;
    grid += "</div>";

    grid += `<a href="/buy/buyForm/${vehicle.inv_id}" id="buy-button" class="buy-button">Buy This Car</a>`;
    
    grid += "</div>"; // close detail-info-container
    grid += "</li>";
    
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

Util.buildClassificationBuyList = async function (classification_id = null) {
  let data = await invModel.getClassifications();
  let classificationList =
    '<select name="classification_id" id="classificationBuyList" required>';
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

Util.checkLoginStatus = (req, res, next) => {
  const token = req.cookies.jwt;
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
      res.locals.loggedin = true;
      res.locals.accountData = decoded;
    } catch (error) {
      res.locals.loggedin = false;
      res.locals.accountData = null;
    }
  } else {
    res.locals.loggedin = false;
    res.locals.accountData = null;
  }
  next();
};

module.exports = Util;

const invModel = require("../models/inventory-model");
const Util = {};

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function () {
  let data = await invModel.getClassifications();
  let list = "<ul>";
  list += '<li><a href="/" title="Home page">Home</a></li>';
  data.rows.forEach((row) => {
    list += "<li>";
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      "</a>";
    list += "</li>";
  });
  list += "</ul>";
  return list;
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

module.exports = Util;

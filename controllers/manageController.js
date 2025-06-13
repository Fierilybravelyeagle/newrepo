const invModel = require("../models/inventory-model");
const utilities = require("../utilities/");

const manageCont = {};

/* ***************************
 *  Build inventory by classification view
 * ***************************/
manageCont.buildManagementView = async function (req, res, next) {
  try {
    let nav = await utilities.getNav();

    res.render("./inventory/management", {
      title: "Managemet",
      nav,
    });
  } catch (error) {
    console.error("buildManagementView error:", error);
    next(error);
  }
};

module.exports = manageCont;

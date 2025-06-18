const invModel = require("../models/inventory-model");
const utilities = require("../utilities/");

const manageCont = {};

/* ***************************
 *  Build inventory by classification view
 * ***************************/
manageCont.buildManagementView = async function (req, res, next) {
  try {
    let nav = await utilities.getNav();
    //... This is the empty space ...//
    const classificationSelect = await utilities.buildClassificationList()
    res.render("./inventory/management", {
      title: "Managemet",
      nav,
      classificationSelect,
    });
  } catch (error) {
    console.error("buildManagementView error:", error);
    next(error);
  }
};

module.exports = manageCont;

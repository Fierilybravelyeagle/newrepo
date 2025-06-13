const utilities = require("../utilities");
const invModel = require("../models/inventory-model");
const AddNewInvCont = {};

/* ***************************
 *  Build Add New Inventory View
 * ************************** */
AddNewInvCont.buildAddNewInventoryView = async function (req, res, next) {
  try {
    const nav = await utilities.getNav();
    const classificationList = await utilities.buildClassificationList();

    res.render("inventory/add-inventory", {
      title: "Add New Vehicle",
      nav,
      classificationList,
    });
  } catch (error) {
    console.error("Error loading add-inventory view:", error);
    next(error);
  }
};

AddNewInvCont.AddedNewInventory = async function (req, res, next) {
  try {
    const nav = await utilities.getNav();
    const {
      classification_id,
      inv_make,
      inv_model,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_year,
      inv_miles,
      inv_color,
    } = req.body;

    const invResult = await invModel.addVehicle(
      classification_id,
      inv_make,
      inv_model,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_year,
      inv_miles,
      inv_color
    );

    if (invResult) {
      req.flash(
        "notice",
        `Congratulations, you have added ${inv_make} ${inv_model} successfully!.`
      );
      return res.status(201).render("inventory/succesfulInvAdded", {
        title: "New Vehicle added",
        nav,
        errors: [],
      });
    }

    req.flash("notice", "Sorry, the process failed.");
    res.status(501).render("inventory/add-inventory", {
      title: "Add Inventory",
      nav,
      errors: [],
      classification_id,
      inv_make,
      inv_model,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_year,
      inv_miles,
      inv_color,
    });
  } catch (error) {
    console.error("AddedNewInventory error:", error);
    next(error); // Properly pass the error to Express
  }
};


module.exports = AddNewInvCont;

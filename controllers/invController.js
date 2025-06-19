const invModel = require("../models/inventory-model");
const detModel = require("../models/detail-model");
const utilities = require("../utilities/");

const invCont = {};

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  try {
    const classification_id = req.params.classificationId;
    const data = await invModel.getInventoryByClassificationId(
      classification_id
    );

    if (!data || data.length === 0) {
      return res.redirect("/");
    }

    const grid = await utilities.buildClassificationGrid(data);
    const nav = await utilities.getNav();
    const className = data[0].classification_name;

    console.log("Title:", className + " vehicles");
    console.log("Grid HTML:", grid);

    res.render("./inventory/classification", {
      title: className + " vehicles",
      nav,
      grid,
    });
  } catch (error) {
    console.error("buildByClassificationId error:", error);
    next(error);
  }
};

/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id);
  const invData = await invModel.getInventoryByClassificationId(
    classification_id
  );
  if (invData[0]?.inv_id) {
    return res.json(invData);
  } else {
    next(new Error("No data returned"));
  }
};

/* ***************************
 *  Build Edit Inventory Form
 * ************************** */
invCont.buildItemIditingForm = async function (req, res, next) {
  try {
    const inventory_id = parseInt(req.params.inventory_id);
    const nav = await utilities.getNav();
    const data = await detModel.getDataByInvId(inventory_id);
    const name = `${data.inv_make} ${data.inv_model}`;
    const classificationList = await utilities.buildClassificationList(
      data.classification_id
    );

    res.render("inventory/edit-inventory", {
      title: "Edit " + name,
      nav,
      classificationList,
      errors: null,
      ...data,
    });
  } catch (error) {
    console.error("Error loading edit-inventory view:", error);
    next(error);
  }
};

/* ***************************
 *  Update Inventory Data
 * ************************** */
invCont.updateInventory = async function (req, res, next) {
  const nav = await utilities.getNav();
  let {
    inv_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id,
  } = req.body;

  classification_id = parseInt(classification_id);

  const updateResult = await invModel.updateInventory(
    inv_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id
  );

  if (updateResult) {
    const itemName = updateResult.inv_make + " " + updateResult.inv_model;
    req.flash("notice", `The ${itemName} was successfully updated.`);
    res.redirect("/inv/");
  } else {
    const classificationList = await utilities.buildClassificationList(
      classification_id
    );
    const itemName = `${inv_make} ${inv_model}`;
    req.flash("notice", "Sorry, the update failed.");
    res.status(501).render("inventory/edit-inventory", {
      title: "Edit " + itemName,
      nav,
      classificationList,
      errors: null,
      inv_id,
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
      classification_id,
    });
  }
};

/* ***************************
 *  Build Delete Confirmation View
 * ************************** */
invCont.buildItemDeleteForm = async function (req, res, next) {
  try {
    const inventory_id = parseInt(req.params.inventory_id);
    const nav = await utilities.getNav();
    const data = await detModel.getDataByInvId(inventory_id);
    const name = `${data.inv_make} ${data.inv_model}`;

    res.render("inventory/delete-confirm", {
      title: "Delete " + name,
      nav,
      errors: null,
      inv_id: data.inv_id,
      inv_make: data.inv_make,
      inv_model: data.inv_model,
      inv_year: data.inv_year,
      inv_price: data.inv_price,
      classification_id: data.classification_id,
    });
  } catch (error) {
    console.error("Error loading delete-confirm view:", error);
    next(error);
  }
};

/* ***************************
 *  Delete Inventory Item
 * ************************** */
invCont.deleteInventory = async function (req, res, next) {
  const nav = await utilities.getNav();
  const inv_id = parseInt(req.body.inv_id); // ✅ FIXED HERE

  let { inv_make, inv_model, inv_price, inv_year, classification_id } =
    req.body;

  classification_id = parseInt(classification_id);

  const deleteResult = await invModel.deleteInventory(inv_id);

  if (deleteResult?.rowCount > 0) {
    const itemName = `${inv_make} ${inv_model}`;
    req.flash("notice", `The ${itemName} was successfully deleted.`);
    res.redirect("/inv/");
  } else {
    const itemName = `${inv_make} ${inv_model}`;
    req.flash("notice", "Sorry, the delete failed.");
    res.status(501).render("inventory/delete-confirm", {
      title: "Delete " + itemName,
      nav,
      errors: null,
      inv_make,
      inv_model,
      inv_year,
      inv_price,
      inv_id,
      classification_id,
    });
  }
};

module.exports = invCont;

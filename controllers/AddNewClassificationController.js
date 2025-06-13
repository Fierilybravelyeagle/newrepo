const classModel = require("../models/classification-model");
const utilities = require("../utilities/");

const AddNewClassiCont = {};

/* ***************************
 *  Build inventory by classification view
 * ************************** */
AddNewClassiCont.buildAddNewClassificationView = async function (
  req,
  res,
  next
) {
  try {
    let nav = await utilities.getNav();

    res.render("./inventory/add-classification", {
      title: "Add New Classification",
      nav,
    });
  } catch (error) {
    console.error("buildManagementView error:", error);
    next(error);
  }
};

AddNewClassiCont.AddedNewClassification = async function (req, res, next) {
  try {
    const nav = await utilities.getNav();
    const {
      classification_name
    } = req.body;

    const classResult = await classModel.addClassification(
      classification_name
    );

    if (classResult) {
      req.flash(
        "notice",
        `Congratulations, you have added a new classification successfully! ${classification_name}.`
      );
      return res.status(201).render("inventory/succesfulClassAdded", {
        title: "New Classification added",
        nav,
        errors: [],
      });
    }

    req.flash("notice", "Sorry, the process failed.");
    res.status(501).render("inventory/add-classification", {
      title: "Add Classification",
      nav,
      errors: [],
      classification_name,
    });
  } catch (error) {
    console.error("AddedNewClassification error:", error);
    next(error); // Properly pass the error to Express
  }
};



module.exports = AddNewClassiCont;

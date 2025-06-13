const { body, validationResult } = require("express-validator");
const utilities = require(".");
const validate = {};

/**********************************
 *  Classification Data Validation Rules
 **********************************/
validate.classRules = () => {
  return [
    body("classification_name")
      .trim()
      .notEmpty()
      .withMessage("Classification name is required.")
      .matches(/^[A-Za-z]+$/)
      .withMessage("Classification name must contain only alphabetic characters with no spaces or special characters."),
  ];
};

/**********************************
 *  Check classification data and return errors or continue
 **********************************/
validate.checkClassData = async (req, res, next) => {
  const { classification_name } = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    res.render("inventory/add-classification", {
      errors: errors.array(),
      title: "Add Classification",
      nav,
      classification_name,
    });
    return;
  }
  next();
};


module.exports = validate;


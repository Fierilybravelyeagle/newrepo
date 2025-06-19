/*const buyModel = require("../models/buy-model");*/
const utilities = require("../utilities/");
const detModel = require("../models/detail-model");

const buyCont = {};

/* ***************************
 *  Build inventory by classification view
 * ************************** */
buyCont.buildBuyView = async function (req, res, next) {
  try {
    const nav = await utilities.getNav();
    const classificationSelect = await utilities.buildClassificationBuyList();
    res.render("./buy/choose-car", {
      title: " BUY FORM ",
      nav,
      classificationSelect,
    });
  } catch (error) {
    console.error("buildForm error:", error);
    next(error);
  }
};

buyCont.getBuyFormView = async function (req, res, next) {
  try {
    const inventory_id = parseInt(req.params.inventory_id);
    const nav = await utilities.getNav();
    const data = await detModel.getDataByInvId(inventory_id);
    const name = `${data.inv_make} ${data.inv_model}`;
    const price = `${data.inv_price}`;

    res.render("buy/buy-form", {
      title: "Buy " + name,
      nav,
      price,
      errors: null,
      ...data,
    });
  } catch (error) {
    console.error("Error loading edit-inventory view:", error);
    next(error);
  }
};

buyCont.confirmPurchase = async (req, res) => {
  const { inv_id, buyer_name, buyer_email, buyer_address } = req.body;

  // You could save this to a "purchases" table or send an email here
  console.log("Purchase confirmed for:", buyer_name, "Item:", inv_id);

  req.flash("notice", "Thank you! Your purchase has been submitted.");
  req.flash("notice", "An email has been sent");
  res.redirect("/");
};

module.exports = buyCont;

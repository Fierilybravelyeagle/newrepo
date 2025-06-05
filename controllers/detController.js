const detModel = require("../models/detail-model");
const utilities = require("../utilities/");

const detCont = {};

/* ***************************
 *  Build detail by inventory
 * ************************** */
detCont.buildDetailbyInvId = async function (req, res, next) {
  try {
    const invId = req.params.inv_id;
    const data = await detModel.getDetailByInvId(invId);

    if (!data || data.length === 0) {
    return res.redirect('/');
}

    // Ensure we pass a single vehicle object to the utility
    const vehicle = data[0]; // ✅ Fix: use the first row object
    const grid = await utilities.buildDetailGrid(vehicle); // ✅ Pass object not array
    let nav = await utilities.getNav();

    const className =
      vehicle.inv_year + " " + vehicle.inv_make + " " + vehicle.inv_model;

    // Debug logs
    console.log("Title:", className);
    console.log("Grid HTML:", grid);

    // Render the detail view (adjust the path if your template differs)
    res.render("./inventory/detail", {
    title: className,
    nav,
    grid,
    });
    
  } catch (error) {
    console.error("buildDetailbyInvId error:", error);
    next(error);
  }
};

module.exports = detCont;

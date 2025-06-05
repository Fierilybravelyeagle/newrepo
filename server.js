/******************************************
 * server.js - Primary application file
 *******************************************/

/* ***********************
 * Require Statements
 *************************/
const express = require("express");
const expressLayouts = require("express-ejs-layouts");
require("dotenv").config();
const utilities = require("./utilities");

const app = express();

const baseController = require("./controllers/baseController");
const staticRoutes = require("./routes/static");
const inventoryRoutes = require("./routes/inventoryRoute");
const detailRoutes = require("./routes/detailRoute"); // ✅ Make sure this file exists

/* ***********************
 * View Engine and Templates
 *************************/
app.set("view engine", "ejs");
app.use(expressLayouts);
app.set("layout", "./layouts/layout"); // ✅ layout.ejs should be in views/layouts/
app.use(express.static("public")); // ✅ Serve static assets from /public

/* ***********************
 * Routes
 *************************/

// Home page route (✅ must come before staticRoutes if both use "/")
app.get("/", utilities.handleErrors(baseController.buildHome));

// Static routes (e.g., about, contact)
app.use("/", staticRoutes);

// Inventory routes (listing + detail)
app.use("/inv/detail", detailRoutes); // ✅ More specific route goes first
app.use("/inv", inventoryRoutes); // ✅ Then general inventory listing

/* ***********************
 * 404 Handler - Must be last
 *************************/
app.use(async (req, res, next) => {
  next({ status: 404, message: "Sorry, we appear to have lost that page." });
});

/* ***********************
 * Express Error Handler
 * Place after all other middleware
 *************************/
app.use(async (err, req, res, next) => {
  let nav = await utilities.getNav();
  console.error(`Error at: "${req.originalUrl}": ${err.message}`);
  const message =
    err.status == 404
      ? err.message
      : "Oh no! There was a crash. Maybe try a different route?";
  res.status(err.status || 500).render("errors/error", {
    title: err.status || "Server Error",
    message,
    nav,
  });
});

/* ***********************
 * Local Server Information
 *************************/
const port = process.env.PORT || 3000;
const host = process.env.HOST || "localhost";

/* ***********************
 * Start Server
 *************************/
app.listen(port, () => {
  console.log(`App listening on http://${host}:${port}`);
});

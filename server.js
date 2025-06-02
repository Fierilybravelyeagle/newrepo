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
const staticRoutes = require("./routes/static"); // Make sure this exports a Router
const inventoryRoutes = require("./routes/inventoryRoute"); // Make sure file is named exactly this or change accordingly

/* ***********************
 * View Engine and Templates
 *************************/
app.set("view engine", "ejs");
app.use(expressLayouts);
app.set("layout", "./layouts/layout"); // Make sure views/layouts/layout.ejs exists
app.use(express.static("public")); // Serve static files from /public

/* ***********************
 * Routes
 *************************/
// Static routes (e.g., about, contact pages, etc.)
app.use("/", staticRoutes);

// Home page route
app.get("/", baseController.buildHome);

// Inventory routes mounted at /inv
app.use("/inv", inventoryRoutes);

// File Not Found Route - must be last route in list
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
  res.render("errors/error", {
    title: err.status || "Server Error",
    message: err.message,
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

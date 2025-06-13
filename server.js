/******************************************
 * server.js - Primary application file
 *******************************************/
const session = require("express-session");
const pool = require("./database/");

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
const detailRoutes = require("./routes/detailRoute");
const accountRoutes = require("./routes/accountRoutes");
const bodyParser = require("body-parser");

/* ***********************
 * Middleware
 *************************/
app.use(
  session({
    store: new (require("connect-pg-simple")(session))({
      createTableIfMissing: true,
      pool,
    }),
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
    name: "sessionId",
  })
);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Express Messages Middleware
app.use(require("connect-flash")());
app.use(function (req, res, next) {
  res.locals.messages = require("express-messages")(req, res);
  next();
});

/* ***********************
 * View Engine and Templates
 *************************/
app.set("view engine", "ejs");
app.use(expressLayouts);
app.set("layout", "./layouts/layout");
app.use(express.static("public"));

/* ***********************
 * Handle well-known paths (e.g., Chrome dev tools, cert verifications)
 *************************/
app.get("/.well-known/*", (req, res) => {
  res.status(204).end(); // No Content - gracefully handle unknown well-known requests
});

/* ***********************
 * Routes
 *************************/

// Home page route
app.get("/", utilities.handleErrors(baseController.buildHome));

// Static routes
app.use("/", staticRoutes);

// Inventory routes (detail must come before general)
app.use("/inv/detail", detailRoutes);
app.use("/inv", inventoryRoutes); // ✅ Aquí está lo correcto

// Account routes
app.use("/account", accountRoutes);

// ❌ Esta línea causa conflictos de ruta y debe ser eliminada:
// app.use("/", inventoryRoutes); <--- REMOVIDA

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
    err.status === 404
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

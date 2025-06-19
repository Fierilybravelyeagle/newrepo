/******************************************
 * server.js - Primary application file
 ******************************************/
const session = require("express-session");
const pool = require("./database/");

/* ***********************
 * Require Statements
 *************************/
const cookieParser = require("cookie-parser");
const express = require("express");
const expressLayouts = require("express-ejs-layouts");
require("dotenv").config();
const utilities = require("./utilities");
const bodyParser = require("body-parser");
const connectFlash = require("connect-flash");

const app = express();

// Route modules
const baseController = require("./controllers/baseController");
const staticRoutes = require("./routes/static");
const inventoryRoutes = require("./routes/inventoryRoute");
const detailRoutes = require("./routes/detailRoute");
const accountRoutes = require("./routes/accountRoutes");

/* ***********************
 * Middleware
 *************************/
// Ignore favicon requests
app.get("/favicon.ico", (req, res) => res.status(204).end());

// Configure session storage
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

// Parse cookies
app.use(cookieParser());

// Check JWT and login status
app.use(utilities.checkJWTToken);
app.use(utilities.checkLoginStatus);

// Parse form and JSON data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Flash messages
app.use(connectFlash());
app.use(function (req, res, next) {
  res.locals.messages = require("express-messages")(req, res);
  next();
});

// Global nav for all views
app.use(async (req, res, next) => {
  res.locals.nav = await utilities.getNav();
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
 * Special Paths
 *************************/
app.get("/.well-known/*", (req, res) => {
  res.status(204).end();
});

/* ***********************
 * Routes
 *************************/
app.get("/", utilities.handleErrors(baseController.buildHome));
app.use("/", staticRoutes);
app.use("/inv/detail", detailRoutes);
app.use("/inv", inventoryRoutes);
app.use("/account", accountRoutes);

/* ***********************
 * 404 Handler - Must be last
 *************************/
app.use(async (req, res, next) => {
  next({ status: 404, message: "Sorry, we appear to have lost that page." });
});

/* ***********************
 * Error Handler
 *************************/
app.use(async (err, req, res, next) => {
  console.error(`Error at: "${req.originalUrl}": ${err.message}`);
  const message =
    err.status === 404
      ? err.message
      : "Oh no! There was a crash. Maybe try a different route?";
  res.status(err.status || 500).render("errors/error", {
    title: err.status || "Server Error",
    message,
  });
});

/* ***********************
 * Local Server Info
 *************************/
const port = process.env.PORT || 3000;
const host = process.env.HOST || "localhost";

app.listen(port, () => {
  console.log(`App listening on http://${host}:${port}`);
});

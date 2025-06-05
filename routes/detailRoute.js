const express = require("express");
const router = express.Router();
const detCont = require("../controllers/detController");
const utilities = require("../utilities/");

router.get("/:inv_id", utilities.handleErrors(detCont.buildDetailbyInvId));

module.exports = router;

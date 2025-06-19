const express = require("express");
const router = express.Router();
const detCont = require("../controllers/detController");
const utilities = require("../utilities/");
const buyController = require("../controllers/buyController");

// Ruta para mostrar el formulario de compra
router.post(
  "/buyForm/:inventory_id",
  utilities.handleErrors(buyController.getBuyFormView)
);

// Ruta para mostrar detalles de un vehículo por ID
router.get(
  "/:inv_id",
  utilities.handleErrors(detCont.buildDetailbyInvId)
);

module.exports = router;

const express = require("express");
const router = new express.Router();
const invController = require("../controllers/invController");
const vehicleController = require("../controllers/vehicleController");
const utilities = require("../utilities")
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));
router.get("/detail/:vehicleId", utilities.handleErrors(vehicleController.buildVehicle));
module.exports = router;
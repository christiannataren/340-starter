const express = require("express");
const router = new express.Router();
const invController = require("../controllers/invController");
const vehicleController = require("../controllers/vehicleController");
router.get("/type/:classificationId", invController.buildByClassificationId);
router.get("/detail/:vehicleId", vehicleController.buildVehicle);
module.exports = router;
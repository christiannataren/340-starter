const express = require("express");
const router = new express.Router();
const invController = require("../controllers/invController");
const vehicleController = require("../controllers/vehicleController");
const utilities = require("../utilities")
const addingValidator = require("../utilities/adding-validation")

router.get("/", utilities.handleErrors(invController.buildIndex));
router.get("/add-classification", utilities.handleErrors(invController.buildAddingClasification));
router.post("/add-classification", addingValidator.addingClassification(), addingValidator.checkRegData, utilities.handleErrors(invController.buildAddingClasificationPost));


router.get("/add-vehicle", utilities.handleErrors(invController.buildAddingVehicle));
router.post("/add-vehicle", addingValidator.addingVehicle(), addingValidator.checkVehicleData, utilities.handleErrors(invController.buildAddingVehiclePost));


router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));
router.get("/detail/:vehicleId", utilities.handleErrors(vehicleController.buildVehicle));
router.get("/getInventory/:classification_id", utilities.handleErrors(invController.getInventoryJSON));

router.get("/edit/:inventory_id", utilities.handleErrors(invController.editInventory)); ///Route that handles vehicle editing
router.post("/update/", addingValidator.addingVehicle(), addingValidator.validateVehicleId(), addingValidator.checkUpdateData, utilities.handleErrors(invController.updateInventoryPost))

router.get("/delete/:inventory_id", utilities.handleErrors(invController.deleteInventory));
router.post("/delete/", utilities.handleErrors(invController.deleteInventoryPost));


/////Add versions routes
router.get("/add-version/:inventory_id", utilities.handleErrors(invController.buildAddingVersion));
router.post("/add-version/:inventory_id", addingValidator.validateVersionRules(), addingValidator.checkVersionData, utilities.handleErrors(invController.buildAddingVersionPost));

/////Delete versions routes
router.get("/version/delete/:version_id", utilities.handleErrors(invController.buildDeleteVersion));
router.post("/version/delete/:version_id", utilities.handleErrors(invController.buildDeleteVersionPost));




module.exports = router;

const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}




/* ***************************
 *  Build Home view Inventory Management
 * ************************** */
invCont.buildIndex = async function (req, res, next) {
    let nav = await utilities.getNav()
    let clasifications = await invModel.getClassifications()
    let categories = await utilities.buildSelectClassification(clasifications);
    res.render("./inventory/index", {
        title: "Vehicle management",
        nav,
        errors: null,
        categories
    })

}
/* ***************************
 *  Build Adding clasification controller
 * ************************** */
invCont.buildAddingClasification = async function (req, res, next) {
    let nav = await utilities.getNav()
    res.render("./inventory/adding-clasification", {
        title: "Add New Clasification",
        nav,
        errors: null
    })

}

// Edit Vehicle controller edit-vehicle
invCont.editInventory = async function (req, res, next) {
    let nav = await utilities.getNav()
    let inventory_id = parseInt(req.params.inventory_id)
    let vehicle_data = await invModel.getVehicleDetails(inventory_id)
    vehicle_data = vehicle_data[0]
    let clasifications = await invModel.getClassifications()
    let select_classifications = await utilities.buildSelectClassification(clasifications, vehicle_data.classification_id);
    let make = vehicle_data.inv_make
    let model = vehicle_data.inv_model
    console.log(vehicle_data)
    res.render("./inventory/edit-vehicle", {
        title: `Edit ${make} ${model}`,
        nav,
        errors: null,
        select_classifications,
        vehicle: vehicle_data
    })

}
// Add Vehicle controller add-vehicle
invCont.buildAddingVehicle = async function (req, res, next) {
    let nav = await utilities.getNav()
    let clasifications = await invModel.getClassifications()
    let select_classifications = await utilities.buildSelectClassification(clasifications);
    res.render("./inventory/adding-vehicle", {
        title: "Add New Vehicle",
        nav,
        errors: null,
        select_classifications
    })

}
/* ***************************
 *  Build Adding vehicle POST controller
 * ************************** */
invCont.buildAddingVehiclePost = async function (req, res, next) {
    let nav = await utilities.getNav()
    let regResult = invModel.insertNewVehicle(req.vehicle);
    //
    if (regResult) {
        req.flash(
            "notice",
            `The ${req.vehicle.inv_model}  was successfully added.`
        )
        res.status(201).render("inventory/index", {
            title: "Vehicle management",
            nav,
            errors: null
        })
    } else {
        req.flash("error", "Sorry, the vehicle was not added")
        res.status(501).render("inventory/adding-vehicle", {
            title: "Add New Vehicle",
            nav,
            errors: null
        })
    }

}
/* ***************************
 *  Build Editing vehicle POST controller
 * ************************** */
invCont.updateInventoryPost = async function (req, res, next) {
    let nav = await utilities.getNav()
    let updateResult = await invModel.updateInventory(req.vehicle);
    vehicle_data = req.vehicle
    if (updateResult) {
        const itemName = updateResult.inv_make + " " + updateResult.inv_model
        // console.log(`The ${itemName} was successfully updated.`)
        req.flash("notice", `The ${itemName} was successfully updated.`)
        res.redirect("/inv/")
    } else {

        let clasifications = await invModel.getClassifications()
        let select_classifications = await utilities.buildSelectClassification(clasifications, vehicle_data.classification_id);
        let make = vehicle_data.inv_make
        let model = vehicle_data.inv_model
        req.flash("notice", "Sorry, the insert failed.")
        res.status(501).render("./inventory/edit-vehicle", {
            title: `Edit ${make} ${model}`,
            nav,
            errors: null,
            select_classifications,
            vehicle: vehicle_data
        })
    }

}
/* ***************************
 *  Build Adding clasification POST controler
 * ************************** */
invCont.buildAddingClasificationPost = async function (req, res, next) {
    let nav = await utilities.getNav()
    let { classification_name } = req.body
    let regResult = invModel.insertNewClassification(classification_name);
    //

    if (regResult) {

        req.flash(
            "notice",
            `The ${classification_name} Classification was successfully added.`
        )
        res.redirect("/inv")
    } else {
        req.flash("error", "Sorry, the classification was not added")
        res.status(501).render("inventory/adding-clasification", {
            title: "Add New Classification",
            nav,
            errors: null
        })
    }

}
/* ***************************
 *  Build inventory by classification view
 * ************************** */

invCont.buildByClassificationId = async function (req, res, next) {
    const classification_id = req.params.classificationId
    const data = await invModel.getInventoryByClassificationId(classification_id)
    const grid = await utilities.buildClassificationGrid(data)
    let nav = await utilities.getNav()
    const className = data[0].classification_name
    res.render("./inventory/classification", {
        title: className + " vehicles",
        nav,
        grid,
    })

}

/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async function (req, res, next) {
    const classification_id = parseInt(req.params.classification_id)
    const invData = await invModel.getInventoryByClassificationId(classification_id)
    console.log("Entramos a jSON")
    if (invData[0].inv_id) {
        return res.json(invData)
    } else {
        next(new Error("No data returned"))
    }
}

module.exports = invCont
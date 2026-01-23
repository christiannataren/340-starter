const invModel = require("../models/inventory-model")
const utilities = require("../utilities")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildVehicle = async function (req, res, next) {
    const vehicleId = req.params.vehicleId
    const data = await invModel.getVehicleDetails(vehicleId)
    const grid = await utilities.buildVehicleData(data)
    let nav = await utilities.getNav()
    const className = data[0].inv_make + " " + data[0].inv_model + " details"
    res.render("./inventory/vehicle", {
        title: className,
        nav,
        grid,
    })

}

module.exports = invCont
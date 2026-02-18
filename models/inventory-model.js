const pool = require("../database/")

/* ***************************
 *  Get all classification data
 * ************************** */
async function getClassifications() {
    return await pool.query("SELECT * FROM public.classification ORDER BY classification_name")
}



/* ***************************
 *  Get all inventory items and classification_name by classification_id
 * ************************** */
async function getInventoryByClassificationId(classification_id) {
    try {
        const data = await pool.query(
            `SELECT * FROM public.inventory AS i 
      JOIN public.classification AS c 
      ON i.classification_id = c.classification_id 
      WHERE i.classification_id = $1`,
            [classification_id]
        )
        return data.rows
    } catch (error) {
        console.error("getclassificationsbyid error " + error)
    }
}



async function getVehicleDetails(vehicleId) {
    try {
        // console.log("Vehicle: " + vehicleId)
        const data = await pool.query(`SELECT * FROM public.inventory WHERE inv_id = $1`, [vehicleId]);
        return data.rows
    } catch (error) {
        console.log("Get Vehicle Error: " + error)
        return undefined;
    }
}
async function getVersionById(versionId) {
    try {
        // console.log("Vehicle: " + vehicleId)
        const data = await pool.query(`SELECT * FROM public.version WHERE version_id = $1`, [versionId]);
        return data.rows[0]
    } catch (error) {
        console.log("Get Versions Error: " + error)
        return undefined;
    }
}
async function getVehicleVersions(vehicleId) {
    try {
        // console.log("Vehicle: " + vehicleId)
        const data = await pool.query(`SELECT * FROM public.version WHERE inv_id = $1`, [vehicleId]);
        return data.rows
    } catch (error) {
        console.log("Get Versions Error: " + error)
        return undefined;
    }
}

// CLasification ID exist
async function classificationIdExists(classification_id) {
    try {
        const sql = "SELECT * FROM classification WHERE classification_id = $1"
        const clas = await pool.query(sql, [classification_id])
        return clas.rowCount
    } catch (error) {
        return error.message
    }
}
// CLasification exist
async function classificationExists(classification_name) {
    try {
        const sql = "SELECT * FROM classification WHERE classification_name = $1"
        const email = await pool.query(sql, [classification_name])
        return email.rowCount
    } catch (error) {
        return error.message
    }
}
///////Inserting new classification
async function insertNewClassification(classification_name) {
    try {
        const sql = "INSERT INTO classification (classification_name) VALUES ($1) RETURNING *"
        return await pool.query(sql, [classification_name])
    } catch (error) {
        return error.message
    }
}
///////Inserting new vehicle
async function insertNewVehicle(vehicle) {
    try {
        const sql = "INSERT INTO inventory (inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *"
        return await pool.query(sql, [
            vehicle.inv_make,
            vehicle.inv_model,
            vehicle.inv_year,
            vehicle.inv_description,
            vehicle.inv_image,
            vehicle.inv_thumbnail,
            vehicle.inv_price,
            vehicle.inv_miles,
            vehicle.inv_color,
            vehicle.classification_id,
        ])
    } catch (error) {
        return error.message
    }
}
///////Inserting new version
async function insertNewVersion(vehicle) {
    try {
        const sql = "INSERT INTO version (inv_id, version_name, version_image) VALUES ($1, $2, $3) RETURNING *"
        return await pool.query(sql, [
            vehicle.inv_id,
            vehicle.version_name,
            vehicle.version_image
        ])
    } catch (error) {
        console.log(error.message)
        return false;
    }
}

/* ***************************
 *  Update Inventory Data
 * ************************** */
async function updateInventory(vehicle) {
    try {
        const sql =
            "UPDATE public.inventory SET inv_make = $1, inv_model = $2, inv_description = $3, inv_image = $4, inv_thumbnail = $5, inv_price = $6, inv_year = $7, inv_miles = $8, inv_color = $9, classification_id = $10 WHERE inv_id = $11 RETURNING *"
        const data = await pool.query(sql, [
            vehicle.inv_make,
            vehicle.inv_model,
            vehicle.inv_description,
            vehicle.inv_image,
            vehicle.inv_thumbnail,
            vehicle.inv_price,
            vehicle.inv_year,
            vehicle.inv_miles,
            vehicle.inv_color,
            vehicle.classification_id,
            vehicle.inv_id
        ])
        return data.rows[0]
    } catch (error) {
        console.error("model error: " + error)
    }
}
/* ***************************
 *  Delete Inventory Data
 * ************************** */
async function deleteInventory(inventory_id) {
    try {
        const sql =
            "DELETE FROM public.inventory WHERE inv_id = $1 RETURNING *"
        const data = await pool.query(sql, [inventory_id])
        return data.rows[0]
    } catch (error) {
        console.error("model error: " + error)
    }
}
/* ***************************
 *  Delete Version Data
 * ************************** */
async function deleteVersion(version_id) {
    try {
        const sql =
            "DELETE FROM public.version WHERE version_id = $1 RETURNING *"
        const data = await pool.query(sql, [version_id])
        return data.rows[0]
    } catch (error) {
        console.error("model error: " + error)
    }
}


module.exports = {deleteVersion, getVersionById, getVehicleVersions, insertNewVersion, deleteInventory, updateInventory, getClassifications, getInventoryByClassificationId, getVehicleDetails, insertNewClassification, classificationExists, classificationIdExists, insertNewVehicle };
const invModel = require("../models/inventory-model")
const accountModel = require("../models/account-model")
const Util = {}
const jwt = require("jsonwebtoken")
require("dotenv").config()

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
    let data = await invModel.getClassifications()
    let list = "<ul>"
    list += '<li><a href="/" title="Home page">Home</a></li>'
    data.rows.forEach((row) => {
        list += "<li>"
        list +=
            '<a href="/inv/type/' +
            row.classification_id +
            '" title="See our inventory of ' +
            row.classification_name +
            ' vehicles">' +
            row.classification_name +
            "</a>"
        list += "</li>"
    })
    list += "</ul>"
    return list
}
/* ************************
 * Constructs the versions HTML 
 ************************** */
Util.buildCurrenVersions = function (data) {
    let html = ``;
    if (data.length > 0) {
        let rows = '';
        for (let i = 0; i < data.length; i++) {
            rows += `<tr><td>${data[i].version_name}</td>
      <td><a href="/inv/version/delete/${data[i].version_id}">Delete</a></td></tr>`
        }
        html = `<table>
  <thead>
    <tr>
      <th>Name</th>
      <th>Delete</th>
    </tr>
  </thead>
  <tbody>
    
    ${rows}
      
    
  </tbody>
</table>`
    }

    return html;
}


/* **************************************
* Build the classification view HTML
* ************************************ */
Util.buildClassificationGrid = async function (data) {
    let grid
    if (data.length > 0) {
        grid = '<ul id="inv-display">'
        data.forEach(vehicle => {
            grid += '<li>'
            grid += '<a href="../../inv/detail/' + vehicle.inv_id
                + '" title="View ' + vehicle.inv_make + ' ' + vehicle.inv_model
                + 'details"><img src="' + vehicle.inv_thumbnail
                + '" alt="Image of ' + vehicle.inv_make + ' ' + vehicle.inv_model
                + ' on CSE Motors" ></a>'
            grid += '<div class="namePrice">'
            grid += '<h2>'
            grid += '<a href="../../inv/detail/' + vehicle.inv_id + '" title="View '
                + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">'
                + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
            grid += '</h2>'
            grid += '<span>$'
                + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
            grid += '</div>'
            grid += '</li>'
        })
        grid += '</ul>'
    } else {
        grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
    }
    return grid
}

function buildVersions(defaultImg, versions) {
    if (versions.length > 0) {
        let options = `<option disabled selected>Available versions</option>
        <option id="default" value="${defaultImg}" >Default version</option>`;
        for (let i = 0; i < versions.length; i++) {
            options += `<option value="${versions[i].version_image}">${versions[i].version_name}</option>`
        }
        return `<select id="versions-select">${options}</select>`;
    }
    return "";
}
///////////////////Build vehicle view
Util.buildVehicleData = async function (data) {
    let info = data[0];
    let veh_name = `${info.inv_make} ${info.inv_model}`
    let versions = buildVersions(info.inv_image, data.versions)
    let html = `
    <div id="veh-details">
        <h1>${info.inv_year} ${veh_name}</h1>
        <img id="vehicle-image" src="${info.inv_image}" alt="Photo of ${veh_name}"  >
        <div  id="details">
        <h2>${veh_name} Details</h2>
       <p> <span class="bold">Price: </span>$${new Intl.NumberFormat('en-US').format(info.inv_price).toString()}</p>
        <p><span class="bold">Description: </span>${info.inv_description}</p>
        <p id="color-veh"><span class="bold">Color: </span>${info.inv_color}</p>
        <p id="miles-veh"><span class="bold">Miles: </span>${new Intl.NumberFormat('en-US').format(info.inv_miles).toString()}</p>
        ${versions}
        </div>

        
    </div>
    
    
    
    `;
    return html;
    ;

}
///////////////////Build select clasification
Util.buildSelectClassification = async function (data, selected = null) {
    data = data.rows;
    let options = '<option value="">--Please choose an option--</option>';
    for (let i = 0; i < data.length; i++) {
        if (selected != null) {
            if (selected == data[i].classification_id) {
                options += `<option selected value="${data[i].classification_id}">${data[i].classification_name}</option>`;
            } else {
                options += `<option value="${data[i].classification_id}">${data[i].classification_name}</option>`;
            }
        } else {
            options += `<option value="${data[i].classification_id}">${data[i].classification_name}</option>`;
        }

    }
    let html = `
    <select name="classification_id" id="classification_id" required>
    ${options}

    </select>
    `;
    return html;
    ;

}


/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);


// Chechink the jwt is useful
/* ****************************************
* Middleware to check token validity
**************************************** */
Util.checkJWTToken = async (req, res, next) => {
    if (req.cookies.jwt) {
        jwt.verify(
            req.cookies.jwt,
            process.env.ACCESS_TOKEN_SECRET,
            async function (err, accountData) {
                if (err) {
                    req.flash("Please log in")
                    res.clearCookie("jwt")
                    return res.redirect("/account/login")
                }
                res.locals.accountData = await accountModel.getAccountById(accountData.account_id)
                req.accountData = res.locals.accountData
                res.locals.loggedin = 1
                next()
            })
    } else {
        next()
    }
}

/* ****************************************
 *  Check Login
 * ************************************ */
Util.skipLogginByUrl = function (originalUrl) {
    let passUrls = ["/inv/type/", "/inv/detail/"]
    let split = originalUrl.split("/")
    let url = `/${split[1]}/${split[2]}/`
    if (passUrls.includes(url)) {
        return true
    }

    return false
}
Util.checkLogin = (req, res, next) => {
    if (res.locals.loggedin) {
        next()
    } else {
        if (Util.skipLogginByUrl(req.originalUrl)) {/////skip the login function if the url is in the contained array
            next()
            return
        }
        req.flash("notice", "Please log in.")
        return res.redirect("/account/login")
    }
}


module.exports = Util
let button_see = document.querySelector("#see-password");

button_see.addEventListener("click", function () {
    let account_password = document.querySelector("#account_password");
    if (account_password.getAttribute("type") == "password") {
        account_password.setAttribute("type", "text");
    } else {
        account_password.setAttribute("type", "password");
    }

});

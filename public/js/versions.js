
let select = document.querySelector("#versions-select");
select.addEventListener("change", function (event) {
    let image = event.target.value;
    document.querySelector("#vehicle-image").setAttribute("src", image);

    if (select.options[select.selectedIndex].getAttribute("id") == "default") {
        document.querySelector("#color-veh").classList.remove("hide")
        document.querySelector("#miles-veh").classList.remove("hide")
    } else {
        document.querySelector("#color-veh").classList.add("hide")
        document.querySelector("#miles-veh").classList.add("hide")
    }
});